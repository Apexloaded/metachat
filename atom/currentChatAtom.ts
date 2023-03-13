import { atom } from "recoil";
import { ChatInterface } from "../interface/message.interface";

export const currentChatState = atom<ChatInterface>({
  key: "currentChatState",
  default: undefined,
});
