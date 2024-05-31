import React, { useState, useEffect, useRef } from "react";
import { Form, Col, Row } from "react-bootstrap";
import { TextInput, ActionButton, CustomCheckbox } from "../../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationCircle,
  faExclamationTriangle,
  faSearch,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import "./EditForm.scss";

const EditForm = ({
  location: { state },
  t,
  history,
  editServiceRequest,
  getEnabledPlaces,
}) => {
  const [originalData, setOriginalData] = useState({});
  const [serviceData, setServiceData] = useState({});

  //modified done controls if user modified some input so it requires save changes before cancel the edit mode
  const [modifiedDone, setModifiedDone] = useState(false);
  const [validationError, setValidationError] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [enabledPlaces, setEnabledPlaces] = useState({
    options: [],
    error: null,
  });
  const [modifiedPlacesSuccess, setModifiedPlacesSuccess] = useState(false);

  useEffect(() => {
    setEditMode(state.editMode);
    setServiceData(state);
    setOriginalData(state);

    const callback = (data) => {
      if (data.success) {
        setEnabledPlaces({
          options: data.data,
          error: null,
        });
      } else {
        setEnabledPlaces({
          options: [],
          error:
            "Ha ocurrido un error al intentar obtener los lugares habilitados",
        });
      }
    };
    getEnabledPlaces({ callback });
  }, []);

  const onChange = (e) => {
    console.log("onchange", e);
    console.log(originalData.requestId.value);
    setModifiedDone(true);
    const { name, type, value, checked } = e.target;

    console.log(value);
    let val = value;

    console.log(val);
    if (type === "number") {
      val = Number(value);
    }
    if (type === "checkbox") {
      val = checked ? "SI" : "NO";
    }

    setServiceData({
      ...serviceData,
      [name]: {
        value: val,
        status: "ok",
        error: "",
      },
    });
  };

  const placeInput = useRef(null);
  const matchPlaces = () => {
    const value = placeInput.current.value;
    const isEnabledPlace = enabledPlaces.options.find(
      (place) =>
        place.enabled_place.toLowerCase() === value.toLowerCase() ||
        place.enabled_place.toLowerCase() === value.toLowerCase() + " "
    );
    if (isEnabledPlace) {
      setServiceData({
        ...serviceData,
        locality: {
          value: isEnabledPlace.locality_name,
          error: "",
          status: "ok",
        },
        province: {
          value: isEnabledPlace.province_name,
          error: "",
          status: "ok",
        },
        cpa: { value: isEnabledPlace.zip_code, error: "", status: "ok" },
      });

      setEnabledPlaces({
        ...enabledPlaces,
        error: null,
      });

      setModifiedPlacesSuccess(true);

      setTimeout(() => {
        setModifiedPlacesSuccess(false);
      }, 4000);
    } else {
      setEnabledPlaces({
        ...enabledPlaces,
        error: "No se encontró el lugar ingresado",
      });
    }
  };

  const onSubmit = () => {
    if (formValidation(serviceData)) return;

    Swal.fire({
      title: t("saveChangesQuestion"),
      showDenyButton: true,
      icon: "warning",
      confirmButtonText: t("modalButtons.accept"),
      confirmButtonColor: "#F28E2A",
      denyButtonText: t("modalButtons.cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        editServiceRequest({
          requestData: serviceData,
          idToModify: originalData.requestId.value,
        });
        setEditMode(!editMode);
        Swal.fire({
          title: t("changesHaveBeenSaved"),
          icon: "success",
          confirmButtonText: "Cerrar",
          confirmButtonColor: "#F28E2A",
        }).then((res) => {
          if (res.isConfirmed) history.goBack();
        });
      } else {
        setServiceData(originalData);
        handleEditMode(false);
        setModifiedDone(false);
        //alert("hola");
      }
    });
  };

  const formValidation = (data) => {
    const {
      requestId,
      recipientFullname,
      addressStreet,
      addressNumber,
      locality,
      province,
      cpa,
      qtyPieces,
      enabledPlaces,
      totalWeight,
      homeDelivery,
    } = data;
    // default
    const valuesToValidate = {
      requestId: requestId.value,
      recipientFullname: recipientFullname.value,
      locality: locality.value,
      province: province.value,
      cpa: cpa.value,
    };
    //with homeDelivery
    if (homeDelivery.value === "SI") {
      valuesToValidate.addressStreet = addressStreet.value;
      valuesToValidate.addressNumber = addressNumber.value;
    }

    //setValidationError([]);
    let errors = [];
    Object.keys(valuesToValidate).forEach((val) => {
      if (val.trim() === "") {
        errors.push(val);
      }
    });

    if (qtyPieces <= 0) {
      errors.push("qtyPieces");
    }
    if (totalWeight <= 0) {
      errors.push("totalWeight");
    }
    setValidationError(errors);
    return errors.length > 0;
  };

  const handleEditMode = (cancelChanges) => {
    if (cancelChanges && modifiedDone) {
      onSubmit();
      return;
    }
    setEditMode(!editMode);
  };

  const getStatusIcon = (status, msg) => {
    switch (status) {
      case "danger":
        return (
          <FontAwesomeIcon
            className="text-danger ml-2"
            icon={faExclamationCircle}
            title={msg}
          />
        );
      case "warning":
        return (
          <FontAwesomeIcon
            className="text-warning ml-2"
            icon={faExclamationTriangle}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      {Object.values(serviceData).length > 0 && (
        <Form className="editRequestForm" onSubmit={onSubmit}>
          <Row>
            <Col xs={12} md={3} className="mb-3">
              <label className="mr-2">
                <strong>{t("serviceRequests.requestId")}</strong>
                {getStatusIcon(
                  serviceData.requestId.status,
                  serviceData.requestId.error
                )}
              </label>

              <TextInput
                name="requestId"
                value={serviceData.requestId.value}
                onChange={onChange}
                readOnly={!editMode}
                type="text"
              />
              {validationError.includes("requestId") && (
                <div style={{ marginTop: "-15px" }}>
                  <span className="text-danger">{t("requiredFieldError")}</span>
                </div>
              )}
            </Col>
            <Col xs={12} md={3} className="mb-3">
              <label className="mr-2">
                <strong>{t("serviceRequests.recipient")}</strong>
                {getStatusIcon(
                  serviceData.recipientFullname.status,
                  serviceData.recipientFullname.error
                )}
              </label>
              <TextInput
                name="recipientFullname"
                value={serviceData.recipientFullname.value}
                onChange={onChange}
                readOnly={!editMode}
              />
              {validationError.includes("recipientFullname") && (
                <div style={{ marginTop: "-15px" }}>
                  <span className="text-danger">{t("requiredFieldError")}</span>
                </div>
              )}
            </Col>
            <Col xs={12} md={3} className="mb-3">
              <label className="mr-2">
                <strong>{t("serviceRequests.address")}</strong>
                {getStatusIcon(
                  serviceData.addressStreet.status,
                  serviceData.addressStreet.error
                )}
              </label>
              <TextInput
                name="addressStreet"
                value={serviceData.addressStreet.value}
                onChange={onChange}
                readOnly={!editMode}
              />
              {validationError.includes("addressStreet") && (
                <div style={{ marginTop: "-15px" }}>
                  <span className="text-danger">{t("requiredFieldError")}</span>
                </div>
              )}
            </Col>
            <Col xs={12} md={3} className="mb-3">
              <label className="mr-2">
                <strong>{t("serviceRequests.addressNumber")}</strong>
                {getStatusIcon(
                  serviceData.addressNumber.status,
                  serviceData.addressNumber.error
                )}
              </label>
              <TextInput
                name="addressNumber"
                value={serviceData.addressNumber.value}
                inputType="number"
                onChange={onChange}
                readOnly={!editMode}
              />
              {validationError.includes("addressNumber") && (
                <div style={{ marginTop: "-15px" }}>
                  <span className="text-danger">{t("requiredFieldError")}</span>
                </div>
              )}
            </Col>
            <Col xs={12} md={3} className="mb-3">
              <label className="mr-2">
                <strong>{t("serviceRequests.addressBuild")}</strong>
                {getStatusIcon(
                  serviceData.addressBuild.status,
                  serviceData.addressBuild.error
                )}
              </label>
              <TextInput
                name="addressBuild"
                value={serviceData.addressBuild.value}
                onChange={onChange}
                readOnly={!editMode}
              />
              {validationError.includes("addressBuild") && (
                <div style={{ marginTop: "-15px" }}>
                  <span className="text-danger">{t("requiredFieldError")}</span>
                </div>
              )}
            </Col>
            <Col xs={12} md={3} className="mb-3">
              <label className="mr-2">
                <strong>{t("serviceRequests.addressFloor")}</strong>
                {getStatusIcon(
                  serviceData.addressFloor.status,
                  serviceData.addressFloor.error
                )}
              </label>
              <TextInput
                name="addresssFloor"
                value={serviceData.addressFloor.value}
                onChange={onChange}
                readOnly={!editMode}
              />
              {validationError.includes("addressFloor") && (
                <div style={{ marginTop: "-15px" }}>
                  <span className="text-danger">{t("requiredFieldError")}</span>
                </div>
              )}
            </Col>
            <Col xs={12} md={3} className="mb-3">
              <label className="mr-2">
                <strong>{t("serviceRequests.addressApartment")}</strong>
                {getStatusIcon(
                  serviceData.addressApartment.status,
                  serviceData.addressApartment.error
                )}
              </label>
              <TextInput
                name="addressApartment"
                value={serviceData.addressApartment.value}
                onChange={onChange}
                readOnly={!editMode}
              />
              {validationError.includes("addressApartment") && (
                <div style={{ marginTop: "-15px" }}>
                  <span className="text-danger">{t("requiredFieldError")}</span>
                </div>
              )}
            </Col>
            <Col xs={12} md={3} className="mb-3">
              <label className="mr-2">
                <strong>{t("formLabels.availablePlaces")}</strong>
                {getStatusIcon(
                  serviceData.locality.status,
                  serviceData.locality.error
                )}
              </label>
              <div className="enabled-places">
                <input
                  className="form-control custom-input"
                  type="text"
                  list="places-data"
                  id="enabledPlaces"
                  name="enabledPlace"
                  autoComplete="off"
                  disabled={!editMode}
                  ref={placeInput}
                  value={serviceData.enabledPlace.value}
                  onChange={onChange}
                />
                <datalist id="places-data">
                  {enabledPlaces.options.map((place, idx) => (
                    <option key={idx}> {place.enabled_place} </option>
                  ))}
                </datalist>
                <ActionButton onClick={matchPlaces} disabled={!editMode}>
                  <FontAwesomeIcon icon={faSearch} />
                </ActionButton>
              </div>
              {enabledPlaces.error && (
                <div style={{ marginTop: "10px" }}>
                  <span className="text-danger"> {enabledPlaces.error}</span>
                </div>
              )}
            </Col>
            <Col xs={12} md={3} className="mb-3">
              <label className="mr-2">
                <strong>{t("serviceRequests.localidad")}</strong>
                {getStatusIcon(
                  serviceData.locality.status,
                  serviceData.locality.error
                )}
              </label>
              {modifiedPlacesSuccess && (
                <small className="text-success animate__animated animate__fadeIn">
                  <b>Actualizado</b> <FontAwesomeIcon icon={faCheckCircle} />
                </small>
              )}
              <TextInput
                name="locality"
                value={serviceData.locality.value}
                onChange={onChange}
                readOnly
              />
              {/* {validationError.includes("locality") && (
                <div style={{ marginTop: "-15px" }}>
                  <span className="text-danger">{t("requiredFieldError")}</span>
                </div>
              )} */}
            </Col>
            <Col xs={12} md={3} className="mb-3">
              <label className="mr-2">
                <strong>{t("serviceRequests.province")}</strong>
                {getStatusIcon(
                  serviceData.province.status,
                  serviceData.province.error
                )}
              </label>
              {modifiedPlacesSuccess && (
                <small className="text-success">
                  <b>Actualizado</b> <FontAwesomeIcon icon={faCheckCircle} />
                </small>
              )}
              <TextInput
                name="province"
                value={serviceData.province.value}
                onChange={onChange}
                readOnly
              />
              {/* {validationError.includes("province") && (
                <div style={{ marginTop: "-15px" }}>
                  <span className="text-danger">{t("requiredFieldError")}</span>
                </div>
              )} */}
            </Col>
            <Col xs={12} md={3} className="mb-3">
              <label className="mr-2">
                <strong>{t("serviceRequests.cpa")}</strong>
                {getStatusIcon(serviceData.cpa.status, serviceData.cpa.error)}
              </label>
              {modifiedPlacesSuccess && (
                <small className="text-success">
                  <b>Actualizado</b> <FontAwesomeIcon icon={faCheckCircle} />
                </small>
              )}
              <TextInput
                name="cpa"
                value={serviceData.cpa.value}
                onChange={onChange}
                readOnly
              />
              {/* {validationError.includes("cpa") && (
                <div style={{ marginTop: "-15px" }}>
                  <span className="text-danger">{t("requiredFieldError")}</span>
                </div>
              )} */}
            </Col>
            <Col xs={12} md={3} className="mb-3">
              <label className="mr-2">
                <strong>{t("serviceRequests.pieces")}</strong>
                {getStatusIcon(
                  serviceData.qtyPieces.status,
                  serviceData.qtyPieces.error
                )}
              </label>
              <TextInput
                name="qtyPieces"
                inputType="number"
                value={serviceData.qtyPieces.value}
                onChange={onChange}
                readOnly={!editMode}
              />
              {validationError.includes("qtyPieces") && (
                <div style={{ marginTop: "-15px" }}>
                  <span className="text-danger">
                    El número de piezas no puede ser menor o igual a 0
                  </span>
                </div>
              )}
            </Col>
            <Col xs={12} md={3} className="mb-3">
              <label className="mr-2">
                <strong>{t("serviceRequests.weight")}</strong>
                {getStatusIcon(
                  serviceData.totalWeight.status,
                  serviceData.totalWeight.error
                )}
              </label>
              <TextInput
                name="totalWeight"
                value={serviceData.totalWeight.value}
                onChange={onChange}
                readOnly={!editMode}
                inputType="number"
              />
              {validationError.includes("totalWeight") && (
                <div style={{ marginTop: "-15px" }}>
                  <span className="text-danger">
                    El peso no puede ser menor o igual a 0
                  </span>
                </div>
              )}
            </Col>

            <Col xs={12} md={3} className="mb-3">
              <label className="mr-2">
                <strong>{t("formLabels.docType")}</strong>{" "}
                {getStatusIcon(
                  serviceData.docType.status,
                  serviceData.docType.error
                )}
              </label>

              <TextInput
                name="docType"
                value={serviceData.docType.value}
                onChange={onChange}
                readOnly={!editMode}
                inputType="text"
              />
            </Col>

            <Col xs={12} md={3} className="mb-3">
              <label className="mr-2">
                <strong>{t("formLabels.docNumber")}</strong>{" "}
                {getStatusIcon(
                  serviceData.docNumber.status,
                  serviceData.docNumber.error
                )}
              </label>
              <TextInput
                name="docNumber"
                value={serviceData.docNumber.value}
                onChange={onChange}
                readOnly={!editMode}
                inputType="number"
              />
            </Col>
            <Col xs={12} md={3} className="mb-3">
              <label className="mr-2">
                <strong>{t("formLabels.email")}</strong>{" "}
                {getStatusIcon(
                  serviceData.email.status,
                  serviceData.email.error
                )}
              </label>
              <TextInput
                name="email"
                value={serviceData.email.value}
                onChange={onChange}
                readOnly={!editMode}
                inputType="email"
              />
            </Col>
            <Col xs={12} md={3} className="mb-3">
              <label className="mr-2">
                <strong>{t("formLabels.telephone")}</strong>{" "}
                {getStatusIcon(
                  serviceData.phone.status,
                  serviceData.phone.error
                )}
              </label>
              <TextInput
                name="phone"
                value={serviceData.phone.value}
                onChange={onChange}
                readOnly={!editMode}
                inputType="number"
              />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xs={12} md={4}>
              <label htmlFor="homeDelivery" className="mr-2">
                <strong>{t("serviceRequests.homeDelivery")}</strong>{" "}
              </label>
              <CustomCheckbox
                checked={serviceData.homeDelivery.value !== "NO"}
                onChange={onChange}
                name="homeDelivery"
                id="homeDelivery"
                disabled={!editMode}
              />
            </Col>
            {/* <Col xs={12} md={4}>
              <label
                
                htmlFor="payUponReceipt"
                className="mr-2"
              >
                <strong>{t("serviceRequests.payUponReceipt")}</strong>{" "}
              </label>
              <CustomCheckbox
                checked={serviceData.payUponReceipt.value}
                onChange={onChange}
                name="payUponReceipt"
                id="payUponReceipt"
                disabled={!editMode}
              />
            </Col> */}
            {/* <Col xs={12} md={4}>
              <label
                
                htmlFor="remittanceDone"
                className="mr-2"
              >
                <strong>{t("serviceRequests.remittanceDone")}</strong>{" "}
              </label>
              <CustomCheckbox
                checked={serviceData.remittanceDone.value}
                onChange={onChange}
                name="remittanceDone"
                id="remittanceDone"
                disabled={!editMode}
              />
            </Col> */}
          </Row>
          <Row className="justify-content-start mt-3">
            <Col xs={12} md={8}>
              <label htmlFor="observations">
                {" "}
                <strong>{t("serviceRequests.observations")} </strong>
              </label>
              <textarea
                name="observations"
                className="form-control"
                onChange={onChange}
                value={serviceData.observations.value}
                disabled={!editMode}
              ></textarea>
            </Col>
          </Row>
        </Form>
      )}
      <Row className="justify-content-end align-items-center mt-4 mb-4">
        {editMode ? (
          <>
            <Col xs={12} md={3}>
              <ActionButton
                secondary
                onClick={() => handleEditMode(handleEditMode, "cancel")}
                width="100"
              >
                {t("cancel")}
              </ActionButton>
            </Col>
            <Col xs={12} md={3}>
              <ActionButton onClick={onSubmit} width="100">
                {t("saveChanges")}
              </ActionButton>
            </Col>
          </>
        ) : (
          <Col xs={12} md={3}>
            <ActionButton
              secondary={!editMode}
              width="100"
              onClick={handleEditMode}
              type="button"
            >
              {t("serviceRequests.editRequest")}
            </ActionButton>
          </Col>
        )}
      </Row>
    </>
  );
};

export default EditForm;
