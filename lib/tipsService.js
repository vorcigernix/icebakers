import { ecsign, hashPersonalMessage, toBuffer, bufferToHex } from "ethereumjs-util";

const getPendingTips = async () => {
    // get tips that are owed to me (but i don't have wallet so it didn't payout)
    // email address from authenticated header
    const result = await fetch("/api/tipsPending");
    const json = await result.json();
    return json;
};

const connectWallet = async (wallet) => {
    // connect my metamask address (use the google email that is authenticated)
    const result = await fetch("/api/connectWallet", {
        method: "POST",
        body: JSON.stringify({
            "address": wallet
        })
    });
    const json = result.json();

    return json;
};

// #deprecated
const claimTip = async (kit, performActions, wallet, json) => {
    const escrow = await kit.contracts.getEscrow();

    // todo: consider having the user sign this and send the signed data to
    // the server for submission on the blockchain (server pays gas costs)

    if (json?.tipsPending?.length > 0) {
        const escrow = await kit.contracts.getEscrow();
        await Promise.all(json.tipsPending.map(async key => {
            const web3 = kit.web3;
            const acc = web3.eth.accounts.privateKeyToAccount(key);
            const hash = web3.utils.soliditySha3(
                wallet
            );
            console.log(acc, escrow.address);
            //prefix the hash 
            const prefixedHash = hashPersonalMessage(toBuffer(hash));

            //get the ECDSA signature and its r,s,v parameters
            const privateKey = Buffer.from(key.substr(2), "hex")
            const signature = ecsign(prefixedHash, privateKey);
            const r = bufferToHex(signature.r),
                s = bufferToHex(signature.s),
                v = signature.v;

            // a = SignatureUtils.serializeSignature(a);
            // function withdraw(address paymentId, uint8 v, bytes32 r, bytes32 s)
            
            await performActions(escrow.withdraw(acc.address, v, r, s));
            console.log("Successfully received escrow funds!");

            return Promise.resolve();
        }));
        console.log("All tips successfully claimed!");
        const result = await fetch("/api/claimTips", {
            method: "POST"
        });
    }

};

// tip friend's account (they don't have a registered wallet)
const tipFriendAccount = async (friendEmail, key) => {
    console.log("Tipping friend account", friendEmail, key);
    // connect my metamask address (use the google email that is authenticated)
    const result = await fetch("/api/tipFriend", {
        method: "POST",
        body: JSON.stringify({
            friendEmail,
            "accessId": key
        })
    });
    const json = result.json();

    return json;
};

export {
    getPendingTips,
    connectWallet,
    tipFriendAccount,
    claimTip
};