import React, { SetStateAction, useState } from "react";
import { IoPaperPlaneOutline, IoAttachOutline } from "react-icons/io5";
import { BiHappy } from "react-icons/bi";
import { useMetaChatProvider } from "../context/metaChat.context";
import { useRecoilState } from "recoil";
import { currentChatState } from "../atom/currentChatAtom";
import { MessageInterface } from "../interface/message.interface";

type Props = {
  endOfMsgRef: React.RefObject<HTMLParagraphElement>;
  setChats: React.Dispatch<SetStateAction<MessageInterface[]>>;
  chats: MessageInterface[];
};

const SendMessage = ({ endOfMsgRef, setChats, chats }: Props) => {
  const [msg, setMsg] = useState<string>();
  const [currentChat, setCurrentChat] = useRecoilState(currentChatState);
  const { sendMessage, account } = useMetaChatProvider();

  const scrollToBottom = (prop: any) => {
    if (endOfMsgRef.current) endOfMsgRef.current.scrollIntoView(prop);
  };

  const initSendMessage = async () => {
    if (!msg || !account) return;
    await sendMessage(msg, currentChat.user.pubkey);
    const chat: MessageInterface = {
      sender: account,
      message: msg,
      timestamp: new Date(),
    };
    setCurrentChat({
      user: currentChat.user,
      chat: [...currentChat.chat, chat],
    });
    setChats([...chats, chat]);
    setMsg("");
    scrollToBottom({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <form>
        <footer className="min-h-[5rem] max-h-20 bg-white md:bg-indigo-100 border-gray-200 dark:bg-gray-800 border-t dark:border-gray-600 flex space-x-2 items-center px-4">
          <button>
            <BiHappy className="h-8 dark:text-gray-400" />
          </button>
          <div className="rounded-3xl w-full px-4 overflow-hidden dark:bg-gray-900 flex bg-white">
            <textarea
              onChange={(e) => setMsg(e.currentTarget.value)}
              className="w-full outline-none h-12 min-h-[3rem] bg-transparent py-3 text-gray-700 dark:text-gray-400"
              placeholder="Type a message..."
              value={msg}
            ></textarea>
            <button>
              <IoAttachOutline className="h-6 w-6 dark:text-gray-400" />
            </button>
          </div>
          <button
            type="button"
            onClick={initSendMessage}
            className="w-10 bg-indigo-600 h-10 rounded-full shadow-lg flex items-center justify-center text-white min-w-[2.5rem]"
          >
            <IoPaperPlaneOutline className="h-5 rotate-45" />
          </button>
        </footer>
      </form>
    </>
  );
};

export default SendMessage;
