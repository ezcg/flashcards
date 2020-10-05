import React from 'react'
import { Redirect } from 'react-router-dom'
import AuthService from "../services/auth.service";

const ProtectedRoute = props => {

  const currentUser = AuthService.getCurrentUser();
  const Component = props.component;
  return currentUser ? (
    <Component props={props}/>
  ) : (
    <Redirect to={{
      pathname: '/home',
      isRedirect: 1
    }} />
  );

}

export default ProtectedRoute
