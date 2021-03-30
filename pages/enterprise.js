export default function Enterprise() {
  return (
    <div className={`nojs-show loaded`}>
      <div className="flex flex-col  min-h-screen py-2">
        <main className="flex flex-col items-center mt-9 flex-1 md:px-20">
          <h1 className="text-6xl pb-8 font-extrabold text-center md:text-left md:pb-1">
            🧁
            <span className="text-blue-400">Ice</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-600">
              Bakers
            </span>
          </h1>

          <>
            <div className="text-center md:text-left md:flex">
              <div className="md:block inline-block p-2 w-56 h-56 rounded-full bg-gradient-to-r from-yellow-100 to-blue-400 md:w-72 md:h-72 ">
                <img
                  className="mx-auto w-64 w h-64"
                  src="/undraw_career_development_oqcb.svg"
                  alt="illustration"
                />
              </div>
              <div
                className={`visible md:w-2/3 pt-6 md:p-12 md:ml-16 space-y-4`}
              >
                <p className="my-6 text-xl mx-auto">
                  Private groups, custom questions and more...
                </p>
                <p className="text-lg font-light">
                  Do you need SSO, ISO27001, ISO27018, SOC 2 level security,
                  GDPR compliant application? Do you want to be sure that your
                  answers are secure within your company?
                </p>
                <p className="text-lg font-light">
                  We hear you and we understand. For just one <b>Ξ</b> Ether monthly, you
                  get all of enterprise features for first 900 users. And you
                  can expect same friendly price for all our custom plans. And
                  yes, you can pay in USD and EUR via wire (bank) transfer if
                  you wish.
                </p>
                <a
                  target="email"
                  href="mailto:enterprise@icebakers.app?subject=Let's talk about Icebakers for our corporation"
                >
                  <button className="relative inline-flex items-center px-2 py-2 mt-4 border rounded-md border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-green-200">
                    <span>Get in touch</span>

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
                <p className="font-light">
                  ... and start discussing details. We understand this is a long
                  process including a legal and security specialists on your
                  side and we are looking forward to meet them.
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
