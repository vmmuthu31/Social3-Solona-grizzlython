import { Fragment } from "react";
import React from "react";
import { Menu, Popover, Transition } from "@headlessui/react";
import styles from "../styles/Home.module.css";
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
import { Connection } from "@solana/web3.js";
import dynamic from "next/dynamic";
import { useCreateProfile, useCreateUser, useProfile } from "@gumhq/react-sdk";
import { useCreatePost } from "@gumhq/react-sdk";
import axios from "axios";
import Link from "next/link";
import CreatePost from "@/components/createPost";
import { useGumSDK } from '@/hooks/useGumSDK';
const navigation = [
  { name: "Feed", href: "/", icon: BookOpenIcon, current: true },
  { name: "Profile", href: "/Profile", icon: FireIcon, current: false },
  { name: "User", href: "/User", icon: UserIcon, current: false },
];
const userNavigation = [
  { name: "Settings", icon: ViewGridAddIcon, href: "#" },
  { name: "Sign Out", icon: LogoutIcon, href: "#" },
];

const BellNavigation = [{ name: "Notifications", href: "#" }];

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

const Post = [
  {
    id: "81614",
    likes: "29",
    replies: "11",
    views: "2.7k",
    author: {
      name: "Fred",
      imageUrl:
        "https://ipfs.io/ipfs/bafkreibw4jyovs7gg42tamg3cmjlciahlzixd7u2mjkzswirxigkwscwl4",
      href: "#",
    },
    date: "@fblauer.lens",
    day: "3 days ago",
    href: "#",
    body: `
      <p>Hi. Just trying out the platform. But I can't seem to refer or apply to Jobs to complete my profile? Don't know what I am doing wrong.</p>
    `,
  },
];
const whoToFollow = [
  {
    name: "Lens Protocol",
    handle: "A premissionless, composable, & decentralized social graph...",
    href: "#",
    imageUrl:
      "https://ipfs.io/ipfs/bafkreice45jmlvhctbt2nsygitnt3jphbahcq5hlx7vrlav63hmjacb5ea",
  },
  {
    name: "Lens Protocol",
    handle: "We built Aave Protocol, an open source and non-custodial...",
    href: "#",
    imageUrl:
      "https://ipfs.io/ipfs/bafybeihgymqvubldycb5nhrha6md6bveo64cjifagp5zbiuw3aizooowna",
  },
  {
    name: "Lens Protocol",
    handle: "Building @LensProtocol & @AaveAave",
    href: "#",
    imageUrl:
      "https://ipfs.io/ipfs/bafybeiehsyi2xtlfr7zmsuadruhwvodc4sxs6oh57bzd3fhd2mcjsybaiy",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Feed() {
  const [isDarkMode, setDarkMode] = React.useState(false);
  const [contentofpost, SetContentofpost] = useState("");

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
  const [profilesList, setProfilesList] = useState<any[]>([]);
  const [profileMetadataList, setProfileMetadataList] = useState<any[]>([]);
  const [postsList, setPostsList] = useState<any[]>([]);
  const [jsonData, setJsonData] = useState(null);
  const [postData, setPostData] = useState(null);
  const [metadataList, setMetadataList] = useState([]);
  
  const connection = useMemo(() => new Connection("https://api.devnet.solana.com", "confirmed"), []);
  const sdk = useGumSDK(connection, { preflightCommitment: "confirmed" }, "devnet");

    useEffect(() => {
      if (!wallet.connected) return;
      if (!sdk) return;
      const getData = async () => {
        const profileMetadataList = await sdk.profileMetadata.getProfileMetadataAccountsByUser(userPublicKey);
        setUsersList(await sdk.user.getUserAccountsByUser(userPublicKey));
        setProfilesList(await sdk.profile.getProfileAccountsByUser(userPublicKey));
        setProfileMetadataList(profileMetadataList as any);
        const postdatalink = postsList.map(item => item.account.metadataUri);
        const postdatajson = await Promise.all(postdatalink.map(url => fetch(url).then(res => res.json())));
        setMetadataList(postdatajson);
        const vm =  profileMetadataList[0]?.[0]?.account?.metadataUri;
        const apiUrl = vm;
        fetch(apiUrl)
          .then(response => response.json())
          .then(data => {
            const jsonData = data;
            setJsonData(jsonData);
          })
          .catch(error => console.error(error));
        setPostsList( await sdk.post.getPostAccountsByUser(userPublicKey));
      };
      getData();
    }, [wallet.connected]);
    const data =  postsList.map(item => item.account.metadataUri);
    console.log("profile",data)
    
  return (
    <div className={`App ${theme}`}>
      <div className={`App ${theme}`}>
        <Head>
          <title>Feed / Social3</title>
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
                        <a href="#">
                          <img
                            className="block h-8 w-auto"
                            src="https://app.social3.club/_next/static/media/light-logo.21d5d80f.svg"
                            alt="Workflow"
                          />
                        </a>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1 md:px-8 lg:px-0 xl:col-span-6">
                      <div className="flex text-2xl font-bold items-center px-6 py-4 md:max-w-3xl md:mx-auto lg:max-w-none lg:mx-0 xl:px-0">
                        Feed
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
                      <a
                        href="#"
                        className="ml-5 flex-shrink-0  rounded-full p-1 text-gray-400 hover:text-gray"
                      >
                        <span className="sr-only">View notifications</span>
                        <SearchIcon
                          className="h-9 w-9 border-2  border-slate-400 rounded-full p-[4px]"
                          aria-hidden="true"
                        />
                      </a>
                      <a
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
                      </a>

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
                                  <a
                                    href={item.href}
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block py-2 px-4 text-sm text-gray-700"
                                    )}
                                  >
                                    {item.name}
                                  </a>
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
                                  <a
                                    href={item.href}
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block py-2 px-4 text-sm text-gray-700"
                                    )}
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
                                    <span className="truncate">
                                      {item.name}
                                    </span>
                                  </a>
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
              <main className="lg:col-span-9 xl:col-span-6 ">
                <div className="mt-4">
                  <h1 className="sr-only">Recent questions</h1>
                  <CreatePost sdk={sdk} />
                  
                  <ul role="list" className="space-y-4 mt-5">
                 
                  {postsList.map((user, index) => (
                      <li
                      key={index}
                        className=" px-4 py-6 shadow sm:p-6 sm:rounded-lg"
                      >
                        <article
                          aria-labelledby={"question-title-" }
                        >
                          <div>
                            <div className="flex space-x-3">
                              <div className="flex-shrink-0">
                              {jsonData && (
         <img
         className="h-10 ml-6 w-10 rounded-full "
         src={jsonData?.avatar}
         alt=""
       />
      )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium ">
                                  <a
                                   
                                    className="hover:underline"
                                  >
                                    {jsonData && (
          <div>{jsonData?.name}</div>
      )}
                                  </a>
                                </p>
                                <p className="text-sm  text-gray-500">
                                {metadataList[index] &&(
        <div >
          <p > {jsonData?.username}</p>
        
        </div>
      )}
                                </p>
                                <p className="text-2xl mt-3 pr-40 font-bold">
                                {metadataList[index] &&(
        <div >
          <p >{metadataList[index]?.content?.content}</p>
        
        </div>
      )}
                                </p>
                              </div>
                              <div className="flex-shrink-0 self-center flex">
                                <Menu
                                  as="div"
                                  className="relative inline-block text-left"
                                >
                                  <div>
                                    <Menu.Button className="-m-2 p-2 rounded-full flex items-center text-gray-400 hover:text-gray-600">
                                      <span className="sr-only">
                                        Open options
                                      </span>
                                      <DotsVerticalIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
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
                                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                      <div className="py-1">
                                        <Menu.Item>
                                          {({ active }) => (
                                            <a
                                              href="#"
                                              className={classNames(
                                                active
                                                  ? "bg-gray-100 "
                                                  : "text-gray-700",
                                                "flex px-4 py-2 text-sm"
                                              )}
                                            >
                                              <StarIcon
                                                className="mr-3 h-5 w-5 text-gray-400"
                                                aria-hidden="true"
                                              />
                                              <span>Add to favorites</span>
                                            </a>
                                          )}
                                        </Menu.Item>
                                        <Menu.Item>
                                          {({ active }) => (
                                            <a
                                              href="#"
                                              className={classNames(
                                                active
                                                  ? "bg-gray-100 "
                                                  : "text-gray-700",
                                                "flex px-4 py-2 text-sm"
                                              )}
                                            >
                                              <CodeIcon
                                                className="mr-3 h-5 w-5 text-gray-400"
                                                aria-hidden="true"
                                              />
                                              <span>Embed</span>
                                            </a>
                                          )}
                                        </Menu.Item>
                                        <Menu.Item>
                                          {({ active }) => (
                                            <a
                                              href="#"
                                              className={classNames(
                                                active
                                                  ? "bg-gray-100 "
                                                  : "text-gray-700",
                                                "flex px-4 py-2 text-sm"
                                              )}
                                            >
                                              <FlagIcon
                                                className="mr-3 h-5 w-5 text-gray-400"
                                                aria-hidden="true"
                                              />
                                              <span>Report content</span>
                                            </a>
                                          )}
                                        </Menu.Item>
                                      </div>
                                    </Menu.Items>
                                  </Transition>
                                </Menu>
                              </div>
                            </div>
                          </div>
                          
                          
                          <div className="mt-6 flex justify-between space-x-8">
                            <div className="flex space-x-6">
                              <span className="inline-flex items-center text-sm">
                                <button
                                  type="button"
                                  className="inline-flex space-x-2 text-gray-400 hover:text-gray-500"
                                >
                                  <ThumbUpIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                  <span className="font-medium ">
                                    {/* {question.likes} */}
                                  </span>
                                  <span className="sr-only">likes</span>
                                </button>
                              </span>
                              <span className="inline-flex items-center text-sm">
                                <button
                                  type="button"
                                  className="inline-flex space-x-2 text-gray-400 hover:text-gray-500"
                                >
                                  <ChatAltIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                  <span className="font-medium ">
                                    {/* {question.replies} */}
                                  </span>
                                  <span className="sr-only">replies</span>
                                </button>
                              </span>
                              <span className="inline-flex items-center text-sm">
                                <button
                                  type="button"
                                  className="inline-flex space-x-2 text-gray-400 hover:text-gray-500"
                                >
                                  <EyeIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                  <span className="font-medium ">
                                    {/* {question.views} */}
                                  </span>
                                  <span className="sr-only">views</span>
                                </button>
                              </span>
                            </div>
                            <div className="flex text-sm">
                              <span className="inline-flex items-center text-sm">
                                <button
                                  type="button"
                                  className="inline-flex space-x-2 text-gray-400 hover:text-gray-500"
                                >
                                  <ShareIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                  <span className="font-medium ">Share</span>
                                </button>
                              </span>
                            </div>
                          </div>
                        </article>
                      </li>
                    ))}
                  </ul>
                </div>
              </main>
              <aside className="hidden xl:block  xl:col-span-4">
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
                            {whoToFollow.map((user) => (
                              <li
                                key={user.handle}
                                className="flex items-center py-4 space-x-3"
                              >
                                <div className="flex-shrink-0">
                                  <img
                                    className="h-16 w-16 rounded-full"
                                    src={user.imageUrl}
                                    alt=""
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium ">
                                    <a href={user.href}>{user.name}</a>
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    <a href={user.href}>{"@" + user.handle}</a>
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
