import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import Form from './styles/Form';
import useForm from '../lib/useForm';
import { CURRENT_USER_QUERY } from '../lib/useUser';
import DisplayError from './ErrorMessage';

export const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    sendUserPasswordResetLink(email: $email) {
      code
      message
    }
  }
`;

export default function RequestResetPassword() {
  const { inputs, handleChange } = useForm({ email: '' });

  const [sendUserPasswordResetLink, { loading, data, error }] = useMutation(
    REQUEST_RESET_MUTATION,
    {
      variables: inputs,
    }
  );

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await sendUserPasswordResetLink().catch(console.error);
    console.log(res);
  }

  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <h2>Request Reset Password</h2>
      <DisplayError error={error} />
      {data?.sendUserPasswordResetLink === null && (
        <p>Success! Check your e-mail for a link.</p>
      )}
      <fieldset>
        <label htmlFor="email">
          Email
          <input
            type="email"
            name="email"
            placeholder="Email"
            autoComplete="email"
            value={inputs.email}
            onChange={handleChange}
          />
        </label>

        <button type="submit">Request reset</button>
      </fieldset>
    </Form>
  );
}
