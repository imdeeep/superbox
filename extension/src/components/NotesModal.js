import React, { useState } from "react";
import "./NotesModal.css";
import { IoCloseCircle } from "react-icons/io5";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "axios";
import {BASE_URL} from "../constant/data.js";

const NotesModal = ({ onClose }) => {
  const { user } = useAuth(); 
  const [notes, setNotes] = useState(""); 

  const handleSaveNotes = async () => {
    try {
      const body = {
        CreatedBy: user.id,
        NotesDescription: notes,
      };

      const response = await axios.post(
        `${BASE_URL}api/v1/notes/create/`,
        body,
        {
          headers: {
            "Content-Type": "application/json", 
          },
        }
      );

      if (response.status === 200) {
        alert("Notes saved successfully!");
        onClose(false); // Close the modal
      } else {
        alert("Failed to save notes. Please try again.");
      }
    } catch (error) {
      console.error("Error creating note:", error);
      alert("An error occurred while saving the note.");
    }
  };

  return (
    <div className="modal">
      <div className="header">
        <h1 className="headerH1">superbox</h1>
        <button className="iconButton" onClick={() => onClose(false)}>
          <IoCloseCircle size={26} />
        </button>
      </div>
      <div className="mainModal">
        <h2 className="notesHeading">Add Notes</h2>
        <textarea
          className="notesInput"
          placeholder="Add notes here..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)} // Update the state with input value
        ></textarea>
        <button className="modalbutton" onClick={handleSaveNotes}>
          Save Notes
        </button>
      </div>
    </div>
  );
};

export default NotesModal;
