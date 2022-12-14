import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { perPage } from '../config';
import Product from './Product';

export const ALL_PRODUCTS_QUERY = gql`
  query ALL_PRODUCTS_QUERY($offset: Int = 0, $size: Int) {
    allProducts(first: $size, skip: $offset) {
      id
      name
      price
      description
      photo {
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

const ProductsListStyles = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
`;

export default function Products({ page }) {
  const { data, error, loading } = useQuery(ALL_PRODUCTS_QUERY, {
    variables: {
      offset: (page - 1) * perPage,
      size: perPage,
    },
  });

  if (loading) return <p>Loading...</p>;
  return (
    <div>
      <ProductsListStyles>
        {data?.allProducts.map((p) => (
          <Product key={p.id} product={p}>
            {p.name}
          </Product>
        ))}
      </ProductsListStyles>
    </div>
  );
}
