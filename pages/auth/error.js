import { providers, signIn, signOut } from "next-auth/client";

export default function AuthError() {
  return Object.values(providers).map((provider) => (
    <div key={provider.name}>
      <button
        className="flex items-center justify-center px-3 py-3 border border-transparent text-base font-medium rounded-md text-gray-600 bg-white hover:bg-gray-50 hover:text-black md:py-3 md:px-3 shadow-sm m-4"
        onClick={() => signOut(provider.id)}
      >
        Sign out with {provider.name}
      </button>
    </div>
  ));
}
