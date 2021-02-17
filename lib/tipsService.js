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
        method:"POST",
        body: JSON.stringify({
            "address": wallet
        })
    });
    const json = result.json();

    return json;
};

export {
    getPendingTips,
    connectWallet,
};