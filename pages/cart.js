import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useAppContext } from "../context/AppContext";
import { MdAdd, MdCheck, MdClose } from "react-icons/md";
import Link from "next/link";
import toast from "react-hot-toast";
import placeholderImg from "../public/assets/placeholder.png";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

const Cart = () => {
  const router = useRouter();

  const {
    appState: { cart, wishlist },
    appStateDispatch,
    addToCart,
    removeFromCart,
    addToWishlist,
    removeFromWishlist,
    totalPrice,
    shipping,
    setShipping,
    salesTax,
    setSalesTax,
    numbersWithCommas,
    increaseQty,
    decreaseQty,
    totalCartAmt,
    setTotalCartAmt,
  } = useAppContext();

  const [couponAlert, setCouponAlert] = useState(null);
  const [totalAmountAfterCoupons, setTotalAmountAfterCoupons] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined" || typeof window !== null) {
      if (window.localStorage.getItem("TotalAmountAfterCoupons")) {
        setTotalAmountAfterCoupons(
          JSON.parse(window.localStorage.getItem("TotalAmountAfterCoupons"))
        );
        setCouponAlert(window.localStorage.getItem("couponAlert"));
      }
    }
  }, []);

  // Form Dependencies
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  const onSubmit = async (data) => {
    data.totalCart = totalCartAmt;
    try {
      const options = {
        method: "GET",
        headers: { "Content-type": "application/json" },
      };

      await fetch(
        `https://mercurius-backend.up.railway.app/api/orders/coupons/${data.coupon_code}/`,
        options
      )
        .then((res) => res.json())
        .then((resData) => {
          if (resData.error || resData.detail) {
            toast.error(resData.error ? resData.error : "Invalid Coupon Code");
          } else if (resData.is_used === true) {
            toast.error("Coupon code has been USED!!");
          } else {
            let cartAmt = totalAmountAfterCoupons
              ? totalAmountAfterCoupons
              : totalCartAmt;
            const po = resData.percentage_off / 100;
            const poAmt = po * cartAmt;
            const poTotal = cartAmt - poAmt;

            const options = {
              method: "GET",
              headers: { "Content-type": "application/json" },
            };

            fetch(
              `https://mercurius-backend.up.railway.app/api/orders/coupons/${data.coupon_code}/disable`,
              options
            )
              .then((res) => res.json())
              .then((resData) => {
                if (resData.status) {
                  setTotalAmountAfterCoupons(Math.round(poTotal));
                  setCouponAlert(`Coupon applied!`);
                  window.localStorage.setItem(
                    "TotalAmountAfterCoupons",
                    Math.round(poTotal)
                  );
                  window.localStorage.setItem("couponAlert", `Coupon applied!`);
                  toast.success(`Coupon applied!`);
                  router.reload(window.location.pathname);
                }
              });
          }
        });
    } catch (err) {
      console.log(err);
      //   // toast.error(err);
    }
  };

  return (
    <section className="w-[85%] mx-auto max-w-screen-xl">
      <Head>
        <title>Mercurius | Cart | Best Thrift Store in Nigeria</title>
      </Head>

      <section className="flex flex-col my-10 lg:flex-row lg:items-start lg:justify-between lg:my-16">
        {cart.length === 0 ? (
          <section className="w-full p-6 lg:w-[65%] h-[100%] grid place-items-center lg:p-12">
            <section className="">
              <h4 className="text-xl font-dalek text-primary">
                Your Cart Is Empty
              </h4>
              <Link href="/">
                <button className="bg-black rounded-md mt-5 px-5 py-3 text-white hover:bg-primary cursor-pointer w-fit">
                  Back to Shopping
                </button>
              </Link>
            </section>
          </section>
        ) : (
          <section className="lg:w-[65%] w-[100%] h-[100%] flex flex-col items-left">
            <h1 className="text-2xl sm2:text-3xl md:text-4xl text-primary font-dalek">
              Your Cart ({cart.length})
            </h1>

            <section className="w-full bg-white my-3 lg:mt-8 sm2:text-md md:text-lg">
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
                    className="flex items-start justify-start flex-wrap space-x-3 md:my-3 md:p-3 border-b-2 my-3 py-3 text-sm sm2:text-md md:text-lg sm2:items-center sm2:justify-between dark:text-black"
                  >
                    {/* md:items-center sm3:justify-between */}
                    <section className="w-[60px] h-[60px] sm2:w-[80px] sm2:h-[80px] rounded-md">
                      <Image
                        src={fiUrl}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-[55px] h-[55px] sm2:w-[80px] sm2:h-[80px] object-contain rounded-md"
                      />
                    </section>

                    <section className="w-[70%] sm:w-[60%] sm2:w-[45%] mb-2">
                      <section className="">{item.name}</section>

                      <section className="mt-1 sm2:mt-2 font-semibold">
                        ₦{numbersWithCommas(item.price)}
                      </section>

                      <section className="mt-1 sm2:mt-2 flex items-start justify-start flex-wrap space-x-2 space-y-2 text-sm">
                        {item.size && (
                          <p className="">
                            Size:{" "}
                            <span className="font-semibold">{item.size}</span>
                          </p>
                        )}
                        {item.vol && (
                          <p className="">
                            Vol:{" "}
                            <span className="font-semibold">{item.vol}</span>
                          </p>
                        )}
                      </section>
                    </section>

                    <section className="w-fit sm2:w-[15%] flex items-center justify-center space-x-2 mt-3">
                      <section
                        className="bg-black w-[30px] h-[30px] grid place-items-center text-white rounded-sm cursor-pointer hover:bg-primary duration-300"
                        onClick={() => increaseQty(item.id)}
                      >
                        +
                      </section>
                      <section>{item.qty}</section>
                      <section
                        className="bg-black w-[30px] h-[30px] grid place-items-center text-white rounded-sm cursor-pointer hover:bg-primary duration-300"
                        onClick={() => decreaseQty(item.id)}
                      >
                        -
                      </section>
                    </section>

                    <section className="w-full relative flex items-center justify-between sm2:w-[20%] sm2:flex-col sm2:items-start space-x-2 mt-3">
                      <section className="font-semibold  dark:text-black">
                        ₦{numbersWithCommas(item.price * item.qty)}
                      </section>
                      <section
                        className="md:mt-2 cursor-pointer text-red-700 hover:text-black duration-300 w-fit"
                        onClick={() => {
                          removeFromCart(item);
                          toast.error(`${item.name} removed from cart`);
                        }}
                      >
                        remove
                      </section>
                      <section
                        className="md:mt-2 cursor-pointer text-red-700 hover:text-black duration-300 fit"
                        onClick={() => {
                          addToWishlist(item);
                          toast.success(`${item.name} added to wishlist`);
                        }}
                      >
                        wishlist
                      </section>
                    </section>
                  </section>
                );
              })}
            </section>
          </section>
        )}

        <section className="lg:w-[30%] w-full">
          <section className="mb-10 sm2:flex sm2:items-start sm2:justify-between lg:block dark:text-black">
            <section className="sm2:w-[48%] lg:w-full">
              <h3 className="text-xl md:text-2xl text-primary font-dalek">
                Order Summary
              </h3>
              <section className="mt-2 py-2 px-2 md:mt-4 md:text-lg md:py-2 md:px-6">
                <section className="flex items-center justify-between my-1">
                  <span>Subtotal</span>
                  <span className="font-semibold">
                    ₦{numbersWithCommas(totalPrice)}
                  </span>
                </section>

                <section className="flex items-center justify-between my-1">
                  <span>Shipping Fee</span>
                  <span className="font-semibold">
                    ₦{numbersWithCommas(shipping)}
                  </span>
                </section>

                <section className="flex items-center justify-between my-1">
                  <span>Sales Tax</span>
                  <span className="font-semibold">
                    ₦{numbersWithCommas(salesTax)}
                  </span>
                </section>

                <section className="border-t-2 border-b-2 border-black mt-2 md:mt-6 py-2 md:py-4 flex items-center justify-between">
                  <span>Total</span>
                  <span className="font-semibold">
                    ₦
                    {numbersWithCommas(
                      totalAmountAfterCoupons
                        ? totalAmountAfterCoupons
                        : totalCartAmt
                    )}
                  </span>
                </section>
              </section>
              <p
                className={
                  couponAlert &&
                  `text-green-600 dark:text-green-600 w-full px-3 py-2 rounded-md text-center font-bold`
                }
              >
                {couponAlert}
              </p>
            </section>

            <section className="mt-5 sm2:mt-0 lg:mt-7 flex flex-col sm2:w-[48%] lg:w-full">
              <h4 className="text-lg md:text-xl text-primary font-dalek">
                Have a coupon?
              </h4>

              <p className="text-red-600">
                Please NOTE: Only USE your coupons if you want your orders to be
                shipped or delivered to you instantly (Instant Shipping).
              </p>

              <form
                className="mt-2 py-2 flex items-center justify-between"
                onSubmit={handleSubmit(onSubmit)}
              >
                <section className="">
                  <label htmlFor="coupon-field" className="w-full">
                    <section className="flex items-center justify-between relative mt-2">
                      <>
                        <input
                          {...register("coupon_code", {
                            required: {
                              value: true,
                              message: "Coupon code is required",
                            },
                            pattern: {
                              value: /^[A-Za-z0-9]*$/,
                              message: "Enter a valid coupon code",
                            },
                          })}
                          type="text"
                          name="coupon_code"
                          className="rounded-md px-3 md:px-4 py-2 outline-none border-2 border-black w-[100%]  dark:bg-white"
                          placeholder="Enter your code here..."
                        />
                      </>
                    </section>
                  </label>

                  {errors.coupon_code &&
                    errors.coupon_code.type === "pattern" && (
                      <span className="text-red-500 block mt-2">
                        {errors.coupon_code.message}
                      </span>
                    )}
                  {errors.coupon_code &&
                    errors.coupon_code.type === "required" && (
                      <span className="text-red-500 block mt-2">
                        {errors.coupon_code.message}
                      </span>
                    )}
                </section>

                <button className="bg-black text-white rounded-md cursor-pointer ml-4 px-6 py-2 outline-none hover:bg-primary duration-300">
                  Apply
                </button>
              </form>

              <section className="mt-0 text-md py-2 flex items-center justify-between">
                <button
                  type="button"
                  className="bg-black text-white rounded-md cursor-pointer px-6 py-2 outline-none hover:bg-primary duration-300 w-[47%]"
                  onClick={() => {
                    appStateDispatch({
                      type: "CLEAR_CART",
                    });
                    toast.error(`Cart cleared`);
                  }}
                >
                  Clear Cart
                </button>
                <Link href="/checkout" className=" w-[47%]">
                  <button
                    type="button"
                    className="bg-primary font-bold text-white rounded-md cursor-pointer px-6 py-2 outline-none hover:bg-black duration-300 w-full"
                  >
                    Checkout
                  </button>
                </Link>
              </section>
            </section>
          </section>

          <section className="">
            <h1 className="text-2xl text-primary font-dalek">
              Wishlist ({wishlist.length})
            </h1>
            <section className="mt-0 text-sm md:text-lg py-2 px-0">
              {wishlist.length <= 0 ? (
                <section className="grid place-items-center mt-2 text-sm md:text-lg py-2 px-3 md:px-6 dark:text-black">
                  <h4>No item in your wishlist</h4>
                  <Link href="/">
                    <button className="bg-black rounded-md mt-3 md:mt-5 md:px-5 px-3 py-3 text-white hover:bg-primary cursor-pointer w-fit">
                      Back to Shopping
                    </button>
                  </Link>
                </section>
              ) : (
                <section className="">
                  {wishlist.map((item) => {
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
                        className="flex items-center justify-between my-3 p-2 border-b-2 space-x-4 dark:text-black"
                      >
                        <section className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] bg-white rounded-md">
                          <Image
                            src={fiUrl}
                            alt={item.name}
                            width={50}
                            height={50}
                            className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] object-contain rounded-md"
                          />
                        </section>

                        <section className="text-sm md:text-[16px]">
                          {item.name} - ₦{numbersWithCommas(item.price)}
                        </section>

                        <ul className="w-fit block space-y-2 text-sm">
                          <li
                            className="bg-white w-[30px] h-[30px] grid place-items-center cursor-pointer hover:text-primary rounded-sm shadow-md"
                            onClick={() => {
                              addToCart(item);
                              toast.success(`${item.name} added to cart`);
                            }}
                          >
                            <MdAdd className="product__card__icon add_from_cart" />
                          </li>

                          <li
                            className="bg-black w-[30px] h-[30px] grid place-items-center cursor-pointer text-white hover:bg-primary rounded-sm shadow-md"
                            onClick={() => {
                              removeFromWishlist(item);
                              toast.error(`${item.name} removed from wishlist`);
                            }}
                          >
                            <MdClose className="product__card__icon remove_from_cart" />
                          </li>
                        </ul>
                      </section>
                    );
                  })}
                </section>
              )}
            </section>
          </section>
        </section>
      </section>
    </section>
  );
};

export default Cart;
