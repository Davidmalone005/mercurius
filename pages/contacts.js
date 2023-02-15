import React, { useState } from "react";
import Head from "next/head";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

const contact = () => {
  const router = useRouter();

  const [messageStatus, setMessageStatus] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const options = {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(data),
      };

      await fetch("http://localhost:8000/api/contact/", options)
        .then((res) => res.json())
        .then((resData) => {
          if (resData.email) {
            setMessageStatus("Message Received Successfully!");
            toast.success("Message Received Successfully!");
            setTimeout(() => {
              router.reload(window.location.pathname);
            }, 2000);
          } else {
            setMessageStatus("Message not sent, please try again...");
            toast.error("Message not sent, please try again...");
          }
        });
    } catch (err) {
      console.log(err);
      // toast.error(err);
    }
  };

  return (
    <section className="w-full min-w-[320px] grid place-items-center overflow-hidden z-10">
      <Head>
        <title>Mercurius | Contacts | Best Thrift Store in Nigeria</title>
      </Head>

      <section className="w-full min-w-[320px] grid place-items-center overflow-hidden z-20 ">
        <section className="bg-black text-white dark:text-white flex flex-col md:flex-row flex-wrap items-center justify-between space-y-6 md:space-y-0 py-10 px-10 w-full min-w-[320px]">
          <section className="px-8 py-3 md:px-16 md:py-6 md3:px-16 md3:py-6 lg:px-28 lg:py-12 w-[90%] mx-auto md:w-[48%]">
            <h1 className="text-2xl uppercase font-dalek mb-8">Contacts</h1>

            <p className="my-3 text-md px-6 text-justify">
              We know what it's like out there, we just want to help out...
            </p>
          </section>
          <section className="grid place-items-center w-[75%] mx-auto md:w-[48%] bg-primary rounded-md p-6">
            <h1 className="text-2xl mb-4">Send Us a Message</h1>

            <form
              className="flex flex-col space-y-4 w-full"
              onSubmit={handleSubmit(onSubmit)}
            >
              <section className="">
                <label htmlFor="name" className="text-black">
                  Name
                </label>
                <section className="flex items-center justify-between relative mt-2">
                  <input
                    {...register("name", {
                      required: {
                        value: true,
                        message: "Firstname and Lastname is required",
                      },
                      pattern: {
                        value: /^[A-Za-z ]*$/,
                        message: "Please enter valid names",
                      },
                    })}
                    type="text"
                    name="name"
                    placeholder="Firstname Lastname"
                    className={`appearance-none rounded-md py-3 pl-5 w-full placeholder-black pr-12 text-black outline-none dark:bg-white ${
                      errors.name &&
                      "border-2 border-red-500 text-red-500 bg-black"
                    }`}
                  />
                </section>
                {errors.name && errors.name.type === "pattern" && (
                  <span className="text-red-500 block mt-2">
                    {errors.name.message}
                  </span>
                )}
                {errors.name && errors.name.type === "required" && (
                  <span className="text-red-500 block mt-2">
                    {errors.name.message}
                  </span>
                )}
              </section>

              <section className="">
                <label htmlFor="email" className="text-black">
                  Email
                </label>
                <section className="flex items-center justify-between relative mt-2">
                  <input
                    {...register("email", {
                      required: {
                        value: true,
                        message: "Email is required",
                      },
                      pattern: {
                        value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                        message: "Please enter a valid email",
                      },
                      maxLength: {
                        value: 60,
                        message: "Email is longer than 60 characters",
                      },
                    })}
                    type="email"
                    name="email"
                    placeholder="Email"
                    className={`appearance-none rounded-md py-3 pl-5 w-full placeholder-black pr-12 text-black outline-none dark:bg-white ${
                      errors.email &&
                      "border-2 border-red-500 text-red-500 bg-black"
                    }`}
                  />
                </section>

                {errors.email && errors.email.type === "pattern" && (
                  <span className="text-red-500 block mt-2">
                    {errors.email.message}
                  </span>
                )}

                {errors.email && errors.email.type === "maxLength" && (
                  <span className="text-red-500 block mt-2">
                    {errors.email.message}
                  </span>
                )}

                {errors.email && errors.email.type === "required" && (
                  <span className="text-red-500 block mt-2">
                    {errors.email.message}
                  </span>
                )}
              </section>

              <section className="">
                <label htmlFor="message" className="text-black">
                  Message
                </label>
                <section className="flex items-center justify-between relative mt-2">
                  <textarea
                    {...register("message", {
                      required: {
                        value: true,
                        message: "Message is required",
                      },
                      pattern: {
                        value: /^[A-Za-z0-9-?\/.,#!:; ]*$/,
                        message: "Please enter a valid message",
                      },
                    })}
                    type="textarea"
                    name="message"
                    placeholder="Type your message here..."
                    className={`appearance-none rounded-md py-3 pl-5 w-full placeholder-black pr-12 text-black outline-none resize-y dark:bg-white h-[200px] ${
                      errors.message &&
                      "border-2 border-red-500 text-red-500 bg-black"
                    }`}
                  ></textarea>
                </section>
                {errors.message && errors.message.type === "pattern" && (
                  <span className="text-red-500 block mt-2">
                    {errors.message.message}
                  </span>
                )}
                {errors.message && errors.message.type === "required" && (
                  <span className="text-red-500 block mt-2">
                    {errors.message.message}
                  </span>
                )}
              </section>

              <button className="bg-black text-white rounded-md px-6 py-3 flex items-center justify-center w-full cursor-pointer hover:bg-white hover:text-black duration-300">
                <span>Send</span>
              </button>
            </form>

            {messageStatus && messageStatus.includes("Successfully") && (
              <section className="bg-green-700 text-white dark:text-white rounded-md px-6 py-3 flex items-center justify-center w-full duration-300 mt-3">
                {messageStatus}
              </section>
            )}
          </section>
        </section>
      </section>
    </section>
  );
};

export default contact;
