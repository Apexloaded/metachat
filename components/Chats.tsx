import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { sidebarState } from "../atom/sidebarAtom";
import { showchatState } from "../atom/showchatAtom";
import { IoChevronBackOutline, IoLockClosedOutline } from "react-icons/io5";
import { useMutationObserver } from "../utils/mutationObserver";
import SendMessage from "./SendMessage";
import Chat from "./Chat";
import {
  ChatInterface,
  MessageInterface,
} from "../interface/message.interface";
import { currentChatState } from "../atom/currentChatAtom";
import { useMetaChatProvider } from "../context/metaChat.context";

type ScrollIntoViewProps = {
  behavior: ScrollBehavior | undefined;
  block: ScrollLogicalPosition | undefined;
};

const Chats = () => {
  const [collapsed, setCollapse] = useRecoilState(sidebarState);
  const [displayChat, setDisplayChat] = useRecoilState(showchatState);
  const [currentChat, setCurrentChat] = useRecoilState(currentChatState);
  const { readMessage, friendMsg, setFriendMsg } = useMetaChatProvider();
//   const [chats, setChats] = useState<MessageInterface[]>([]);
//   const toggle = () => {
//     collapsed ? setCollapse(false) : setCollapse(true);
//   };
  const endOfMsgRef = useRef<HTMLParagraphElement>(null);
  const elementRef = useRef(null);

  const scrollIntoView = (props: ScrollIntoViewProps) =>
    endOfMsgRef.current?.scrollIntoView(props);

  const onListMutation = useCallback(
    (mutations: MutationRecord[], observer: MutationObserver) => {
      if (mutations[mutations.length - 1].type === "attributes") {
        scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      scrollIntoView({ behavior: "auto", block: "start" });
    },
    []
  );

  useMutationObserver(elementRef.current, onListMutation);

  useEffect(() => {
    if (!currentChat) return;
    (async () => {
      await readMessage(currentChat.user.pubkey);
    })();
  }, [currentChat]);

  return (
    <>
      {!currentChat ? (
        <div className="w-auto hidden sm:block md:ml-[18rem] lg:ml-[25rem]  bg-indigo-50 min-h-screen">
          <div className="text-gray-800 border-b-4 border-indigo-600 flex items-center flex-col justify-between text-center min-h-screen">
            <div></div>
            <div>
              <h1 className="text-3xl font-normal">Metachat Messenger</h1>
              <p className="text-gray-600 font-normal mt-4">
                <span className="block">
                  You can now send and recieved encrypted and unsensored
                </span>
                <span className="block">
                  messages on the blockchain with Metachat Messenger
                </span>
              </p>
            </div>
            <p className="py-3 flex items-center">
              <IoLockClosedOutline className="text-indigo-600 h-5 w-5" />{" "}
              Unsensored Messenger
            </p>
          </div>
        </div>
      ) : (
        <div
          className={`w-auto ${
            !displayChat ? "hidden md:flex" : "flex"
          } flex-col justify-between md:ml-[18rem] lg:ml-[25rem]  bg-white md:bg-indigo-50 dark:bg-gray-900 dark:border-l dark:border-gray-600 h-screen`}
        >
          <header className="sticky top-0 z-10">
            <div className="flex items-center justify-between h-14 bg-white md:bg-indigo-100 border-gray-200 dark:bg-gray-800 border-b dark:border-gray-600 px-4">
              <div className="flex">
                {displayChat && (
                  <div
                    onClick={() => setDisplayChat(false)}
                    className="md:hidden cursor-pointer dark:bg-gray-800 outline-none dark:hover:bg-gray-900 dark:hover:text-indigo-500 hover:bg-indigo-100"
                  >
                    {React.createElement(IoChevronBackOutline, {
                      className:
                        "h-6 dark:text-gray-200 md:hidden text-indigo-600",
                    })}
                  </div>
                )}
              </div>
              <div className="max-w-[10rem] md:max-w-xs">
                <p className="font-semibold truncate text-gray-800 dark:text-gray-400">
                  {currentChat.user.pubkey}
                </p>
              </div>
              <div className="flex items-center space-x-2 justify-between">
                <div className="h-10 text-center flex items-center justify-center w-10 bg-gray-300 rounded-full">
                  <p className="uppercase font-bold text-xl">
                    {currentChat.user.name.charAt(0)}
                  </p>
                </div>
              </div>
            </div>
          </header>
          <section className="flex overflow-scroll px-4 flex-1">
            <div className="w-full" ref={elementRef}>
              {friendMsg.map((msg: MessageInterface, i: number) => (
                <Chat key={i} chat={msg} />
              ))}
              <p
                ref={endOfMsgRef}
                className={`text-gray-100 transition text-sm bg-black mb-1`}
              >
                <span className={`hidden font-thin`}></span>
              </p>
            </div>
          </section>
          <SendMessage
            endOfMsgRef={endOfMsgRef}
            setChats={setFriendMsg}
            chats={friendMsg}
          />
        </div>
      )}
    </>
  );
};

export default Chats;
