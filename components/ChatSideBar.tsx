import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { sidebarState } from "../atom/sidebarAtom";
import { HiOutlineMenuAlt3, HiOutlineMenuAlt2 } from "react-icons/hi";
import {
  IoEllipsisVerticalOutline,
  IoChatboxEllipsesOutline,
  IoAddOutline,
} from "react-icons/io5";
import Moment from "react-moment";
import { useMetaChatProvider } from "../context/metaChat.context";
import { showchatState } from "../atom/showchatAtom";
import { newcontactState } from "../atom/newcontactAtom";
import NewContact from "./NewContact";
import { FriendInterface } from "../interface/users.interface";
import { currentChatState } from "../atom/currentChatAtom";
import { convertTime } from "../services/metaChat.services";
import FriendList from "./FriendList";

const ChatSideBar = () => {
  const [collapsed, setCollapse] = useRecoilState(sidebarState);
  const [displayChat, setDisplayChat] = useRecoilState(showchatState);
  const [currentChat, setCurrentChat] = useRecoilState(currentChatState);
  const [isOpen, setIsOpen] = useRecoilState(newcontactState);
  const { friendLists, friendMsg, readMessage } = useMetaChatProvider();
  const [width, setWidth] = useState(0);

  const toggle = () => {
    collapsed ? setCollapse(false) : setCollapse(true);
  };

  const newContact = () => {
    setIsOpen(true);
  };

  const showChat = (currentChat: FriendInterface) => {
    if (width <= 765) {
      setDisplayChat(true);
    }
    //updateRead(connect);
    setCurrentChat({ user: currentChat, chat: [] });
  };

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className={`w-full ${
        displayChat && width <= 765 && "hidden"
      } md:w-[18rem] lg:w-[25rem] md:fixed top-0 bg-white dark:bg-gray-800 min-h-screen`}
    >
      <NewContact />
      <div className="overflow-y-scroll h-screen">
        <header className="sticky top-0">
          <div className="flex items-center justify-between h-14 bg-indigo-200 dark:bg-gray-800 px-4">
            <div className="flex space-x-2">
              <div
                onClick={toggle}
                className="bg-gray-100 cursor-pointer dark:bg-gray-800 dark:hover:bg-gray-900 dark:hover:text-indigo-500 hover:bg-indigo-100 w-10 h-10 flex items-center justify-center rounded-full"
              >
                {React.createElement(
                  collapsed ? HiOutlineMenuAlt3 : HiOutlineMenuAlt2,
                  {
                    className:
                      "h-6 dark:text-gray-200 xl:hidden text-indigo-600",
                  }
                )}
                {React.createElement(
                  collapsed ? HiOutlineMenuAlt2 : HiOutlineMenuAlt3,
                  {
                    className:
                      "h-6 dark:text-gray-200 hidden xl:inline text-indigo-600",
                  }
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2 justify-between">
              <button className="h-10 w-10 rounded-full hover:bg-indigo-100 dark:bg-gray-800 dark:hover:bg-gray-900 flex items-center justify-center">
                <IoChatboxEllipsesOutline className="h-6 w-6 dark:text-gray-200" />
              </button>
              <button className="h-10 w-10 rounded-full hover:bg-indigo-100 dark:bg-gray-800 dark:hover:bg-gray-900 flex items-center justify-center">
                <IoEllipsisVerticalOutline className="h-6 w-6 dark:text-gray-200" />
              </button>
            </div>
          </div>
          <div className="px-4 bg-indigo-100 dark:bg-gray-700 h-14 flex items-center">
            <input
              type="search"
              name=""
              placeholder="search messages"
              className="w-full outline-none px-3 rounded-md h-10 dark:bg-gray-900 dark:text-gray-200"
            />
          </div>
        </header>
        <section className="overflow-y-scroll">
          {friendLists && friendLists.length > 0 ? (
            <>
              {friendLists.map((contact, index) => (
                <div
                  key={index}
                  onClick={() => showChat(contact)}
                  className={`hover:cursor-pointer border-b dark:border-gray-600 hover:bg-indigo-50 dark:hover:bg-gray-700 py-4 px-4`}
                >
                  <FriendList contact={contact} />
                </div>
              ))}
            </>
          ) : (
            <div className="py-2 px-5 text-center">
              <h1 className="font-normal text-lg">No Connect</h1>
              <p className="font-normal text-gray-500 text-sm">
                You do not have any connect yet, send someone a message now.
              </p>
            </div>
          )}
        </section>
        <div className="absolute bottom-5 right-5">
          <button
            onClick={newContact}
            className="w-14 flex items-center justify-center h-14 bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700 text-white rounded-full"
          >
            <IoAddOutline className="h-10 w-10" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSideBar;
