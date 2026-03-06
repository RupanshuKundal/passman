"use client";

import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';

export default function Home() {
  useEffect(() => {
    const encryptedUid = Cookies.get("uid");
    
    if (encryptedUid) {
      try {
        const decryptedUid = CryptoJS.AES.decrypt(encryptedUid, 'cookey').toString(CryptoJS.enc.Utf8);
        if (decryptedUid) {
          redirect(`/dashboard/${decryptedUid}`);
        } else {
          redirect('/register');
        }
      } catch (error) {
        redirect('/register');
      }
    } else {
      redirect('/register');
    }
  }, []);
  
  return <div>Loading...</div>;
}