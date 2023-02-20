import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { signOut } from "next-auth/react";
import { Sidebar2, StorehouseTimer } from "../components";
import { FiMenu, FiPackage, FiEdit } from "react-icons/fi";
import { FaEnvelope, FaHeart } from "react-icons/fa";
import { MdClose, MdInventory } from "react-icons/md";
import { ImUser } from "react-icons/im";
import { RiLogoutBoxFill } from "react-icons/ri";
import { useRouter } from "next/router";
import { PaystackButton } from "react-paystack";
import Image from "next/image";

const Storehouse = () => {
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
  const [userOrders, setUserOrders] = useState(null);
  const [storehouseOrders, setStorehouseOrders] = useState(null);
  const [shippingFee, setShippingFee] = useState(null);
  const [salesTax, setSalesTax] = useState(null);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [shippingDestination, setShippingDestination] = useState(null);
  const [shipAllOrdersCharges, setShipAllOrdersCharges] = useState(null);
  const [allOrderIdsArr, setAllOrderIdsArr] = useState(null);

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
    },
    {
      name: "Storehouse",
      url: "/storehouse",
      icon: <MdInventory size={20} className="mr-2" />,
      active: true,
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
          const allOrders = fetch(
            `https://mercurius-backend.up.railway.app/api/orders/${user.id}/`
          )
            .then((res) => res.json())
            .then((res) => {
              if (res.length > 0) {
                const shos = res.filter(
                  (sho) =>
                    sho.storehouse_order.length > 0 &&
                    sho.storehouse_order[0].has_been_paid === false
                );

                setUserOrders(res);
                setStorehouseOrders(shos);

                const numOfItems = [];
                for (let ord of shos) {
                  numOfItems.push(ord.ordered_items.length);
                }

                let totalNumOfItems = 0;
                for (let i in numOfItems) {
                  totalNumOfItems = totalNumOfItems + numOfItems[i];
                }

                setSalesTax(totalNumOfItems * 10);

                let averageOverdue = 0;

                const overduesArr = [];
                for (let i of shos) {
                  let bs = i.storehouse_order[0].billing_starts;
                  let bsd = new Date(bs).getTime();
                  let now = Date.now();
                  const msDays = 1000 * 60 * 60 * 24;
                  let atime = now - bsd;
                  let overdue = Math.round(atime / msDays);

                  if (overdue > 0) {
                    overduesArr.push(overdue);
                  }
                }

                if (overduesArr.length > 0) {
                  const numOfOverdues = overduesArr.length;
                  let sumOfOverdues = 0;
                  for (let o in overduesArr) {
                    sumOfOverdues = sumOfOverdues + o;
                  }

                  averageOverdue = sumOfOverdues / numOfOverdues;
                }

                const shipAllOrdersItemCost = totalNumOfItems * 100;

                const shipAllOrdersTotalItemCost =
                  shipAllOrdersItemCost * averageOverdue;

                setShipAllOrdersCharges(shipAllOrdersTotalItemCost);

                if (shos.length > 0) {
                  let allOrderIds = [];

                  for (let s of shos) {
                    allOrderIds.push(s.storehouse_order[0].id);
                  }

                  setAllOrderIdsArr(allOrderIds);
                }
              }
            });
        }
      }

      const shippingFee = fetch(
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

                const shippingDestination =
                  defaultAddresses && defaultAddresses.length > 0
                    ? defaultAddresses[0].state
                    : null;
                const sdArr = shippingDestination
                  ? shippingDestination.split(" ")
                  : null;
                const shippingFee =
                  sdArr && sdArr.length > 0
                    ? fetch(
                        `https://mercurius-backend.up.railway.app/api/orders/shippingrates/${sdArr[0]}/`
                      )
                        .then((res) => res.json())
                        .then((res) => {
                          if (res.detail) {
                            setShippingFee(3500);
                          } else {
                            setShippingFee(res.shipping_fee);
                          }
                        })
                    : setShippingFee(3500);
              }
            }
          }
        });
    }
  }, []);

  let shipAllOrders = {};

  if (allOrderIdsArr) {
    shipAllOrders = {
      email: userStatus && userStatus.email ? userStatus.email : "",
      amount: (shippingFee + salesTax + shipAllOrdersCharges) * 100,
      metadata: {
        // user_id: userStatus && userStatus.id ? userStatus.id : "",
        // order_id: order.id,
        // storehouse_order_id: order.storehouse_order[0].id,
        // order_reference: order.reference,
        // name: userStatus && userStatus.fullname ? userStatus.fullname : "",
        // phone: userStatus && userStatus.phone ? userStatus.phone : "",
        // email: userStatus && userStatus.email ? userStatus.email : "",
        // paymentType: `Ship Order`,
        // totalAmount: totalAmount,
        // storehouse_billings: total_cost,
        // shippingFee: shippingFee ? shippingFee : 0,
        // salesTax: order.ordered_items.length * 10,
        // billing_starts: bs,

        user_id: userStatus && userStatus.id ? userStatus.id : "",
        name: userStatus && userStatus.fullname ? userStatus.fullname : "",
        phone: userStatus && userStatus.phone ? userStatus.phone : "",
        email: userStatus && userStatus.email ? userStatus.email : "",
        paymentType: "Ship All Orders",
        totalAmount: Math.round(shippingFee + salesTax + shipAllOrdersCharges),
        shippingFee: shippingFee ? shippingFee : 0,
        salesTax: salesTax ? salesTax : 0,
        storehouse_items: allOrderIdsArr,
      },
      publicKey: process.env.NEXT_PUBLIC_PAYSTACK_TEXTMODE_PUBLIC_KEY,
      text: "Ship All Orders",
      // // callback_url: "http://localhost:3000/thankyou/",
      onSuccess: () => router.reload(window.location.pathname),
      onClose: () =>
        alert("Wait! Are you sure you want to ship orders individually?"),
    };
  }

  return (
    <section className="w-[85%] mx-auto max-w-screen-xl">
      <Head>
        <title>Mercurius | Storehouse | Best Thrift Store in Nigeria</title>
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
              onClick={handleSignOut}
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
                <h3 className="text-xl text-white">Storehouse</h3>
              </section>

              <section
                className={`w-full h-fit flex flex-col items-center justify-center px-4 py-3 md:px-6 md:py-4 ${
                  asideOpen ? "" : ""
                } overflow-x-hidden scrollbar-thin scrollbar-track-gray-300 scrollbar-thumb-primary scroll-smooth space-y-3 duration-500`}
              >
                {storehouseOrders && storehouseOrders.length <= 0 ? (
                  <section className="w-full rounded-md mt-6 mb-12 p-4 flex flex-col items-center justify-center">
                    <h4 className="text-primary text-center">
                      You have no orders in your Storehouse...
                    </h4>
                    <Link href="/">
                      <button className="bg-black rounded-md mt-5 px-5 py-3 text-white hover:bg-primary cursor-pointer w-fit">
                        Back to Shopping
                      </button>
                    </Link>
                  </section>
                ) : (
                  <section className="w-[100%] space-y-6">
                    <section className="w-full rounded-md mt-3 mb-5 p-2 flex flex-col items-center justify-center">
                      <p className="text-black text-center ">
                        Note: Shipping Fee will be charged
                      </p>

                      <section className="flex items-center justify-center space-x-6 mt-3 flex-wrap w-full">
                        <section className="dark:text-black">
                          Shipping Fee:{" "}
                          <span className="text-primary font-semibold font-dalek">
                            {shippingFee
                              ? `₦${numbersWithCommas(shippingFee)}`
                              : `₦${numbersWithCommas(0)}`}
                          </span>
                        </section>
                        <section className="dark:text-black">
                          Sales Tax:{" "}
                          <span className="text-primary font-semibold font-dalek">
                            {salesTax
                              ? `₦${numbersWithCommas(salesTax)}`
                              : `₦${numbersWithCommas(0)}`}
                          </span>
                        </section>

                        {shipAllOrdersCharges > 0 && (
                          <section className="dark:text-black">
                            Charges:{" "}
                            <span className="text-primary font-semibold font-dalek">
                              ₦{numbersWithCommas(shipAllOrdersCharges)}
                            </span>
                          </section>
                        )}
                      </section>

                      {defaultAddress ? (
                        <PaystackButton
                          className="bg-black rounded-md mt-5 px-5 py-3 text-white hover:bg-primary cursor-pointer w-fit"
                          {...shipAllOrders}
                        />
                      ) : (
                        <Link
                          href="/account/addresses/add-address/"
                          className="bg-black rounded-md flex items-center justify-center px-3 py-2 text-white hover:bg-primary cursor-pointer w-fit mt-5"
                        >
                          Add Shipping Address
                        </Link>
                      )}
                    </section>

                    {storehouseOrders &&
                      storehouseOrders.map((order) => {

                        const diArr = order.ordered_items
                          ? order.ordered_items.filter(
                              (item) =>
                                item.defaultImage.includes("placeholder") ===
                                false
                            )
                          : order.ordered_items.filter(
                              (item) =>
                                item.defaultImage.includes("placeholder") ===
                                true
                            )
                          ? order.ordered_items.filter(
                              (item) =>
                                item.defaultImage.includes("placeholder") ===
                                true
                            )
                          : null;

                        const di = diArr ? diArr[0] : null;

                        const diUrl = di
                          ? di.defaultImage.replace(/ /g, "%20")
                          : "#";

                        const paidDate = new Date(
                          order.paid_at
                        ).toLocaleString();

                        const bs = order.storehouse_order[0].billing_starts;
                        const bsd = new Date(bs).getTime();

                        let now = Date.now();
                        const msDays = 1000 * 60 * 60 * 24;
                        let atime = now - bsd;
                        let overdue = Math.round(atime / msDays);

                        const item_cost =
                          overdue > 0 ? order.ordered_items.length * 100 : 0;

                        const total_cost =
                          overdue > 0 ? item_cost * overdue : item_cost;
                        const totalAmount =
                          total_cost +
                          shippingFee +
                          order.ordered_items.length * 10;

                        // console.log(totalAmount);

                        const shipOrder = {
                          email:
                            userStatus && userStatus.email
                              ? userStatus.email
                              : "",
                          amount: totalAmount * 100,
                          metadata: {
                            user_id:
                              userStatus && userStatus.id ? userStatus.id : "",
                            order_id: order.id,
                            storehouse_order_id: order.storehouse_order[0].id,
                            order_reference: order.reference,
                            name:
                              userStatus && userStatus.fullname
                                ? userStatus.fullname
                                : "",
                            phone:
                              userStatus && userStatus.phone
                                ? userStatus.phone
                                : "",
                            email:
                              userStatus && userStatus.email
                                ? userStatus.email
                                : "",
                            paymentType: `Ship Order`,
                            totalAmount: totalAmount,
                            storehouse_billings: total_cost,
                            shippingFee: shippingFee ? shippingFee : 0,
                            salesTax: order.ordered_items.length * 10,
                            billing_starts: bs,
                            storehouse_items: [],
                          },
                          publicKey:
                            process.env
                              .NEXT_PUBLIC_PAYSTACK_TEXTMODE_PUBLIC_KEY,
                          text: "Ship Order",
                          // // callback_url: "http://localhost:3000/thankyou/",
                          onSuccess: () =>
                            router.reload(window.location.pathname),
                          onClose: () =>
                            alert("Wait! Are you sure you want to leave?"),
                        };

                        return (
                          <section
                            className="w-full bg-white rounded-md flex flex-col space-y-4 items-center"
                            key={order.id}
                          >
                            <section className="w-full rounded-md p-4 flex flex-col space-y-2 lg:space-y-0 lg:flex-row items-center justify-center lg:justify-between">
                              <section className="flex items-start justify-between w-[100%] flex-wrap">
                                <section className="w-[80px] h-[80px] md:w-[120px] md:h-[120px] md3:w-[150px] md3:h-[150px] hidden sm:block p-1">
                                  <Image
                                    src={diUrl}
                                    alt={order.reference}
                                    width={120}
                                    height={120}
                                    className="w-full h-full object-cover rounded-md"
                                  />
                                </section>

                                <section className="flex flex-col items-start space-y-2 w-full sm:w-[70%] md:w-[60%] md2:w-[70%] lg2:w-[55%] dark:text-black">
                                  <section className="text-lg uppercase">
                                    Order {order.reference && order.reference}
                                  </section>
                                  <section className="text-md text-[#868686]">
                                    No. of Items:{" "}
                                    {order.ordered_items &&
                                      order.ordered_items.length}
                                  </section>
                                  <section className="text-md text-[#868686]">
                                    Payment Type:{" "}
                                    {order.payment_type && order.payment_type}
                                  </section>
                                  <section className="text-md text-black font-semibold">
                                    Amount: ₦
                                    {numbersWithCommas(
                                      order.amount && order.amount
                                    )}
                                  </section>
                                </section>

                                {defaultAddress ? (
                                  <PaystackButton
                                    className="bg-primary rounded-sm px-5 py-3 text-white hover:bg-black cursor-pointer w-full mt-3 lg2:w-fit lg2:mt-0"
                                    {...shipOrder}
                                  />
                                ) : (
                                  <Link
                                    href="/account/addresses/add-address/"
                                    className="bg-primary rounded-sm px-5 py-3 text-white hover:bg-black cursor-pointer w-full mt-3 lg2:w-fit lg2:mt-0"
                                  >
                                    Add Shipping Address
                                  </Link>
                                )}
                              </section>
                            </section>

                            <section className="bg-red-600 text-white w-full p-2 flex items-center justify-center">
                              {bsd > now ? (
                                <section className="flex items-center justify-center">
                                  FREE Storekeeping Ends In:
                                  <StorehouseTimer
                                    billing_starts={
                                      order.storehouse_order[0].billing_starts
                                    }
                                  />
                                </section>
                              ) : (
                                <section className="flex items-center justify-center space-x-6 flex-wrap">
                                  <section className="">
                                    Overdue:{" "}
                                    <span className="font-dalek text-md">
                                      {overdue} Days
                                    </span>
                                    ,
                                  </section>
                                  <section className="">
                                    Charges:{" "}
                                    <span className="font-dalek text-md">
                                      ₦{numbersWithCommas(total_cost)}
                                    </span>
                                  </section>
                                  ,
                                  <section className="">
                                    Shipping Fee:{" "}
                                    <span className="font-dalek text-md">
                                      ₦{numbersWithCommas(shippingFee)}
                                    </span>
                                  </section>
                                  ,
                                  <section className="">
                                    Sales Tax:{" "}
                                    <span className="font-dalek text-md">
                                      ₦
                                      {numbersWithCommas(
                                        order.ordered_items.length * 10
                                      )}
                                    </span>
                                  </section>
                                </section>
                              )}
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

export default Storehouse;
