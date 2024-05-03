import React from "react";
import Moment from "react-moment";
import { useMetaChatProvider } from "../context/metaChat.context";
import { MessageInterface } from "../interface/message.interface";

type Props = {
  chat: MessageInterface;
};

const Chat = ({ chat }: Props) => {
  const { account } = useMetaChatProvider();

  const isUserMessage = (sender: string) =>
    sender.toLowerCase() === account?.toLocaleLowerCase();

  return (
    <div
      className={`flex flex-col space-x-2 my-5 ${
        isUserMessage(chat.sender) ? "justify-end items-end" : "items-start"
      }`}
    >
      <div
        className={`relative space-x-2 px-3 py-2 max-w-xs rounded-2xl ${
          isUserMessage(chat.sender)
            ? "rounded-br-xl bg-indigo-600 text-white"
            : "rounded-bl-xl bg-indigo-100 dark:text-gray-200 dark:bg-gray-700"
        }`}
      >
        <p className="inline">{chat.message}</p>
        <sub className="inline">
          <Moment
            format="h:mm A"
            className={`text-[.6rem] ${
              isUserMessage(chat.sender)
                ? "order-last pr-1 text-gray-200"
                : "text-gray-400"
            }`}
          >
            {chat.timestamp}
          </Moment>
        </sub>
        <div
          className={`absolute w-0 -bottom-5 h-0 border-t-[10px] ${
            isUserMessage(chat.sender)
              ? "right-1 border-t-indigo-600"
              : "-left-1 border-t-indigo-100 dark:border-t-gray-700"
          } border-r-[13px] border-r-transparent border-l-[13px] border-l-transparent border-b-[13px] border-b-transparent`}
        ></div>
      </div>
    </div>
  );
};

export default Chat;
