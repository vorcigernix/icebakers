import "../styles/globals.css";
import { Provider } from "next-auth/client";
import Head from "next/head";
import {
  ContractKitProvider,
  Alfajores,
  Mainnet,
} from "@celo-tools/use-contractkit";
import "@celo-tools/use-contractkit/lib/styles.css";

function iceRenderProvider(provider) {
  console.log(provider);
  switch (provider.name) {
    case "Valora":
      return (
        <div
          className="flex md:hidden text-indigo-100 cursor-pointer py-5 px-4 bg-blue-700 rounded focus:shadow-outline bg-gradient-to-tl hover:from-green-400 transition "
          onClick={provider.onClick}
          key={provider.name.trim()}
        >
          <div className="flex w-1/4">
            <span className="my-auto">
              {typeof provider.image === "string" ? (
                <img
                  src={provider.image}
                  alt={`${provider.name} logo`}
                  style={{ height: "48px", width: "48px" }}
                />
              ) : (
                provider.image
              )}
            </span>
          </div>
          <div className="w-3/4">
            <div className="text-lg pb-1 font-medium">{provider.name}</div>
            <span className="text-sm text-white">
              Install Valora app and click on this button.
            </span>
          </div>
        </div>
      );

    case "Celo Extension Wallet":
      return (
        <div
          className="hidden md:flex text-indigo-100 cursor-pointer py-5 px-4 bg-blue-700 rounded focus:shadow-outline bg-gradient-to-tl hover:from-green-400 transition "
          style={{"margin":"4px"}}
          onClick={provider.onClick}
          key={provider.name.trim()}
        >
          <div className="flex w-1/4">
            <span className="my-auto">
              {typeof provider.image === "string" ? (
                <img
                  src={provider.image}
                  alt={`${provider.name} logo`}
                  style={{ height: "48px", width: "48px" }}
                />
              ) : (
                provider.image
              )}
            </span>
          </div>
          <div className="w-3/4">
            <div className="text-lg pb-1 font-medium">{provider.name}</div>
            <span className="text-sm text-white">
              Install Metamask plugin and click here.
            </span>
          </div>
        </div>
      );

      // case "Wallet Connect":
      //   return (
      //     <div
      //       className="hidden md:flex text-indigo-100 cursor-pointer py-5 px-4 bg-blue-700 rounded focus:shadow-outline bg-gradient-to-tl hover:from-green-400 transition "
      //       style={{"margin":"4px"}}
      //       onClick={provider.onClick}
      //       key={provider.name.trim()}
      //     >
      //       <div className="flex w-1/4">
      //         <span className="my-auto">
      //           {typeof provider.image === "string" ? (
      //             <img
      //               src={provider.image}
      //               alt={`${provider.name} logo`}
      //               style={{ height: "48px", width: "48px" }}
      //             />
      //           ) : (
      //             provider.image
      //           )}
      //         </span>
      //       </div>
      //       <div className="w-3/4">
      //         <div className="text-lg pb-1 font-medium">{provider.name}</div>
      //         <span className="text-sm text-white">
      //           Install Metamask plugin and click here.
      //         </span>
      //       </div>
      //     </div>
      //   );

    default:
      return (
        <div
          className="cursor-pointer py-5 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition rounded hidden"
          onClick={provider.onClick}
          key={provider.name.trim()}
        >
          <div className="flex w-1/4">
            <span className="my-auto">
              {typeof provider.image === "string" ? (
                <img
                  src={provider.image}
                  alt={`${provider.name} logo`}
                  style={{ height: "24px", width: "24px" }}
                />
              ) : (
                provider.image
              )}
            </span>
          </div>
          <div className="w-3/4">
            <div className="text-lg pb-1 font-medium dark:text-gray-300">
              {provider.name}
            </div>
          </div>
        </div>
      );
  }
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
          href="https://fonts.googleapis.com/css2?family=Titillium+Web:wght@700&family=Lato:wght@300;400;700;900&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Titillium+Web:wght@700&family=Lato:wght@300;400;700;900&display=swap"
          media="print"
          onLoad="this.media='all'"
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Titillium+Web:wght@700&family=Lato:wght@300;400;700;900&display=swap"
          />
        </noscript>
      </Head>
      <ContractKitProvider
        dappName="Icebakers"
        dappDescription="Blockchain enhanced icebreaker question game"
        dappUrl="https://icebakers.app"
        connectModal={{
          renderProvider: iceRenderProvider,
        }}
      >
        <Provider session={session}>
          <Component {...pageProps} />
        </Provider>
      </ContractKitProvider>
    </>
  );
}

export default MyApp;
