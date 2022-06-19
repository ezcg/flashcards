import React, {useState} from 'react';
import { useGoogleLogin } from '@react-oauth/google';
//import { refreshTokenSetup } from '../utils/refreshToken';
import AuthService from "../services/auth.service";
import Message from "./Message";
import axios from "axios";

function LoginHooks() {

  const [messageObj, setMessageObj] = useState({message:"", success:0, errorObj:{}});

  const onSuccess = async (res) => {
    const userInfo = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      { headers: { Authorization: 'Bearer ' + res.access_token } },
    )
    AuthService.login(userInfo.data).then((r) => {
        window.location.reload();
      },
      (error) => {
        console.log("AuthService.login error", error);
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        let errorObj = {};
        errorObj.message = resMessage;
        setMessageObj({message:"", success:0, errorObj});
      }
    )
    //refreshTokenSetup(res)
  }

  const onFailure = (res) => {
    alert(
      `Failed to login.`
    );
  };

  const login = useGoogleLogin({
    onSuccess,
    onFailure,
    flow: 'implicit'
  })

  return (
    <div>

      <button onClick={() => login()} className="button">
        <img src="/icons/google.svg" alt="google login" className="icon"></img>
        <span className="buttonText">Sign in with Google</span>
      </button>
      <Message messageObj={messageObj} />
    </div>
  );
}

export default LoginHooks