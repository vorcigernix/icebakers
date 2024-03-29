import Web3 from 'web3'
let web3Instance = global.web3Instance;
const resolveWeb3 = async () => {
  if (web3Instance) return web3Instance;

  let { web3 } = window
  const alreadyInjected = typeof web3 !== 'undefined' // i.e. Mist/Metamask

  if (alreadyInjected) {
    console.log(`Injected web3 detected.`)
    web3 = new Web3(web3.currentProvider)
  } else {
    console.log(`No web3 instance injected, using Local web3 (client side).`);
    const localProvider = `http://localhost:9545`
    const provider = new Web3.providers.HttpProvider(localProvider)
    web3 = new Web3(provider)
  }
  web3Instance = web3;
  global.web3Instance = web3;
  return web3;
}

const resolver = async (resolve) => {
  resolve(await resolveWeb3());
}

const App = () =>
  new Promise(async (resolve) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener(`load`, async () => {
      await resolver(resolve)
    })
    // If document has loaded already, try to get Web3 immediately.
    if (document.readyState === `complete`) {
      await resolver(resolve)
    }
  })

export {
  resolveWeb3
}

export default App;
