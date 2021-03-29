import { useSession, signin } from "next-auth/client";
import useSWR from "swr";
import { useState } from "react";
import { useRouter } from "next/router";
import useStickyState from "../../lib/useStickyState";

export default function QuestionsPage() {
  const [session, loading] = useSession();
  const [questionIndex, setQuestionIndex] = useStickyState(0, "questionNumber");
  const [answerText, setAnswerText] = useState("");
  const [loader, setLoader] = useState(false);
  const router = useRouter();
  const { id } = router.query; // note this value (id) is based on the [id].js
  //console.log(router.query, id);

  if (!loading && !session?.user) return signin();

  const fetcher = (url) => fetch(url).then((r) => r.json()); // todo: add the organisation id so we get only questions for a particular org
  const { data, error } = useSWR(`/api/questions`, fetcher);
  //console.log(data)
  if (error) return <div>failed to load</div>;
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
        orgId: id,
        qnId: data[questionIndex].id,
      }),
    });
    setAnswerText("");
    setLoader(false);
  }

  return (
    <div >
      <main className="flex flex-col items-center mt-9 flex-1 md:px-20">
        <h1 className=" text-4xl md:text-6xl font-extrabold text-center md:text-left">
          🧁
          <span className="text-blue-400">Ice</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-tl from-green-400 to-blue-600">
            Bakers
          </span>
        </h1>
        <div className="md:shadow overflow-hidden mt-8 md:mt-14 md:w-2/3 rounded-md ">
          {data.map((item, index) => (
            <div
              className={
                index == questionIndex ? `visible px-6 py-12 md:pb-16 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500` : `hidden`
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
                tabIndex="1"
              ></textarea>
            </div>
          </div>
          <div className="w-full flex items-start py-6">
          <nav
            className="flex mx-4"
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
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {questionIndex > 15 && (
              <a href={`/guessgame/${id}`}>
                <button className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-green-100 text-sm font-medium text-gray-500 hover:bg-green-50">
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
              className="relative inline-flex items-center rounded-r-md px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-green-50 disabled:opacity-20 "
              onClick={handleClick}
              disabled={answerText==""}
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
          <p className=" px-4 pb-6 font-light">
            Now you can guess the answers. You will see what other people in
            your company responded and you will have to guess who gave this
            answer.
          </p>
        </div>
      </main>
    </div>
  );
}
