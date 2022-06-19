import React from "react"
import AuthService from "../services/auth.service"
import configs from "../configs"
import { useLocation } from 'react-router-dom'

const Home = () => {

  const location = useLocation()
  const { state } = location
  const user = AuthService.getCurrentUser()
  let signInRequiredMsgStyle = {display:'none'}
  if (state && state.isRedirect) {
    signInRequiredMsgStyle = {display:'block',color:'red'}
  }

  return (
    <div className="container">
      <h3>Welcome!</h3>
      <p style={signInRequiredMsgStyle}>You must be signed in to access that page.</p>
      <p>This is the admin site for creating and editing tutorials based on FlashCards.</p>
      <p>You can create up to 3 tutorials a day that have a minimum of 5 and a maximum of 20 FlashCards.</p>
      <p>Once you're done creating a tutorial, you can Publish it and access it from this site.</p>
      <p>If a moderator approves your tutorial, everyone will be able to
        access it from the <a href={configs.flashcardsappurl}>main category list</a>.</p>
      <p>Questions, bugs or comments, contact flashcards@ezcg.com</p>
      <p style={{color:"green"}}>
      {!user ? ("To get started, sign in with Google above.") : ("")}
      </p>
    </div>
  )
}

export default Home
