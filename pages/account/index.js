import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { signOut } from "next-auth/react";
import { Sidebar } from "../../components";
import { FiMenu, FiPackage, FiEdit } from "react-icons/fi";
import { FaEnvelope, FaHeart } from "react-icons/fa";
import { MdClose, MdInventory } from "react-icons/md";
import { ImUser } from "react-icons/im";
import { RiLogoutBoxFill } from "react-icons/ri";
import { useRouter } from "next/router";

const Account = ({}) => {
  const router = useRouter();
  const [userStatus, setUserStatus] = useState(null);

  const [isUserStatus, setIsUserStatus] = useState(false);

  const {
    appState: { cart },
    tabbed,
    setTabbed,
    setUserInfo,
  } = useAppContext();

  const handleSignOut = () => {
    window.localStorage.removeItem("UserData");
    setUserInfo(null);
    setUserStatus(null);
    signOut({ callbackUrl: "/register" });
  };

  const sidebarLinks = [
    {
      name: "Account",
      url: "/account",
      icon: <ImUser size={20} className="mr-2" />,
      active: true,
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
  const [defaultAddress, setDefaultAddress] = useState(null);

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

      const allAddresses = fetch(
        "https://mercurius-backend.up.railway.app/api/addresses/"
      )
        .then((res) => res.json())
        .then((res) => {
          if (res.length > 0) {
            if (window.localStorage.getItem("UserData")) {
              const user = JSON.parse(window.localStorage.getItem("UserData"));
              if (user.id) {
                const addresses = res.filter(
                  (address) => address.user === user.id
                );

                const defaultAddresses = addresses
                  ? addresses.filter((address) => address.is_default === true)
                  : null;

                setDefaultAddress(
                  defaultAddresses ? defaultAddresses[0] : null
                );
              }
            }
          }
        });
    }
  }, []);



  return (
    <section className="w-[85%] mx-auto max-w-screen-xl">
      <Head>
        <title>Mercurius | Account | Best Thrift Store in Nigeria</title>
      </Head>

      {userStatus && userStatus.error ? (
        <section className="w-full p-12 grid place-items-center text-center">
          <h4 className="text-xl text-primary text-center">
            Please, complete your Account registration. Or Login with your
            registered email address!
          </h4>
          <Link href="#">
            <button
              className="bg-black rounded-md mt-5 px-5 py-3 text-white hover:bg-primary cursor-pointer w-fit"
              onClick={() => handleSignOut()}
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
              <section className="grid place-items-center sm2:hidden w-[40px] h-[40px] ml-1 font-bold duration-300 cursor-pointer">
                {/* grid place-items-center sm2:hidden w-[40px] h-[40px] absolute
                -top-[40px] left-[8px] font-bold duration-300 cursor-pointer */}
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
                } sm2:w-[200px] h-full px-[15px] py-[20px] md:px-[20px] md:py-[35px] flex items-start justify-between relative duration-300`}
              >
                <Sidebar links={sidebarLinks} asideOpen={asideOpen} />
              </section>
            </section>

            <section
              className={`bg-[#F1F1F1] w-[100%] flex flex-col items-center justify-center scroll-smooth duration-500`}
            >
              {/* whitespace-nowrap overflow-x-scroll scrollbar-none */}
              <section className="w-full sticky top-0 left-0 bg-black px-4 py-3 md:px-6 md:py-4 mb-5 md:mb-8">
                <h3 className="text-xl text-white">Account</h3>
              </section>

              <section
                className={`w-full h-fit flex flex-col items-center justify-center px-4 py-3 md:px-6 md:py-4 ${
                  asideOpen ? "" : ""
                } overflow-x-hidden scrollbar-thin scrollbar-track-gray-300 scrollbar-thumb-primary scroll-smooth space-y-3 duration-500 dark:text-black`}
              >
                <section className="w-full bg-white rounded-md p-4">
                  <section className="flex items-start justify-between mb-6">
                    <h3 className="text-lg text-black font-semibold">
                      Account Details
                    </h3>
                    <Link
                      href="/account/account-details"
                      className="cursor-pointer hover:text-primary duration-300"
                    >
                      <FiEdit size={25} className="p-0 m-0" />
                    </Link>
                  </section>

                  <section className="flex flex-col items-start text-[#868686] space-y-1 w-full">
                    <p>
                      {userStatus && userStatus.fullname
                        ? userStatus.fullname
                        : "John Doe"}
                    </p>
                    <p>
                      {userStatus && userStatus.email
                        ? userStatus.email
                        : "johndoe@gmail.com"}
                    </p>
                    <p>
                      {userStatus && userStatus.phone
                        ? userStatus.phone
                        : "+2348012345678"}
                    </p>
                  </section>
                </section>
              </section>

              <section
                className={`w-full h-fit flex flex-col items-center justify-center px-4 py-3 md:px-6 md:py-4 ${
                  asideOpen ? "" : ""
                } overflow-x-hidden scrollbar-thin scrollbar-track-gray-300 scrollbar-thumb-primary scroll-smooth space-y-3 duration-500 dark:text-black`}
              >
                <section className="w-full bg-white rounded-md p-4">
                  <section className="flex items-start justify-between mb-6">
                    <h3 className="text-lg text-black font-semibold">
                      Shipping Address
                    </h3>
                    <Link
                      href="/account/addresses"
                      className="cursor-pointer hover:text-primary duration-300"
                    >
                      <FiEdit size={25} className="p-0 m-0" />
                    </Link>
                  </section>

                  {defaultAddress && defaultAddress.id ? (
                    <section className="flex flex-col items-start text-[#868686] space-y-1 w-full sm:w-[50%] md:w-[35%]">
                      <p>
                        No. {defaultAddress.house_no},{" "}
                        {defaultAddress.street_name}, {defaultAddress.bus_stop},{" "}
                        {defaultAddress.lga}{" "}
                        {defaultAddress.postal_code !== 0 &&
                          defaultAddress.postal_code}
                        , {defaultAddress.state}, {defaultAddress.country}.
                      </p>
                    </section>
                  ) : (
                    <section className="flex flex-col items-start text-[#868686] space-y-1 w-full sm:w-[50%] md:w-[35%]">
                      <p>No default shipping address set</p>
                    </section>
                  )}
                </section>
              </section>

              <section
                className={`w-full h-fit flex flex-col items-center justify-center px-4 py-3 md:px-6 md:py-4 ${
                  asideOpen ? "" : ""
                } overflow-x-hidden scrollbar-thin scrollbar-track-gray-300 scrollbar-thumb-primary scroll-smooth space-y-3 duration-500 dark:text-black`}
              >
                <section className="w-full bg-white rounded-md p-4">
                  <section className="flex items-start justify-between mb-0">
                    <h3 className="text-lg text-black font-semibold">
                      Change Password
                    </h3>
                    <Link
                      href="/account/change-password"
                      className="cursor-pointer hover:text-primary duration-300"
                    >
                      <FiEdit size={25} className="p-0 m-0" />
                    </Link>
                  </section>
                </section>
              </section>

              <section
                className={`w-full h-fit flex flex-col items-center justify-center px-4 py-3 md:px-6 md:py-4 ${
                  asideOpen ? "" : ""
                } overflow-x-hidden scrollbar-thin scrollbar-track-gray-300 scrollbar-thumb-primary scroll-smooth space-y-3 duration-500 dark:text-black`}
              >
                <section className="w-full bg-white rounded-md p-4">
                  <section className="flex items-start justify-between mb-0">
                    <h3 className="text-lg text-black font-semibold">
                      Select Currency
                    </h3>

                    <p className="text-primary">Nigeria (NGN)</p>
                    {/* <FiEdit size={25} className="p-0 m-0" /> */}
                  </section>
                </section>
              </section>
            </section>
          </section>
        </section>
      )}
    </section>
  );
};

export default Account;
