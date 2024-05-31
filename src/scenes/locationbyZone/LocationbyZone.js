import React, { useEffect } from "react";
import { useState } from "react";
import "./styles.scss";
import { Col, Container, Form, Row, Table } from "react-bootstrap";
import LocationLists from "./components/LocationLists";
import { ActionButton, CustomCheckbox, ScreenNav } from "../../components";
import { compose } from "redux";
import { connect } from "react-redux";
import { authActions } from "../../state/ducks/auth";
import { userActions } from "../../state/ducks/user";
import { withTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import ModalInfo from "./components/ModalInfo";

const LocationbyZone = (props) => {
  const [accdata, setAccData] = useState([]); // reception of zipcodes to list them.
  const [accdata1, setAccData1] = useState([]); // reception of zipcodes to list them
  const [pricingData, setPricingData] = useState({}); // reception of zipcodes to list them.
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedValues, setSelectedValues] = useState([]);//new array for select all checkboxes of cps filter.
  const [checkboxValue , setCheckboxValue] = useState(false); //state for select all checkbox
  const [numRows, setNumRows] = useState(0);
  const [rows, setRows] = useState([]);
  const [checked, setChecked] = useState([
    {
      checkboxId: "",
      checkboxValue: false,
    },
  ]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [zipCodesRows, setzipCodesRows] = useState([]);
  const [zipCodes1, setzipCodes1] = useState([]);
  const [checked2, setChecked2] = useState([]);
  const [checkedValues, setCheckedValues] = useState([]);
  const [addedCps, setAddedCps] = useState([]);

  const companyName = props.history.location.state.companyName;
  const prueba = props.history.location.state.rows;
  const { t, history } = props;
  const value = JSON.parse(localStorage.getItem("persist:root"));
  const valuetoken = JSON.parse(value.auth);
  const token = valuetoken.userData.token;
  const { inputValues } = props.location.state;

  function handleCpChange(event) {
    let selectedZipCode = event.currentTarget.value;
    if (selectedZipCode === "") {
      setRows(rows);
    } else setSelectedValue(selectedZipCode);
  }
  //dinamic rows creation to the table.
  function addFilas(num) {
    setChecked([]);
    setNumRows(num);
  }

  //function to render zones by client
  const locationLists = [];
  for (let i = 0; i < prueba; i++) {
    locationLists.push(
      <Col key={i} xs={12} sm={6} md={4} lg={3}>
        <LocationLists
          checkedValues={checkedValues}
          addedCps={addedCps}
          zoneName={inputValues[i] ? inputValues[i].value : ""}
          accdata={accdata}
          rows={rows}
          zipCodesRows={zipCodesRows}
          checkboxAllValue={checkboxValue} 
          t={t}
          setRows={setRows}
          setzipCodesRows={setzipCodesRows}
          setSelectValues={setCheckedValues}
          setSelectedValues={setSelectedValues}
          setCheckboxValue={setCheckboxValue}
          setAddedCps={setAddedCps}
          setSelectedProvince = {setSelectedProvince}
        />
      </Col>
    );
  }


  //dinamic creation of table´s rows
  useEffect(() => {
    const newRows = [];
    for (let i = 0; i < numRows; i++) {
      const key = uuidv4(); // make unic key for each element
      newRows.push(
        <tr style={{ display: "table", width: "100%" }} key={key}>
          <td
            style={{ textAlign: "center", width: "75%", tableLayout: "fixed" }}
          >
            {selectedValue}
          </td>

          <td
            style={{ textAlign: "center", width: "25%", tableLayout: "fixed" }}
          >
            <CustomCheckbox
              name={`checkbox ${key}`}
              value={key}
              id={key}
              onChange={(event) => handleCheckboxChange(event, key)}
              checked={checked[key]}
            />
          </td>
        </tr>
      );
    }
    setRows((prevRows) => prevRows.concat(newRows));
    setSelectedValues((prevValues) => prevValues.concat(selectedValue));
  }, [numRows, selectedValue]);

  //event required to checkboxes.
  function handleCheckboxChange(event) {
    setChecked(checked.shift());
    const newcheckboxId = event.currentTarget.value;
    const newcheckboxValue = event.currentTarget.checked;
    const checkbox = {
      checkboxId: newcheckboxId,
      checkboxValue: newcheckboxValue,
    };
    setChecked(checked.push(checkbox));

    if (newcheckboxValue === true) {
      setCheckedValues((prevRows) => prevRows.concat(selectedValue));
    } else {
      setCheckedValues((prevRows) =>
        prevRows.filter((element) => element !== selectedValue)
      );
    }
  }

  //headers to get api access.
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  });
  const config = {
    method: "GET",
    headers: headers,
  };

  //new array with provinces.
  let provinces = [];
  provinces = accdata.map(function (elem) {
    let returnObjeto = { province_name: elem.province_name };
    return returnObjeto;
  });

  let provincescp = [];
  provincescp = accdata.map(function (elem) {
    let returnObjeto = {
      province_name: elem.province_name,
      zip_code: elem.zip_code,
      locality_name: elem.locality_name,
    };
    return returnObjeto;
  });

  function getZipCodesForProvince(provincescp, selectedProvince) {
    let zipCodes = [];
    for (let i = 0; i < provincescp.length; i++) {
      if (provincescp[i].province_name === selectedProvince) {
        zipCodes.push(
          `${provincescp[i].zip_code} - ${provincescp[i].locality_name}`
        );
      }
    }
    return zipCodes;
  }
  const zipCodes = getZipCodesForProvince(provincescp, selectedProvince); //print zipcode of each province


  const handleProvinceChange = (event) => {
    setzipCodesRows([]);
    setSelectedProvince(event.target.value);
  };

  //make province list without repeat them
  const provincesOptions = provinces
    .filter(
      (province, index, self) =>
        self.findIndex((t) => t.province_name === province.province_name) ===
        index
    )
    .map((province, index) => (
      <option key={index} value={province.province_name}>
        {province.province_name}
      </option>
    ));

  useEffect(() => {
    setzipCodesRows((prevRows) =>
      prevRows.concat(
        zipCodes.map((zipCode, index) => (
          <tr
            style={{ display: "table", width: "100%" }}
            key={`${selectedProvince}-${zipCode}-${index}`}
          >
            <td style={{ textAlign: "center", width: "75%" }}>{zipCode}</td>
            <td style={{ textAlign: "center", width: "25%" }}>
              <CustomCheckbox
                value={index}
                name={zipCode}
                id={`${index} - checkbox`}
                onChange={(event) => handleCheckboxChange2(event, index)}
                checked={checked2[index]}
              />
            </td>
          </tr>
        ))
      )
    );
  }, [selectedProvince, checked2]);

  //event required to checkboxes.
  const handleCheckboxChange2 = (event) => {
    const checkboxCp = event.target.name; //get zipcode from select checkbox
    const checkboxValue = event.target.checked; //get value from select checkbox
    if (checkboxValue === true) {
      setCheckedValues((prevRows) => prevRows.concat(checkboxCp));
    } else {
      setCheckedValues((prevRows) =>
        prevRows.filter((element) => element !== checkboxCp)
      );
    }
  };

   //fetch data localities endpoint.
    useEffect(() => {
      fetch("http://localhost:4200/v1/api/pricings/localities", config)
        .then((response) => response.json())
        .then((accdata) => {
          setAccData(accdata.data);
        });
    }, []);


  //go back function.
  function handleBack() {
    props.history.goBack();
  }

  //handle all checkboxes
  function handleAllCheckboxes(event) {
    setCheckboxValue(event.target.checked);
    setCheckedValues([]); 
    if (checkboxValue === true) {
      const checkboxes = document.getElementsByClassName("custom-checkbox");
      let selectCheckbox = Array.from(checkboxes);
      console.log(selectCheckbox)
      selectCheckbox.forEach(element => {
        element.checked = false;
      }); 
      setCheckedValues([]); 
    } else {
      const checkboxes = document.getElementsByClassName("custom-checkbox");
      let selectCheckbox = Array.from(checkboxes);
      selectCheckbox.forEach(element => {
        element.checked = true;
      }); 
      setCheckedValues((prevRows) => prevRows.concat(zipCodes, selectedValues));
      } 
    }
  
  //POST User data of pricing to API 
   useEffect(() => {
      const dataPricing = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({name: "TARIFARIO NUEVO2",
        validSince: "2023-02-27T18:06:22.438Z",
        areas: [
         {
           name: "AMBA",
           finalKilogramValue: 100,
           increasedWeight: 20,
           startingTariffPrice: 1100,
           tariffPriceIncrease: 600,
           insurance: 700,
           homeDelivery: 745,
           homeWithdrawal: 300,
           others: 800,
           additionalPriceIncrease: 110,
           localities: [
            {
              "zipCode": 1888,
              "name": "FLORENCIO VARELA"
            }
          ]
         }
       ],
       accountId: 1,
     })};
      fetch("http://localhost:4200/v1/api/pricings/", dataPricing)
      .then(response => response.json())
      .then(data => setPricingData(data));
  }, []);

  console.log("Valor de estado actual:", pricingData )
  console.log(checkedValues)
  console.log(zipCodes)
  console.log(locationLists)
  return (
    <Container fluid style={{ marginBottom: "3rem" }}>
      <Row style={{ justifyContent: "flex-start", marginTop: "3rem" }}>
        <Col xs={9} sm={8}>
          <h2>
            {t("locationByZone.mainTitle")} - {companyName}
          </h2>
        </Col>
      </Row>
      <Row style={{ justifyContent: "flex-start", marginTop: "3rem" }}>
        <Col xs={12} sm={8}>
          <ScreenNav
            history={history}
            previousPage={t("locationByZone.previousPage")}
            currentPage={t("locationByZone.currentPage")}
          />
         <h5>{t("locationByZone.subTitle")}</h5>
        </Col>
      </Row>
      <Row style={{ justifyContent: "flex-start", marginTop: "0.5rem" }}>
        <Col xs={10} sm={6} md={6} lg={2}>
         <ModalInfo/>
        </Col>
      </Row>
      <Container fluid>
        <Row style={{ justifyContent: "center", marginTop: "5rem" }}>
          {locationLists}
        </Row>
      </Container>
      <Container fluid>
        <Row style={{ justifyContent: "center", alignContent: "center" }}>
          <Col xs={12} lg={6}>
            <div className="mt-4">
              <Form>
                <Table style={{ overflowX: "scroll" }} bordered hover>
                  <thead style={{ display: "block" }}>
                    <tr
                      style={{ display: "table", width: "100%" }}
                      className="trclass"
                    >
                      <th className="th-custom">
                        {t("locationByZone.tableTitle1")}
                        <select
                          className="select"
                          onChange={(event) => {
                            handleCpChange(event);
                            addFilas(1);
                          }}
                        >
                          <option value="">
                            {t("locationByZone.defaultOptionValue2")}
                          </option>
                          {accdata.map((cp, index) => (
                            <option
                              key={index}
                              value={`${cp.zip_code} - ${cp.locality_name}`}
                            >
                              {cp.zip_code} - {cp.locality_name}
                            </option>
                          ))}
                        </select>
                      </th>
                      <th className="th-custom">
                        {t("locationByZone.tableTitle2")}
                        <select
                          className="select"
                          onChange={handleProvinceChange}
                          value={selectedProvince}
                        >
                          <option value="">
                            {t("locationByZone.defaultOptionValue1")}
                          </option>
                          {provincesOptions}
                        </select>
                      </th>
                      <th style={{ width: "25%" }}>
                        {t("locationByZone.tableTitle3")}
                        <br></br>
                        <br></br>
                        <h6 className="select-all">
                          {t("locationByZone.tableTitle4")}
                          <input
                            type="checkbox"
                            className="check-all"
                            checked={checkboxValue}
                            onChange={(event) => handleAllCheckboxes(event)}
                          ></input>
                        </h6>
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    style={{
                      display: "block",
                      width: "100%",
                      overflowY: "auto",
                      maxHeight: "40vh",
                    }}
                  >
                    {rows}
                    {zipCodesRows}
                  </tbody>
                </Table>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
      <Row
        style={{
          width: "100%",
          justifyContent: "flex-end",
        }}
      >
        <Col
          style={{
            margin: "2rem",
            justifyContent: "left",
          }}
          xs={11}
          sm={6}
          md={3}
          className="p-0"
        >
          <ActionButton 
             type="submit" 
             width="90" 
            >
            {t("locationByZone.actionButton1")}
          </ActionButton>
          <ActionButton secondary width="90" onClick={handleBack}>
            {t("locationByZone.actionButton2")}
          </ActionButton>
        </Col>
      </Row>
    </Container>
  );
};

const mapDispatchToProps = ({ auth, user }) => ({ auth, user });
export default compose(
  connect(mapDispatchToProps, { ...authActions, ...userActions }),
  withTranslation()
)(LocationbyZone);
