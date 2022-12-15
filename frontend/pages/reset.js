import RequestResetPassword from '../components/RequestResetPassword';
import ResetPassword from '../components/ResetPassword';

export default function ResetPage({ query }) {
  if (!query.token)
    return (
      <div>
        <p>Sorry, you must suply a valid token.</p>
        <RequestResetPassword />
      </div>
    );
  return (
    <div>
      <ResetPassword token={query.token} />
    </div>
  );
}
