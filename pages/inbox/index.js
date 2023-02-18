import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { signOut } from "next-auth/react";
import { Sidebar2, StorehouseTimer } from "../../components";
import { FiMenu, FiPackage, FiEdit } from "react-icons/fi";
import { FaEnvelope, FaHeart } from "react-icons/fa";
import { MdClose, MdInventory } from "react-icons/md";
import { ImUser } from "react-icons/im";
import { RiLogoutBoxFill } from "react-icons/ri";
import { useRouter } from "next/router";
import { PaystackButton } from "react-paystack";

const Inbox = () => {
  const router = useRouter();

  const {
    appState: { cart, wishlist },
    appStateDispatch,
    addToCart,
    removeFromWishlist,
    numbersWithCommas,
    userInfo,
    setUserInfo,
  } = useAppContext();

  const [userStatus, setUserStatus] = useState(null);
  const [userInbox, setUserInbox] = useState(null);

  const sidebarLinks = [
    {
      name: "Account",
      url: "/account",
      icon: <ImUser size={20} className="mr-2" />,
    },
    {
      name: "Favourites",
      url: "/favourites",
      icon: <FaHeart size={20} className="mr-2" />,
    },
    {
      name: "Orders",
      url: "/orders",
      icon: <FiPackage size={20} className="mr-2" />,
    },
    {
      name: "Inbox",
      url: "/inbox",
      icon: <FaEnvelope size={20} className="mr-2" />,
      active: true,
    },
    {
      name: "Storehouse",
      url: "/storehouse",
      icon: <MdInventory size={20} className="mr-2" />,
    },
    {
      name: "Log Out",
      url: null,
      icon: <RiLogoutBoxFill size={20} className="mr-2" />,
    },
  ];

  const [asideOpen, setAsideOpen] = useState(false);

  const handleSignOut = () => {
    window.localStorage.removeItem("UserData");
    setUserInfo(null);
    setUserStatus(null);
    signOut({ callbackUrl: "/register" });
  };

  useEffect(() => {
    if (typeof window !== "undefined" || typeof window !== null) {
      if (
        (window.localStorage.getItem("UserData") &&
          userStatus === "undefined") ||
        (window.localStorage.getItem("UserData") && userStatus === null)
      ) {
        setUserStatus(JSON.parse(window.localStorage.getItem("UserData")));
      } else if (!window.localStorage.getItem("UserData")) {
        window.localStorage.removeItem("UserData");
        toast.error("Please login with your email and password!");
        setUserInfo(null);
        setUserStatus(null);
        signOut({ callbackUrl: "/login" });
      } else {
        fetch("https://mercurius-backend.up.railway.app/api/users/verify/", {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(userStatus),
        })
          .then((res) => res.json())
          .then((userStatusRes) => {
            window.localStorage.setItem(
              "UserData",
              JSON.stringify(userStatusRes)
            );
            setUserInfo(userStatusRes);
            setUserStatus(userStatusRes);
            return userStatusRes;
          });
      }

      if (window.localStorage.getItem("UserData")) {
        const user = JSON.parse(window.localStorage.getItem("UserData"));
        if (user.id) {
          const allInbox = fetch(`https://mercurius-backend.up.railway.app/api/inbox/${user.id}/`)
            .then((res) => res.json())
            .then((res) => {
              setUserInbox(res);
            });
        }
      }
    }
  }, []);

  const markAsRead = (inbox) => {

    if (inbox.has_been_read === false) {
      inbox.has_been_read = true;
      console.log("Updated Inbox", inbox);

      fetch(`https://mercurius-backend.up.railway.app/api/inbox/${inbox.user}/${inbox.id}/`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(inbox),
      })
        .then((res) => res.json())
        .then((res) => {
          router.reload(window.location.pathname);
        });
    }
  };


  return (
    <section className="w-[85%] mx-auto max-w-screen-xl">
      <Head>
        <title>Mercurius | Inbox | Best Thrift Store in Nigeria</title>
      </Head>

      {userStatus && userStatus.error ? (
        <section className="w-full p-12 grid place-items-center text-center">
          <h4 className="text-xl text-primary text-center">
            Please, complete your Account registration. Or Login with your
            registered email address!
          </h4>
          <Link href="/register">
            <button
              className="bg-black rounded-md mt-5 px-5 py-3 text-white hover:bg-primary cursor-pointer w-fit"
              onClick={()=>handleSignOut()}
            >
              Register
            </button>
          </Link>
        </section>
      ) : (
        <section className="w-full flex flex-col items-start justify-start my-10">
          <h1 className="text-2xl sm2:text-3xl md2:text-4xl text-primary font-dalek">
            Settings
          </h1>

          <section className="w-full flex items-start justify-start mt-8">
            <section className="flex flex-col h-full items-start sticky top-0 left-0 mr-5 md:mr-7">
              <section className="grid place-items-center md:hidden w-[40px] h-[40px] ml-1 font-bold duration-300 cursor-pointer">
                {asideOpen ? (
                  <MdClose
                    size={25}
                    className="text-primary"
                    onClick={() => setAsideOpen(false)}
                  />
                ) : (
                  <FiMenu
                    size={25}
                    className="text-black"
                    onClick={() => setAsideOpen(true)}
                  />
                )}
              </section>

              <section
                className={`bg-black ${
                  asideOpen ? "w-[175px] duration-300" : "w-[60px]"
                } md:w-[200px] h-full px-[15px] py-[20px] md:px-[20px] md:py-[35px] flex items-start justify-between relative duration-300`}
              >
                <Sidebar2 links={sidebarLinks} asideOpen={asideOpen} />
              </section>
            </section>

            <section
              className={`bg-[#F1F1F1] w-[100%] flex flex-col items-center justify-center scroll-smooth z-10 duration-500`}
            >
              <section className="w-full sticky top-0 left-0 bg-black px-4 py-3 md:px-6 md:py-4 mb-5 md:mb-8">
                <h3 className="text-xl text-white">Inbox</h3>
              </section>

              <section
                className={`w-full h-fit flex flex-col items-center justify-center px-4 py-3 md:px-6 md:py-4 ${
                  asideOpen ? "" : ""
                } overflow-x-hidden scrollbar-thin scrollbar-track-gray-300 scrollbar-thumb-primary scroll-smooth space-y-3 duration-500`}
              >
                {userInbox && userInbox.length <= 0 ? (
                  <section className="w-full rounded-md mt-6 mb-12 p-4 flex flex-col items-center justify-center">
                    <h4 className="text-primary text-center">
                      You have no notification in your Inbox...
                    </h4>
                  </section>
                ) : (
                  <section className="w-[100%] space-y-6">
                    {userInbox &&
                      userInbox.map((inbox) => {
                        const sentDate = new Date(
                          inbox.created_at
                        ).toLocaleString();

                        return (
                          <section
                            className="w-full bg-white rounded-md flex flex-col space-y-0 items-center dark:text-black"
                            key={inbox.id}
                          >
                            <section className="w-full rounded-md p-4 flex flex-col md2:flex-row items-start justify-between">
                              <section className="flex flex-col items-start space-y-2 w-full mb-2 md2:w-[65%] m2:mb-2">
                                <section className="text-lg capitalise text-black">
                                  {inbox.subject}
                                </section>
                                <section className="text-md text-[#868686]">
                                  {sentDate}
                                </section>
                              </section>

                              <button
                                className="bg-primary rounded-sm px-3 py-2 md2:px-5 md2:py-3 text-white hover:bg-black cursor-pointer w-full md2:w-fit"
                                onClick={() => markAsRead(inbox)}
                              >
                                Mark as Read
                              </button>
                            </section>

                            <section className="w-full rounded-md px-4 pt-0 pb-4 flex flex-col">
                              {inbox.message}
                            </section>
                          </section>
                        );
                      })}
                  </section>
                )}
              </section>
            </section>
          </section>
        </section>
      )}
    </section>
  );
};

export default Inbox;
