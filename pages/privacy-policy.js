import React from "react";
import Head from "next/head";

const privacy_policy = () => {
  return (
    <section className="w-full min-w-[320px] grid place-items-center overflow-hidden z-10">
      <Head>
        <title>Mercurius | Privacy Policy | Best Thrift Store in Nigeria</title>
      </Head>

      <section className="bg-gray-100 text-black dark:text-black flex flex-col items-center justify-center py-16 px-10 w-full min-w-[320px]">
        <h1 className="text-2xl uppercase font-dalek mb-8">Privacy Policy</h1>
        <section className="flex flex-col w-[95%] md:w-[75%] md3:w-[50%] space-y-6">
          <p className="my-3 text-md px-6 text-justify">
            Mercurius ecommerce is committed to protecting the privacy of its
            customers and website visitors. We understand that your privacy is
            important, and we take steps to ensure that your personal
            information is kept safe and secure.
          </p>
          <ul className="px-6 ml-6 list-disc list-outside">
            <li className="my-4">
              We will do our best to protect your personal data.
            </li>
            <li className="my-4">
              We will never sell or rent your personal information to third
              parties for their marketing or other purposes. If you do not agree
              with the terms of the Privacy Policy, you should not use the
              website.
            </li>
            <li className="my-4">
              We understand that your privacy while using our site is important,
              especially when conducting business or providing sensitive
              personal information. This notice explains our privacy policy and
              how we collect, use and protect your personal data.
            </li>
          </ul>
          <p className="my-3 text-md px-6 text-justify">
            Mercurius ecommerce collects the following information about its
            users: name, addresses, cell phone numbers, email address, interests
            and business information (if applicable). Third party vendors may
            also collect this information, and Google Analytics is used to
            collect information about how visitors use the site. Cookies are
            used to obtain information about what product and information
            interest visitors and to protect the user's information.
          </p>
        </section>
      </section>
    </section>
  );
};

export default privacy_policy;
