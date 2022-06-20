import { Navigate } from 'react-router-dom'
import AuthService from '../services/auth.service'

const Protected = ({ currentUser, children }) => {

  if (!currentUser) {
    // if the browser is refreshed, the currentUser is not retrieved in App.js, so double check user is
    // not logged in otherwise, if they refresh the browser and come here, they get redirected
    currentUser = AuthService.getCurrentUser()
  }
  if (!currentUser) {
    return <Navigate to="/" state={{isRedirect:1}} replace/>
  }
  return children
}

export default Protected
