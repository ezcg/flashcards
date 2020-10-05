import React, {useState} from 'react';
import { useGoogleLogin } from 'react-google-login';
import { refreshTokenSetup } from '../utils/refreshToken';
import configs from "../configs";
import AuthService from "../services/auth.service";
import Message from "./Message";
import { useHistory } from "react-router-dom";

const clientId = configs.GOOGLE_CLIENT_ID;

function LoginHooks(props) {

  const history = useHistory();
  const [messageObj, setMessageObj] = useState({message:"", success:0, errorObj:{}});

  const onSuccess = (res) => {
    AuthService.login(res.profileObj).then(
      () => {
        history.push("/tutorials/my");
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
    );
    refreshTokenSetup(res);
  };

  const onFailure = (res) => {
    console.log("onFailure() response:", res);
    alert(
      `Failed to login.`
    );
  };

  const { signIn } = useGoogleLogin({
    onSuccess,
    onFailure,
    clientId,
    isSignedIn: true,
    accessType: 'offline'
  });

  return (
    <div>
      <button onClick={signIn} className="button">
        <img src="/icons/google.svg" alt="google login" className="icon"></img>
        <span className="buttonText">Sign in with Google</span>
      </button>
      <Message messageObj={messageObj} />
    </div>
  );
}

export default LoginHooks;
