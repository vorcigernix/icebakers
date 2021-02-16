import Web3 from "web3";
import React, { useEffect } from "react";

/**
 * Check if metamask (or browser-based wallet) is installed
 *
 * @returns whether wallet is installed. If not display a message for user to install
 */
function isWalletInstalled() {
  if (!window.ethereum) {
    return false;
  }
  return true;
}

/**
 * Call this function when the user clicks connect wallet.
 * The workflow for login/registration is to first connect the users' wallet
 *
 * This function throws an exception if something went wrong, or if the chain id
 * is not Binance Testnet (chainId = 0x61)
 *
 * @returns selected address (public key) from metamask
 */
async function connect() {
  window.web3 = new Web3(window.ethereum);
  await window.ethereum.enable();
  const chainId = await window.web3.eth.getChainId();
  if (chainId !== 0x61) {
    throw new Error("Chain ID must be set to the BSC TestNet - ChainId 0x61");
  }
  const coinbase = await window.web3.eth.getCoinbase();

  console.log(await window.web3.eth.getBalance(coinbase));
  return coinbase;
}

/**
 * Tip a friend; if the friend has a wallet, tip directly, otherwise
 * hash (sha) their email address and send to escrow service. The friend
 * can claim when they login (will notify them to claim the token)
 *
 * @param {JSON} friend - JSON object for friend
 * @param {Number} amount - amount of 'eth' to send
 * @param {JSON} token - the token to which to send
 * @param {String} wallet - my wallet to send from
 */
async function tipFriend({ friend, amount, token, wallet }) {
  console.log(amount);
  if (friend.wallet) {
    await window.web3.eth.sendTransaction({
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
  }
}

/**
 * This is the function that you should have already created which helps to authenticate
 * a user using google login. Please also save the wallet address along with the user details
 *
 * @param {String} wallet - the wallet address to be saved along with the google email
 */
async function signInWithGoogle({ wallet }) {
  console.log("Sign in completed", wallet);
}

function Wallet() {
  const [walletInstalled, setWalletInstalled] = React.useState(false);
  const [wallet, setWallet] = React.useState("");
  const [open, setOpened] = React.useState(false);
  const [inProgress, setInProgress] = React.useState(false);

  useEffect((e) => {
    setWalletInstalled(isWalletInstalled());
  });

  return (
    <>
      {walletInstalled && (
        <button
          className="flex items-center justify-center px-3 py-3 border border-transparent text-base font-medium rounded-md text-gray-600 bg-white hover:bg-gray-50 hover:text-black md:py-3 md:px-3 shadow-sm m-4"
          variant="contained"
          onClick={async (e) => {
            setInProgress(true);
            setWallet(await connect());
            setInProgress(false);
          }}
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
          Connect wallet
        </button>
      )}
      {!walletInstalled && (
        <button className="flex items-center justify-center px-3 py-3 border border-transparent text-base font-medium rounded-md text-gray-600 bg-white hover:bg-gray-50 hover:text-black md:py-3 md:px-3 shadow-sm m-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-8 mx-2 text-blue-400"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
              clipRule="evenodd"
            />
          </svg>

          <a href="https://metamask.io/">Install Metamask</a>
        </button>
      )}
    </>
  );

//   if (wallet === "") {
//     return (
//       <div className={style.App}>
//         <header className={style.Appheader}>
//           <CircularProgress
//             style={{ display: inProgress ? "block" : "none" }}
//           />
//           <Button
//             variant="contained"
//             onClick={async (e) => {
//               setInProgress(true);
//               setWallet(await connect());
//               setInProgress(false);
//             }}
//           >
//             Connect Wallet
//           </Button>
//         </header>
//       </div>
//     );
//   }
//   return (
//     <div className={style.App}>
//       <Snackbar
//         autoHideDuration={3000}
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//         open={open}
//         onClose={(e) => setOpened(false)}
//         message="Successfully sent a tip to your friend"
//         key={"topright"}
//       />
//       <header className={style.Appheader}>
//         <CircularProgress style={{ display: inProgress ? "block" : "none" }} />
//         <Typography variant="body1">Connected: {wallet}</Typography>
//         <Card className={classes.root}>
//           <CardContent>
//             <Typography
//               className={classes.title}
//               color="textSecondary"
//               gutterBottom
//             >
//               A question that your friend asked which is rather informative!
//             </Typography>
//           </CardContent>
//           <CardActions>
//             <Button
//               size="small"
//               onClick={async (e) => {
//                 const amount = window.prompt("Enter amount of BNB to send");
//                 if (!amount || amount === "") return;
//                 setInProgress(true);
//                 await tipFriend({
//                   friend: {
//                     wallet: "0x8218bC91354b2AB329eCF20B90751Fc9345e8C96", // hard coded value
//                     email: "email@email.com",
//                   },
//                   amount: window.web3.utils.toWei(amount, "ether"),
//                   wallet,
//                 });
//                 setInProgress(false);
//                 setOpened(true);
//               }}
//             >
//               Tip
//             </Button>
//           </CardActions>
//         </Card>
//         <br />
//         <Card className={classes.root}>
//           <CardContent>
//             <Typography
//               className={classes.title}
//               color="textSecondary"
//               gutterBottom
//             >
//               Another question that your friend asked which is rather
//               informative!
//             </Typography>
//           </CardContent>
//           <CardActions>
//             <Button variant="small" onClick={(e) => alert("To Be Created")}>
//               Tip - Friend does not have Wallet
//             </Button>
//           </CardActions>
//         </Card>
//       </header>
//     </div>
//   );
}

export default Wallet;
