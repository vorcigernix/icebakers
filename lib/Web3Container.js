import React, { useEffect, useState } from "react";
import { connectWallet } from "./tipsService";
import { getSession } from "next-auth/client";
import { Alfajores, useContractKit } from '@celo-tools/use-contractkit';

const Web3Container = (props) => {
  // const { openModal, modalIsOpen } = useContractKit();
  const { kit, address, updateNetwork, performActions, updateKit, connect } = useContractKit();
  const [session, setSession] = useState(props.session);
  const [isConnecting, setConnecting] = useState(false);
  const [escrow, setEscrow] = useState(null);
  const [stableToken, setStableToken] = useState(null);

  useEffect(async e => {
    if (!session) {
      setSession(await getSession());
      if (window.celo) await window.celo.enable()
      //updateNetwork(Alfajores);
      setEscrow(await kit.contracts.getEscrow());
      setStableToken(await kit.contracts.getStableToken());
      console.log("Address is", address, kit.defaultAccount);
    }
    //updateNetwork(Alfajores);

  }, [props])

  useEffect(async e => {
    if (!address || address === "") return; // ignore empty
    // if (isConnecting === modalIsOpen) return; // true true or false false, we can ignore
    //updateNetwork(Alfajores);
    const json = await connectWallet(address);
    // await claimTip(kit, performActions, address, json);
    setSession(await getSession());
  }, [address]);

  if (!session) return props.renderLoading();

  if (!address && isConnecting) return props.renderLoading();

  if (session && session.user && !session.user.address) {
    return (
      <button
        className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-white"
        onClick={async (e) => {
          setConnecting(true);
          try {
            await connect(e);
            console.log("Connecting completed?")
            setConnecting(false);
          }
          catch (e) {
            console.log(e, "error connecting");
            setConnecting(false);
          }
          // setConnecting(true);
        }}
      >
        {props.claimTip && (
          <>
            <svg
              className="h-5 w-5 mr-2 text-green-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
                Claim Tips
          </>
        )}
        {!props.claimTip && (
          <>
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
                Connect Wallet
          </>
        )}
      </button>);
  }
  else {
    return props.render({
      web3: kit.web3,
      kit,
      accounts: [address || session?.user?.address],
      escrow,
      session: session,
      stableToken,
      performActions
    });
  }
}

export default Web3Container;