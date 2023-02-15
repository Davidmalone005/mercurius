import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  useReducer,
} from "react";
import { appReducer, productFilterReducer, userReducer } from "./Reducers";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFilterBoxOpen, setIsFilterBoxOpen] = useState(false);
  const [flashsaleProducts, setFlashsaleProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQty, setTotalQty] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [salesTax, setSalesTax] = useState(0);
  const [totalCartAmt, setTotalCartAmt] = useState(0);
  const [tabbed, setTabbed] = useState(false);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirm_password: false,
  });

  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [productTypes, setProductTypes] = useState([]);
  const [products, setProducts] = useState([]);
  const [flashsaleTimer, setFlashsaleTimer] = useState([]);
  const [flashsaleTimerSwitch, setFlashsaleTimerSwitch] = useState(false);

  const [userInfo, setUserInfo] = useState(null);

  const numbersWithCommas = (numbers) => {
    return numbers
      ? numbers.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")
      : "0".replace(/\B(?=(\d{3})+(?!\d))/g, ", ");
  };

  // CART
  const [appState, appStateDispatch] = useReducer(appReducer, [], () => ({
    cart: [],
    wishlist: [],
  }));

  useEffect(() => {
    if (typeof window !== "undefined" || typeof window !== null) {
      // cart

      if (appState.cart.length > 0) {
        window.localStorage.setItem("cart", JSON.stringify(appState.cart));
      }

      let cartFromLocalStorage = JSON.parse(
        window.localStorage.getItem("cart")
      );

      if (cartFromLocalStorage !== null) {
        if (appState.cart.length === 0 && cartFromLocalStorage.length > 0) {
          appState.cart = cartFromLocalStorage;
        }
      }

      // wishlist

      if (appState.wishlist.length > 0) {
        window.localStorage.setItem(
          "wishlist",
          JSON.stringify(appState.wishlist)
        );
      }

      let wishlistFromLocalStorage = JSON.parse(
        window.localStorage.getItem("wishlist")
      );

      if (wishlistFromLocalStorage !== null) {
        if (
          appState.wishlist.length === 0 &&
          wishlistFromLocalStorage.length > 0
        ) {
          appState.wishlist = wishlistFromLocalStorage;
        }
      }
    }
  }, [appState]);

  useEffect(() => {
    if (typeof window !== "undefined" || typeof window !== null) {
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

                const shippingDestination =
                  defaultAddresses.length > 0
                    ? defaultAddresses[0].state
                    : null;

                const sdArr = shippingDestination
                  ? shippingDestination.split(" ")
                  : null;

                if (sdArr && sdArr.length > 0) {
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
                setSalesTax(appState.cart.length * 10);
                setTotalCartAmt(totalPrice + shipping + salesTax);
              }
            }
          }
        });
    }
  }, [shipping, appState.cart.length, salesTax, totalPrice]);

  // CART FUNCTIONS
  const addToCart = (item) => {
    const isInWishlist = (item) => {
      if (appState.wishlist.length > 0) {
        for (let i = 0; i < appState.wishlist.length; i++) {
          if (appState.wishlist[i].id === item.id) {
            return true;
          }
        }

        return false;
      } else {
        return false;
      }
    };

    if (isInWishlist(item)) {
      appStateDispatch({ type: "REMOVE_FROM_WISHLIST", payload: item });
      appStateDispatch({ type: "ADD_TO_CART", payload: item });
    } else {
      appStateDispatch({ type: "ADD_TO_CART", payload: item });
    }
  };

  const increaseQty = (id) => {
    appStateDispatch({ type: "INCREASE_QTY", payload: id });
  };

  const decreaseQty = (id) => {
    appStateDispatch({ type: "DECREASE_QTY", payload: id });
  };

  const removeFromCart = (item) => {
    appStateDispatch({ type: "REMOVE_FROM_CART", payload: item });
  };

  useEffect(() => {
    setTotalPrice(
      appState.cart.reduce(
        (acc, curr) => acc + Number(curr.price) * curr.qty,
        0
      )
    );
  }, [appState.cart]);

  // WISHLIST
  const addToWishlist = (item) => {
    const isInCart = (item) => {
      if (appState.cart.length > 0) {
        for (let i = 0; i < appState.cart.length; i++) {
          if (appState.cart[i].id === item.id) {
            return true;
          }
        }

        return false;
      } else {
        return false;
      }
    };

    if (isInCart(item)) {
      appStateDispatch({ type: "REMOVE_FROM_CART", payload: item });
      appStateDispatch({ type: "ADD_TO_WISHLIST", payload: item });
    } else {
      appStateDispatch({ type: "ADD_TO_WISHLIST", payload: item });
    }
  };

  const removeFromWishlist = (item) => {
    appStateDispatch({ type: "REMOVE_FROM_WISHLIST", payload: item });
  };

  useEffect(() => {
    const flashsaleProductsFilter = products.filter(
      (product) => product.flashsale > 0
    );

    return () => {
      setFlashsaleProducts(flashsaleProductsFilter);
    };
  }, [products]);

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const [productFilter, productFilterDispatch] = useReducer(
    productFilterReducer,

    {
      searchQuery: "",
      byCategory: "",
      bySubcategory: "",
      byBrand: "",
      byPrice: 0,
      byStock: false,
      byFlashsale: false,
      byGender: "",
      bySize: "",
      byColor: "",
    }
  );

  const totalAmount = Math.round(totalPrice * 100);
  const totalAmountWithShippingNtax = Math.round(
    (totalPrice + shipping + salesTax) * 100
  );

  // Select product size
  const selectSize = (item) => {
    appStateDispatch({ type: "SELECT_SIZE", payload: item });
  };

  return (
    <AppContext.Provider
      value={{
        isSidebarOpen,
        setIsSidebarOpen,
        openSidebar,
        closeSidebar,
        appState,
        appStateDispatch,
        totalPrice,
        totalAmount,
        setTotalPrice,
        totalQty,
        setTotalQty,
        shipping,
        setShipping,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        addToWishlist,
        removeFromWishlist,
        productFilter,
        productFilterDispatch,

        flashsaleProducts,
        setFlashsaleProducts,
        isFilterBoxOpen,
        setIsFilterBoxOpen,
        tabbed,
        setTabbed,
        showPassword,
        setShowPassword,
        avatarMenuOpen,
        setAvatarMenuOpen,
        products,
        setProducts,
        flashsaleTimer,
        setFlashsaleTimer,
        flashsaleTimerSwitch,
        setFlashsaleTimerSwitch,
        salesTax,
        setSalesTax,
        numbersWithCommas,
        userInfo,
        setUserInfo,
        productTypes,
        setProductTypes,
        selectSize,
        totalAmountWithShippingNtax,

        totalCartAmt,
        setTotalCartAmt,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
