import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { useRouter } from 'next/dist/client/router';

export const CURRENT_USER_QUERY = gql`
  query {
    authenticatedItem {
      ... on User {
        id
        email
        name
      }
    }
  }
`;

const SIGN_OUT_MUTATION = gql`
  mutation {
    endSession
  }
`;

export default function useUser() {
  const { data } = useQuery(CURRENT_USER_QUERY);
  const [endSession] = useMutation(SIGN_OUT_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });
  const router = useRouter();

  async function signOut() {
    await endSession();
    router.push('/signin');
  }

  return { user: data?.authenticatedItem, signOut };
}
