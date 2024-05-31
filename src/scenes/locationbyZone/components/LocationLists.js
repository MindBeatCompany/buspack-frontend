import React, { useState } from "react";
import "../styles.scss";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { ActionButton } from "../../../components";
import { v4 as uuidv4 } from "uuid";
import Swal from "sweetalert2";

const LocationLists = (props) => {
  const [zoneList, setZoneList] = useState([]);

  let t = props.t;
  let setSelectedValues = props.setSelectedValues;
  let setselectValues = props.setSelectValues; //state de checked values
  let setzipCodesRows = props.setzipCodesRows;
  let setRows = props.setRows;
  let rows = props.rows;
  let zipCodesRows = props.zipCodesRows;
  let selectValues = props.checkedValues; //checked values
  let checkboxValue = props.checkboxAllValue;
  let setCheckboxValue = props.setCheckboxValue;
  let addedCps = props.addedCps;
  let setAddedCps = props.setAddedCps;
  let data = props.accdata;
  let setSelectedProvince = props.setSelectedProvince;
 
  //array with objects cps and locality.
  const CpsandLocality = data.map(function (obj) {
    const rObj = {
      cp: obj.zip_code,
      locality: obj.locality_name,
    };
    return rObj;
  });
  let cpsandlocality = CpsandLocality.filter((item) =>
    selectValues.map((i) => i).includes(`${item.cp} - ${item.locality}`)
  );

  function handleAddCp() {

  let catchErrorCp = addedCps.filter((item) => selectValues.map((i) => i).includes(`${item.cp} - ${item.locality}`));
  console.log(catchErrorCp)
  if (catchErrorCp.length > 0) {
    let repeatCps = []; 
    catchErrorCp.map((item)=>
      repeatCps.push(item.cp)
    )
    Swal.fire({
      title: `${repeatCps.map((item) => `CP: ${item} ya pertenece a una zona.`).join("\n")}`,
      confirmButtonText: "Cerrar",
    })
  }

  let filteredRepeatCases = cpsandlocality
    .filter(
      (item) =>
        !zoneList.map((i) => i.props.children[2]).includes(item.locality)
    )
    .filter(
      (item) =>
    !addedCps.map((i) => i.locality).includes(item.locality));
    console.log(filteredRepeatCases)

    setZoneList((prevList) =>
      prevList.concat(
        filteredRepeatCases.map(function (item) {
            const key = uuidv4(); // make unic key for each element
            return (
              <ListGroupItem
                key={key}
                className="location-list-item"
                style={{ textAlign: "center" }}
              >
                {item.cp} - {item.locality}
              </ListGroupItem>
            );
          })
        ));
    
    if (checkboxValue === true) {
      setCheckboxValue(!checkboxValue);
    } 
    setselectValues([]);
     setSelectedValues([]);
    setAddedCps((prevList) => prevList.concat(filteredRepeatCases));
    setSelectedProvince();
  }
  
  function handleFilas() {
    let selectrows = rows.filter(
      (i) =>
        !selectValues
          .map((index) => index)
          .includes(i.props.children[0].props.children)
    );
    setRows(selectrows);
    let selectzipcoderows = zipCodesRows.filter(
      (i) =>
        !selectValues
          .map((index) => index)
          .includes(i.props.children[0].props.children.toString())
    );
    setzipCodesRows(selectzipcoderows);
  }

  function handleDelete() {
    console.log(zoneList);
    console.log(selectValues);
    let newZoneList = zoneList.filter(
      (item) =>
        !selectValues.includes(
          `${item.props.children[0].toString()} - ${item.props.children[2]}`
        )
    );
    setZoneList([...newZoneList]);
    if (checkboxValue === true) {
      setselectValues([]);
      setSelectedValues([]);
      setCheckboxValue(!checkboxValue);
    } else {
      setselectValues([]);
      setSelectedValues([]);
    }
    setAddedCps((prevList) => prevList.filter(function(item) {
     return !selectValues.map((i) => i).includes(`${item.cp} - ${item.locality}`);
    }));
    setSelectedProvince();
  }

  console.log(selectValues);
  console.log(addedCps);
  
  return (
    <div>
      <h5 style={{ textAlign: "center", padding: "0.5rem" }}>
        {props.zoneName ? props.zoneName : "Zona"}
      </h5>
      <ListGroup className="location-list">{zoneList}</ListGroup>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyItems: "center",
          padding: "1rem",
        }}
      >
        <ActionButton
          onClick={() => {
            handleAddCp();
            handleFilas();
          }}
        >
          {t("locationByZone.actionButton3")}
        </ActionButton>
        <ActionButton
          onClick={() => {
            handleDelete();
            handleFilas();
          }}
        >
          {t("locationByZone.actionButton4")}
        </ActionButton>
      </div>
    </div>
  );
};

export default LocationLists;
