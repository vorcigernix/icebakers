import Head from "next/head";
import { getProviders, signIn } from "next-auth/client";

export default function SignIn({ providers }) {
  return (
    <div className={`nojs-show loaded`}>
      <noscript>
        <style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
      </noscript>
      <div className="flex flex-col  min-h-screen py-2">
        <Head>
          <title>Login to IceBakers</title>
        </Head>

        <main className="flex flex-col items-center mt-9 flex-1 md:px-20">
          <h1 className="text-6xl font-extrabold text-center md:text-left">
            🧁
            <span className="text-blue-400">Ice</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-600">
              Bakers
            </span>
          </h1>
          <>
            <div className="md:flex p-8">
              {Object.values(providers).map((provider) => (
                <div key={provider.name}>
                  <button
                    className="flex items-center justify-center px-3 py-3 border border-transparent text-base font-medium rounded-md text-gray-600 bg-white hover:bg-gray-50 hover:text-black md:py-3 md:px-3 shadow-sm m-4"
                    onClick={() => signIn(provider.id)}
                  >
                    Sign in with {provider.name}
                  </button>
                </div>
              ))}
            </div>
            <div className="text-center md:text-left md:flex">
              <div className="md:block inline-block p-2 w-56 h-56 rounded-full bg-gradient-to-r from-yellow-100 to-green-400 md:w-72 md:h-72 ">
                <img
                  className="mx-auto w-64 w h-64"
                  src="/undraw_Fingerprint_re_uf3f.svg"
                  alt="illustration"
                />
              </div>
              <div className="visible md:w-2/3 pt-6 md:p-12 md:ml-16 space-y-4">
                <p className="my-6 text-xl mx-auto">
                  Get to know your colleagues and friends
                </p>
                <p className="text-lg font-light">
                  IceBakers works in two parts. In one, you respond to the
                  "icebreaker questions" and your responses are saved with your
                  name. In a second part, you will play the guess game: you
                  will see the question with a list of answers, you pick the
                  answer you like best and then you will see two names - one is
                  author of reply and on is random person from your
                  team. Your goal is to find out who is the correct author
                  of the response.
                </p>
                <p className="text-lg font-light">
                  This application is inspired by a functionality of&nbsp;
                  <a
                    href="https://www.quizbreaker.com/"
                    className="font-semibold"
                  >
                    QuizBreaker
                  </a>
                  . We want to create a similar system that will be free to use,
                  with a reward system that will allow you to appreciate
                  interesting and honest answers of your friends.
                </p>
              </div>
            </div>
          </>
        </main>

        <footer className="flex items-center justify-center w-full h-24 md:border-t">
          <a
            className="flex items-center justify-center"
          >
            &copy; 2021 - IceBakers. Images by Unsplash
          </a>
        </footer>
      </div>
    </div>
  );
}

SignIn.getInitialProps = async (context) => {
  return {
    providers: await getProviders(context),
  };
};
