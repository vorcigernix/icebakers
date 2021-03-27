import "../styles/globals.css";
import { Provider } from "next-auth/client";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  const { session } = pageProps;
  return (
    <>
      <Head>
        <title>IceBakers</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🧁</text></svg>"
        />
                  <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          <link
            rel="preload"
            as="style"
            href="https://fonts.googleapis.com/css2?family=Averia+Serif+Libre:wght@700&family=Lato:wght@300;400;700;900&display=swap"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Averia+Serif+Libre:wght@700&family=Lato:wght@300;400;700;900&display=swap"
            media="print"
            onLoad="this.media='all'"
          />
          <noscript>
            <link
              rel="stylesheet"
              href="https://fonts.googleapis.com/css2?family=Averia+Serif+Libre:wght@700&family=Lato:wght@300;400;700;900&display=swap"
            />
          </noscript>
      </Head>
      <Provider session={session}>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

export default MyApp;
