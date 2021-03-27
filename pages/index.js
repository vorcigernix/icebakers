import Head from "next/head";
import React, { useState } from "react";
import { signin, signout, useSession } from "next-auth/client";
import Companies from "../components/companies";
import Wallet from "../components/wallet";
import { useRouter } from "next/router";
import useStickyState from "../lib/useStickyState";

export default function Home() {
  const [session, loading] = useSession();
  if (!loading && (!session || !session?.user)) return signin();
  const fwRouter = useRouter();

  //refactor this
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedCompany, setSelectedCompany] = useState(" ");
  const [createdCompany, setCreatedCompany] = useState("");
  const [lastCompany, setLastCompany] = useStickyState("", "companyid");
  lastCompany &&
    session &&
    session.user.address &&
    fwRouter.push(`/questions/${lastCompany}`);
  //
  async function ManageCompany(isnew) {
    setPageIndex(pageIndex + 1);
    if (isnew) {
      const result = await fetch("/api/addcompany", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          name: createdCompany,
        }),
      });
      setSelectedCompany(createdCompany);
    } else {
      setLastCompany(selectedCompany.id);
      await fetch("/api/joincompany", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          orgId: selectedCompany.id,
        }),
      });
    }
  }

  return (
    <div className={`nojs-show ${!session && loading ? "loading" : "loaded"}`}>
      <noscript>
        <style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
      </noscript>
      <div className="flex flex-col  min-h-screen py-2">
        <Head>
          <title>IceBakers</title>
          <link
            rel="icon"
            href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🧁</text></svg>"
          />
        </Head>

        <main className="flex flex-col items-center mt-9 flex-1 md:px-20">
          <h1 className="text-6xl font-extrabold text-center md:text-left">
            🧁
            <span className="text-blue-400">Ice</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-600">
              Bakers
            </span>
          </h1>

          {session && session.user && (
            <>
              <div className="text-center md:text-left md:flex">
                <div className="md:block inline-block p-2 w-56 h-56 rounded-full bg-gradient-to-r from-yellow-100 to-green-400 md:w-72 md:h-72 ">
                  <img
                    className="mx-auto w-64 w h-64"
                    src="/undraw_Waiting__for_you_ldha.svg"
                    alt="illustration"
                  />
                </div>
                <div
                  className={
                    pageIndex == 0
                      ? `visible md:w-2/3 pt-6 md:p-12 md:ml-16 space-y-4`
                      : `hidden`
                  }
                >
                  <p className="my-6 text-xl mx-auto">
                    Get to know your colleagues and friends
                  </p>
                  <p className="text-lg font-light">
                    Thanks for signing in. Now we recommend to start with
                    answering questions. This will provide pool of answers for
                    others and make the app more fun for your colleagues.
                  </p>
                  <p className="text-lg font-light">
                    First, please select a "company". This is the group that
                    sets boundaries, your answers will be visible only within
                    your group and later, in a Guess Answer part, you will see
                    answers only from your group.
                  </p>

                  <Companies
                    onCreateCompany={setCreatedCompany}
                    onCompanyChange={setSelectedCompany}
                  />
                  <p className="font-light">
                    Existing companies are listed as you type. If you want to
                    create a new company, type a name and press the yellow
                    button.
                  </p>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm my-8 py-6"
                    aria-label="Pagination"
                  >
                    {selectedCompany && selectedCompany != " " && (
                      <button
                        className="relative inline-flex items-center px-2 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-green-50"
                        onClick={() => ManageCompany(false)}
                      >
                        <span>Join {selectedCompany.name}</span>
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
                    )}
                    {!selectedCompany && (
                      <button
                        className="relative inline-flex items-center px-2 py-2 rounded-md border border-gray-300 bg-yellow-300 text-sm font-medium text-gray-500 hover:bg-white"
                        onClick={() => ManageCompany(true)}
                      >
                        <span>Create new company</span>
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
                    )}
                  </nav>
                </div>
                {/* screen 2 */}
                <div
                  className={
                    pageIndex == 1
                      ? `visible md:w-2/3 pt-6 md:p-12 md:mx-8 space-y-4`
                      : `hidden`
                  }
                >
                  <p className="my-6 text-2xl mx-auto">
                    Get rewarded for great answers
                  </p>
                  <p className="text-lg font-light">
                    Thanks for selecting your company. Now, this part is
                    optional, but we all like to be rewarded, right? A new
                    projects like BSC allows us to make tip process fast and
                    easy. This does not mean that you need to reward your peers,
                    no pressure, this is up to you.
                  </p>
                  <p className="text-lg font-light">
                    It goes both ways though, if you want to be rewarded, we'll
                    need your wallet address. If you don't have a wallet
                    installed, follow{" "}
                    <a
                      href="https://academy.binance.com/en/articles/connecting-metamask-to-binance-smart-chain"
                      className="font-semibold"
                    >
                      Binance easy guide
                    </a>{" "}
                    to install and setup a Metamask. And, welcome to the future.
                  </p>
                  <nav
                    className="relative z-0 inline-flex my-8 py-6 last:rounded-r-md"
                    aria-label="Pagination"
                  >
                    <button
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      onClick={() => setPageIndex(pageIndex - 1)}
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
                    {session.user.address && selectedCompany && (
                      <a href={`/questions/${selectedCompany.id}`}>
                        <button className="relative inline-flex items-center px-2 py-2 border rounded-r-md border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                          <span>Nice, all is set</span>

                          <svg
                            className="h-5 w-5 ml-2"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </a>
                    )}
                    <Wallet session={session} />
                    {!session.user.address && selectedCompany && (
                      <a href={`/questions/${selectedCompany.id}`}>
                        <button className="relative inline-flex items-center rounded-r-md px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                          <span>Skip</span>

                          <svg
                            className="h-5 w-5 ml-2"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </a>
                    )}
                  </nav>
                </div>
                {/* screen3 - choose questions or answers?*/}
              </div>
            </>
          )}
        </main>

        <footer className="flex items-center justify-center w-full h-24 md:border-t">
          <a
            className="flex items-center justify-center"
            href="https://gitcoin.co/issue/binancex/Grant-projects/17/100024656"
            target="_blank"
            rel="noopener noreferrer"
          >
            built at Binance Hackathon: The Future Is Now
          </a>
        </footer>
      </div>
    </div>
  );
}
