import React from 'react';
import { googleLogout } from '@react-oauth/google';
import AuthService from "../services/auth.service";

export default function LogoutHooks() {

  const signOut = () => {
    new Promise((resolve, reject) => {
      return resolve(googleLogout())
    }).then(() => {
      return AuthService.logout();
    }).then(() => {
      window.location.reload();
    })
  }

  return (
    <button onClick={() => signOut()} className="button">
      <img src="/icons/google.svg" alt="google logout" className="icon"></img>
      <span className="buttonText">Sign out</span>
    </button>
  )

}