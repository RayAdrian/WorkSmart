"use client";

import React from "react";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { UserCircleIcon, BellIcon } from "@heroicons/react/24/outline";

interface HeaderProps {
  username?: string | null;
  email?: string | null;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ username, email, onLogout }) => {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <h1 className="text-xl font-semibold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-black">
              WorkSmart
            </h1>
          </div>

          <div className="flex items-center gap-2 h-full relative">
            <button className="flex items-center justify-center h-10 w-10 p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-50 transition-colors">
              <BellIcon className="h-6 w-6" />
            </button>
            <Menu as="div" className="flex items-center h-full">
              <Menu.Button className="flex items-center justify-center h-10 w-10 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 hover:bg-gray-50 transition-colors">
                <UserCircleIcon className="h-8 w-8 text-gray-400" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 top-full w-56 origin-top-right rounded-xl bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {username || "John Doe"}
                    </p>
                  </div>
                  <Menu.Item>
                    {({ active }: { active: boolean }) => (
                      <a
                        href="#"
                        className={`${
                          active ? "bg-gray-50" : ""
                        } block px-4 py-2 text-sm text-gray-700`}
                      >
                        Your Profile
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }: { active: boolean }) => (
                      <a
                        href="#"
                        className={`${
                          active ? "bg-gray-50" : ""
                        } block px-4 py-2 text-sm text-gray-700`}
                      >
                        Settings
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }: { active: boolean }) =>
                      onLogout ? (
                        <button
                          type="button"
                          onClick={onLogout}
                          className={`${
                            active ? "bg-gray-50" : ""
                          } w-full text-left block px-4 py-2 text-sm text-red-600`}
                        >
                          Sign out
                        </button>
                      ) : (
                        <a
                          href="#"
                          className={`${
                            active ? "bg-gray-50" : ""
                          } block px-4 py-2 text-sm text-red-600`}
                        >
                          Login
                        </a>
                      )
                    }
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
