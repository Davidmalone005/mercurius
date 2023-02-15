import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useAppContext } from "../context/AppContext";
import { MdAdd, MdCheck, MdClose } from "react-icons/md";
import Link from "next/link";
import placeholderImg from "../public/assets/placeholder.png";
import Image from "next/image";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { signOut } from "next-auth/react";

const Thankyou = () => {
  const [userStatus, setUserStatus] = useState(null);

  const {
    appState: { cart },
    totalPrice,
    numbersWithCommas,
    setUserInfo,
  } = useAppContext();

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
        fetch("http://localhost:8000/api/users/verify/", {
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
    }
  }, [setUserInfo, userStatus]);

  return (
    <section className="w-[85%] mx-auto max-w-screen-xl">
      <Head>
        <title>Mercurius | Thank You | Best Thrift Store in Nigeria</title>
      </Head>

      <section className="w-full p-12 grid place-items-center text-center">
        <h4 className="text-xl text-primary text-center">Thank You!!!</h4>
        <p className="mt-3 dark:text-black">
          For buying from us, your orders have been received...
        </p>
        <Link href="/orders">
          <button className="bg-black rounded-md mt-5 px-5 py-3 text-white hover:bg-primary cursor-pointer w-fit">
            View Orders
          </button>
        </Link>
      </section>
    </section>
  );
};

export default Thankyou;
