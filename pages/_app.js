import "../styles/globals.css";
import { Provider } from "next-auth/client";

function MyApp({ Component, pageProps }) {
  const { session } = pageProps;
  return (
    <Provider session={session}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
