import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { signOut } from "next-auth/react";
import { Sidebar2 } from "../../components";
import { FiMenu, FiPackage, FiEdit } from "react-icons/fi";
import { FaEnvelope, FaHeart } from "react-icons/fa";
import { MdClose, MdInventory } from "react-icons/md";
import { ImUser } from "react-icons/im";
import { RiLogoutBoxFill } from "react-icons/ri";
import { useRouter } from "next/router";
import { BsArrowLeft } from "react-icons/bs";
import Image from "next/image";

const OrderDetails = () => {
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
  const [order, setOrder] = useState(null);
  const [address, setAddress] = useState(null);

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
      active: true,
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

      if (window.localStorage.getItem("Orders")) {
        const orders = JSON.parse(window.localStorage.getItem("Orders"));

        const pathnameArr = window.location.pathname.split("/");
        const reference = pathnameArr[pathnameArr.length - 1];

        const order = orders.filter(
          (order) => order.reference.toString() === reference
        );

        setOrder(order[0]);

        const allAddresses = fetch("https://mercurius-backend.up.railway.app/api/addresses/")
          .then((res) => res.json())
          .then((res) => {
            if (res.length > 0) {
              if (window.localStorage.getItem("UserData")) {
                const user = JSON.parse(
                  window.localStorage.getItem("UserData")
                );
                if (user.id) {
                  const addresses = res.filter(
                    (address) => address.user === user.id
                  );

                  const defaultAddresses = addresses.filter(
                    (address) => address.is_default === true
                  );

                  setAddress(defaultAddresses[0]);
                }
              }
            }
          });
      }
    }
  }, []);


  return (
    <section className="w-[85%] mx-auto max-w-screen-xl">
      <Head>
        <title>
          Mercurius | Order {order && order.reference} | Best Thrift Store in
          Nigeria
        </title>
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
              <section className="w-full sticky top-0 left-0 bg-black text-white px-4 py-3 md:px-6 md:py-4 mb-5 md:mb-8 flex items-center justify-start z-10">
                <Link href="/orders">
                  <BsArrowLeft
                    size={25}
                    className="p-0 m-0 mr-4 cursor-pointer hover:text-primary duration-300"
                  />
                </Link>
                <h3 className="text-xl">Order {order && order.reference}</h3>
              </section>

              <section
                className={`w-full h-fit flex flex-col items-center justify-center px-4 py-3 md:px-6 md:py-4 ${
                  asideOpen ? "" : ""
                } overflow-x-hidden scrollbar-thin scrollbar-track-gray-300 scrollbar-thumb-primary scroll-smooth space-y-3 duration-500`}
              >
                {order && (
                  <section className="w-full bg-white rounded-md p-4 flex flex-col space-y-4 items-center justify-center dark:text-black">
                    <section className="w-full flex flex-col space-y-2 items-start justify-center">
                      <section className="w-full bg-black text-white px-5 py-3 mb-3 md:mb-5 flex items-center justify-start">
                        <h4 className="text-lg">
                          Order No: {order && order.transaction_id}
                        </h4>
                      </section>

                      <section className="w-full text-[#868686] px-5 mb-3 md:mb-5 flex items-center justify-start">
                        Order Placed On:{" "}
                        {new Date(order.paid_at).toLocaleString()}
                      </section>

                      <section className="w-full text-[#868686] px-5 mb-3 md:mb-5 flex items-center justify-start">
                        Items: {order.ordered_items.length}
                      </section>

                      <section className="w-full text-[#868686] px-5 mb-3 md:mb-5 flex items-center justify-start">
                        Amount: ₦{numbersWithCommas(order.amount)}
                      </section>
                    </section>

                    <section className="w-full flex flex-col space-y-2 items-start justify-center">
                      <section className="w-full bg-black text-white px-5 py-3 mb-3 md:mb-5 flex items-center justify-start">
                        <h4 className="text-lg">
                          Order Items ({order && order.ordered_items.length})
                        </h4>
                      </section>

                      <section className="w-full flex flex-col space-y-4 items-center justify-center">
                        {order &&
                          order.ordered_items.map((item) => {
                            const di = item.defaultImage;

                            const diUrl =
                              "https://res.cloudinary.com/dxhq8jlxf/" +
                              di.replace(/ /g, "%20");

                            return (
                              <section
                                className="w-full flex flex-row xl:space-x-6 items-start justify-between flex-wrap text-[#868686]"
                                key={item.id}
                              >
                                <section className="w-[80px] h-[80px] md:w-[120px] md:h-[120px] md3:w-[135px] md3:h-[135px] hidden sm:block p-1">
                                  <Image
                                    src={diUrl}
                                    alt={order.reference}
                                    width={120}
                                    height={120}
                                    className="w-full h-full object-cover rounded-md"
                                  />
                                </section>

                                <section className="flex flex-col items-center text-center sm:text-left sm:items-start space-y-2 w-full sm:w-[65%] sm3:w-[75%] md:w-[58%] md2:w-[6535 lg:w-[70%] lg2:w-[40%] py-4">
                                  <section className="text-lg uppercase text-black">
                                    {item.name}
                                  </section>
                                  <section className="text-md">
                                    {item.description}
                                  </section>
                                </section>

                                {item.size && (
                                  <section className="flex flex-col items-center space-y-2 w-full md2:w-[30%] lg2:w-fit py-4">
                                    <section className="text-lg uppercase text-black">
                                      Size
                                    </section>
                                    <section className="text-md">
                                      {item.size}
                                    </section>
                                  </section>
                                )}

                                <section
                                  className={`flex flex-col items-center space-y-2 w-full sm2:w-[48%] ${
                                    item.size && "md2:w-[30%]"
                                  } lg2:w-fit py-4`}
                                >
                                  <section className="text-lg uppercase text-black">
                                    Quantity
                                  </section>
                                  <section className="text-md">
                                    x{item.qty}
                                  </section>
                                </section>

                                <section
                                  className={`flex flex-col items-center space-y-2 w-full sm2:w-[48%] ${
                                    item.size && "md2:w-[30%] "
                                  } lg2:w-fit py-4`}
                                >
                                  <section className="text-lg uppercase text-black">
                                    Amount
                                  </section>
                                  <section className="text-md">
                                    ₦{numbersWithCommas(item.price)}
                                  </section>
                                </section>
                              </section>
                            );
                          })}
                      </section>

                      <section className="w-full flex flex-col space-y-2 items-start justify-center">
                        <section className="w-full bg-black text-white px-5 py-3 mb-3 md:mb-5 flex items-center justify-start">
                          <h4 className="text-lg">Payment Info</h4>
                        </section>

                        <section className="w-full text-[#868686] px-5 mb-3 md:mb-5 flex items-center justify-start capitalize">
                          Payment Method: {order.payment_method}
                        </section>

                        <section className="w-full text-[#868686] px-5 mb-3 md:mb-5 flex items-center justify-start">
                          Shipping Fee: ₦{numbersWithCommas(order.shipping_fee)}
                        </section>

                        <section className="w-full text-[#868686] px-5 mb-3 md:mb-5 flex items-center justify-start">
                          Sales Tax: ₦{numbersWithCommas(order.sales_tax)}
                        </section>

                        <section className="w-full text-[#868686] px-5 mb-3 md:mb-5 flex items-center justify-start">
                          Total: ₦{numbersWithCommas(order.amount)}
                        </section>
                      </section>

                      <section className="w-full flex flex-col space-y-2 items-start justify-center">
                        <section className="w-full bg-black text-white px-5 py-3 mb-3 md:mb-5 flex items-center justify-start">
                          <h4 className="text-lg">Shipping Address</h4>
                        </section>

                        {address ? (
                          <section className="w-full text-[#868686] px-5 mb-3 md:mb-5 flex items-center justify-start capitalize">
                            <p>
                              No. {address.house_no && address.house_no},{" "}
                              {address.street_name && address.street_name},{" "}
                              <br />
                              {address.bus_stop && address.bus_stop},{" "}
                              {address.lga && address.lga}{" "}
                              {address.postal_code &&
                                address.postal_code !== 0 &&
                                address.postal_code}
                              , <br />
                              {address.state && address.state},{" "}
                              {address.country && address.country}.
                            </p>
                          </section>
                        ) : (
                          <section className="w-full text-[#868686] px-5 mb-3 md:mb-5 flex items-center justify-start capitalize">
                            <p>No Shipping Address Set</p>
                          </section>
                        )}
                      </section>
                    </section>

                    {/* <section className="flex items-start justify-between w-[100%] flex-wrap">
                      <section className="w-[80px] h-[80px] md:w-[120px] md:h-[120px] md3:w-[150px] md3:h-[150px] hidden sm:block p-1">
                        <img
                          src={diUrl}
                          alt={order.reference}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </section>

                      <section className="flex flex-col items-start space-y-2 w-full sm:w-[70%] md:w-[60%] md2:w-[70%] lg2:w-[55%]">
                        <section className="text-lg uppercase">
                          Order {order.reference} - {paidDate}
                        </section>
                        <section className="text-md text-[#868686]">
                          No. of Items: {order.ordered_items.length}
                        </section>
                        <section className="text-md text-[#868686]">
                          Payment Type: {order.payment_type}
                        </section>
                        <section className="text-md text-black font-semibold">
                          Amount: ₦{numbersWithCommas(order.amount)}
                        </section>
                      </section>

                      <Link href={`/orders/${order.reference}`}>
                        <button className="bg-primary rounded-sm px-5 py-3 text-white hover:bg-black cursor-pointer w-full mt-3 lg2:w-fit lg2:mt-0">
                          View Details
                        </button>
                      </Link>
                    </section> */}
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

export default OrderDetails;
