import React, { useState, useEffect } from "react";

const useWalletHook = () => {
  const [account, setAccount] = useState();

  useEffect(() => {
    (async () => {
      const account = await isWalletConnected();
      setAccount(account);
    })();
  }, []);

  const connectWallet = async () => {
    try {
      const w = window as any;
      if (!w.ethereum) return console.log("Install Metamask");
      const accounts = await w.ethereum.request({
        method: "eth_requestAccounts",
      });
      const userAccount = accounts[0];
      setAccount(userAccount);
      return userAccount;
    } catch (error) {
      console.log(error);
    }
  };

  const isWalletConnected = async () => {
    try {
      const w = window as any;
      if (!w.ethereum) return console.log("Install Metamask");
      const accounts = await w.ethereum.request({
        method: "eth_accounts",
      });
      const account = accounts[0];
      return account;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    account,
    setAccount,
    connectWallet,
    isWalletConnected,
  };
};

export default useWalletHook;
