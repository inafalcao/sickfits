import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { ALL_PRODUCTS_QUERY } from './Products';

const DELETE_PRODUCT_MUTATION = gql`
  mutation DELETE_PRODUCT_MUTATION($id: ID!) {
    deleteProduct(id: $id) {
      id
      name
    }
  }
`;

function update(cache, payload) {
  cache.evict(cache.identify(payload.data.deleteProduct));
}

export default function DeleteProduct({ id, children }) {
  const [deleteProduct, { loading }] = useMutation(DELETE_PRODUCT_MUTATION, {
    variables: { id },
    update,
  });

  return (
    <button
      disabled={loading}
      onClick={() => {
        if (confirm('Are you sure?')) {
          deleteProduct();
        }
      }}
    >
      {children}
    </button>
  );
}
