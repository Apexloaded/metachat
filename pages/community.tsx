import { NextPage } from "next";
import React from "react";
import { HiOutlineMenuAlt3, HiOutlineMenuAlt2 } from "react-icons/hi";
import { IoCopyOutline } from "react-icons/io5";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { useRecoilState } from "recoil";
import { sidebarState } from "../atom/sidebarAtom";
import HeadTag from "../components/HeadTag";
import Section from "../components/Section";
import SideBar from "../components/SideBar";
import { useMetaChatProvider } from "../context/metaChat.context";
import { UserInterface } from "../interface/users.interface";
import { TypeOptions } from "react-toastify/dist/types";
import { useAuthProvider } from "../context/auth.context";
import Login from "../components/Login";

const Community: NextPage = () => {
  const [collapsed, setCollapse] = useRecoilState(sidebarState);
  const { account, userName, userList, addFriend, error, friendLists } =
    useMetaChatProvider();
  const { isAuthenticated } = useAuthProvider();

  const isOwner = (wallet: string) =>
    wallet.toLowerCase() === account?.toLocaleLowerCase();

  const isFriend = (user: UserInterface) => {
    const friend = friendLists?.find(
      (f) =>
        f.pubkey.toLocaleLowerCase() === user.accountAddress.toLocaleLowerCase()
    );
    return !!friend;
  };

  const toggle = () => {
    collapsed ? setCollapse(false) : setCollapse(true);
  };

  const notify = (text: string, type: TypeOptions) =>
    toast(text, {
      type: type,
      position: "top-right",
      autoClose: 10000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  const sendFriendReq = async (user: UserInterface) => {
    if (!user) return;
    const newFriendTx = await addFriend(user.name, user.accountAddress);
    if (newFriendTx) {
      notify("Contact added successfully", "success");
    }
    if (error) {
      notify(error, "error");
    }
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <>
      <HeadTag title="Community members" />
      <>
        <SideBar></SideBar>
        <Section>
          <div
            className={`w-auto flex flex-col justify-between bg-white dark:bg-gray-900 dark:border-l dark:border-gray-600 h-screen`}
          >
            <header className="sticky top-0 z-10">
              <div className="flex items-center justify-between h-14 bg-white border-gray-200 dark:bg-gray-800 border-b dark:border-gray-600 px-4">
                <div className="flex space-x-2 items-center">
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
                  <p className="text-xl font-bold text-gray-600">Community</p>
                </div>
                <div className="flex items-center space-x-2 justify-between">
                  <p className="font-bold text-gray-600 bg-indigo-100 rounded-lg px-5 hidden lg:inline">{`${account?.slice(
                    0,
                    5
                  )}...${account?.slice(-4)}`}</p>
                  <div className="h-10 text-center flex items-center justify-center w-10 bg-gray-300 rounded-full">
                    <p className="uppercase font-bold text-xl">
                      {userName?.charAt(0)}
                    </p>
                  </div>
                </div>
              </div>
            </header>
            <section className="flex overflow-scroll px-4 flex-1">
              <div className="h-full w-full">
                <div className="w-full grid grid-cols-1 md:grid-cols-3 pt-5 gap-5">
                  {userList &&
                    userList.length > 0 &&
                    userList.map((user, index) => (
                      <div
                        key={index}
                        className="border px-5 py-8 rounded-md shadow-sm hover:shadow-md"
                      >
                        <div className="h-20 w-20 mx-auto rounded-full flex items-center justify-center bg-indigo-50 dark:bg-gray-200">
                          <p className="text-4xl font-bold uppercase">
                            {user.name.charAt(0)}
                          </p>
                        </div>
                        <div className="flex items-center justify-center mt-3 space-x-2">
                          <p className="text-center font-bold text-gray-400">
                            {`${user.accountAddress?.slice(
                              0,
                              5
                            )}...${user.accountAddress?.slice(-4)}`}
                          </p>
                          <span className="flex items-center gap-1 cursor-pointer">
                            <IoCopyOutline /> Copy
                          </span>
                        </div>
                        <p className="text-center font-bold">({user.name})</p>
                        <div className="flex justify-center">
                          <button
                            onClick={() => sendFriendReq(user)}
                            disabled={
                              isOwner(user.accountAddress) || isFriend(user)
                            }
                            className={`mt-5 bg-indigo-600 ${
                              isOwner(user.accountAddress) && "bg-indigo-400"
                            } ${
                              isFriend(user) && "bg-indigo-400"
                            } text-white py-2 px-6 mx-auto`}
                          >
                            {isOwner(user.accountAddress)
                              ? "My Account"
                              : `${
                                  isFriend(user)
                                    ? "Already Friend"
                                    : "Send Request"
                                }`}
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </section>
          </div>
        </Section>
        <ToastContainer limit={1} />
      </>
    </>
  );
};

export default Community;
