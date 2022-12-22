import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { fakeUser } from '../lib/testUtils';
import RequestResetPassword, {
  REQUEST_RESET_MUTATION,
} from '../components/RequestResetPassword';

const me = fakeUser();
const mocks = [
  {
    request: {
      query: REQUEST_RESET_MUTATION,
      variables: { email: me.email },
    },
    result: {
      data: { sendUserPasswordResetLink: null },
    },
  },
];

describe('<RequestReset/>', () => {
  it('renders and matches snapshot', () => {
    const { container } = render(
      <MockedProvider>
        <RequestResetPassword />
      </MockedProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it('calls the mutation when submited', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <RequestResetPassword />
      </MockedProvider>
    );
    await userEvent.type(screen.getByPlaceholderText(/Email/i), me.email);

    await userEvent.click(screen.getByText('Request reset'));
    await screen.findByText('Success! Check your e-mail for a link.');
  });
});
