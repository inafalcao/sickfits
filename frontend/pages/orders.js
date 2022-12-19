import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Head from 'next/head';
import styled from 'styled-components';
import { Link } from 'next/link';
import DisplayError from '../components/ErrorMessage';
import OrderStyles from '../components/styles/OrderStyles';
import formatMoney from '../lib/formatMoney';
import OrderItemStyles from '../components/styles/OrderItemStyles';

const USER_ORDERS_QUERY = gql`
  query {
    allOrders {
      id
      charge
      total
      user {
        id
      }
      items {
        id
        name
        description
        price
        quantity
        photo {
          image {
            publicUrlTransformed
          }
        }
      }
    }
  }
`;

const OrderUl = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  grid-gap: 4rem;
`;

export default function OrdersPage() {
  const { data, error, loading } = useQuery(USER_ORDERS_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <DisplayError error={error} />;
  const { allOrders } = data;
  return (
    <div>
      <Head>
        <title>Your Orders {allOrders.lenght}</title>
      </Head>
      <h2>You have {allOrders.length} orders!</h2>
      <OrderUl>
        {allOrders.map((order) => (
          <OrderItemStyles>
            <Link href={`/order/${order.div}`}>
              <div className="order-meta">
                <p>{formatMoney(order.total)}</p>
              </div>
            </Link>
          </OrderItemStyles>
        ))}
      </OrderUl>
    </div>
  );
}
