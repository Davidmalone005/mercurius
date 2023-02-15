import React, { useEffect } from "react";
import { MdAdd, MdCheck, MdClose } from "react-icons/md";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import Link from "next/link";
import placeholderImg from "../public/assets/placeholder.png";
import Image from "next/image";

const ProductCard = ({ product }) => {
  const {
    appState: { cart, wishlist },
    appStateDispatch,
    addToCart,
    addToWishlist,
    removeFromCart,
    removeFromWishlist,
    numbersWithCommas,
  } = useAppContext();

  const fi =
    product.product_images.length !== 0
      ? product.product_images.filter((image) => image.is_feature == true)
      : null;

  const fiUrl = fi
    ? "https://res.cloudinary.com/dxhq8jlxf/" +
      fi[0].product_images.replace(/ /g, "%20")
    : placeholderImg;

  return (
    <section className="bg-white dark:bg-white m-4 pb-6 shadow-md rounded-md relative text-center cursor-pointer group w-[250px] min-w-[250px]">
      {product.is_onFlashsale && (
        <span className="w-fit block absolute top-[15px] left-[15px] bg-primary text-white dark:text-white px-3 py-2 rounded-lg">
          -{product.flashsale}%
        </span>
      )}

      <ul className="product__actions w-fit block absolute top-[100px] md:top-[120px] right-[15px] space-y-2">
        {cart.some((p) => p.id === product.id) ? (
          <li
            className="bg-black dark:bg-black w-[50px] h-[50px] grid place-items-center cursor-pointer text-white dark:text-white hover:bg-primary rounded-md shadow-md"
            onClick={() => {
              removeFromCart(product);
              toast.error(`${product.name} removed from cart`);
            }}
          >
            <MdClose className="product__card__icon remove_from_cart" />
          </li>
        ) : (
          <li
            className="bg-white dark:bg-white w-[50px] h-[50px] grid place-items-center cursor-pointer hover:text-primary rounded-md shadow-md dark:text-black"
            onClick={() => {
              addToCart(product);
              toast.success(`${product.name} added to cart`);
            }}
          >
            <MdAdd className="product__card__icon add_from_cart" />
          </li>
        )}

        {wishlist.some((w) => w.id === product.id) ? (
          <li
            className="bg-white dark:bg-white w-[50px] h-[50px] grid place-items-center cursor-pointer hover:text-white hover:bg-primary rounded-md shadow-md text-primary dark:text-primary"
            onClick={() => {
              removeFromWishlist(product);
              toast.error(`${product.name} removed from wishlist`);
            }}
          >
            <FaHeart className="product__card__icon remove_from_wishlist" />
          </li>
        ) : (
          <li
            className="bg-white dark:bg-white w-[50px] h-[50px] grid place-items-center cursor-pointer hover:text-primary rounded-md shadow-md dark:text-black"
            onClick={() => {
              addToWishlist(product);
              toast.success(`${product.name} added to wishlist`);
            }}
          >
            <FiHeart className="product__card__icon" />
          </li>
        )}
      </ul>

      <Link href={`../p/${product.slug}`}>
        <Image
          src={fiUrl}
          alt={product.name}
          width={250}
          height={250}
          className="w-[250px] h-[250px] min-w-[250px] min-h-[250px] object-cover duration-300"
        />
        <h4 className="product__name mt-6 mb-4 text-md group-hover:text-primary dark:group-hover:text-primary w-full px-4 dark:text-black">
          {product.name}
        </h4>
      </Link>

      {product.is_onFlashsale ? (
        <p className="product__price text-[18px] font-semibold mt-4 px-4 dark:text-black">
          <s className="text-gray-400 text-[16px] mr-1">
            ₦{numbersWithCommas(product.price)}
          </s>{" "}
          ₦{numbersWithCommas(product.flashsale_price)}
        </p>
      ) : (
        <p className="product__price text-[18px] font-semibold mt-4 px-4 dark:text-black">
          ₦{numbersWithCommas(product.price)}
        </p>
      )}
    </section>
  );
};

export default ProductCard;
