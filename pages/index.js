import Head from "next/head";
import React, { useState, useEffect } from "react";
import { AllProducts, Flashsales, HeroBanner } from "../components";
import { useAppContext } from "../context/AppContext";
import { getSession, useSession, signOut } from "next-auth/react";

export default function Home({
  products,
  flashsale_timer,
  flashsale_products,
  productTypes,
}) {
  const {
    flashsaleProducts,
    setFlashsaleProducts,
    setProductTypes,
    setProducts,
    setFlashsaleTimer,
    flashsaleTimerSwitch,
    setFlashsaleTimerSwitch,
    setUserInfo,
  } = useAppContext();

  const { data: session } = useSession();

  const [userStatus, setUserStatus] = useState(null);

  useEffect(() => {
    const userData = window.localStorage.getItem("UserData");

    if (session && session.user && session.user.name) {
      if (userData === null || userData === "undefined") {
        window.localStorage.setItem("UserData", JSON.stringify(session.user));
        setUserInfo(session.user);
        setUserStatus(session.user);
      }
    } else {
      if (userData !== null || userData !== "undefined") {
        console.log(userData.error);
        // if (userData["error"]) {
        //   console.log(userData["error"]);

        //   window.localStorage.removeItem("UserData");
        //   setUserInfo(null);
        //   setUserStatus(null);
        //   signOut({ callbackUrl: "/" });
        // } else console.log(userData);
      } else console.log("No user data");
    }
  }, [session, setUserInfo]);

  useEffect(() => {
    if (products.length !== 0) {
      window.localStorage.setItem("ProductsData", JSON.stringify(products));
      setProducts(JSON.parse(window.localStorage.getItem("ProductsData")));
    }

    if (flashsale_products.length !== 0) {
      setFlashsaleProducts(flashsale_products);
    }

    if (productTypes.length !== 0) {
      setProductTypes(productTypes);
    }

    if (flashsale_timer.length !== 0) {
      const activeFlashsaleDatetime = flashsale_timer[0].when;

      const activeFlashsaleDate = new Date(activeFlashsaleDatetime).getTime();

      window.localStorage.setItem(
        "FlashsaleTimeMilliseconds",
        activeFlashsaleDate
      );

      setFlashsaleTimer(
        window.localStorage.getItem("FlashsaleTimeMilliseconds")
      );

      if (Date.now() > activeFlashsaleDate) {
        setFlashsaleTimerSwitch(false);
      } else {
        setFlashsaleTimerSwitch(true);
      }
    }
  }, [
    flashsale_products,
    flashsale_timer,
    productTypes,
    products,
    setFlashsaleProducts,
    setFlashsaleTimer,
    setFlashsaleTimerSwitch,
    setProductTypes,
    setProducts,
  ]);

  return (
    <section className="">
      <Head>
        <title>Mercurius | Best Thrift Store in Nigeria</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="z-10">
        <HeroBanner />
      </section>

      {flashsaleTimerSwitch && (
        <section className="my-6">
          <Flashsales />
        </section>
      )}

      <section className="mt-3 mb-3 bg-[#fcfcfc]">
        <AllProducts />
      </section>
    </section>
  );
}

export const getServerSideProps = async ({ req }) => {
  const products = await fetch(
    "https://mercurius-backend.up.railway.app/api/inventory/"
  ).then((res) => res.json());

  const flashsale_timer = await fetch(
    "https://mercurius-backend.up.railway.app/api/inventory/f/"
  ).then((res) => res.json());

  const flashsale_products = await fetch(
    "https://mercurius-backend.up.railway.app/api/inventory/f/all/"
  ).then((res) => res.json());

  const productTypes = await fetch(
    "https://mercurius-backend.up.railway.app/api/inventory/pt/"
  ).then((res) => res.json());

  return {
    props: {
      products,
      flashsale_timer,
      flashsale_products,
      productTypes,
    },
  };
};

