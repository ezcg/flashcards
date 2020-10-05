import React from 'react';
import { useGoogleLogout } from 'react-google-login';
import configs from '../configs';
import AuthService from "../services/auth.service";
import { useHistory } from "react-router-dom";

const clientId = configs.GOOGLE_CLIENT_ID;

export default function LogoutHooks(props) {

  const history = useHistory();

  const onLogoutSuccess = (res) => {
    AuthService.logout();
    history.push("/home");
    window.location.reload();
  };

  const onFailure = () => {
    console.log('Handle failure cases');
  };

  const { signOut } = useGoogleLogout({
    clientId,
    onLogoutSuccess,
    onFailure,
  });

  return (
    <button onClick={signOut} className="button">
      <img src="/icons/google.svg" alt="google logout" className="icon"></img>
      <span className="buttonText">Sign out</span>
    </button>
  );
}
