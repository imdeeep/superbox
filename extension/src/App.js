import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { FaUser } from "react-icons/fa";
import { CiLogin } from "react-icons/ci";
import { FaRegCopy } from "react-icons/fa6";
import { MdSubdirectoryArrowLeft } from "react-icons/md";
import Modal from "./components/Modal";
import NotesModal from "./components/NotesModal.js";
import { BASE_URL , FRONTEND_URL } from "./constant/data";
import { useAuth } from "./context/AuthContext.jsx";
import LoadingSpinner from "./components/LoadingSpinner.js"

const App = () => {
  const { setUser, user } = useAuth();
  const [contexts, setContexts] = useState([]);
  const [modal, setModal] = useState(false);
  const [notesModal, setNotesModal] = useState(false);

  console.log(contexts)

  const handleCopy = (context) => {
    navigator.clipboard
      .writeText(context)
      .then(() => {
        console.log(contexts);
        alert("Context copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("trying...")
        const response = await axios.get(
          `${BASE_URL}api/v1/context/allcontexts/${user.id}`
        );
        console.log(response.data)
        setContexts(response.data);
      } catch (error) {
        console.log("Error in fetching Contexts:", error);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (typeof chrome === "undefined" || !chrome.cookies) {
          console.error(
            "Chrome cookies API is not available in this environment."
          );
          return;
        }

        chrome.cookies.get(
          { url: FRONTEND_URL, name: "tk" },
          async (cookie) => {
            if (cookie && cookie.value) {
              console.log("authToken:", cookie.value);
              const response = await axios.post(`${BASE_URL}auth/user`, {
                token: cookie.value,
              });
              if (response.data.success) {
                console.log('User authenticated:', response.data.user);
                setUser(response.data.user);
              } else {
                setUser(null);
                console.log("Authentication failed");
              }
            } else {
              console.log("No authToken found. User is not authenticated.");
              setUser(null);
            }
          }
        );
      } catch (error) {
        console.error("Error during authentication:", error);
        setUser(null);
      }
    };

    checkAuth();
  }, [setUser]);
                                                  
  return (
    <div className="body">
      {modal ? (
        <Modal onClose={() => setModal(false)} setContexts={setContexts} />
      ) : null}
      {
        notesModal ? (
        <NotesModal onClose={()=> setNotesModal(false)}/>
      ) : null
      }
      <div className="header">
        <h1 className="headerH1">superbox</h1>
        {user ? (
          <button className="iconButton">
            <FaUser size={16} />
          </button>
        ) : (
          <button
            className="iconButton"
            onClick={() => {
              window.open("https://superb0x.vercel.app", "_blank");
            }}
          >
            <CiLogin size={20} />
          </button>
        )}
      </div>
      <div className="mainButtons">
        <button className="mainButton" onClick={() => setModal(true)}>
          Save Context
        </button>
        <button className="mainButton" onClick={()=> setNotesModal(true)}>Add Notes</button>
      </div>
      <div className="recentContexts">
        <h2 className="recentContextsH2">Recent Operations</h2>
        <div className="contextGrid">
          {contexts.map((context, index) => (
            <div className="contextItem" key={index}>
              <button
                className="copyButton"
                onClick={() => handleCopy(context.refineContext)}
              >
                <FaRegCopy size={15} />
              </button>
              <div className="title">{context.title}</div>
              {
                context.temporary == false ? (<button className="continue">
                  Continue
                  <MdSubdirectoryArrowLeft /></button>) : null 
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
