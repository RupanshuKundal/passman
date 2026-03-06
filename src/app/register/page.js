"use client";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";

const page = () => {

  if (Cookies.get("uid")) {
    const decryptedUid = CryptoJS.AES.decrypt(
      Cookies.get("uid"),
      process.env.NEXT_PUBLIC_COOKIE_ENCRYPTION_KEY
    ).toString(CryptoJS.enc.Utf8);
    redirect(`/dashboard/${decryptedUid}`);
  }

    const [viewIcon, setviewIcon] = useState("fa-solid fa-eye");
    const [psswrdType, setpsswrdType] = useState("password");
    const [viewStyle, setviewStyle] = useState({ visibility: "hidden" });

      function ToggleViewPsswrd(e) {
    e.preventDefault();
    setviewIcon(viewIcon === "fa-solid fa-eye-slash" ? "fa-solid fa-eye" : "fa-solid fa-eye-slash");
    setpsswrdType(psswrdType === "password" ? "text" : "password");
  }

  async function register(e) {
    e.preventDefault();
    let form = e.target;
    let registryData = {
      uid: form.uid.value,
      password: form.password.value,
    };

    const response = await fetch("/api/sendRegistry", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(registryData),
    });
    
    const data = await response.json();
    
    if (data.error) {
      alert(data.error);
    } else {
      alert("User Registered Successfully");
      const encryptedUid = CryptoJS.AES.encrypt(
        registryData.uid, 
        process.env.NEXT_PUBLIC_COOKIE_ENCRYPTION_KEY
      ).toString();
      Cookies.set("uid", encryptedUid, { path: '/' });
      form.reset();
      redirect(`/dashboard/${registryData.uid}`);
    }
  }
  
  return (
    <>
    <div className="flex flex-row justify-between items-center border-b-1 border-gray-700
     px-5 py-3">
      <h1 className="text-4xl font-bold">PassMan</h1>
      <div className="flex flex-row justify-baseline gap-5">
      
      <p className="text-sm text-gray-500 ">Already have an account? <Link href="/login" className="text-blue-400">Login here</Link></p>

      </div>

    </div>
    <form
      method="POST"
      className="flex-col flex justify-center items-center mt-45 gap-2 "
      onSubmit={register}
    >
      <label>Register Here</label>
      <input
        type="text"
        className="bg-zinc-700 px-5 py-3 rounded"
        placeholder="UserID"
        name="uid"
        // underscores and hyphens allowed, but no spaces or special characters
        pattern="^[a-zA-Z0-9_-]+$"
        title="UserID must contain only letters, numbers, underscores, and hyphens"
        required
      />
     <div className="relative">
        <input
          type={psswrdType}
          name="password"
          placeholder="Password"
          onChange={(e) => {
            setviewStyle({ 
              visibility: e.target.value.length > 0 ? "visible" : "hidden" 
            });
          }}
          className="w-full bg-zinc-700  text-white rounded-lg px-5 py-3"
          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$"
          title="Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character"
          required
        />
        <button
          type="button"
          onClick={ToggleViewPsswrd}
          style={viewStyle}
          className="absolute right-3 top-3 text-gray-400 hover:text-white"
        >
          <i className={viewIcon}></i>
        </button>
      </div>
      <input
        type="submit"
        placeholder="submit"
        className="bg-blue-900 font-bold px-5 py-1.5 rounded "
      />
   
    </form>
    </>
  );
};

export default page;