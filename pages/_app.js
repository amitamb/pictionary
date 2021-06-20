import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css'
import { AuthContextProvider } from '../store/auth-context';

function MyApp({ Component, pageProps }) {
  return (
    <AuthContextProvider>
      <Component {...pageProps} />
    </AuthContextProvider>
  );
}

export default MyApp
