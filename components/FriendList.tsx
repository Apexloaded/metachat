import React, { useEffect, useState } from "react";
import Moment from "react-moment";
import { useRecoilState } from "recoil";
import { currentChatState } from "../atom/currentChatAtom";
import { useMetaChatProvider } from "../context/metaChat.context";
import { MessageInterface } from "../interface/message.interface";
import { FriendInterface } from "../interface/users.interface";
import { convertTime } from "../services/metaChat.services";

type Props = { contact: FriendInterface };

const FriendList = ({ contact }: Props) => {
  const { readMessage, setChatEvent, chatEvent } = useMetaChatProvider();
  const [currentChat] = useRecoilState(currentChatState);
  const [lastMsg, setLastMsg] = useState<MessageInterface>();

  useEffect(() => {
    (async () => {
      if (contact) {
        const msgs = await readMessage(contact.pubkey);
        const sortedMsg = msgs.sort(
          (a, b) => b.timestamp.valueOf() - a.timestamp.valueOf()
        );
        setLastMsg(sortedMsg[0]);
      }
    })();
  }, [contact, currentChat, chatEvent]);

  return (
    <div className="flex justify-between space-x-2 lg:space-x-0">
      <div className="flex truncate w-full md:w-[12rem] lg:w-[18rem] items-center space-x-2">
        <div className="h-11 w-11 lg:h-12 lg:w-12 min-w-[2.75rem] min-h-[2.75rem] lg:min-h-[3rem] lg:min-w-[3rem] rounded-full flex items-center justify-center bg-indigo-50 dark:bg-gray-200">
          <p className="text-xl uppercase">{contact.name.charAt(0)}</p>
        </div>
        <div className="w-auto truncate">
          <h1 className="truncate font-semibold text-gray-700 dark:text-gray-200">
            {contact.pubkey}
          </h1>
          <p className="truncate text-sm text-gray-600 dark:text-gray-400">
            {lastMsg?.message}
          </p>
        </div>
      </div>
      <div className="w-[6rem] md:w-[4rem] text-gray-600 flex items-center justify-end text-right">
        <div className="">
          <Moment
            format="h:mm A"
            className={`text-xs text-gray-400 block truncate`}
          >
            {lastMsg?.timestamp}
          </Moment>
        </div>
      </div>
    </div>
  );
};

export default FriendList;
