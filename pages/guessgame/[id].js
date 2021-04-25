import { signIn, useSession } from "next-auth/client";
import useStickyState from "../../lib/useStickyState";
import Wallet from "../../components/wallet";
import People from "../../components/people";
import { useState, useEffect } from "react";
import { getPendingTips } from "../../lib/tipsService";
import { getAnswers } from "../../lib/getanswers";

export default function GuessGame({ data }) {
  const [session, loading] = useSession();
  const [pendingTips, setPendingTips] = useState(false);
  const [answered, setAnswered] = useState(false);

  if (!loading && !session && !session?.user) return signIn();

  useEffect(
    async (e) => {
      if (loading) return;
      const result = await getPendingTips();
      setPendingTips(+result.pending > 0);
    },
    [loading]
  );

  async function copyToClip() {
    navigator.clipboard.writeText(location).then(
      function () {
        return true;
      },
      function () {
        return false;
      }
    );
  }

  const [questionIndex, setQuestionIndex] = useStickyState(
    0,
    "questionAnswerNumber"
  );
  const [answer, setAnswer] = useState(null);

  function handleNext() {
    setQuestionIndex(questionIndex + 1);
    setAnswered(false);
    setAnswer(null);
  }

  function changeAnswer(event, id) {
    setAnswer(id);
  }

  function freezeAnswers(answer) {
    setAnswered(answer);
  }


  return (
    <div>
      <main className="flex flex-col items-center mt-9 flex-1 md:px-20">
        <h1 className=" text-4xl md:text-6xl font-extrabold text-center md:text-left">
          🧁
          <span className="text-blue-400">Ice</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-600">
            Bakers
          </span>
        </h1>
        {data && questionIndex < data.length && (
          <div className="bg-white overflow-hidden mt-8 md:mt-14 md:w-2/3">
            {data &&
              questionIndex < data.length &&
              data.map((item, index) => {
                return (
                  <div
                    className={
                      index == questionIndex
                        ? `visible text-center px-4 py-5 md:text-left sm:px-6`
                        : `hidden`
                    }
                    key={index}
                  >
                    <h3 className="text-2xl font-extrabold  text-gray-900">
                      <span className=" text-blue-400">Q:&nbsp;</span>
                      {item.question}
                    </h3>
                    <div className="font-light text-base mb-4">
                      select best answer:
                    </div>
                    <div>
                      <div className="flex flex-col md:items-start text-gray-900">
                        {item.answer.map((answeritem, answerindex) => {
                          return (
                            <div
                              key={`a${answerindex}`}
                              className={
                                answer == null || answer == answerindex
                                  ? `block w-full`
                                  : `hidden`
                              }
                            >
                              <button
                                key={`ans${answerindex}`}
                                className="my-4 p-6 rounded w-full shadow md:text-left focus:ring-2 focus:ring-blue-600 group focus:bg-blue-700 "
                                onClick={(event) =>
                                  changeAnswer(event, answerindex)
                                }
                              >
                                <figure>
                                  <blockquote className=" group-focus:text-white text-lg">
                                    <span className="font-bold text-4xl mr-3 text-green-400 group-focus:text-blue-400">
                                      "
                                    </span>
                                    {answeritem.answer}
                                  </blockquote>
                                  <figcaption></figcaption>
                                </figure>
                              </button>
                              <div
                                className={
                                  answer == answerindex ? `visible` : `hidden`
                                }
                              >
                                <People
                                  data={answeritem}
                                  onselectedPerson={freezeAnswers}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}

            <div className="w-full flex items-start py-6">
              <nav className="flex mx-4" aria-label="Pagination">
                <button
                  className="h-10 px-5 text-indigo-100 transition-colors duration-150 bg-blue-700 rounded-l focus:shadow-outline bg-gradient-to-tl hover:from-green-400 inline-flex items-center"
                  onClick={() =>
                    questionIndex > 0 && setQuestionIndex(questionIndex - 1)
                  }
                >
                  <span className="sr-only">Previous</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {answered && (
                  <div className="h-10 px-5 text-indigo-100 transition-colors duration-150 bg-blue-700  focus:shadow-outline bg-gradient-to-tl hover:from-green-400 inline-flex items-center">
                    <Wallet
                      enableTipping={true}
                      session={session}
                      email={
                        data[questionIndex].answer[answer].person?.objectId
                      }
                      claimTip={pendingTips}
                    />
                  </div>
                )}
                <button
                  className="h-10 px-5 text-indigo-100 transition-colors duration-150 bg-blue-700 rounded-r focus:shadow-outline bg-gradient-to-tl hover:from-green-400 inline-flex items-center disabled:opacity-10"
                  disabled={!answered}
                  onClick={() => handleNext()}
                >
                  <span>Next</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
            <p
              className={
                questionIndex < 3 ? `visible px-4 pb-6 font-light` : `hidden`
              }
            >
              Welcome to the guess game part. Here you see a question (same you
              were answering) and a list of answers. You can select the answer
              you like best and then you have to guess who is the author of this
              question.
            </p>
          </div>
        )}
        {data && questionIndex == data.length && (
          <div className="text-center md:text-left md:flex">
            <div className="md:block inline-block p-2 w-56 h-56 rounded-full bg-gradient-to-r from-yellow-100 to-green-400 md:w-72 md:h-72 ">
              <img
                className="mx-auto w-64 w h-64"
                src="/undraw_result_5583.svg"
                alt="illustration"
              />
            </div>
            <div className={`md:w-2/3 pt-6 md:p-12 md:mx-8 space-y-1`}>
              <p className="my-6 text-2xl mx-auto">Thank you</p>
              <p className="text-lg font-light">
                That's it for the guess game. Hope you enjoyed the experience.
                The nature of game force us to filter our questions where we
                don't have enough answers. As your teammates add their
                responses, this game naturally grow.
              </p>
              <p className="text-lg font-light">
                You can help to keep this game entertaining if you share the
                link. Also, we suggest you bookmark this page to continue with
                new answers as they arrive.
              </p>
              <p className="text-lg font-light pb-8">
                Press the button below and paste the link into your favorite
                communication channel.
              </p>

              <button
                className="h-10 px-5  text-indigo-100 transition-colors duration-150 bg-blue-700 rounded focus:shadow-outline bg-gradient-to-tl hover:from-green-400 inline-flex items-center"
                onClick={() => copyToClip}
              >
                Copy link
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const data = await getAnswers(context);
  if (!data) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/login",
      },
    };
  }
  return {
    props: { data },
  };
}
