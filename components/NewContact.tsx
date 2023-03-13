import React, { Fragment, useState } from "react";
import { Dialog, Transition, Combobox } from "@headlessui/react";
import { useRecoilState } from "recoil";
import { newcontactState } from "../atom/newcontactAtom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { TypeOptions } from "react-toastify/dist/types";
import { useMetaChatProvider } from "../context/metaChat.context";
import { HiChevronUpDown } from "react-icons/hi2";
import { UserInterface } from "../interface/users.interface";
import { useRouter } from "next/router";

const NewContact = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useRecoilState(newcontactState);
  const { error, setError, addFriend, userList, loading } =
    useMetaChatProvider();
  const [selectedPerson, setSelectedPerson] = useState<UserInterface>();
  const closeModal = () => {
    setIsOpen(false);
  };

  const filteredPeople =
    query === ""
      ? userList
      : userList.filter(
          (user) =>
            user.name
              .toLowerCase()
              .replace(/\s+/g, "")
              .includes(query.toLowerCase().replace(/\s+/g, "")) ||
            user.accountAddress
              .toLowerCase()
              .replace(/\s+/g, "")
              .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

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

  const addContact = async () => {
    if (!selectedPerson) return setError("Select a user");
    const newFriendTx = await addFriend(
      selectedPerson.name,
      selectedPerson.accountAddress
    );
    if (newFriendTx) {
      notify("Contact added successfully", "success");
      setIsOpen(false);
      setSelectedPerson(undefined);
      router.reload();
    }
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all dark:border dark:border-gray-600 transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 dark:text-gray-100 text-gray-900"
                >
                  Add Connect
                </Dialog.Title>
                <form className="h-full">
                  <div className="mt-1 h-full">
                    <p className="text-xs mb-2 text-gray-500 dark:text-gray-300">
                      You can only connect with a user when your request has
                      been granted access by the user.
                    </p>
                    <Combobox
                      value={selectedPerson}
                      onChange={setSelectedPerson}
                    >
                      <div className="relative mt-1">
                        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                          <Combobox.Input
                            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 outline-none"
                            displayValue={(person: any) => person.name}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Enter username or address"
                          />
                          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <HiChevronUpDown
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </Combobox.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                          afterLeave={() => setQuery("")}
                        >
                          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {filteredPeople.length === 0 && query !== "" ? (
                              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                Nothing contact found.
                              </div>
                            ) : (
                              filteredPeople.map((user, index) => (
                                <Combobox.Option
                                  key={index}
                                  className={({ active }) =>
                                    `relative cursor-default select-none flex justify-between py-2 px-4 ${
                                      active
                                        ? "bg-indigo-600 text-white"
                                        : "text-gray-900"
                                    }`
                                  }
                                  value={user}
                                >
                                  <span>{user.name}</span>
                                  <span>{`${user.accountAddress.slice(
                                    0,
                                    5
                                  )}...${user.accountAddress.slice(-4)}`}</span>
                                </Combobox.Option>
                              ))
                            )}
                          </Combobox.Options>
                        </Transition>
                      </div>
                    </Combobox>
                    <span className="text-red-500 text-sm">{error}</span>
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={addContact}
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 dark:bg-gray-100 dark:text-gray-800 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                      disabled={loading}
                    >
                      {loading ? <>Connecting...</> : <>Connect</>}
                    </button>
                  </div>
                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
      <ToastContainer limit={1} />
    </>
  );
};

export default NewContact;
