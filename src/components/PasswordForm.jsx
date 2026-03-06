"use client";
import { useState } from "react";
import CryptoJS from 'crypto-js';

const PasswordForm = ({ onSubmit, id }) => {
  function neutraliseString(strVar) {
    strVar = String(strVar);
    strVar = strVar.trim();
    return strVar;
  }

  const [viewIcon, setviewIcon] = useState("fa-solid fa-eye");
  const [psswrdType, setpsswrdType] = useState("password");
  const [viewStyle, setviewStyle] = useState({ visibility: "hidden" });
  const [loading, setLoading] = useState(false);


  
  
      function RandomPassword() {
      const length = 12;
      const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
      let password = "";
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
      }
      return password;
    }


  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    let form = e.target;
    let encryptedPass = CryptoJS.AES.encrypt(
      form.password.value, 
      process.env.NEXT_PUBLIC_PASSWORD_ENCRYPTION_KEY
    ).toString();
    let website = neutraliseString(form.website.value);
    let username = neutraliseString(form.username.value);
    let uid = id;
    let data = { website, username, password: encryptedPass, uid };

    await onSubmit(data);
    form.reset();
    setviewStyle({ visibility: "hidden" });
    setLoading(false);
  }

  function ToggleViewPsswrd(e) {
    e.preventDefault();
    setviewIcon(viewIcon === "fa-solid fa-eye-slash" ? "fa-solid fa-eye" : "fa-solid fa-eye-slash");
    setpsswrdType(psswrdType === "password" ? "text" : "password");
  }

  return (
    <form method="POST" className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          name="website"
          placeholder="Website name"
          className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
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
          className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="button"
          onClick={() => {
            const randomPass = RandomPassword();
            document.querySelector('input[name="password"]').value = randomPass;
            setviewStyle({ 
              visibility: "visible" 
            });
          }}
          style={viewStyle}
          className="absolute right-3 top-3 text-gray-400 hover:text-white"
        >
          <i className="fa-solid fa-random"></i>
        </button>
        <button
          type="button"
          onClick={ToggleViewPsswrd}
          style={viewStyle}
          className="absolute right-10 top-3 text-gray-400 hover:text-white"
        >
          <i className={viewIcon}></i>
        </button>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Password"}
      </button>
    </form>
  );
};

export default PasswordForm;