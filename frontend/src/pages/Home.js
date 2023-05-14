import React, { useEffect, useContext, useState } from "react";
import AuthContext from "../context/AuthContext";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const { authTokens,logOutUser } = useContext(AuthContext)
  
  const getNotes = async () => {
    let response = await fetch('http://127.0.0.1:8000/api/notes/', {
      method: 'GET',
      headers:
      {
        'Content-Type': 'application/json',
        'Authorization':'Bearer '+ String(authTokens.access)
      }
    })
    let data = await response.json()
    if (response.status === 200) {
      setNotes(data)
    } else if(response.statusText==='Unauthorized'){
      logOutUser()
    }
    
  }
  useEffect(() => {
    getNotes()
  },[])
  return (
    <div>
      <p>You are logged to the home page</p>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>{note.body}</li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
