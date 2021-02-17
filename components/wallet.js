import Web3Container from "../lib/Web3Container";
import { getPendingTips, connectWallet } from "../lib/tipsService";
import React, { useEffect } from "react";
import { useSession, signIn, signOut } from 'next-auth/client'

async function tipFriend({ friend, amount, contract, wallet, web3 }) {
  console.log(amount);
  if (friend.wallet) {
    await web3.eth.sendTransaction({
      from: wallet,
      to: friend.wallet,
      value: amount,
    });
    console.log("Completed");
    // this function should call update on a database to register
    // that your friend was tipped an amount
    return true;
  } else {
    // send to escrow account (smart contract)
    // to be continued
    console.log("No address, so we will send a tip to the escrow service");
    const result = await contract.methods
      .deposit(web3.utils.soliditySha3(friend.email))
      .send({ from: wallet, value: amount });
    console.log(result);
  }
}

/**
 * This function is called to simulate registering your wallet ideally you call
 * this when the user wants to register their wallet; it will also help claim
 * some tips if they have any
 *
 * @param {String} wallet - wallet to be registered
 */
async function registerWalletToClaim(wallet) {
  connectWallet(wallet);
}

function WalletComponent(props) {
  const [wallet, setWallet] = React.useState(
    props.accounts && props.accounts[0]
  );
  
  const [pendingTips, setPendingTips] = React.useState(false);
  const [session] = useSession();

  useEffect((e) => {
    // poll the pending tips
    console.log(session);
    if (session && session.user && session.user.address) {
      return; // we don't need to check pending tips if the user already exists
    }
    window.setInterval(async (e) => {
      const result = await getPendingTips();
      setPendingTips(+result.pending > 0);
    }, 15000);
  });

  return (
    <>
      {pendingTips && (
        <button
          className="flex items-center justify-center text-base font-medium text-gray-600 bg-white hover:bg-gray-50 hover:text-black md:py-3 md:px-3 mr-4 shadow rounded border-0 p-3"
          onClick={(e) => registerWalletToClaim(wallet)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-8 mx-2 text-blue-400"
          >
            <path
              fillRule="evenodd"
              d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z"
              clipRule="evenodd"
            />
          </svg>
          Claim your tips
        </button>
      )}
    </>
  );
}

const Wallet = (props) => {
  return (
    <Web3Container
      renderLoading={() => (
        <div className="flex items-center justify-center text-base font-medium text-gray-600 bg-white hover:bg-gray-50 hover:text-black md:py-3 md:px-3 mr-4 shadow rounded border-0 p-3">
          Connecting
        </div>
      )}
      render={({ web3, accounts, contract }) => (
        <WalletComponent accounts={accounts} contract={contract} web3={web3} />
      )}
      {...props}
    />
  );
};

export default Wallet;