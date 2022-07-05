import TutorialDataService from '../services/TutorialService'
import React, { useState } from "react";

const ImportDb = () => {

  let responseStatus = 0
  let [msg, setMsg] = useState("This will overwrite any data in the database with the most recent back up. If this is the first time running it, it will initialize the database.")

  async function doit() {
    if (window.confirm('Are you sure?')) {
      setMsg("Importing...")
      let r = await TutorialDataService.importDb()
      responseStatus = r.status
      if (r.status === 200) {
        msg = r.data.message
      } else {
        msg = r.data.error
      }
      setMsg(msg)
    } else {
      setMsg("Cancelled. No import done.")
    }
  }

  return (<div key={responseStatus}>{msg}<br/><br/>
    <button
      className="btn btn-danger"
      onClick={ () => { doit() }}
    >
      Import Database
    </button></div>)

}

export default ImportDb