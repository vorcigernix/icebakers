import Head from "next/head";
import { providers, signIn } from "next-auth/client";

export default function SignIn({ providers }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Sign-in to IceBakers</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center flex-1 px-20 text-center">
        <h1 className="text-6xl font-extrabold">
          <span className="text-blue-600">Ice</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-600">
            Bakers
          </span>
        </h1>

        <p className="my-6 text-2xl">Get to know your colleagues and friends</p>

        <div className="flex flex-col flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          <>
            {Object.values(providers).map((provider) => (
              <div key={provider.name}>
                <button
                  className="w-full flex items-center justify-center px-3 py-3 border border-transparent text-base font-medium rounded-md text-gray-600 bg-white hover:bg-gray-50 hover:text-black md:py-3 md:px-3 shadow-sm"
                  onClick={() => signIn(provider.id)}
                >
                  Sign in with {provider.name}
                </button>
              </div>
            ))}
          </>

          <span className="text-gray-900 w-2/3 pt-8">
            We use your login to recognize your colleagues. Please use your work account.
          </span>
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <a
          className="flex items-center justify-center"
          href="https://adamsobotka.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
        >
          by Adam Sobotka
        </a>
      </footer>
    </div>
  );
}

SignIn.getInitialProps = async (context) => {
  return {
    providers: await providers(context),
  };
};
