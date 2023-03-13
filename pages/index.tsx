import type { NextPage } from "next";
import Chats from "../components/Chats";
import ChatSideBar from "../components/ChatSideBar";
import HeadTag from "../components/HeadTag";
import Login from "../components/Login";
import Section from "../components/Section";
import SideBar from "../components/SideBar";
import { useMetaChatProvider } from "../context/metaChat.context";

const Home: NextPage = () => {
  const { account, userName } = useMetaChatProvider();

  return (
    <>
      <HeadTag title="Welcome to web3 metachat" />
      {account && userName ? (
        <div>
          <SideBar />
          <Section>
            <ChatSideBar />
            <Chats />
          </Section>
        </div>
      ) : (
        <Login />
      )}
    </>
  );
};

export default Home;
