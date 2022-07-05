import TutorialDataService from '../services/TutorialService'
import React, { useState } from "react";

const BackupDb = () => {

  let responseStatus = 0
  let [msg, setMsg] = useState("This will overwrite any existing backup with what is in the database.")

  async function doit() {
    if (window.confirm('Are you sure?')) {
      setMsg("Backing up...")
      let r = await TutorialDataService.backupDb()
      responseStatus = r.status
      if (r.status === 200) {
        msg = r.data.message
      } else {
        msg = r.data.error
      }
      setMsg(msg)
    } else {
      setMsg("Cancelled. No backup done.")
    }
  }

  return (<div key={responseStatus}>{msg}<br/><br/>
    <button
      className="btn btn-danger"
      onClick={ () => { doit() }}
    >
    Backup Database
    </button></div>)

}

export default BackupDb