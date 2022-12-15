import Link from 'next/link';
import { useCart } from '../lib/cartState';
import useUser from '../lib/useUser';
import NavStyles from './styles/NavStyles';

export default function Nav() {
  const { user, signOut } = useUser();
  const { openCart } = useCart();

  return (
    <NavStyles>
      <Link href="/products">Products</Link>
      {user && (
        <>
          <Link href="/sell">Sell</Link>
          <Link href="/orders">Orders</Link>
          <Link href="/account">Account</Link>
          <button type="button" onClick={() => signOut()}>
            Sign Out
          </button>
          <button type="button" onClick={() => openCart()}>
            My Cart
          </button>
        </>
      )}
      {!user && <Link href="/signin">Sign in</Link>}
    </NavStyles>
  );
}
