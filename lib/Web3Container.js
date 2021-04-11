import React, { useState } from "react";
import getWeb3 from "./getWeb3";
import getContract from "./getContract";
import contractDefinition from "./contracts/TipEscrow.json";
import { connectWallet } from "./tipsService";
import { getSession } from "next-auth/client";
import { useContractKit } from '@celo-tools/use-contractkit';

const Web3Container = (props) => {
  const { openModal } = useContractKit();
  const { kit, address } = useContractKit();
  const [installed, setInstalled] = useState(false);

  console.log(address, kit)

  if (!installed) {
    return (
      <button
        className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-green-50"
        onClick={e => openModal(e)}
      >
        Install Wallet
      </button>);
  }
}
// export default class Web3Container extends React.Component {
//   state = {
//     web3: null,
//     accounts: null,
//     contract: null,
//     connected: false,
//     loading: false,
//     walletInstalled: false,
//     session: null,
//   };

//   async setupWeb3() {
//     try {
//       const web3 = await getWeb3();
//       const netId = await web3.eth.net.getId();
//       console.log(netId);
//       if (netId !== 97) {
//         alert(
//           `Please choose the Binance Testnet (97) in your Metamask and then restart`
//         );
//         return;
//       }
//       const accounts = await web3.eth.getAccounts();
//       const contract = await getContract(web3, contractDefinition);
//       this.setState({ web3, accounts, contract });

//       return web3;
//     } catch (error) {
//       alert(
//         `Failed to load web3, accounts, or contract. Check console for details.`
//       );
//       console.error(error);
//     }
//   }

//   componentDidMount() {
//     const connected =
//       this.props.session &&
//       this.props.session.user &&
//       this.props.session.user.address;
//     this.setState({ walletInstalled: this.isWalletInstalled(), connected });

//     if (connected) {
//       this.connect();
//     }
//   }

//   /**
//    * Check if metamask (or browser-based wallet) is installed
//    *
//    * @returns whether wallet is installed. If not display a message for user to install
//    */
//   isWalletInstalled() {
//     if (!window.ethereum) return false;
//     return true;
//   }

//   /**
//    * This function will connect to the users' web-based ethereum wallet
//    */
//   async connect() {
//     await window.ethereum.enable();
//     this.setState({ loading: false, connected: true });
//     const web3 = await this.setupWeb3();
//     // you would potentially call connectWallet here!
//     // connectWallet();
//     // register wallet if its not part of the session details!
//     if (
//       this.props.session &&
//       this.props.session.user &&
//       !this.props.session.user.address
//     ) {
//       const accounts = await web3.eth.getAccounts();
//       await connectWallet(accounts[0]);
//       this.setState({ session: await getSession() });
//     }
//   }

//   render() {
//     const {
//       web3,
//       accounts,
//       contract,
//       connected,
//       loading,
//       walletInstalled,
//     } = this.state;
//     if (!walletInstalled) {
//       return (
//         <div className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-green-50">
//           <a href="https://metamask.io/" target="metamask">
//             Please install Metamask
//           </a>
//         </div>
//       );
//     }
//     if (!connected) {
//       return (
//         <>
//           <button
//             className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-green-50"
//             onClick={async (e) => {
//               this.setState({ loading: true });
//               this.connect();
//             }}
//           >
//             {this.props.claimTip && (
//               <>
//                 <svg
//                   className="h-5 w-5 mr-2 text-green-400"
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                   aria-hidden="true"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 Claim Tips
//               </>
//             )}
//             {!this.props.claimTip && (
//               <>
//                 <svg
//                   className="h-5 w-5 mr-2 text-blue-400"
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                   aria-hidden="true"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 Connect Wallet
//               </>
//             )}
//           </button>
//         </>
//       );
//     }
//     console.log("Session is from Web3Container", this.state.session);
//     return web3 && accounts
//       ? this.props.render({
//           web3,
//           accounts,
//           contract,
//           session: this.state.session ? this.state.session : this.props.session,
//         })
//       : this.props.renderLoading();
//   }
// }

export default Web3Container;