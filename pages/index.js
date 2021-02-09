import Head from "next/head";
import { signin, signout, useSession } from "next-auth/client";

export default function Home() {
  const [session, loading] = useSession();
  if (!loading && !session?.user) return signin();
  //console.log(session)
  return (
    <div className={`nojs-show ${!session && loading ? "loading" : "loaded"}`}>
      <noscript>
        <style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
      </noscript>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <Head>
          <title>IceBakers</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="flex flex-col items-center justify-center flex-1 px-20 text-center">
          <h1 className="text-6xl font-extrabold">
          🧁
            <span className="text-blue-400">Ice</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-600">
              Bakers
            </span>
          </h1>

          {session && session.user && (
            <>
              <div className="md:flex p-8">
                <button className="flex items-center justify-center px-3 py-3 border border-transparent text-base font-medium rounded-md text-gray-600 bg-white hover:bg-gray-50 hover:text-black md:py-3 md:px-3 shadow-sm m-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-8 mx-2 text-blue-400"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Answer Questions
                </button>
                <button className="flex items-center justify-center px-3 py-3 border border-transparent text-base font-medium rounded-md text-gray-600 bg-white hover:bg-gray-50 hover:text-black md:py-3 md:px-3 shadow-sm m-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-8 mx-2 text-green-400"
                  >
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  Quess Answers
                </button>
              </div>
              <div className="md:flex p-8 md:p-0">
                <img
                  className="w-1/3 h-32 md:w-48 md:h-auto mx-auto"
                  src="/bg2.svg"
                  alt=""
                />
                <div className="w-2/3 pt-6 md:p-8 text-center md:text-left space-y-4">
                  <p className="my-6 text-2xl">
                    Get to know your colleagues and friends
                  </p>
                  <p className="text-lg font-light">
                    IceBakers works in two stages. In one, you respond to the
                    "icebreaker questions" and your responses are saved with
                    your name. In a second stage, you will get the questions
                    with a reply from your colleague. There is the catch though,
                    you will get two names and your goal is to figure out who is
                    the right person that wrote this answer.
                  </p>
                  <p className="text-lg font-light">
                    This site is heavily influenced by a functionality of <a href="https://www.quizbreaker.com/" className="font-semibold">QuizBreaker</a>. We aim to make a lightweight version that will be free to use.
                  </p>
                </div>
              </div>
            </>
          )}
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
    </div>
  );
}
