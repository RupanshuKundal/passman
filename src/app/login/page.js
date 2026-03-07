"use client";
import { redirect } from 'next/navigation';
import React, { useState } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';




const page = () => {
  const [showPassword, setShowPassword] = useState(false);
   const [viewIcon, setviewIcon] = useState("fa-solid fa-eye");
  const [psswrdType, setpsswrdType] = useState("password");
  const [viewStyle, setviewStyle] = useState({ visibility: "hidden" });
  const [loading, setLoading] = useState(false);

  if (Cookies.get("uid")) {
    const decryptedUid = CryptoJS.AES.decrypt(
      Cookies.get("uid"), 
      process.env.NEXT_PUBLIC_COOKIE_ENCRYPTION_KEY
    ).toString(CryptoJS.enc.Utf8);
    redirect(`/dashboard/${decryptedUid}`);
  }

  function ToggleViewPsswrd(e) {
    e.preventDefault();
    setviewIcon(viewIcon === "fa-solid fa-eye-slash" ? "fa-solid fa-eye" : "fa-solid fa-eye-slash");
    setpsswrdType(psswrdType === "password" ? "text" : "password");
  }

  async function login(e) {
    e.preventDefault();
    
    const response = await fetch("/api/loginAccess", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        uid: e.target.uid.value,
        password: e.target.password.value
      })
    });
    
    const data = await response.json();
    
    if (data.message === "Login Success") {
      alert("Login Success");
      const encryptedUid = CryptoJS.AES.encrypt(
        e.target.uid.value, 
        process.env.NEXT_PUBLIC_COOKIE_ENCRYPTION_KEY
      ).toString();
      Cookies.set("uid", encryptedUid, { path: '/' });
      redirect(`/dashboard/${e.target.uid.value}`);
    } else {
      alert(data.message);
    }
  }
  // add a show password button that toggles the password input type between "password" and "text"

  return (
    <form method='POST' className='flex-col flex justify-center items-center mt-65 gap-2' onSubmit={login}>
      <label>Login</label>
      <input type="text" className="bg-zinc-700 px-5 py-3 rounded" placeholder='UserID' name='uid' required />

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


      <input type="submit" placeholder='submit' className='bg-blue-900 font-bold px-5 py-1.5 rounded' />
      <Link href="/register" className='text-sm text-white'>Don't have an account? Register here</Link>
    </form>
  );
};

export default page;