import { Fragment,useRef } from "react";
import React from "react";
import { Menu, Popover, Transition } from "@headlessui/react";
import {
  BookOpenIcon,
  ChatAltIcon,
  CodeIcon,
  DotsVerticalIcon,
  EyeIcon,
  FlagIcon,
  LogoutIcon,
  PlusSmIcon,
  SearchIcon,
  ShareIcon,
  StarIcon,
  ThumbUpIcon,
  UserIcon,
  ViewGridAddIcon,
} from "@heroicons/react/solid";
import styles from "../styles/Home.module.css";
import {
  BellIcon,
  FireIcon,
  HomeIcon,
  MenuIcon,
  XIcon,
} from "@heroicons/react/outline";
import Head from "next/head";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import localStorage from "localStorage";
import { useWallet } from "@solana/wallet-adapter-react";
import { useMemo, useCallback, useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import dynamic from "next/dynamic";
import Link from "next/link";
import CreateUser from "@/components/createUser";
import { useGumSDK } from '@/hooks/useGumSDK';

const navigation = [
  { name: "Feed", href: "/", icon: BookOpenIcon, current: false },
  { name: "Profile", href: "/Profile", icon: FireIcon, current: false },
  { name: "User", href: "#", icon: UserIcon, current: true },
];
const userNavigation = [
  { name:"" ,icon: UserIcon, href: "#" },
  
];

const BellNavigation = [{ name: "Notifications", href: "#" }];

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);


function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Feed() {
    const [isDarkMode, setDarkMode] = React.useState(false);
    const counterRef = useRef(0);
    var toggleDarkMode = function (checked) {
      setDarkMode(checked);
    };
  
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const toggleTheme = () => {
      if (theme === "light") {
        setTheme("dark");
      } else {
        setTheme("light");
      }
    };
    useEffect(() => {
      localStorage.setItem("theme", theme);
      document.body.className = theme;
    }, [theme]);
    const wallet = useWallet();
    const userPublicKey = wallet?.publicKey as PublicKey;
    const [usersList, setUsersList] = useState<any[]>([]);
    const [Allprofile,setAllProfile] =useState<any[]>([]);
    const [jsonData, setJsonData] = useState(null);
    const [allJson, setAllJson] = useState<any>(null);
    const connection = useMemo(() => new Connection("https://greatest-fluent-firefly.solana-devnet.discover.quiknode.pro/fe61091953c4185459c5e2df72ab90a12ee2c17c/", "confirmed"), []);
    const sdk = useGumSDK(connection, { preflightCommitment: "confirmed" }, "devnet");
    const staticAddresses: PublicKey[] = [
      new PublicKey("CCZz1UAKw7o5ftDYtYPaR5oX4ZvC3QmsGNeCJeM3FMCP"),
      new PublicKey("FQPxZebhpTqTCTBW8cHjoYgbPZVbMPZGJ5pNqE3GnGPo"),
      new PublicKey("AuuVT8BqwDtyXdqqoVCntuPjnwg3eu5oMumsZX4UnVfy"),
    ];
    const shuffleArray = (array) => {
      let arr = [...array];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
      return arr;
    };
    useEffect(() => {
      const fetchProfileData = async () => {
        const metadataUrls =  Allprofile.map(item => item[0].account?.metadataUri);
        const profiles = [];
        for (let i = 0; i < metadataUrls.length; i++) {
          
          const metadataUrl = metadataUrls[i];
          try {
            const response = await fetch(metadataUrl);
            const data = await response.json();
            profiles.push({
              publicKey: Allprofile[i].publicKey,
              metadataUri: metadataUrl,
              data: data
            });
            counterRef.current += 1;
          } catch (error) {
            console.error(error);
          }
        } 
          setAllJson(profiles);
      };
      if (counterRef.current < 2) {
      fetchProfileData();
      }
    }, [userPublicKey,staticAddresses,counterRef]);
    

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileMetadataList = await sdk.profileMetadata.getProfileMetadataAccountsByUser(userPublicKey);
        const allprofiledata = await Promise.all(
          staticAddresses.map((address) =>
            sdk.profileMetadata.getProfileMetadataAccountsByUser(address)
          )
        );
        const vm =  profileMetadataList[0]?.[0]?.account?.metadataUri;
        const apiUrl = vm;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUsersList(await sdk.user.getUserAccountsByUser(userPublicKey));
        setAllProfile(shuffleArray(allprofiledata.flat()));
        setJsonData(data);
        counterRef.current += 1;
      } catch (error) {
        console.error(error);
      }
    };
    if (counterRef.current < 1) {
    if (wallet.connected && sdk) {
      fetchData();
    }
  }
  }, [wallet.connected, sdk,counterRef]);

  const recommendedProfiles = allJson?.slice(0, 3).map(profile => {
    const { name, bio, username, avatar } = profile.data;
    return { name, bio, username, avatar };
  });  
  const sliceIndex = 3;
  const slicedProfiles = recommendedProfiles?.slice(0, sliceIndex);
  
  return (
    <div className={`App ${theme}`}>
      <div className={`App ${theme}`}>
        <Head>
          <title>Profile / Social3</title>
          <meta name="description" content="Generated by create next app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link
            rel="icon"
            href="https://pbs.twimg.com/profile_images/1610613930182991872/0h5Voucf_400x400.jpg"
          />
        </Head>
        <div className="min-h-full ">
          {/* When the mobile menu is open, add `overflow-hidden` to the `body` element to prevent double scrollbars */}
          <Popover
            as="header"
            className={({ open }) =>
              classNames(
                open ? "fixed inset-0 z-40 overflow-y-auto" : "",
                " shadow-sm lg:static lg:overflow-y-visible"
              )
            }
          >
            {({ open }) => (
              <>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="relative flex justify-between xl:grid xl:grid-cols-12 lg:gap-8">
                    <div className="flex md:absolute md:left-0 md:inset-y-0 lg:static xl:col-span-2">
                      <div className="flex-shrink-0 flex items-center">
                        <Link href="#">
                          <img
                            className="block h-8 w-auto"
                            src="https://app.social3.club/_next/static/media/light-logo.21d5d80f.svg"
                            alt="Workflow"
                          />
                        </Link>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1 md:px-8 lg:px-0 xl:col-span-6">
                      <div className="flex text-2xl font-bold items-center px-6 py-4 md:max-w-3xl md:mx-auto lg:max-w-none lg:mx-0 xl:px-0">
                        User
                      </div>
                    </div>
                    <div className="flex items-center md:absolute md:right-0 md:inset-y-0 lg:hidden">
                      {/* Mobile menu button */}
                      <Popover.Button className="-mx-2 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rose-500">
                        <span className="sr-only">Open menu</span>
                        {open ? (
                          <XIcon className="block h-6 w-6" aria-hidden="true" />
                        ) : (
                          <MenuIcon
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        )}
                      </Popover.Button>
                    </div>
                    <div className="hidden lg:flex lg:items-center lg:justify-end xl:col-span-4">
                      <Link
                        href="#"
                        className="ml-5 flex-shrink-0  rounded-full p-1 text-gray-400 hover:text-gray"
                      >
                        <span className="sr-only">View notifications</span>
                        <SearchIcon
                          className="h-9 w-9 border-2  border-slate-400 rounded-full p-[4px]"
                          aria-hidden="true"
                        />
                      </Link>
                      <Link
                        href="#"
                        className="ml-5 flex-shrink-0  rounded-full p-1 hover:text-gray"
                      >
                        <span className="sr-only">View notifications</span>
                        <DarkModeSwitch
                          style={{ marginBottom: "1px" }}
                          className="h-9 w-9 border-2  rounded-full border-slate-400  p-[4px]"
                          checked={isDarkMode}
                          onChange={toggleDarkMode}
                          onClick={toggleTheme}
                          size={30}
                        />
                      </Link>

                      {/* Profile dropdown */}
                      <Menu as="div" className="flex-shrink-0 relative ml-5">
                        <div>
                          <Menu.Button className=" rounded-full flex ">
                            <span className="sr-only">Open user menu</span>
                            <BellIcon className="h-9 w-9 border-2  rounded-full border-slate-400  p-[4px]" />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="origin-top-right absolute z-10 right-0 mt-2 w-48 rounded-md shadow-lg  ring-1 ring-black ring-opacity-5 py-1 focus:outline-none">
                            {BellNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <Link
                                    href={item.href}
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block py-2 px-4 text-sm text-gray-700"
                                    )}
                                  >
                                    {item.name}
                                  </Link>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                      <Menu as="div" className="flex-shrink-0 relative ml-5">
                        <div>
                          <Menu.Button className="bg-white rounded-full flex ">
                            <span className="sr-only">Open user menu</span>
                            {jsonData && (
         <img
         className="h-10 ml-6 w-10 rounded-full "
         src={jsonData?.avatar}
         alt=""
       />
      )}
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="origin-top-right absolute z-10 right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 focus:outline-none">
                            {userNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <Link
                                    href={item.href}
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block py-2 px-4 text-sm text-gray-700"
                                    )}
                                  >
                                    <div className="flex">
                                    <item.icon
                                      className={classNames(
                                        item.current
                                          ? "text-gray-500"
                                          : "text-gray-400 group-hover:text-gray-500",
                                        "flex-shrink-0 -ml-1 mr-3 h-6 w-6"
                                      )}
                                      aria-hidden="true"
                                    />
                                    <span>
                                    {jsonData && (
       <>{jsonData.name} </>
      )}
                                    </span>
                                    </div>
                                  </Link>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                </div>

                <Popover.Panel
                  as="nav"
                  className="lg:hidden"
                  aria-label="Global"
                >
                  <div className="max-w-3xl mx-auto px-2 bg-slate-300 pt-2 pb-3 space-y-1 sm:px-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        aria-current={item.current ? "page" : undefined}
                        className={classNames(
                          item.current ? "bg-gray-100 " : "hover:bg-gray-50",
                          "block rounded-md py-2 px-3 text-base font-medium"
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                  <div className=" max-w-3xl font-black bg-slate-300 mx-auto px-4 sm:px-6">
                    <WalletMultiButtonDynamic />
                  </div>
                </Popover.Panel>
              </>
            )}
          </Popover>

          <div className="py-10 ">
            <div className="max-w-3xl mx-auto sm:px-6 lg:max-w-7xl lg:px-2 lg:grid lg:grid-cols-12 lg:gap-2">
              <div className="hidden lg:block lg:col-span-3 xl:col-span-2">
                <nav
                  aria-label="Sidebar"
                  className="sticky top-4 divide-y  divide-gray-300"
                >
                  <div className="pb-8 space-y-1">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-200 "
                            : "text-gray-600 hover:bg-gray-50",
                          "group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        <item.icon
                          className={classNames(
                            item.current
                              ? "text-gray-500"
                              : "text-gray-400 group-hover:text-gray-500",
                            "flex-shrink-0 -ml-1 mr-3 h-6 w-6"
                          )}
                          aria-hidden="true"
                        />
                        <span className="truncate">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </nav>
              </div>
              <main className="lg:col-span-9 xl:col-span-6">
                <div className="mt-4">
                  <h1 className="sr-only">Recent questions</h1>
                  <section aria-labelledby="post">
                  <div className={styles.minimize}>
                    <div className={styles.listContainer}>
                       <h2 className={styles.title}>Your User Accounts</h2>
                            {usersList.map((user, index) => (
                            <div key={index} className={styles.userCard}>
                                <div className={styles.userNumber}>
                                    {index + 1}
                                </div>
                                <div className={styles.userInfo}>
                                  <p className={styles.userEmail}>User Account: {user.publicKey.toBase58()}</p>
                                  <p className={styles.userAuthority}>Authority: {user.account.authority.toBase58()}</p>
                                </div>
                              </div>
                              ))}
                      </div>
                    </div>
            <div className="mt-5">
                    <CreateUser  sdk={sdk} />
                    </div>
                  </section>
                </div>
              </main>
              <aside className="hidden xl:block xl:col-span-4">
                <div className="sticky top-4 space-y-4">
                <section aria-labelledby="connectwallet">
                    <div className=" rounded-lg bg-gray-300 shadow">
                      <div className="text-center font-sans p-1 text-2xl font-bold">
                        My wallet: <WalletMultiButtonDynamic />
                      </div>
                    </div>
                  </section>

                  <section aria-labelledby="recommendedprofiles">
                    <div className=" rounded-lg shadow">
                      <div className="p-6">
                        <h2
                          id="recommendedprofiles"
                          className="text-base font-medium "
                        >
                          Recommended Profiles
                        </h2>
                        <div className="mt-6 flow-root">
                          <ul
                            role="list"
                            className="-my-4 divide-y divide-gray-200"
                          >
                             {slicedProfiles?.map((user) => (
                              <li
                                key={user.metadata_id}
                                className="flex items-center py-4 space-x-3"
                              >
                                <div className="flex-shrink-0">
                                  <img
                                    className="h-16 w-16 rounded-full"
                                    src={user.avatar|| "https://pbs.twimg.com/profile_images/1621492955868545024/CpsOM4M3_400x400.jpg"}
                                    alt=""
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium ">
                                    <a href={user.href}>{user.name|| "GumProtocol"}</a>
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    <a href={user.href}>{"@" + (user.username|| "Gum")}</a>
                                  </p>
                                  <p className="text-md text-black ml-1">
                                    <a href={user.href}>{user.bio|| "Create User, profile, post"}</a>
                                  </p>
                                </div>
                                <div className="flex-shrink-0">
                                  <button
                                    type="button"
                                    className="inline-flex items-center px-3 py-0.5 rounded-full bg-rose-50 text-sm font-medium text-rose-700 hover:bg-rose-100"
                                  >
                                    <PlusSmIcon
                                      className="-ml-1 mr-0.5 h-5 w-5 text-rose-400"
                                      aria-hidden="true"
                                    />
                                    <span>Follow</span>
                                  </button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-6">
                          <a
                            href="#"
                            className="w-full block text-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            View all
                          </a>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
