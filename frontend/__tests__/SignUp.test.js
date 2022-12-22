import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import wait from 'waait';
import userEvent from '@testing-library/user-event';
import Signup, { SIGN_UP_MUTATION } from '../components/SignUp';
import { CURRENT_USER_QUERY } from '../lib/useUser';
import { fakeUser } from '../lib/testUtils';

const me = fakeUser();
const password = 'ina';

const mocks = [
  // mutation mock
  {
    request: {
      query: SIGN_UP_MUTATION,
      variables: {
        name: me.name,
        email: me.email,
        password: '',
      },
    },
    result: {
      data: {
        createUser: {
          __typename: 'User',
          id: 'abc123',
          email: me.email,
          name: me.name,
        },
      },
    },
  },
];

describe('<SignUp/>', () => {
  it('renders and matches snapshot', () => {
    const { container } = render(
      <MockedProvider>
        <Signup />
      </MockedProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it('calls the mutation properly', async () => {
    const { container, debug } = render(
      <MockedProvider mocks={mocks}>
        <Signup />
      </MockedProvider>
    );
    await userEvent.type(screen.getByPlaceholderText(/Name/i), me.name);
    await userEvent.type(screen.getByPlaceholderText(/Email/i), me.email);
    await userEvent.type(screen.getByPlaceholderText(/Password/i), me.password);

    await userEvent.click(screen.getByText('Sign Up!'));
    await screen.findByText(
      `Signed Up with ${me.email} - Please go ahead and sign in`
    );
    debug();
  });
});
