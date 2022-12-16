/* eslint-disable */
import { KeystoneContext } from '@keystone-next/types';
import { CartItemsCreateInput } from '../.keystone/schema-types';
import { Session } from '../types';

async function addToCart(
  root: any,
  { productId }: { productId: string },
  context: KeystoneContext
): Promise<CartItemsCreateInput> {
  console.log('adding to cart!!!');
  const session = context.session as Session;

  if (!session.itemId) {
    throw new Error('You must be logged in to do this.');
  }

  console.log("product id");
  console.log(productId);


  console.log("SESSION ID")
  console.log(session.itemId);


  const allCartItems = await context.lists.CartItem.findMany({
    where: { user: { id: session.itemId }, product: { id: productId } },
    resolveFields: 'id,quantity'
  });

  console.log("ALL ITEMS");

  console.log(allCartItems)

  const [existingCartItem] = allCartItems;
  console.log("EXISTING ITEM");

  console.log(existingCartItem)
  if (existingCartItem) {
    return await context.lists.CartItem.updateOne({
      id: existingCartItem.id,
      data: { quantity: existingCartItem.quantity + 1 },
    });
  }

  return await context.lists.CartItem.createOne({
    data: {
      quantity: 1,
      product: { connect: { id: productId } },
      user: { connect: { id: session.itemId } },
    },
  });
}

export default addToCart;