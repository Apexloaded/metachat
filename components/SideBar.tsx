import React, { useEffect, useState } from "react";
import {
  IoHomeOutline,
  IoSettingsOutline,
  IoPeopleOutline,
} from "react-icons/io5";
import { HiOutlineMenuAlt3, HiOutlineMenuAlt2 } from "react-icons/hi";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { sidebarState } from "../atom/sidebarAtom";
import { useMetaChatProvider } from "../context/metaChat.context";

const SideBar = () => {
  const [width, setWidth] = useState(0);
  const router = useRouter();
  const [collapsed, setCollapse] = useRecoilState(sidebarState);
  const [isActive, setIsActive] = useState<string>();
  const { account, userName } = useMetaChatProvider();

  const navigation = [
    { name: "Home", href: "/", icon: <IoHomeOutline className="h-6 w-6" /> },
    {
      name: "Settings",
      href: "#",
      icon: <IoSettingsOutline className="h-6 w-6" />,
    },
    {
      name: "Community",
      href: "/community",
      icon: <IoPeopleOutline className="h-6 w-6" />,
    },
  ];

  const closeSidebar = (isWidth = false) => {
    if (isWidth && width <= 1279) {
      setCollapse(false);
    }
  };

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggle = () => {
    collapsed ? setCollapse(false) : setCollapse(true);
  };

  return (
    <aside
      className={`h-screen z-20 xl:bg-white transition-all duration-100 overflow-auto fixed top-0 ${
        collapsed
          ? "w-full xl:w-20 xs:shadow-2xl sm:shadow-2xl lg:shadow-none dark:bg-gray-800 bg-black bg-opacity-80 dark:bg-opacity-40 xl:border-r border-gray-200 dark:border-gray-600"
          : "w-0 sm:w-20 xl:w-64 sm:border-r xl:shadow-md border-gray-200 dark:border-gray-600"
      }`}
    >
      <div
        className={`h-full ${
          collapsed ? "w-64 xl:w-20" : "w-20 xl:w-64"
        } relative bg-white dark:bg-gray-800`}
      >
        <div
          className={`border-b h-14 w-full bg-white dark:bg-gray-800 px-5 absolute top-0 border-gray-200 dark:border-gray-600 flex items-center justify-center ${
            collapsed ? "xl:justify-center justify-between" : "justify-center"
          } xl:justify-start`}
        >
          <Link
            href="/"
            onClick={() => closeSidebar(true)}
            className="flex outline-none items-center space-x-1"
          >
            <div
              className={`flex items-center space-x-2`}
            >
              <Image
                height={90}
                width={90}
                src={
                  "/icon.png"
                }
                className="h-10 w-10"
                alt="logo"
              /> <p className={`font-bold text-xl ${collapsed ? 'xl:hidden' : 'hidden xl:inline'}`}>Metachat</p>
            </div>
          </Link>
          <div
            className={`bg-gray-100 dark:bg-gray-700 h-10 w-10 flex justify-center items-center rounded-full ${
              collapsed ? "inline xl:hidden" : "hidden"
            }`}
          >
            {collapsed ? (
              <HiOutlineMenuAlt3
                onClick={toggle}
                className="h-6 cursor-pointer text-indigo-600 dark:text-white"
              />
            ) : (
              <HiOutlineMenuAlt2
                onClick={toggle}
                className="h-6 cursor-pointer text-indigo-600 dark:text-white"
              />
            )}
          </div>
        </div>
        <div
          className={`flex flex-col h-screen overflow-auto py-14 justify-start`}
        >
          <div className="block w-full pt-3 pb-0 border-gray-200 dark:border-gray-600">
            {navigation.map((el, i) => (
              <Link
                onClick={() => {
                  closeSidebar(true);
                  setIsActive(el.href);
                }}
                href={el.href}
                key={i}
                className={`flex ${
                  collapsed
                    ? "justify-start"
                    : "justify-center xl:justify-start"
                } w-full px-2 group mb-2`}
              >
                <div
                  className={`inline rounded-full px-3 ${
                    router.route === el.href && "bg-indigo-50"
                  } dark:text-gray-300 group-hover:shadow-sm group-hover:bg-indigo-50 dark:group-hover:bg-gray-700 items-center space-x-4 ${
                    collapsed
                      ? "justify-start xl:justify-center xl:px-5 group-hover:pr-7 xl:group-hover:pr-5"
                      : `xl:justify-start justify-center group-hover:xl:pr-7 ${
                          router.route === el.href ? "xl:pr-7" : "xl:px-3"
                        }`
                  } py-[.62rem] "group-hover:bg-indigo-50"
                    `}
                >
                  <span className="float-left">{el?.icon}</span>
                  <span
                    className={`float-left text-lg ${
                      collapsed ? "xl:hidden" : "xl:inline hidden"
                    } ${router.route === el.href && "font-bold"}`}
                  >
                    {el.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="absolute mt-14 bg-white border-t border-gray-200 dark:border-gray-600 dark:bg-gray-700 bottom-0 h-12 shadow-2xl w-full">
          <div className="h-full w-full px-4 flex items-center gap-2 justify-start">
            <div className="h-10 w-10 rounded-full flex items-center justify-center bg-indigo-50 dark:bg-gray-200">
              <p className="text-xl uppercase font-bold">
                {userName?.charAt(0)}
              </p>
            </div>
            <span
              className={`font-bold ${
                collapsed ? "xl:hidden" : "xl:inline hidden"
              } `}
            >{`${account?.slice(0, 5)}...${account?.slice(-4)}`}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
