/**
 * Server-side, Claim tip given a wallet and a live doc (connected to the tips table in mongo)
 * Will attempt to claim all tips and maintain state after each successful claim
 * 
 * This is a library, assuming called from server side and all necessary checks are in place before
 * this is called.
 * 
 * Note: long-running, todo: figure out how to move this somewhere so the long-running task runs in a 
 * background worker thread. Consider how to fund the wallet so that it can run without issue
 */
import { newKit } from '@celo/contractkit'
import { ecsign, hashPersonalMessage, toBuffer, bufferToHex } from "ethereumjs-util";
const mapSeries = async (iterable, action) => {
    for (const x of iterable) {
        await action(x)
    }
};

const claimTips = async (wallet, doc, db) => {
    // todo: consider having the user sign this and send the signed data to
    // the server for submission on the blockchain (server pays gas costs)
    console.log("Doc is", doc);
    if (doc?.tipped?.length > 0) {
        const kit = newKit(process.env.ENDPOINT);
        const web3 = kit.web3;
        const mainAcc = web3.eth.accounts.privateKeyToAccount(process.env.SECRET_KEY);

        // transfer some 
        kit.connection.addAccount(mainAcc.privateKey);

        const escrow = await kit.contracts.getEscrow();
        const cUSD = await kit.contracts.getStableToken();
        

        await mapSeries(doc.tipped, (async data => {
            if (data.claimed && data.withdrawn) return Promise.resolve(); // done

            const key = data.access;

            const acc = web3.eth.accounts.privateKeyToAccount(key);
            const hash = web3.utils.soliditySha3(
                mainAcc.address
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

            if (!data.claimed) {
                console.log("Claiming the escrow");
                const escrowtx = await escrow.withdraw(acc.address, v, r, s).send({ from: mainAcc.address });
                const escrowReceipt = await escrowtx.waitReceipt();
                console.log(escrowReceipt); // how much did it cost?
                // update claimed
                // const item = doc.tipped.access(data.access);
                // item["claimed"] = true;
                // doc.save();
                
                db.collection("tips").updateOne(
                    {
                        "_id": doc._id,
                        "tipped.access": key
                    },
                    {
                        $set: {
                            "tipped.$.claimed": true,
                        }
                    }
                );
            }
            // pay fees using stable coin
            if (!data.withdrawn) {

                console.log("transferring token to address");
                const transfertx = await cUSD.transfer(wallet, web3.utils.toWei("0.1", "ether")).send({ from: mainAcc.address, feeCurrency: cUSD.address });
                const transferReceipt = await transfertx.waitReceipt();
                console.log(transferReceipt);
                // const item = doc.tipped.access(data.access);
                // item["withdrawn"] = true;
                // doc.save();
                db.collection("tips").updateOne(
                    {
                        "_id": doc._id,
                        "tipped.access": key
                    },
                    {
                        $set: {
                            "tipped.$.withdrawn": true,
                        }
                    }
                );
            }
            // send the money to the wallet

            console.log("Successfully received escrow funds!");

            return Promise.resolve();
        }));
        console.log("All tips successfully claimed!");
    }
};

export default claimTips;