import { FriendInterface } from "./users.interface";

export interface MessageInterface {
  sender: string;
  message: string;
  timestamp: Date;
}

export interface ChatInterface {
  user: FriendInterface;
  chat: MessageInterface[];
}
