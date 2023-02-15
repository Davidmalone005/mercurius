import { SessionProvider } from "next-auth/react";
import "@/styles/globals.css";
import "@/styles/cart.css";
import { AppProvider } from "../context/AppContext";
import { Layout } from "../components";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

import { Poppins } from "@next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--poppins-font",
});

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  useEffect(() => {
    const use = async () => {
      (await import("tw-elements")).default;
    };
    use();
  }, []);

  return (
    <AppProvider>
      <SessionProvider session={pageProps.session}>
        <Toaster />
        <style jsx global>{`
          :root {
            --poppins-font: ${poppins.style.fontFamily};
          }
        `}</style>
        ;
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </AppProvider>
  );
}

export default MyApp;










