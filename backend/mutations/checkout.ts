/* eslint-disable */
import { KeystoneContext } from '@keystone-next/types';
import { CartItemCreateInput, OrderCreateInput } from '../.keystone/schema-types';
import stripeConfig from '../lib/stripe';
import { Session } from '../types';

const graphql = String.raw
interface Arguments {
  token: string
}

async function checkout(
  root: any,
  { token }: Arguments/* or simply { token: string } */,
  context: KeystoneContext
): Promise<OrderCreateInput> {
  const userId = context.session.itemId;
  if (!userId) {
    throw new Error('You must be signed in.')
  }

  const user = await context.lists.User.findOne({
    where: { id: userId },
    resolveFields: graphql`
      id
      name
      email
      cart {
        id
        quantity
        product {
          name
          price
          description
          id
          photo {
            id
            image {
              id
              publicUrlTransformed
            }
          }
        }
      }
    `
  })

  const cartItems = user.cart.filter(cartItem => cartItem.product)
  const amount = cartItems.reduce((acc: number, item: CartItemCreateInput) => {
    return acc + item.product.price * item.quantity
  }, 0)

  const charge = await stripeConfig.paymentIntents.create({
    amount,
    currency: 'USD',
    confirm: true,
    payment_method: token
  }).catch(err => {
    console.log(err);
    throw new Error(err.message)
  });

  /*
  return await context.lists.CartItem.createOne({
    data: {
      quantity: 1,
      product: { connect: { id: productId } },
      user: { connect: { id: session.itemId } },
    },
  });
  */

  const orderItems = cartItems.map(cartItem => {
    return {
      name: cartItem.product.name,
      description: cartItem.product.description,
      price: cartItem.product.price,
      quantity: cartItem.quantity,
      photo: { connect: { id: cartItem.product.photo.id } },
    }
  })

  const order = await context.lists.Order.createOne({
    data: {
      total: charge.amount,
      charge: charge.id,
      items: { create: orderItems },
      user: { connect: { id: userId } }
    }
  })

  const cartItemIds = user.cart.map(cartItem => cartItem.id)

  await context.lists.CartItem.deleteMany({
    ids: cartItemIds
  })

  return order;
}

export default checkout;
