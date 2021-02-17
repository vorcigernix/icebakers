import { useSession } from "next-auth/client";
import useSWR from "swr";
import React, { useEffect, useState } from "react";

export default function QuestionsPage() {
  const [session, loading] = useSession();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answerText, setAnswerText] = React.useState("");

  if (!loading && !session?.user) return signin();

  const fetcher = (url) => fetch(url).then((r) => r.json());
  const { data, error } = useSWR(`/api/questions`, fetcher);
  //console.log(data)
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  async function handleClick() {
    setQuestionIndex(questionIndex + 1);

    await fetch("/api/answer", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ answerText, data: data[questionIndex] }),
    });
  }

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
              key={item.id}
            >
              <h3 className="text-4xl font-extrabold  text-gray-900">
                {item.questiontext}
              </h3>
            </div>
          ))}

          <div>
            <div className="mt-1 py-2 mx-4 rounded-md ring-2 ring-blue-400 ">
              <textarea
                id="answer"
                name="answer"
                rows="3"
                className="block w-full resize-none p-2 outline-none"
                placeholder="type your answer and click next"
                autoFocus
                onChange={(event) => setAnswerText(event.target.value)}
                value={answerText}
              ></textarea>
            </div>
          </div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px m-6"
            aria-label="Pagination"
          >
            <button
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
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
                  fill-rule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>

            <button
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-green-50"
              onClick={() => handleClick()}
            >
              <span className="">Next</span>
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </nav>
        </div>
      </main>
    </div>
  );
}
