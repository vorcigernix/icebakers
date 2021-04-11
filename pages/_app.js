import "../styles/globals.css";
import { Provider } from "next-auth/client";
import Head from "next/head";
import { ContractKitProvider, Alfajores, Screens, SupportedProviders } from '@celo-tools/use-contractkit';
import '@celo-tools/use-contractkit/lib/styles.css';
import { ConnectModal } from "@celo-tools/use-contractkit/lib/modals/connect";

function defaultRenderProvider(provider) {
  console.log("provider", provider);
  if (provider.name === "Wallet Connect" || provider.name === "Ledger") return null;
  return (
    <div
      className="tw-flex tw-cursor-pointer tw-py-5 tw-px-4 hover:tw-bg-gray-100 dark:hover:tw-bg-gray-700 tw-transition tw-rounded-md"
      onClick={provider.onClick}
    >
      <div className="tw-flex tw-w-1/4">
        <span className="tw-my-auto">
          {typeof provider.image === 'string' ? (
            <img
              src={provider.image}
              alt={`${provider.name} logo`}
              style={{ height: '48px', width: '48px' }}
            />
          ) : (
            provider.image
          )}
        </span>
      </div>
      <div className="tw-w-3/4">
        <div className="tw-text-lg tw-pb-1 tw-font-medium dark:tw-text-gray-300">
          {provider.name}
        </div>
        <div className="tw-text-sm tw-text-gray-600 dark:tw-text-gray-400">
          {provider.description}
        </div>
      </div>
    </div>
  );
}

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
      <ContractKitProvider dappName="Icebakers" networks={[Alfajores]} connectModal={{renderProvider:defaultRenderProvider}}>
        <Provider session={session}>
          <Component {...pageProps} />
        </Provider>
      </ContractKitProvider>
    </>
  );
}

export default MyApp;
