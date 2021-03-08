import { signin, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import useStickyState from "../../lib/useStickyState";
import Wallet from "../../components/wallet";
import { useState, useEffect } from "react";
import { getPendingTips } from "../../lib/tipsService";

export default function GuessGame() {
  const [session, loading] = useSession();
  const [pendingTips, setPendingTips] = useState(false);

  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState(undefined);

  useEffect(async () => {
    if (loading) return;
    console.log("Refreshing");
    const res = await fetch(`/api/getanswers/${id}`);
    const data = await res.json();
    setData(data);
  }, [loading]);

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
  const [rightAnswer, setRightAnswer] = useState("");
  function showResult(correct) {
    setRightAnswer(correct === true ? true : false);
  }
  function handleNext() {
    setQuestionIndex(questionIndex + 1);
    setRightAnswer(undefined);
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
  if (!data) return <div>loading...</div>;

  data.map((item, index) => console.log(item));

  return (
    <div>
      <main className="flex flex-col items-center mt-9 flex-1 md:px-20">
        <h1 className=" text-xl md:text-6xl font-extrabold text-center md:text-left">
          🧁
          <span className="text-blue-400">Ice</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-600">
            Bakers
          </span>
        </h1>
        <div className="bg-white md:shadow overflow-hidden mt-8 md:mt-14 md:w-2/3">
          {data.map((item, index) => {
            const rndAnswer = getRandomInt(item.answer.length - 1);
            //console.log(item.question, index);
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
                <div>
                  <h3 className="font-light text-base mb-4">
                    Either {item.answer[rndAnswer].person.name} or &nbsp;
                    {item.answer[rndAnswer].person2.name}
                    &nbsp;responded:
                  </h3>
                  <div className="text-2xl font-bold text-blue-500 my-6">
                    "{item.answer[rndAnswer].answer}"
                  </div>
                </div>
                <div className="text-xl font-extrabold">
                  <div className="flex flex-col md:flex-row justify-center items-center flex-1 text-center py-4">
                    <button
                      className="flex flex-col w-44 items-center justify-center px-3 py-3 font-extrabold text-gray-600 hover:text-black hover:shadow-md md:py-3 md:px-3 mr-4 rounded-lg "
                      onClick={() =>
                        showResult(item.answer[rndAnswer].person.correct)
                      }
                    >
                      <img
                        className="inline-block h-16 w-16 h rounded-full ring-4 ring-blue-400 mr-3 mb-4"
                        src={item.answer[rndAnswer].person.profilePic}
                      />
                      {item.answer[rndAnswer].person.name}
                    </button>
                    <div className="hidden md:w-44 md:h-44 md:flex items-center justify-center">
                      <div className="flex rounded-full w-12 h-12 bg-blue-400 text-white align-middle items-center justify-center">
                        OR
                      </div>
                    </div>
                    <button
                      className="flex flex-col w-44 items-center justify-center px-3 py-3 font-extrabold text-gray-600  hover:text-black hover:shadow-md md:py-3 md:px-3 mr-4 rounded-lg"
                      onClick={() =>
                        showResult(item.answer[rndAnswer].person2.correct)
                      }
                    >
                      <img
                        className="inline-block h-16 w-16 h rounded-full ring-4 ring-blue-400 mr-3 mb-4"
                        src={item.answer[rndAnswer].person2.profilePic}
                      />
                      {item.answer[rndAnswer].person2.name}
                    </button>
                  </div>
                  {rightAnswer && rightAnswer === true && (
                    <h3 className="text-green-400">Oh no, you are right :)</h3>
                  )}
                  {rightAnswer === false && (
                    <h3 className="text-red-400">Awesome. Wrong.</h3>
                  )}
                </div>
              </div>
            );
          })}

          <div className="w-full flex items-start py-6">
            <nav
              className="flex rounded-md shadow-sm mx-auto md:mx-4"
              aria-label="Pagination"
            >
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
              {/* <Wallet
                enableTipping={true}
                session={session}
                email={data[questionIndex]}
                claimTip={pendingTips}
              /> */}
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
            Welcome to the guess game part. Here you see a question you've
            answered before, answer and two of your friends. Your goal is to
            pick the name that responded this.
          </p>
        </div>
      </main>
    </div>
  );
}
