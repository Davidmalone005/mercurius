import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useAppContext } from "../context/AppContext";
import Link from "next/link";
import { PaystackButton } from "react-paystack";
import toast from "react-hot-toast";
import { getSession, useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import placeholderImg from "../public/assets/placeholder.png";
import Image from "next/image";

const Checkout = ({}) => {
  const router = useRouter();

  const {
    appState: { cart },
    totalPrice,
    totalAmount,
    shipping,
    setShipping,
    salesTax,
    setSalesTax,
    numbersWithCommas,
    tabbed,
    setTabbed,
    setUserInfo,
    totalAmountWithShippingNtax,
    totalCartAmt,
    setTotalCartAmt,
  } = useAppContext();

  const [userStatus, setUserStatus] = useState(null);

  const handleSignOut = () => {
    window.localStorage.removeItem("UserData");
    setUserInfo(null);
    setUserStatus(null);
    signOut({ callbackUrl: "/register" });
  };

  const shippingCost = cart.length * 100;
  const salesTaxCost = cart.length * 10;
  const couponPercent = 0;
  const couponAmountInit = Math.round((couponPercent / 100) * totalPrice);
  const couponAmount = Math.round(totalPrice - couponAmountInit);

  const [items, setItems] = useState([]);
  const [coupons, setCoupons] = useState([]);

  const [defaultAddress, setDefaultAddress] = useState(null);

  setSalesTax(salesTaxCost);

  const [totalAmountAfterCoupons, setTotalAmountAfterCoupons] = useState(null);

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

        if (window.localStorage.getItem("TotalAmountAfterCoupons")) {
          setTotalAmountAfterCoupons(
            JSON.parse(window.localStorage.getItem("TotalAmountAfterCoupons"))
          );
        }
      }

      if (window.localStorage.getItem("cart")) {
        const newCart = JSON.parse(window.localStorage.getItem("cart"));

        const bgUrl = (imgUrl) =>
          "https://res.cloudinary.com/dxhq8jlxf/" + imgUrl.replace(/ /g, "%20");

        const itemsArr = newCart.map((item) => {
          const fi =
            item.product_images.length !== 0
              ? item.product_images.filter((image) => image.is_feature == true)
              : null;

          const fiUrl = fi
            ? "https://res.cloudinary.com/dxhq8jlxf/" +
              fi[0].product_images.replace(/ /g, "%20")
            : "https://res.cloudinary.com/dxhq8jlxf/image/upload/v1673892491/Product%20Images/placeholder_sqmnxa.png";

          return {
            name: item.name,
            description: item.description,
            price: item.price,
            qty: item.qty,
            size: item.size ? item.size : "",
            defaultImage: fiUrl,
          };
        });

        setItems(itemsArr);
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

                const defaultAddresses = addresses.filter(
                  (address) => address.is_default === true
                );

                setDefaultAddress(defaultAddresses[0]);

                const shippingDestination = defaultAddresses[0].state;
                const sdArr = shippingDestination.split(" ");
                const shippingFee = fetch(
                  `https://mercurius-backend.up.railway.app/api/orders/shippingrates/${sdArr[0]}/`
                )
                  .then((res) => res.json())
                  .then((res) => {
                    if (res.detail) {
                      setShipping(3500);
                    } else {
                      setShipping(res.shipping_fee);
                    }
                  });
              }
            }
          }
        });
    }
  }, [setShipping, setUserInfo, userStatus]);

  useEffect(() => {
    if (typeof window !== "undefined" || typeof window !== null) {
      if (window.localStorage.getItem("TotalAmountAfterCoupons")) {
        setTotalAmountAfterCoupons(
          JSON.parse(window.localStorage.getItem("TotalAmountAfterCoupons"))
        );
      }
    }
  }, [totalAmountAfterCoupons]);

  const paymentPropsSts = {
    email: userStatus && userStatus.email ? userStatus.email : "",
    amount: totalAmount,
    metadata: {
      user_id: userStatus && userStatus.id ? userStatus.id : "",
      name: userStatus && userStatus.fullname ? userStatus.fullname : "",
      phone: userStatus && userStatus.phone ? userStatus.phone : "",
      email: userStatus && userStatus.email ? userStatus.email : "",
      paymentType: "Storage",
      totalAmount: Math.round(totalPrice),
      shippingFee: 0,
      salesTax: 0,
      discount: coupons,
      cart: items,
    },
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_TEXTMODE_PUBLIC_KEY,
    text: "Pay for Items",
    // callback_url: "http://localhost:3000/thankyou/",
    onSuccess: () => console.log("payment successful"),
    onClose: () => alert("Wait! You need these items, don't go!"),
  };
  // router.push("/thankyou");   () => console.log("payment successful"),
  const paymentPropsIs = {
    email: userStatus && userStatus.email ? userStatus.email : "",
    amount: totalAmountAfterCoupons
      ? totalAmountAfterCoupons * 100
      : totalCartAmt * 100,
    metadata: {
      user_id: userStatus && userStatus.id ? userStatus.id : "",
      name: userStatus && userStatus.fullname ? userStatus.fullname : "",
      phone: userStatus && userStatus.phone ? userStatus.phone : "",
      email: userStatus && userStatus.email ? userStatus.email : "",
      paymentType: "Instant Shipping",
      totalAmount: totalAmountAfterCoupons
        ? Math.round(totalAmountAfterCoupons)
        : Math.round(totalCartAmt),
      shippingFee: shipping ? shipping : 0,
      salesTax: salesTax ? salesTax : 0,
      discount: coupons,
      shippingAddress: defaultAddress,
      cart: items,
    },
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_TEXTMODE_PUBLIC_KEY,
    text: "Pay for Instant Shipping",
    // callback_url: "http://localhost:3000/thankyou/",
    onSuccess: () => console.log("payment successful"),
    onClose: () => alert("Wait! You need these items, don't go!"),
  };

  return (
    <section className="w-[85%] mx-auto max-w-screen-xl">
      <Head>
        <title>Mercurius | Checkout | Best Thrift Store in Nigeria</title>
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
              onClick={handleSignOut}
            >
              Register
            </button>
          </Link>
        </section>
      ) : (
        <section className="my-16">
          <h1 className="text-3xl lg:text-4xl font-dalek text-primary ">
            Checkout
          </h1>

          <section className="my-10 flex flex-col items-center space-y-6 md3:space-y-0">
            <section className="w-full flex flex-col">
              {cart.length === 0 ? (
                <section className="w-full p-6 grid place-items-center">
                  <h4 className="text-xl font-dalek text-primary">
                    Nothing To Checkout
                  </h4>
                  <Link href="/">
                    <button className="bg-black rounded-md mt-5 px-5 py-3 text-white hover:bg-primary cursor-pointer w-fit">
                      Back to Shopping
                    </button>
                  </Link>
                </section>
              ) : (
                <section className=" px-3 md:p-6 space-y-6 md:space-y-0 md:flex md:flex-row md:items-start md:justify-between">
                  <section className="md:w-[55%]">
                    {cart.map((item) => {
                      const fi =
                        item.product_images.length !== 0
                          ? item.product_images.filter(
                              (image) => image.is_feature == true
                            )
                          : null;

                      const fiUrl = fi
                        ? "https://res.cloudinary.com/dxhq8jlxf/" +
                          fi[0].product_images.replace(/ /g, "%20")
                        : placeholderImg;

                      return (
                        <section
                          key={item.id}
                          className="flex items-start justify-start space-x-5 mb-3 md:mb-5 md:w-full"
                        >
                          <section className="w-[50px] h-[50px] rounded-md">
                            <Image
                              src={fiUrl}
                              alt={item.name}
                              width={50}
                              height={50}
                              className="w-[50px] h-[50px] object-contain rounded-md"
                            />
                          </section>

                          <section className="w-full dark:text-black">
                            <section className="">{item.name}</section>
                            <section className="mt-1 font-semibold">
                              Qty: {item.qty}, Subtotal: ₦
                              {numbersWithCommas(item.price * item.qty)}
                            </section>
                          </section>
                        </section>
                      );
                    })}
                  </section>

                  <section className="mt-2 py-2 px-2 md:mt-0 md:py-2 md:px-6 border-t-2 md:border-t-0 border-gray-300 md:w-[38%] md:bg-gray-100 dark:text-black">
                    <section className="flex items-center justify-between my-1">
                      <span>Subtotal</span>
                      <span className="font-semibold">
                        ₦{numbersWithCommas(totalPrice)}
                      </span>
                    </section>

                    <section className="flex items-center justify-between my-1">
                      <span>Shipping Fee</span>
                      <span className="font-semibold">
                        ₦{numbersWithCommas(shipping ? shipping : 0)}
                      </span>
                    </section>

                    <section className="flex items-center justify-between my-1">
                      <span>Sales Tax</span>
                      <span className="font-semibold">
                        ₦{numbersWithCommas(salesTax ? salesTax : 0)}
                      </span>
                    </section>

                    <section className="border-t-2 border-b-2 border-black mt-2 md:mt-6 py-2 md:py-4 flex items-center justify-between">
                      <span>Total</span>
                      <span className="font-semibold">
                        ₦{numbersWithCommas(totalPrice + shipping + salesTax)}
                      </span>
                    </section>

                    <Link href="/cart" className="flex justify-end">
                      <button className="bg-black rounded-md mt-5 px-3 py-2 text-white hover:bg-primary cursor-pointer w-fit">
                        Back to Cart
                      </button>
                    </Link>

                    <p
                      className={
                        totalAmountAfterCoupons &&
                        `bg-green-600 text-white dark:text-white w-full px-3 py-2 rounded-md text-center font-bold mt-4`
                      }
                    >
                      With Coupons: ₦
                      {numbersWithCommas(totalAmountAfterCoupons)}
                    </p>
                  </section>
                </section>
              )}
            </section>

            {cart.length > 0 && (
              <section className="w-full md:w-[100%] border-4 border-gray-100 rounded-xl">
                {tabbed ? (
                  <>
                    <section className="flex flex-col justify-center max-w-xl mx-auto mb-6 border-b md:space-x-10 md:flex-row">
                      <section
                        className="flex justify-center text-center text-black border-b md:border-b-0 hover:text-primary hover:font-bold cursor-pointer md:w-1/2 tab"
                        data-target="panel-1"
                      >
                        <section
                          className="py-3"
                          onClick={() => setTabbed(false)}
                        >
                          Save to Storehouse
                        </section>
                      </section>

                      <section
                        className="flex justify-center text-center text-black border-b md:border-b-0 hover:text-primary hover:font-bold cursor-pointer md:w-1/2 tab"
                        data-target="panel-2"
                      >
                        <section
                          className="py-3 border-b-4 border-primary"
                          onClick={() => setTabbed(true)}
                        >
                          Instant Shipping
                        </section>
                      </section>
                    </section>

                    <section id="panels" className="mx-auto">
                      <section className="flex flex-col py-5 panel panel-2 text-center items-center justify-center dark:text-black">
                        <p className=" mb-5">
                          Your items will be shipped to you AS SOON AS your
                          order is received. Your COUPONS will be applied too!
                        </p>

                        {defaultAddress ? (
                          <PaystackButton
                            className="bg-primary rounded-md flex items-center justify-center px-3 py-2 text-white hover:bg-black cursor-pointer w-fit mt-5"
                            {...paymentPropsIs}
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
                    </section>
                  </>
                ) : (
                  <>
                    <section className="flex flex-col justify-center max-w-xl mx-auto mb-6 border-b md:space-x-10 md:flex-row">
                      <section
                        className="flex justify-center text-center text-black border-b md:border-b-0 hover:text-primary hover:font-bold cursor-pointer md:w-1/2 tab"
                        data-target="panel-1"
                      >
                        <section
                          className="py-3 border-b-4 border-primary"
                          onClick={() => setTabbed(false)}
                        >
                          Save to Storehouse
                        </section>
                      </section>

                      <section
                        className="flex justify-center text-center text-black border-b md:border-b-0 hover:text-primary hover:font-bold cursor-pointer md:w-1/2 tab"
                        data-target="panel-2"
                      >
                        <section
                          className="py-3"
                          onClick={() => setTabbed(true)}
                        >
                          Instant Shipping
                        </section>
                      </section>
                    </section>
                    <section id="panels" className="mx-auto">
                      <section className="flex flex-col py-5 panel panel-2 text-center items-center justify-center dark:text-black">
                        <p className=" mb-5">
                          You can buy as many items as you want, pay for them,
                          keep them in our Storehouse and shipped all of them at
                          once whenever you&apos;re ready.
                        </p>
                        <p className="">
                          <span className="text-red-600 font-bold mr-3">
                            PLEASE NOTE:
                          </span>
                          <span className="text-red-500">
                            It is{" "}
                            <span className="text-primary font-semibold mr-1">
                              FREE for 14 days
                            </span>
                            after which you{" "}
                            <span className="text-red-600 font-bold mr-1">
                              WILL be charged ₦100
                            </span>
                            per item every day until you request for your
                            shipment. And also your COUPONS are not applicable
                            to items saved to our Storehouse.
                          </span>
                        </p>

                        {defaultAddress ? (
                          <PaystackButton
                            className="bg-primary rounded-md flex items-center justify-center px-3 py-2 text-white hover:bg-black cursor-pointer w-fit mt-5"
                            {...paymentPropsSts}
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
                    </section>
                  </>
                )}
              </section>
            )}
          </section>
        </section>
      )}
    </section>
  );
};

export default Checkout;
