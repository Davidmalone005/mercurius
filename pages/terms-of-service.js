import React from "react";
import Head from "next/head";

const tos = () => {
  return (
    <section className="w-full min-w-[320px] grid place-items-center overflow-hidden z-10">
      <Head>
        <title>
          Mercurius | Terms of Service | Best Thrift Store in Nigeria
        </title>
      </Head>

      <section className="bg-gray-100 text-black dark:text-black flex flex-col items-center justify-center py-16 px-10 w-full min-w-[320px]">
        <h1 className="text-2xl uppercase font-dalek mb-8">Terms of Service</h1>
        <section className="flex flex-col w-[95%] md:w-[75%] md3:w-[50%] space-y-6">
          <p className="my-3 text-md px-6 text-justify">
            Mercurius has established certain General Terms and Conditions for
            purchase and sale, which must be agreed to by the Other Party. Users
            are not permitted to copy, distribute, download, modify, reproduce,
            republish, post, print, transmit, upload and store any material
            and/or extracts from the Website without the Company's permission.
          </p>
          <p className="my-3 text-md px-6 text-justify">
            In addition, any information collected from customers through polls,
            surveys, cookies, session tracking and other sources is used
            internally and solely for the purpose of personalizing customer
            service, developing ways to improve the visitor's experience, and to
            prevent and detect fraud.
          </p>
        </section>
      </section>
    </section>
  );
};

export default tos;
