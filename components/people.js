import { useState } from "react";

export default function People({ onselectedPerson, data }) {
  const [rightAnswer, setRightAnswer] = useState("");
  const replys = [
    "Yes, great one. Now who responded this?",
    "Totally. Whose answer is this though?",
    "My favorite. But who is the author?",
    "I like this reply. Now guess the author.",
  ];
  function showResult(person) {
    onselectedPerson(true);
    setRightAnswer(person.correct === true ? [true, person.name] : [false, person.name]);
  }
  return (
    <>
      <span
        className="font-light text-base mb-4"
        suppressHydrationWarning={true}
      >
        {process.browser && replys.sort(() => 0.5 - Math.random()).slice(0, 1)}
      </span>
      <div className="flex flex-row outline-none">
        <button
          className={rightAnswer ? `flex items-center rounded-md text-gray-400 outline-none` : `flex items-center rounded-md group text-gray-900 outline-none`}
          onClick={() => showResult(data.person)}
          disabled={rightAnswer}
        >
          <div className="flex-shrink-0 h-10 w-10">
            <img
              className="h-10 w-10  border-4 border-gray-50 ring-gray-100 rounded-full group-hover:border-blue-400"
              src={data.person.profilePic}
              alt=""
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium  group-hover:text-blue-600">
              {data.person.name}
            </div>
          </div>
        </button>
        <div className="flex w-5 h-5 m-5 text-gray-700 text-xs align-middle items-center justify-center">
          OR
        </div>
        <button
          className={rightAnswer ? `flex items-center rounded-md text-gray-400 outline-none` : `flex items-center rounded-md group text-gray-900 outline-none`}
          onClick={() => showResult(data.person2)}
          disabled={rightAnswer}
        >
          <div className="flex-shrink-0 h-10 w-10">
            <img
              className="h-10 w-10  border-4 border-gray-50 ring-gray-100 rounded-full group-hover:border-blue-400"
              src={data.person2.profilePic}
              alt=""
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium group-hover:text-blue-600">
              {data.person2.name}
            </div>
          </div>
        </button>
      </div>
      <div className="flex mt-4 text-base">
          {rightAnswer && rightAnswer[0] === true && (
            <h3 className="text-green-400">Correct. It was {rightAnswer[1]}. <a href="" className="text-gray-900 hidden">Tip him?</a></h3>
          )}
          {rightAnswer[0] === false && (
            <h3 className="text-red-400">Nope.</h3>
          )}
        </div>
    </>
  );
}
