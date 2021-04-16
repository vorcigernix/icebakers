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

// tip friend's account (they don't have a registered wallet)
const tipFriendAccount = async (friendEmail, key) => {
    console.log("Tipping friend account", friendEmail, key);
    // connect my metamask address (use the google email that is authenticated)
    const result = await fetch("/api/tipFriend", {
        method:"POST",
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
    tipFriendAccount
};