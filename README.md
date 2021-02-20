# About [Icebaker](https://icebakers.vercel.app)
We built this quiz game as a tool to know your friends or colleagues better. It is an icebreaker quiz game where you respond to the questions and later you play guess game: whose answer is what you see on the screen. Main differentiator and the reason why we built this with Victa is that you can sent small tip in cryptocurrency for a great answer. 
If you are interested in the technology behing, look at the source and watch the video [here](https://youtu.be/icSKd9gL108).
Do not forget to try our app at https://icebakers.vercel.app

Have fun, 
Adam + Victa




# Building the project from source
## Configuring Environment Variables
Inside __.env.local__ populate the following  
- BINANCE_ENDPOINT=https://data-seed-prebsc-2-s1.binance.org:8545/
- BINANCE_SECRET_KEY : this is your private key containing a funded binance wallet for interacting with the smart contract
- GRAPHCMS_ENDPOINT : this is your GRAPHCMS endpoint
- GRAPHCMS_MUTATION_TOKEN : this is your GRAPHCMS mutation token (Permanent Access Token)
- NEXTAUTH_DATABASE_URL : this is your mongo-db URL (with username and password)
- NEXTAUTH_GOOGLE_ID : this is your google id for OAUTH
- NEXTAUTH_GOOGLE_SECRET : this is your google secret for OAUTH
- NEXTAUTH_URL=http://localhost:3000
- NEXTAUTH_DATABASE : the database to connect to (default to icebakers)

Inside __.secret__ store the same BINANCE_SECRET_KEY as above. This .secret file is used to compile and deploy your Smart Contracts

## Startup
To begin, run the following commands (version 14+ of NodeJS):
- npm install
- npm install --g truffle
- truffle compile
- truffle migrate --network binance --reset
- npm run link-contracts
- npm run dev

## Pending Items
- Questions / Answers from friends
- Tipping (the services are ready for tipping, we just need the backend for the questions, the friends' email and address, and functionality for tipping)
- Redeeming Tips based on email address

## Completed Items
- Storage of the address into mongodb
- Loading of address into session object (session.user.address)
- Registration and Wallet connection (clicking the Connect Wallet will now save the address into the mongodb)

