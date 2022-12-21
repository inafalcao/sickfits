import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { useCart } from '../lib/cartState';
import { CURRENT_USER_QUERY } from '../lib/useUser';

const ADD_TO_CART_MUTATION = gql`
  mutation ADD_TO_CART_MUTATION($productId: ID!) {
    addToCart(productId: $productId) {
      id
    }
  }
`;

export default function AddToCart({ id }) {
  const cart = useCart();

  if (!cart) return '';

  const { openCart } = cart;

  const [addToCart, { loading }] = useMutation(ADD_TO_CART_MUTATION, {
    variables: { productId: id },
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  async function add() {
    await addToCart();
    openCart();
  }

  return (
    <button type="button" onClick={add} disabled={loading}>
      Add{loading && 'ing'} to cart
    </button>
  );
}
