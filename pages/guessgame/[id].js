import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import useSWR from "swr";
import useStickyState from "../../lib/useStickyState";
import Wallet from "../../components/wallet";
import { useState } from "react";

export default function GuessGame() {
  const [session, loading] = useSession();

  const router = useRouter();
  const { id } = router.query;

  if (!loading && !session?.user) return signin();

  const [questionIndex, setQuestionIndex] = useStickyState(
    0,
    "questionAnswerNumber"
  );
  const [rightAnswer, setRightAnswer] = useState("");
  function showResult(correct){
    setRightAnswer(correct===true ? true:false);
  }
  function handleNext(){
    setQuestionIndex(questionIndex + 1);
    setRightAnswer(undefined);

  }

  const fetcher = (url, id) => fetch(url, id).then((r) => r.json());
  const { data, error } = useSWR(() => id && `/api/getanswers/${id}`, fetcher);
  //console.log(data);
  //if (error) return <div>failed to load</div>;
  //if (!data) return <div>loading...</div>;

  //get the questions so I don't need to fake them
  // const { data, error } = useSWR(`/api/questions`, fetcher);
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  console.log(rightAnswer);
  return (
    <div className="flex flex-col  min-h-screen py-2">
      <main className="flex flex-col items-center mt-9 flex-1 px-20">
        <h1 className="text-6xl font-extrabold">
          🧁
          <span className="text-blue-400">Ice</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-600">
            Bakers
          </span>
        </h1>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg md:mt-14 w-2/3">
          {data.map((item, index) => (
            <div
              className={
                index == questionIndex ? `visible px-4 py-5 sm:px-6` : `hidden`
              }
              key={index}
            >
              <h3 className="text-2xl font-extrabold  text-gray-900">
                <span className=" text-blue-400">Q:&nbsp;</span>{item.questiontext}
              </h3>
              <div className="text-2xl font-extrabold  text-gray-900 my-6">
                <h3 className="text-xl text-blue-400 mb-4">Either {item.answer.person.name} or {item.answer.person2.name} responded:</h3>"
                {item.answer.answer}"
              </div>
              <div className="text-xl font-extrabold">
                <div className="flex flex-col md:flex-row justify-center items-center flex-1 text-center py-4">
                  <button
                    className="flex flex-col w-44 items-center justify-center px-3 py-3 font-extrabold text-gray-600 hover:text-black hover:shadow-md md:py-3 md:px-3 mr-4 rounded-lg "
                    onClick={() => showResult(item.answer.person.correct)}
                  >
                    <img
                      className="inline-block h-16 w-16 h rounded-full ring-4 ring-blue-400 mr-3 mb-4"
                      src={item.answer.person.profilePic}
                    />
                    {item.answer.person.name}
                  </button>
                  <div className="w-44 h-44 flex items-center justify-center">
                    <div className="flex rounded-full w-12 h-12 bg-blue-400 text-white align-middle items-center justify-center">
                      OR
                    </div>
                  </div>
                  <button
                    className="flex flex-col w-44 items-center justify-center px-3 py-3 font-extrabold text-gray-600  hover:text-black hover:shadow-md md:py-3 md:px-3 mr-4 rounded-lg"
                    onClick={() => showResult(item.answer.person2.correct)}
                  >
                    <img
                      className="inline-block h-16 w-16 h rounded-full ring-4 ring-blue-400 mr-3 mb-4"
                      src={item.answer.person2.profilePic}
                    />
                    {item.answer.person2.name}
                  </button>
                </div>
                {rightAnswer && rightAnswer === true && (
                  <h3 className="text-green-400">Oh no, you are right :)</h3>
                )}
                {rightAnswer === false &&  (
                  <h3 className="text-red-400">Awesome. Wrong.</h3>
                )}
              </div>
            </div>
          ))}

          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px m-6"
            aria-label="Pagination"
          >
            <button
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              onClick={() => questionIndex > 0 && setQuestionIndex(questionIndex - 1)}
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

            <button className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <span>Reward</span>
              <svg
                className="h-5 w-5 mx-2 text-green-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z"
                  clipRule="evenodd"
                />
                <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
              </svg>
            </button>
            <Wallet session={session} />
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
          <p className=" px-4 pb-6 font-light">
            Welcome to the guess game part. Here you see a question you've
            answered before, answer and two of your friends. Your goal is to
            pick the name that responded this.
          </p>
        </div>
      </main>
    </div>
  );
}
