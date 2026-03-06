"use client";
import React, { use, useEffect, useState } from "react";
import PasswordForm from "@/components/PasswordForm";
import PasswordList from "@/components/PasswordList";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";

const Page = ({ params }) => {
  const { id } = use(params);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const encryptedUid = Cookies.get("uid");
    if (encryptedUid) {
      try {
        const decryptedUid = CryptoJS.AES.decrypt(
          encryptedUid,
          process.env.NEXT_PUBLIC_COOKIE_ENCRYPTION_KEY,
        ).toString(CryptoJS.enc.Utf8);

        if (decryptedUid !== id) {
          redirect("/login");
        }
      } catch (error) {
        console.error("Auth error:", error);
        redirect("/login");
      }
    } else {
      redirect("/login");
    }
  }, [id]);

  async function handleSavePassword(formData) {
    const response = await fetch("/api/sendPassword", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    await response.json();
    fetchEntries();
  }

  async function fetchEntries() {
    const response = await fetch(`/api/getEntries?id=${id}`);
    const getdata = await response.json();

    getdata.forEach((item) => {
      const decryptedPass = CryptoJS.AES.decrypt(
        item.password,
        process.env.NEXT_PUBLIC_PASSWORD_ENCRYPTION_KEY,
      ).toString(CryptoJS.enc.Utf8);
      item.password = decryptedPass;
    });

    setData(getdata.reverse());
    setLoading(false);
  }
// useeffect to fetch entries and reload only when id changes, this is important because we dont want to fetch entries on every render, only when the user id changes (which happens on login)
  useEffect(() => {
    if (id) {
      fetchEntries();
    }
  }, [id]);

  return (
    <>
      <div
        className="flex flex-row justify-between items-center border-b-1 border-gray-700
     px-5 py-3"
      >
        <h1 className="text-4xl font-bold">PassMan</h1>

        <button
          className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded"
          onClick={() => {
            Cookies.remove("uid", { path: "/" });
            redirect("/login");
          }}
        >
          Logout
        </button>
      </div>

      <h3 className="text-white text-xl mt-5 ml-3">Welcome, {id}!</h3>

      <div className="mt-10">
        <h1 className="text-white text-2xl mb-6  ml-3 mr-2">Quick Add</h1>
        <div className="flex flex-col gap-2 border-b-1  border-gray-700 px-3 py-3 bg-gray-800  rounded-lg">
          <PasswordForm onSubmit={handleSavePassword} id={id} />
        </div>
        <div className="mt-12 ml-8">
           {/* && means if error is not null then only show the error div */}
          {error && <div className="text-red-500 text-xl">Error: {error}</div>}
          <PasswordList data={data} loading={loading} uid={id} />
        </div>
      </div>
    </>
  );
};

export default Page;
