import { signin, useSession } from "next-auth/client";
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

  if (!loading && !session && !session?.user) return signin();

  useEffect(
    async (e) => {
      if (loading) return;
      const result = await getPendingTips();
      setPendingTips(+result.pending > 0);
    },
    [loading]
  );

  const [questionIndex, setQuestionIndex] = useStickyState(
    0,
    "questionAnswerNumber"
  );
  const [answer, setAnswer] = useState(0);

  function handleNext() {
    setQuestionIndex(questionIndex + 1);
    setAnswered(false);
  }

  function changeAnswer(event) {
    setAnswer(event.target.id);
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
        <div className="bg-white md:shadow overflow-hidden mt-8 md:mt-14 md:w-2/3">
          {data &&
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
                    <div
                      className="flex flex-col justify-center text-gray-900"
                      onChange={changeAnswer}
                    >
                      {item.answer.map((answeritem, answerindex) => {
                        return (
                          <div
                            key={`ans${answerindex}`}
                            className={
                              answered
                                ? answer == answerindex
                                  ? `border-blue-400 border-2 p-4 rounded-lg`
                                  : `hidden`
                                : answer == answerindex
                                ? ` border-blue-400 border-2 p-4 rounded-lg`
                                : ` border-white border-2 p-4`
                            }
                          >
                            <div className="flex flex-row">
                              <input
                                type="radio"
                                id={answerindex}
                                name="answerinput"
                                value={answeritem.answer}
                                className={`inline-flex text-blue-600 outline-none`}
                              />
                              <label
                                className={`inline-flex items-center m-4`}
                                htmlFor="answerinput"
                              >
                                {answeritem.answer}
                              </label>
                            </div>
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
            <nav className="flex mx-auto md:mx-4" aria-label="Pagination">
              <button
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
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
              <Wallet
                enableTipping={true}
                session={session}
                email={data[questionIndex].answer[answer].person?.objectId}
                claimTip={pendingTips}
              />
              <button
                className="relative inline-flex items-center rounded-r-md px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-green-50"
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
            were answering) and a list of answers. You can select the answer you
            like best and then you have to guess who is the author of this
            question.
          </p>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const data = await getAnswers(context);
  return {
    props: {
      data,
    },
  };
}
