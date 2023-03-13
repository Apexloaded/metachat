import Link from "next/link";
import React, { useState } from "react";
import { useMetaChatProvider } from "../context/metaChat.context";
import Image from "next/image";

const Login = () => {
  const { connectWallet, createAccount, loading, error, account } =
    useMetaChatProvider();
  const [name, setName] = useState<string>();

  const onSubmit = async () => {
    if (!name) return;
    if (!account) {
      return connectWallet().then((wallet) => {
        createAccount(name, wallet);
      });
      // const wallet = await connectWallet();
      // return createAccount(name, wallet);
    }
    createAccount(name, account);
  };
  return (
    <>
      <div className="h-screen dark:bg-black">
        <div className="h-full flex justify-start flex-col px-5">
          <div className="mt-10">
            <Link
              href="/"
              className="flex mb-3 justify-center items-center space-x-1"
            >
              <img
                className="h-8 w-auto"
                src="/icon.png"
                alt="nftly"
              />
              <p className="font-bold text-indigo-600 text-3xl">metachat</p>
            </Link>
            <p className="text-center font-bold text-3xl lg:text-4xl dark:text-gray-300">
              Connect with your wallet
            </p>
            <p className="font-thin text-center text-lg dark:text-gray-300">
              Connect with one of our available wallet providers or create a new
              wallet. What is a wallet?
            </p>
          </div>
          <div className="mt-10">
            <div className="max-w-md mx-auto">
              <input
                onInput={(e) => setName(e.currentTarget.value)}
                className="border border-gray-500 w-full h-12 px-3 rounded-md"
                placeholder="Username"
              />
              <button
                onClick={onSubmit}
                className="w-full mt-5 font-semibold text-xl text-white cursor-pointer bg-indigo-600 hover:bg-indigo-700 border mb-3 border-gray-300 py-2 lg:py-3 px-4 rounded-md text-center"
              >
                Create Account
              </button>
            </div>
          </div>
          <div className="mt-10">
            <div className="max-w-md text-center mx-auto">
              <p>OR</p>
            </div>
          </div>
          <div className="mt-10">
            <div className="mx-auto overflow-hidden w-full sm:max-w-sm lg:w-96">
              <ul>
                <li
                  onClick={connectWallet}
                  className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 border mb-3 border-gray-300 py-2 lg:py-3 px-4 rounded-full flex items-center"
                >
                  <Image
                    height={40}
                    width={40}
                    src={"/metamask.png"}
                    className="h-10"
                    alt="metamask"
                  />
                  <div className="w-full flex justify-center">
                    <p className="text-xl text-center">
                      <span className="font-semibold text-white">
                        Sign in with Metamask
                      </span>
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
