import NProgress from 'nprogress';
import Page from '../components/Page';
import 'nprogress/nprogress.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <Page cool="some test">
      <Component {...pageProps} />
    </Page>
  );
}
