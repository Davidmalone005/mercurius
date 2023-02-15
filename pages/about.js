import React from "react";
import Head from "next/head";
import Image from "next/image";
import placeholderImg from "../public/assets/placeholder.png";
import about3 from "../public/assets/page-imgs/about3.jpg";

const about = () => {
  return (
    <section className="w-full min-w-[320px] grid place-items-center overflow-hidden z-10">
      <Head>
        <title>
          Mercurius | About Mercurius | Best Thrift Store in Nigeria
        </title>
      </Head>

      <section className="relative w-full min-w-[320px] h-[400px] grid place-items-center overflow-hidden z-10 bg-about_bg1 bg-no-repeat bg-cover bg-fixed">
        <section className="bg-black absolute top-0 left-0 w-full h-[100%] opacity-90 z-10"></section>

        <section className="text-white dark:text-white h-[100%] flex flex-col items-center justify-center z-20">
          <h1 className="text-4xl uppercase font-poppins font-semibold">
            ABOUT US
          </h1>
          <p className="my-3 text-md px-6 text-center">
            We know what's like out there, we just want to help out
          </p>
        </section>
      </section>

      <section className="relative w-full min-w-[320px] h-auto sm2:h-[600px] md3:h-[500px] grid place-items-center overflow-hidden z-10 bg-about_bg2 bg-no-repeat bg-cover bg-fixed">
        <section className="bg-black absolute top-0 left-0 w-full h-[100%] opacity-40 z-10"></section>

        <section className="text-white dark:text-white w-[90%] sm2:w-[85%] py-12 sm2:py-0 md:w-[70%] h-[100%] flex flex-col items-center justify-center z-20">
          <h1 className="text-3xl uppercase font-dalek mb-8">Our Story</h1>

          <section className="z-30 opacity-70 bg-glass_img bg-no-repeat bg-cover bg-fixed w-[100%] bg-white  text-black dark:text-black p-12">
            <p className="my-3 text-md px-6 text-center">
              Had a vision of creating an online marketplace that could bring
              the best of both worlds to customers. After looking at the way of
              life of mixing both the personality of being a white-collar job
              hunter and a weekend hangout individual, dawned on me that...
            </p>
          </section>
        </section>
      </section>

      <section className="w-full min-w-[320px] grid place-items-center overflow-hidden z-20 ">
        <section className="bg-white text-black dark:text-black flex flex-col sm2:flex-row flex-wrap items-center justify-between py-16 px-10 w-full min-w-[320px]">
          <section className="grid place-items-center px-8 py-3 md:px-16 md:py-6 md3:px-28 md3:py-12 w-[90%] mx-auto sm2:w-[48%] sm2:mx-0">
            I needed that bridge that can make people enjoy both worlds without
            breaking the bank or going to market. Mercurius was simple: to offer
            a range of quality, luxurious items at thrifty prices.
          </section>
          <section className="grid place-items-center w-[60%] mx-auto sm2:w-[48%] sm2:mx-0 mt-8 sm2:mt-0">
            <Image
              src={about3}
              alt="Mercurius"
              width={0}
              height={0}
              className="object-cover object-center w-[100%] h-[100%]"
            />
          </section>
        </section>
      </section>

      <section className="w-full min-w-[320px] grid place-items-center overflow-hidden z-20 bg-black text-white dark:text-white">
        <section className="flex flex-col sm2:flex-row flex-wrap items-center sm2:items-start justify-center sm2:justify-center py-16 px-10 w-[80%] space-x-6 space-y-6 sm2:space-y-0">
          <section className="grid place-items-center w-[70%] sm2:w-[45%] md:w-[30%] text-center">
            <h1 className="text-2xl uppercase font-dalek mb-4">Our Mission</h1>
            <p>
              To create affordability which represents our everyday lifestyle
              and trend where everyone can have a spark of quality.
            </p>
          </section>
          <section className="grid place-items-center w-[70%] sm2:w-[45%] md:w-[30%] text-center">
            <h1 className="text-2xl uppercase font-dalek mb-4">Our Vision</h1>
            <p>
              To be the leading African store that offers a wide range of
              on-trend styles in an innovative era that is accessible to all.
            </p>
          </section>
          <section className="grid place-items-center w-[70%] sm2:w-[50%] sm2:mt-8 md:mt-0 md:w-[30%] text-center">
            <h1 className="text-2xl uppercase font-dalek mb-4">Our Goal</h1>
            <p>
              To be the one stop shop that everyone can rely on to suit their
              individual personality.
            </p>
          </section>
        </section>
      </section>

      {/* <section className="text-center bg-white text-black dark:text-black w-full font-dalek font-semibold text-2xl mb-16">
        We Are Mercurius
      </section> */}
    </section>
  );
};

export default about;
