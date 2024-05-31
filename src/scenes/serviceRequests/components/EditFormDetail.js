import React, { useState, useEffect, useRef } from "react";
import { Form, Col, Row } from "react-bootstrap";
import { TextInput, ActionButton } from "../../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationCircle,
  faExclamationTriangle,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import "./EditForm.scss";
import { BASEURL } from "../../../config/constants";

const EditFormDetail = ({
  location: { state },
  t,
  history,
  editServiceRequest,
  getEnabledPlaces,
}) => {
  console.log(state);
  const [originalData, setOriginalData] = useState({});
  const [serviceData, setServiceData] = useState({});
  console.log(serviceData);

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
    setEditMode(false);
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
    setModifiedDone(true);
    const { name, type, value, checked } = e.target;
    console.log(e);
    console.log(e.target);
    console.log(name, type, value, checked);
    let val = value;

    if (type === "number") {
      val = Number(value);
    }
    if (type === "checkbox") {
      val = checked ? "SI" : "NO";
    }

    setServiceData({
      ...serviceData,
      [name]: val,
    });

  };

  // URL DE SOLICITUD

  const onSubmitOperator = () => {
    Swal.fire({
      title: "Un Operador se estará contactando con usted a la brevedad",
      icon: "success",
      confirmButtonText: "Cerrar",
    });
  };

  const onDeleteRequest = () => {
    // const url = `https://localhost:4200/v1/api/service-request/`;
    // const url = `https://qa.derservicios.com.ar/v1/api/v1/api/service-request/`;
    // TENIA DOS V1/API LA BASEURL
    const url = `${BASEURL}/service-request/`;

    Swal.fire({
      title: t("deleteQuestion"),
      showDenyButton: true,
      icon: "warning",
      confirmButtonText: t("modalButtons.accept"),
      confirmButtonColor: "#F28E2A",
      denyButtonText: t("modalButtons.cancel"),
    }).then((result) => {
      console.log(result);
      if (result.isConfirmed) {
        const request = {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        };
        let urlDelete = url + "9";
        console.log(urlDelete);
        fetch(urlDelete, request).then((result) => {
          console.log(result);
          Swal.fire({
            title: t("deleteHaveBeenSaved"),
            icon: "success",
            confirmButtonText: "Cerrar",
            confirmButtonColor: "#F28E2A",
          }).then((acc) => {
            history.push({
              pathname: "/service-requests/query",
              state: acc,
            });
          });
        });
      } else {
        setServiceData(originalData);
        Swal.fire({
          title: "No se ha podido eliminar la solicitud",
          icon: "error",
          confirmButtonText: "Cerrar",
        });
      }
    });
  };

  const onEditRequest = () => {
    // const url = `https://localhost:4200/v1/api/service-request/`;
    // const url = `https://qa.derservicios.com.ar/v1/api/v1/api/service-request/`;
    // TENIA DOS V1/API LA BASEURL
    const url = `${BASEURL}/service-request/`;

    console.log(serviceData);
    Swal.fire({
      title: t("saveChangesQuestion"),
      showDenyButton: true,
      icon: "warning",
      confirmButtonText: t("modalButtons.accept"),
      confirmButtonColor: "#F28E2A",
      denyButtonText: t("modalButtons.cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        const request = {
          method: "PUT",
          body: JSON.stringify(serviceData),
          headers: {
            "Content-Type": "application/json",
            // Authorization: "Bearer " + this.props.auth.userData.token,
          },
        };
        setEditMode(!editMode);

        let urlEdit = url + "edit";
        fetch(urlEdit, request).then((result) => {
          console.log(result);
          if (result.ok) {
            Swal.fire({
              title: t("changesHaveBeenSaved"),
              icon: "success",
              confirmButtonText: "Cerrar",
              confirmButtonColor: "#F28E2A",
            }).then((acc) => {
              history.push({
                pathname: "/service-requests/query",
                state: acc,
              });
            });
          } else {
            Swal.fire({
              title: "No se ha podido actualizar la solicitud",
              icon: "error",
              confirmButtonText: "Cerrar",
            }).then((acc) => {
              history.push({
                pathname: "/service-requests/query",
                state: acc,
              });
            });
          }
        });
      } else {
        setServiceData(originalData);
        handleEditMode(false);
        setModifiedDone(false);
        Swal.fire({
          title: "No se ha podido actualizar la solicitud",
          icon: "error",
          confirmButtonText: this.props.t("modalButtons.accept"),
        });
      }
    });
  };

  const onSubmit = () => {
    console.log(serviceData);
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
      }
    });
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
                <strong>{t("serviceRequestsDetail.requestId")}</strong>
                {getStatusIcon(
                  serviceData.requestId.status,
                  serviceData.requestId.error
                )}
              </label>

              <TextInput
                name="requestId"
                value={serviceData.requestId}
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
                <strong>{t("serviceRequestsDetail.recipientFullname")}</strong>
                {getStatusIcon(
                  serviceData.recipientFullname.status,
                  serviceData.recipientFullname.error
                )}
              </label>
              <TextInput
                name="recipientFullname"
                value={serviceData.recipientFullname}
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
                <strong>{t("serviceRequestsDetail.address")}</strong>
              </label>
              <TextInput
                name="addressStreet"
                value={serviceData.address}
                onChange={onChange}
                readOnly={!editMode}
              />
            </Col>
            <Col xs={12} md={3} className="mb-3">
              <label className="mr-2">
                <strong>{t("serviceRequestsDetail.caja")}</strong>
              </label>
              <TextInput
                name="caja"
                value={serviceData.caja}
                inputType="number"
                onChange={onChange}
                readOnly={!editMode}
              />
            </Col>
            <Col xs={12} md={3} className="mb-3">
              <label className="mr-2">
                <strong>{t("serviceRequestsDetail.city")}</strong>
              </label>
              <TextInput
                name="city"
                value={serviceData.city}
                onChange={onChange}
                readOnly={!editMode}
              />
            </Col>
            <Col xs={12} md={3} className="mb-3">
              <label className="mr-2">
                <strong>{t("serviceRequestsDetail.createdAt")}</strong>
              </label>
              <TextInput
                name="createdAt"
                value={serviceData.createdAt}
                onChange={onChange}
                readOnly={!editMode}
              />
            </Col>
            <Col xs={12} md={3} className="mb-3">
              <label className="mr-2">
                <strong>{t("serviceRequestsDetail.envio")}</strong>
              </label>
              <TextInput
                name="envio"
                value={serviceData.envio}
                onChange={onChange}
                readOnly={!editMode}
              />
            </Col>
            <Col xs={12} md={3} className="mb-3">
              <label className="mr-2">
                <strong>{t("serviceRequestsDetail.estado")}</strong>
              </label>
              <TextInput
                name="estado"
                value={serviceData.estado}
                onChange={onChange}
                readOnly={!editMode}
              />
            </Col>
            <Col xs={12} md={3} className="mb-3">
              <label className="mr-2">
                <strong>{t("serviceRequestsDetail.pieceId")}</strong>
              </label>
              <TextInput
                name="pieceId"
                value={serviceData.pieceId}
                onChange={onChange}
                readOnly={!editMode}
              />
            </Col>
            <Col xs={12} md={3} className="mb-3">
              <label className="mr-2">
                <strong>{t("serviceRequestsDetail.voucher")}</strong>
              </label>
              <TextInput
                name="voucher"
                value={serviceData.voucher}
                onChange={onChange}
                readOnly={!editMode}
              />
            </Col>
            <Col xs={12} md={3} className="mb-3">
              <label className="mr-2">
                <strong>{t("serviceRequestsDetail.province")}</strong>
              </label>
              {modifiedPlacesSuccess && (
                <small className="text-success">
                  <b>Actualizado</b> <FontAwesomeIcon icon={faCheckCircle} />
                </small>
              )}
              <TextInput
                name="province"
                value={serviceData.province}
                onChange={onChange}
                readOnly
              />
            </Col>
            <Col xs={12} md={3} className="mb-3">
              <label className="mr-2">
                <strong>{t("serviceRequestsDetail.cpa")}</strong>
              </label>
              {modifiedPlacesSuccess && (
                <small className="text-success">
                  <b>Actualizado</b> <FontAwesomeIcon icon={faCheckCircle} />
                </small>
              )}
              <TextInput
                name="cpa"
                value={serviceData.cpa}
                onChange={onChange}
                readOnly
              />
            </Col>
          </Row>
        </Form>
      )}
      <Row className="justify-content-end mt-4 mb-4 align-items-center">
        {editMode ? (
          <>
            <Col xs={12} md={3}>
              <ActionButton
                onClick={onSubmitOperator}
                width="100"
                disabled={true}
              >
                {t("operatorHelp")}
              </ActionButton>
            </Col>
            <Col xs={12} md={3}>
              <ActionButton
                onClick={onSubmitOperator}
                width="100"
                disabled={true}
              >
                {t("historyModification")}
              </ActionButton>
            </Col>
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
              <ActionButton onClick={onEditRequest} width="100">
                {t("saveChanges")}
              </ActionButton>
            </Col>
          </>
        ) : (
          <>
            <Col xs={12} md={3}>
              <ActionButton onClick={onSubmitOperator} width="100">
                {t("operatorHelp")}
              </ActionButton>
            </Col>
            <Col xs={12} md={3}>
              <ActionButton onClick={onSubmitOperator} width="100">
                {t("historyModification")}
              </ActionButton>
            </Col>
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
            <Col xs={12} md={3}>
              <ActionButton onClick={onDeleteRequest} width="100" error={true}>
                {t("serviceRequests.deleteRequest")}
              </ActionButton>
            </Col>
          </>
        )}
      </Row>
    </>
  );
};

export default EditFormDetail;
