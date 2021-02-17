import React from "react";
import getWeb3 from "./getWeb3";
import getContract from "./getContract";
import contractDefinition from "./contracts/TipEscrow.json";
import { connectWallet } from "./tipsService";

export default class Web3Container extends React.Component {
  state = {
    web3: null,
    accounts: null,
    contract: null,
    connected: false,
    loading: false,
    walletInstalled: false,
  };

  async setupWeb3() {
    try {
      const web3 = await getWeb3();
      const netId = await web3.eth.net.getId();
      console.log(netId);
      if (netId !== 97) {
        alert (`Please choose the Binance Testnet (97) in your Metamask and then restart`);
        return;
      }
      const accounts = await web3.eth.getAccounts();
      const contract = await getContract(web3, contractDefinition);
      this.setState({ web3, accounts, contract });

      return web3;
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  }

  componentDidMount() {
    this.setState({ walletInstalled: this.isWalletInstalled() });
  }

  /**
   * Check if metamask (or browser-based wallet) is installed
   *
   * @returns whether wallet is installed. If not display a message for user to install
   */
  isWalletInstalled() {
    if (!window.ethereum) return false;
    return true;
  }

  /**
   * This function will connect to the users' web-based ethereum wallet
   */
  async connect() {
    await window.ethereum.enable();
    this.setState({ loading: false, connected: true });
    const web3 = await this.setupWeb3();
    // you would potentially call connectWallet here!
    // connectWallet();
    // register wallet if its not part of the session details!
    if (this.props.session && this.props.session.user && !this.props.session.user.address) {
      const accounts = await web3.eth.getAccounts();
      connectWallet(accounts[0]);
    }
  }

  render() {
    const {
      web3,
      accounts,
      contract,
      connected,
      loading,
      walletInstalled,
    } = this.state;
    if (!walletInstalled) {
      return (
        <div>
          <a href="https://metamask.io/">Please install Metamask</a>
        </div>
      );
    }
    if (!connected) {
      return (
        <>
          <button
            className="flex items-center justify-center text-base font-medium text-gray-600 bg-white hover:bg-gray-50 hover:text-black md:py-3 md:px-3 mr-4 shadow rounded border-0 p-3"
            onClick={async (e) => {
              this.setState({ loading: true });
              this.connect();
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
            Connect Wallet
          </button>
        </>
      );
    }
    return web3 && accounts
      ? this.props.render({ web3, accounts, contract })
      : this.props.renderLoading();
  }
}
