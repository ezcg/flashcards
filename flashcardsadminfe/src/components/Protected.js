import { Navigate } from 'react-router-dom'

const Protected = ({ currentUser, children }) => {

  if (!currentUser) {
    return <Navigate to="/" state={{isRedirect:1}} replace/>
  }
  return children
}

export default Protected
