import { faLandmark } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { useState, useEffect } from "react";
import { get } from "react-hook-form";
import IconInfo from "../../../resources/icons/IconInfo";
import "../styles.scss";



const ModalInfo = () => {
    const [show, setShow] = useState(false);

  return (
    <>
        <div
          onMouseEnter={()=>setShow(true)}
          onMouseLeave={()=>setShow(false)}
        >
          <IconInfo/>
        </div>
    
        <h6 
            id="text-info" 
            className={show ? "show-modal" : "hide-modal"}
             style={{ marginLeft: "0.5rem" }}>
        Las Localidades no pueden pertencer a más de una zona.
      </h6>
    
    </>
  );
};

export default ModalInfo;
