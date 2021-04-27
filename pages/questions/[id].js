import { useSession, signIn } from "next-auth/client";
import { useState } from "react";
import { getQuestions } from "../../lib/getquestions";
import useStickyState from "../../lib/useStickyState";

export default function QuestionsPage({ data, eligible, orgId }) {
  const [session, loading] = useSession();
  const [questionIndex, setQuestionIndex] = useStickyState(0, "questionNumber");
  const [answerText, setAnswerText] = useState("");
  const [loader, setLoader] = useState(false);
  const [id] = useStickyState("", "companyid");

  if (!loading && !session?.user) return signIn();
  if (!data) return <div>loading...</div>;

  async function handleClick() {
    if (!answerText || answerText == "") return;
    setLoader(true);
    setQuestionIndex(questionIndex + 1);
    await fetch("/api/answer", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        ans: answerText,
        orgId: orgId,
        qnId: data[questionIndex].id,
      }),
    });
    setAnswerText("");
    setLoader(false);
  }
  //eligible = false;
  //maybe handle that somehow, don't want to introduce another react state though
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
  return (
    <>
      <div className={questionIndex < data.length ? `visible` : `hidden`}>
        <main className="flex flex-col items-center mt-9 flex-1 md:px-20">
          <h1 className=" text-4xl md:text-6xl font-extrabold text-center md:text-left">
            🧁
            <span className="text-blue-400">Ice</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-green-400 to-blue-600">
              Bakers
            </span>
          </h1>
          <div className="md:shadow overflow-hidden mt-8 md:mt-14 md:w-2/3 rounded-md ">
            {data.map((item, index) => (
              <div
                className={
                  index == questionIndex
                    ? `visible px-6 py-12 md:pb-16 fader `
                    : `hidden`
                }
                key={item.id}
              >
                <h2 className="text-4xl font-extrabold  text-gray-50">
                  {item.questiontext}
                </h2>
              </div>
            ))}

            <div>
              <div
                className={
                  loader
                    ? `mt-1 py-2 mx-4 rounded-md ring-2 ring-gray-100 opacity-10 bg-gray-300`
                    : `mt-1 py-2 mx-4 rounded-md ring-2 ring-white bg-white`
                }
              >
                <textarea
                  id="answer"
                  name="answer"
                  rows="3"
                  className="block w-full resize-none p-2 outline-none bg-transparent"
                  placeholder="type your answer and click next"
                  autoFocus
                  onChange={(event) => setAnswerText(event.target.value)}
                  value={answerText}
                  tabIndex="0"
                ></textarea>
              </div>
            </div>
            <div className="w-full flex items-start py-6">
              <nav className="flex mx-4" aria-label="Pagination">
                <button
                  disabled={questionIndex < 1}
                  className="h-10 px-5 text-indigo-100 transition-colors duration-150 bg-blue-700 rounded-l focus:shadow-outline bg-gradient-to-tl hover:from-green-400 inline-flex items-center disabled:opacity-10"
                  onClick={() => setQuestionIndex(questionIndex - 1)}
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

                {questionIndex > 15 && eligible && (
                  <a href={`/guessgame/${id}`}>
                    <button className="h-10 px-5 text-indigo-100 transition-colors duration-150 bg-blue-700 focus:shadow-outline bg-gradient-to-tl hover:from-green-400 inline-flex items-center">
                      <span>Guess Answers</span>
                      <svg
                        className="h-5 w-5 mx-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </a>
                )}
                {questionIndex > 15 && !eligible && (
                  <a href={`/guessgame/${id}`}>
                    <button className="h-10 px-5 text-indigo-100 transition-colors duration-150 bg-blue-700 focus:shadow-outline bg-gradient-to-tl hover:from-green-400 inline-flex items-center">
                      <span>Guess Answers</span>
                      <svg
                        className="h-5 w-5 mx-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </a>
                )}

                <button
                  className="h-10 px-5 text-indigo-100 transition-colors duration-150 bg-blue-700 rounded-r focus:shadow-outline bg-gradient-to-tl hover:from-green-400 inline-flex items-center disabled:opacity-10"
                  onClick={handleClick}
                  disabled={answerText == ""}
                  tabIndex="1"
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
              Welcome to the Answers part. Answer at least 15 questions and we
              will let you in the Guess Game. Remember: Honest, rare and
              generally great answers will be rewarded by your friends.
            </p>
            <p
              className={
                questionIndex > 15 && !eligible
                  ? `visible px-4 pb-6 font-bold`
                  : `hidden`
              }
            >
              Congratulations, you answered basic set of questions. We are now
              waiting for your friends to answer them too as the game make sense
              only when at least three people participate. You can continue
              answering questions though, more answers equals more fun.
            </p>
          </div>
        </main>
      </div>
      {questionIndex == data.length && (
        <div>
          <main className="flex flex-col items-center mt-9 flex-1 md:px-20">
            <h1 className=" text-4xl md:text-6xl font-extrabold text-center md:text-left">
              🧁
              <span className="text-blue-400">Ice</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-br from-green-400 to-blue-600">
                Bakers
              </span>
            </h1>

            <div className="text-center md:text-left md:flex">
              <div className="md:block inline-block p-2 w-56 h-56 rounded-full bg-gradient-to-r from-yellow-100 to-green-400 md:w-72 md:h-72 ">
                <img
                  className="mx-auto w-64 w h-64"
                  src="/undraw_result_5583.svg"
                  alt="illustration"
                />
              </div>
              <div
                className={
                  eligible
                    ? `visible md:w-2/3 pt-6 md:p-12 md:mx-8 space-y-1`
                    : `hidden`
                }
              >
                <p className="my-6 text-2xl mx-auto">Thank you</p>
                <p className="text-lg font-light">
                  That's it for the icebreakers. We have all your answers
                  recorded and we love them already. Your friends will love them
                  too for sure.
                </p>
                <p className="text-lg font-light pb-8">
                  In next part of the app you will see the questions you just
                  answered with responses from your team. You pick the response
                  you like best and than you guess the author.
                </p>
                <a href={`/guessgame/${id}`}>
                  <button className="h-10 px-5  text-indigo-100 transition-colors duration-150 bg-blue-700 rounded focus:shadow-outline bg-gradient-to-tl hover:from-green-400 inline-flex items-center">
                    Continue to Guess Game
                  </button>
                </a>
              </div>
              <div
                className={
                  !eligible
                    ? `visible md:w-2/3 pt-6 md:p-12 md:mx-8 space-y-1`
                    : `hidden`
                }
              >
                <p className="my-6 text-2xl mx-auto">Thank you</p>
                <p className="text-lg font-light">
                  That's it for the icebreakers. We have all your answers
                  recorded and we love them already. Your friends will love them
                  too for sure.
                </p>
                <p className="text-lg font-light">
                  In next part of the app you will see the questions you just
                  answered with responses from your team. There is not enough
                  answers from your team yet though, what about sharing the game
                  with them?
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
          </main>
        </div>
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  const { data, eligible } = await getQuestions(context);
  const { id } = context.params;
  return {
    props: {
      data,
      eligible,
      orgId: id,
    },
  };
}
