import Head from "next/head";
import { signin, signout, useSession } from "next-auth/client";
import Companies from "../components/companies";
import Wallet from "../components/wallet";

export default function Home() {
  const [session, loading] = useSession();
  if (!loading && !session?.user) return signin();

  return (
    <div className={`nojs-show ${!session && loading ? "loading" : "loaded"}`}>
      <noscript>
        <style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
      </noscript>
      <div className="flex flex-col  min-h-screen py-2">
        <Head>
          <title>IceBakers</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="flex flex-col items-center mt-9 flex-1 px-20">
          <h1 className="text-6xl font-extrabold">
            🧁
            <span className="text-blue-400">Ice</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-600">
              Bakers
            </span>
          </h1>

          {session && session.user && (
            <>
              <div className="md:flex p-8 md:p-0">
                <img
                  className="w-1/3 h-32 md:w-48 md:h-auto mx-auto"
                  src="/bg2.svg"
                  alt=""
                />
                <div className="w-2/3 pt-6 md:p-8  space-y-4">
                  <p className="my-6 text-2xl mx-auto">
                    Get to know your colleagues and friends
                  </p>
                  <p className="text-lg font-light">
                    Thanks for signing in. Now we recommend to start with
                    answering questions. This will provide pool of answers for
                    others and make the app more fun for your colleagues.
                  </p>
                  <Companies />
                  <p className="text-lg font-light mt-6 pt-8">
                    <span>
                      Connect your wallet below if you want to receive tips.
                      <a href="/about" className="font-semibold">
                        {" "}
                        How does it work?
                      </a>
                    </span>
                  </p>
                  <div className="md:flex pb-8">
                    <Wallet session={session} />
                    <a href="/questions/687656586">
                      <button className="flex items-center justify-center text-base font-medium text-gray-600 bg-white hover:bg-gray-50 hover:text-black md:py-3 md:px-3 mr-4 shadow rounded border-0 p-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="h-8 mx-2 text-blue-600"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Answer Questions
                      </button>
                    </a>
                    <button className="flex items-center justify-center text-base font-medium text-gray-600 bg-white hover:bg-gray-50 hover:text-black md:py-3 md:px-3 mr-4 shadow rounded border-0 p-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-8 mx-2 text-green-400"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Guess Answers
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>

        <footer className="flex items-center justify-center w-full h-24 border-t">
          <a
            className="flex items-center justify-center"
            href="https://gitcoin.co/issue/binancex/Grant-projects/17/100024656"
            target="_blank"
            rel="noopener noreferrer"
          >
            built at Binance Hackathon: The Future Is Now
          </a>
        </footer>
      </div>
    </div>
  );
}
