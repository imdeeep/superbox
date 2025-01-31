import React from "react";
import "./Modal.css";
import { IoCloseCircle } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { MdSubdirectoryArrowLeft } from "react-icons/md";
import { saveContext, saveContextWithOrg } from "../chromeutils";
import { useAuth } from "../context/AuthContext.jsx";
import { useEffect, useState } from "react";
import { BASE_URL } from "../constant/data";
import axios from "axios";

const Modal = ({ onClose, setContexts }) => {
  const { user } = useAuth();
  const [organisations, setOrganisations] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}api/v1/organisation/${user.id}`
        );
        console.log(response.data);
        setOrganisations(response.data);
      } catch (error) {
        console.log("Error in fetching Organisations:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="modal">
      <div className="header">
        <h1 className="headerH1">superbox</h1>
        <button className="iconButton" onClick={() => onClose(false)}>
          <IoCloseCircle size={26} />
        </button>
      </div>
      <div className="mainModal">
        <div className="modalButtons">
          <button
            className=" modalbutton"
            onClick={() => {
              window.open(
                "https://superb0x.vercel.app/organisations",
                "_blank"
              );
            }}
          >
            Create Organisation
          </button>
          <button
            className=" modalbutton"
            onClick={() => saveContext(setContexts, user.id)}
          >
            Temprory Context
          </button>
        </div>
        <div className="modalSearch">
          <input type="text" placeholder="Search Organisation" />
          <IoSearch size={16} style={{ cursor: "pointer" }} />
        </div>
      </div>
      <div className="org">
        {organisations.map((org) => (
          <div key={org._id} className="orgCard">
            <h4>{org.OrgName}</h4>
            <button className="continue" onClick={() => saveContextWithOrg(setContexts, org._id,user.id)}>
              Continue <MdSubdirectoryArrowLeft />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Modal;
