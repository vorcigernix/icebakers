import Web3Container from "../lib/Web3Container";
import { getPendingTips, connectWallet, tipFriendAccount } from "../lib/tipsService";
import React, { useEffect, useState } from "react";
import { useSession, getSession } from "next-auth/client";
import { useContractKit } from "@celo-tools/use-contractkit";

// return true on success, false means that we might need to wait for a proper result 
// from the wallet and call the tip function again
async function tipFriend({ friend, wallet, web3, kit, sendTransaction }) {
  // we will tip 
  if (friend.wallet && friend.wallet !== "") {
    // tip 10c to our friend
    // await web3.eth.sendTransaction({
    //   from: wallet,
    //   to: friend.wallet,
    //   value: web3.utils.toWei('0.1', 'ether'),
    // });
    const stableToken = await kit.contracts.getStableToken();
    const result = await sendTransaction(stableToken.transfer(friend.wallet, web3.utils.toWei('0.1', 'ether')));

    if (!result) {
      return false; // probably the prompt to connect wallet, lets do it again!
    }

    console.log("Completed");
    // this function should call update on a database to register
    // that your friend was tipped an amount
    return true;
  } else {

    // send to escrow, then notify server that we have sent amount to escrow, for 
    // claim by the email of the user

    // generate a new user
    // send the tip to this new user
    // update the server, tell it that the secret details for this user
    // server associates the tip details to the user

    const web3 = kit.web3;
    const stableToken = await kit.contracts.getStableToken();
    const escrow = await kit.contracts.getEscrow();

    const account = web3.eth.accounts.create();

    console.log("Tipping friend with paymentId", account.address);

    if (window.celo) await window.celo.enable();
    // approve spending of 10 cUSD
    const approved = (await stableToken.allowance(wallet, escrow.address)).toNumber();
    const tipSize = web3.utils.toWei('0.1', 'ether');

    if (approved < +tipSize) { // only ask for approval if escrow has not enough funds for transfer
      const result = await sendTransaction(stableToken.approve(escrow.address, web3.utils.toWei('10', 'ether')));
    }

    // no unique id, no attestations, 30 days validity - save to escrow account
    // NOTE: must already be initialised before calling this
    const res = await sendTransaction(escrow.transfer(web3.utils.asciiToHex(""), stableToken.address, tipSize, 30 * 24 * 60 * 60, account.address, 0));
    if (!res) {
      return false;
    }
    // todo: notify the user that they have successfully tipped their friend
    
    // finally, save to database so our friend has the tip
    await tipFriendAccount(friend.email, account.privateKey);

    return true;
  }
}

async function tipPerson(email, wallet, kit, sendTransaction) {
  if (!email) return;
  const data = await (await fetch(`/api/getaddress/${email}`)).json();
  console.log(data);

  return await tipFriend({
    friend: data,
    wallet,
    kit,
    web3: kit.web3,
    sendTransaction
  });
}

/**
 * This function is called to simulate registering your wallet ideally you call
 * this when the user wants to register their wallet; it will also help claim
 * some tips if they have any
 *
 * @param {String} wallet - wallet to be registered
 */
async function registerWalletToClaim(wallet) {
  await connectWallet(wallet);
}

function WalletComponent(props) {
  const [wallet, setWallet] = React.useState(
    props.accounts && props.accounts[0]
  );

  const [pendingTips, setPendingTips] = React.useState(false);
  const [session, setSession] = useState(props.session);
  const [timer, setTimer] = useState(0);
  const [waitingContractKit, setWaitingContractKit] = useState(false);

  const {
    kit,
    address,
    network,
    sendTransaction,
    updateKit, 
    modalIsOpen
  } = useContractKit();

  useEffect(
    (e) => {
      setSession(props.session);
    },
    [props.session.user]
  );

  useEffect(
    (e) => {
      if (waitingContractKit && !modalIsOpen) {
        // assume user connected, try to tip again!
        if (!tipPerson(
          props.email,
          props.accounts[0],
          kit,
          sendTransaction
        )) {
          setWaitingContractKit(true);
        }
        else {
          setWaitingContractKit(false);
        }
      }
    },
    [waitingContractKit, modalIsOpen]
  );

  useEffect(
    (e) => {

      setSession(props.session);
      // poll the pending tips
      if (props.session.user && props.session.user.address) {
        window.clearInterval(timer);
        setTimer(0);
        return; // we don't need to check pending tips if the user already exists
      }
      if (timer) {
        window.clearInterval(timer);
      }
      setTimer(
        window.setInterval(async (e) => {
          const result = await getPendingTips();
          setPendingTips(+result.pending > 0);
          setSession(await getSession());
        }, 60000)
      );
    },
    [props.session.user]
  );

  return (
    <>
      <>
        {props.enableTipping && (
          <button
            className="relative inline-flex items-center"
            onClick={async () => {
              if (! await tipPerson(
                props.email,
                props.accounts[0],
                kit,
                sendTransaction
              )) {
                setWaitingContractKit(true);
              }
            }
            }
          >
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
        )}
        <button className="inline-flex items-center ">
          <svg
            className="h-5 w-5 mr-2 text-blue-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z"
              clipRule="evenodd"
            />
          </svg>
          {session.user.address ? "" : "Wallet Connecting"}
        </button>
      </>
    </>
  );
}

const Wallet = (props) => {
  return (
    <Web3Container
      renderLoading={() => (
        <div className="inline-flex items-center">
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
          </svg>
          Connecting
        </div>
      )}
      render={({ accounts, session }) => (
        <WalletComponent
          accounts={accounts}
          session={session}
          enableTipping={props.enableTipping}
          email={props.email}
        />
      )}
      {...props}
    />
  );
};

export default Wallet;
