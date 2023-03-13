import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { useRouter } from "next/router";
import {
  connectWithContract,
  convertTime,
} from "../services/metaChat.services";
import { FriendInterface, UserInterface } from "../interface/users.interface";
import { MessageInterface } from "../interface/message.interface";
import useWalletHook from "../hooks/wallet.hook";
import { Contract, ethers } from "ethers";

export type MetaChatContextType = {
  readMessage: (wallet: string) => Promise<MessageInterface[]>;
  createAccount: (name: string, address: string) => void;
  addFriend: (name: string, address: string) => Promise<any>;
  sendMessage: (message: string, address: string) => Promise<any>;
  readUserDetails: (address: string) => void;
  setError: Dispatch<SetStateAction<string | undefined>>;
  setFriendMsg: Dispatch<SetStateAction<MessageInterface[]>>;
  account: string | undefined;
  userName: string | undefined;
  friendLists: FriendInterface[] | undefined;
  friendMsg: MessageInterface[];
  loading: boolean;
  userList: UserInterface[];
  error: string | undefined;
  currentUserName: string | undefined;
  currentUserAddress: string | undefined;
  connectWallet: () => Promise<any>;
  isWalletConnected: () => Promise<any>;
  chatEvent: string | undefined;
  setChatEvent: Dispatch<SetStateAction<string | undefined>>;
};

interface Props {
  children: React.ReactNode;
}

export const MetaChatContext = createContext<MetaChatContextType | undefined>(
  undefined
);

export function MetaChatProvider({ children }: Props) {
  const [userName, setUserName] = useState<string>();
  const [friendLists, setFriendLists] = useState();
  const [friendMsg, setFriendMsg] = useState<MessageInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [userList, setUserList] = useState([]);
  const [error, setError] = useState<string>();

  const [currentUserName, setCurrentUserName] = useState<string>();
  const [currentUserAddress, setCurrentUserAddress] = useState<string>();
  const { account, connectWallet, isWalletConnected } = useWalletHook();
  const [chatEvent, setChatEvent] = useState<string>();

  const router = useRouter();

  const fetchData = async () => {
    try {
      const contract = await connectWithContract();

      const username = await contract?.getUsername(account);
      setUserName(username);

      const friendLists = await contract?.getFriendsList();
      const fFrendLists = friendLists.map((list: FriendInterface) => {
        return {
          name: list.name,
          pubkey: list.pubkey,
        } as FriendInterface;
      });
      setFriendLists(fFrendLists);

      const allUsers = await contract?.getAllRegisteredUsers();
      const fAllUsers = allUsers.map((user: UserInterface) => {
        return {
          name: user.name,
          accountAddress: user.accountAddress,
        } as UserInterface;
      });
      setUserList(fAllUsers);
    } catch (error: any) {
      setError("Connect your wallet");
    }
  };

  useEffect(() => {
    let contract: Contract | undefined;

    const handleEvent = (
      chatcode: string,
      from: string,
      to: string,
      event: any
    ) => {
      const verifyChatCode = getChatCode(from, to);
      if (verifyChatCode.toString() === chatcode.toString()) {
        if (from == account) return;
        setChatEvent(verifyChatCode.toString());
        const address = getMsgAddress(from, to);
        readMessage(address);
      }
    };

    (async () => {
      if (!account) return;
      contract = await connectWithContract();
      contract?.on("ChatSent", handleEvent);
    })();

    return () => {
      if (contract) contract?.off("ChatSent", handleEvent);
    };
  }, [account]);

  useEffect(() => {
    const w = window as any;
    if(!w.ethereum) return;
    
    const handleDisconnect = (accounts: string[]) => {
      if (accounts && accounts[0]) {
      } else {
        // Disconnected
        router.reload();
      }
    };

    w.ethereum.on("accountsChanged", handleDisconnect);
    return () => {
      w.ethereum.removeListener("accountsChanged", handleDisconnect);
    };
  }, []);

  useEffect(() => {
    if (!account) return;
    fetchData();
  }, [account]);

  const getMsgAddress = (from: string, to: string) => {
    if (from == account) {
      return to;
    }
    return from;
  };

  function getChatCode(addressFrom: string, addressTo: string) {
    let encodePacked;
    if (addressFrom < addressTo) {
      encodePacked = ethers.utils.concat([addressFrom, addressTo]);
      return ethers.utils.keccak256(encodePacked);
    } else {
      encodePacked = ethers.utils.concat([addressTo, addressFrom]);
      return ethers.utils.keccak256(encodePacked);
    }
  }

  const readMessage = async (address: string) => {
    try {
      const contract = await connectWithContract();
      const messages = await contract?.readChat(address);
      const fMessages = messages.map((msg: MessageInterface) => {
        return {
          sender: msg.sender,
          message: msg.message,
          timestamp: convertTime(msg.timestamp),
        } as MessageInterface;
      });
      const sortedMsg: MessageInterface[] = fMessages.sort(
        (a: MessageInterface, b: MessageInterface) =>
          a.timestamp.valueOf() - b.timestamp.valueOf()
      );
      setFriendMsg(sortedMsg);
      return fMessages;
    } catch (error) {
      console.log(error);
    }
  };

  const createAccount = async (name: string, address: string) => {
    try {
      if (!name || !address) return setError("Name and Address required");
      const contract = await connectWithContract();
      const newUser = await contract?.createAccount(name);
      setLoading(true);
      await newUser.wait();
      setLoading(false);
      router.reload();
    } catch (error) {
      console.log(error);
      setError("Error while creating an account, try again!");
    }
  };

  const addFriend = async (name: string, address: string) => {
    try {
      if (!name || !address) return setError("Name and Address required");
      const contract = await connectWithContract();
      const addNewFriend = await contract?.addFriend(address, name);
      setLoading(true);
      await addNewFriend.wait();
      setLoading(false);
      return addNewFriend;
    } catch (error: any) {
      if (error.message.includes("Cannot add yourself as a friend")) {
        return setError("Cannot add yourself as a friend");
      }
      if (error.message.includes("Already a friend!")) {
        return setError(`${name} is your friend already`);
      }
      setError("Something went wrong, try again!");
    }
  };

  const sendMessage = async (message: string, address: string) => {
    try {
      if (!message || !address) return setError("Message and Address required");
      const contract = await connectWithContract();
      const newMsg = await contract?.sendMessage(address, message);
      setLoading(true);
      await newMsg.wait();
      setLoading(false);
      return newMsg;
    } catch (error) {
      console.log(error);
    }
  };

  const readUserDetails = async (address: string) => {
    try {
      const contract = await connectWithContract();
      const username = await contract?.getUsername(address);
      setCurrentUserName(username);
      setCurrentUserAddress(address);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MetaChatContext.Provider
      value={{
        readMessage,
        createAccount,
        addFriend,
        sendMessage,
        readUserDetails,
        setError,
        setFriendMsg,
        account,
        userName,
        friendLists,
        friendMsg,
        loading,
        userList,
        error,
        currentUserName,
        currentUserAddress,
        connectWallet,
        isWalletConnected,
        chatEvent,
        setChatEvent,
      }}
    >
      {children}
    </MetaChatContext.Provider>
  );
}

export function useMetaChatProvider() {
  const context = useContext(MetaChatContext);
  if (context === undefined) {
    throw new Error("useCounter must be used within a MetaChatProvider");
  }
  return context;
}
