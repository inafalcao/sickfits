import { MockedProvider } from '@apollo/react-testing';
import { render, screen } from '@testing-library/react';
import SingleProduct, {
  SINGLE_PRODUCT_QUERY,
} from '../components/SingleProduct';
import { fakeItem } from '../lib/testUtils';

const product = fakeItem();

const mocks = [
  {
    request: {
      query: SINGLE_PRODUCT_QUERY,
      variables: {
        id: '123',
      },
    },
    result: {
      data: {
        Product: product,
      },
    },
  },
];

describe('<SingleProduct />', () => {
  it('renders with proper data', async () => {
    const { container, debug } = render(
      <MockedProvider mocks={mocks}>
        <SingleProduct id="123" />
      </MockedProvider>
    );

    await screen.findByTestId('single-product');
    expect(container).toMatchSnapshot();
  });

  it('Errors out when an item is not found', async () => {
    const errorMock = [
      {
        request: {
          query: SINGLE_PRODUCT_QUERY,
          variables: {
            id: '123',
          },
        },
        result: {
          errors: [{ message: 'Item not found!!!' }],
        },
      },
    ];

    const { container, debug } = render(
      <MockedProvider mocks={errorMock}>
        <SingleProduct id="123" />
      </MockedProvider>
    );

    await screen.findByTestId('graphql-error');
    expect(container).toHaveTextContent('Shoot!');
    expect(container).toHaveTextContent('Item not found!!!');
  });
});
