import React, { useState, useEffect, useRef } from "react";
import {
  Form,
  Col,
  Row,
  Spinner,
} from "react-bootstrap";
import { ActionButton, TextInput } from "../../../components";
import { validateForm } from "../../../helpers/formValidation";
import Swal from "sweetalert2";
import CustomCheckbox from "../../../components/CustomCheckbox/CustomCheckbox";

const ModificationForm = ({
  accountInfo,
  user,
  getRoles,
  rolesAllowed,
  auth,
  history,
  updateUser,
  isRoot,
  currentUserIsRoot,
  t,
}) => {
  const [accountData, setAccountData] = useState({
    company: "",
    ecoCode: "",
    name: "",
    lastname: "",
    email: "",
    userName: "",
    userRol: "",
    isActive: true,
    passReset: false,
  });
  const [showTooltip, setShowTooltip] = useState(false);
  // const [toRecovery, setToRecovery] = useState([]);
  const [roles, setRoles] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [waitingResponse, setWaitingResponse] = useState(false);
  //const target = useRef(null);

  const onChange = (e) => {
    const { value, name } = e.target;
    setAccountData({ ...accountData, [name]: value });
  };

  useEffect(() => {
    getRoles();
  }, []);

  useEffect(() => {
    if (rolesAllowed) {
      let arrRoles = user.roles.filter((rol) =>
        rolesAllowed.includes(rol.name)
      );
      setRoles(arrRoles);
    }
  }, [user.roles]);

  useEffect(() => {
    if (Object.entries(accountInfo).length > 0 && accountInfo.account) {
      setAccountData({
        ...accountInfo,
        company: accountInfo.account.companyName,
        ecoCode: accountInfo.account.codeECO,
        name: accountInfo.firstName,
        lastname: accountInfo.lastName,
        userRol: accountInfo.role.name,
        isActive: true,
        passReset: false,
      });
    }
  }, [accountInfo]);

  const {
    company,
    ecoCode,
    name,
    lastname,
    email,
    userName,
    userRol,
    isActive,
  } = accountData;

  const onDeactivate = (e) => {
    const checked = e.target.checked;
    setShowTooltip(!showTooltip);

    if (checked) {
      setAccountData({ ...accountData, isActive: false });
    } else {
      setAccountData({ ...accountData, isActive: true });
    }
  };
  const onChangeRecovery = (e) => {
    const check = e.target.checked;
    setAccountData({ ...accountData, passReset: check });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setShowTooltip(false);

    //check if there is any corporate admin created. At least must be one
    const { usersList } = user;
    if (userRol === "CORPORATIVO") {
      const filteredArr = usersList.filter(
        (user) => user.id !== accountData.id
      );
      const existAdmin = filteredArr.findIndex(
        (user) => user.role.name === "CORPORATIVO_ADMINISTRADOR"
      );
      if (existAdmin < 0) {
        Swal.fire(
          "",
          "La cuenta debe contener al menos un usuario Corporativo Administrador",
          "info"
        );
        return;
      }
    }

    //validate form data
    const validatedForm = validateForm(accountData, true);
    if (validatedForm[0]) {
      setValidationErrors(validatedForm[1]);
      return;
    }
    setValidationErrors({});

    Swal.fire({
      title: t("questionPreSave"),
      text: `${
        accountData.isActive
          ? ""
          : t("accountModificationScreen.deactivateAlertMessage")
      }`,
      icon: "info",
      showDenyButton: true,
      confirmButtonText: t("modalButtons.accept"),
      denyButtonText: t("modalButtons.cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        setWaitingResponse(true);
        updateUser({
          data: accountData,
          id: accountData.id,
          callback: (data) => {
            setWaitingResponse(false);

            Swal.fire({
              title: data.success
                ? "Se han guardado los datos correctamente"
                : data.message,
              icon: data.success ? "success" : "error",
              confirmButtonText: t("modalButtons.accept"),
            }).then((response) => {
              if (response.isConfirmed) {
                if (data.success) history.goBack();
              }
            });
          },
        });

        // if (toRecovery.length > 0) {
        //   recoveryUsers({
        //     data: { ids: toRecovery },
        //     callback: ({ success, message }) => {
        //       setWaitingResponse(false);
        //       Swal.fire({
        //         title: message,
        //         confirmButtonText: "Entendido",
        //         icon: success ? "success" : "error",
        //       }).then(() => {
        //         if (success) {
        //           setToRecovery([]);
        //         }
        //         goUpdate();
        //       });
        //     },
        //   });
        // } else {
        //   goUpdate();
        // }
      }
    });
  };

  const {
    userData: { id },
  } = auth;

  return (
    <Form onSubmit={onSubmit}>
      {!isRoot && (
        <Row className="justify-content-start">
          <Col xs={12} md={6}>
            <TextInput
              label="Compañía"
              controlId="company"
              name="company"
              onChange={onChange}
              readOnly
              inputType="text"
              placeholder="Ingrese compañía"
              value={company}
            />
            {validationErrors && validationErrors.company && (
              <span className="text-danger d-block validationErrors">
                {" "}
                {validationErrors.company}{" "}
              </span>
            )}
          </Col>
          <Col xs={12} md={3}>
            <TextInput
              label="Código Interno (ECO)"
              controlId="ecoCode"
              name="ecoCode"
              onChange={onChange}
              readOnly
              inputType="text"
              placeholder="Ingrese código ECO"
              value={ecoCode}
            />
            {validationErrors && validationErrors.ecoCode && (
              <span className="text-danger d-block validationErrors">
                {" "}
                {validationErrors.ecoCode}{" "}
              </span>
            )}
          </Col>
        </Row>
      )}

      <Row className="justify-content-start pt-3">
        <Col xs={12} md={3}>
          <TextInput
            label="Nombre"
            controlId="name"
            name="name"
            onChange={onChange}
            inputType="text"
            placeholder="Ingrese nombre"
            value={name}
          />
          {validationErrors && validationErrors.name && (
            <span className="text-danger d-block validationErrors">
              {" "}
              {validationErrors.name}{" "}
            </span>
          )}
        </Col>
        <Col xs={12} md={3}>
          <TextInput
            label="Apellido"
            controlId="lastname"
            name="lastname"
            onChange={onChange}
            inputType="text"
            placeholder="Ingrese apellido"
            value={lastname}
          />
          {validationErrors && validationErrors.lastname && (
            <span className="text-danger d-block validationErrors">
              {" "}
              {validationErrors.lastname}{" "}
            </span>
          )}
        </Col>
        <Col xs={12} md={3}>
          <TextInput
            label="Email"
            controlId="email"
            name="email"
            onChange={onChange}
            inputType="email"
            placeholder="Ingrese email"
            value={email}
          />
          {validationErrors && validationErrors.email && (
            <span className="text-danger d-block validationErrors">
              {" "}
              {validationErrors.email}{" "}
            </span>
          )}
        </Col>
        <Col xs={12} md={3}>
          <TextInput
            label="Usuario"
            controlId="userName"
            name="userName"
            onChange={onChange}
            inputType="text"
            placeholder="Ingrese usuario"
            value={userName}
          />
          {validationErrors && validationErrors.userName && (
            <span className="text-danger d-block validationErrors">
              {" "}
              {validationErrors.userName}{" "}
            </span>
          )}
        </Col>
      </Row>
      <Row className="justify-content-start mt-3">
        <Col xs={12} md={6}>
          <Form.Group controlId="userRol">
            <Form.Label>
              <b>Rol de usuario</b>
            </Form.Label>
            <Form.Control
              as="select"
              custom
              onChange={onChange}
              name="userRol"
              value={userRol}
            >
              {roles.map((rol, idx) => (
                <option value={rol.name} key={idx}>
                  {rol.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>

        <Col xs={12} md={12} className="mt-4">
          {/* <Overlay
              target={target.current}
              show={showTooltip}
              placement="bottom"
            >
              {(props) => (
                <Tooltip id="overlay-example" {...props}>
                  Si desactiva el usuario, los nombres y las transacciones
                  efectuadas en la plataforma se guardarán con fines de
                  auditoría
                </Tooltip>
              )}
            </Overlay> */}
          {/* <div ref={target} className="d-inline-block"> */}
          <CustomCheckbox
            //style={{ cursor: "pointer" }}
            type="checkbox"
            className=" mr-2 mt-3"
            id="deactivateUser"
            value="sd"
            checked={!isActive}
            onChange={onDeactivate}
            //user is not allowed to deactivate his own account
            disabled={accountData.id === id || accountData.passReset}
          />
          <label
            className="ml-2"
            style={{ cursor: "pointer" }}
            htmlFor="deactivateUser"
          >
            <b>{t("formLabels.deactivate")} </b>
          </label>
          {/* </div> */}
        </Col>
        <Col xs={12} md={12} className="mt-3">
          {" "}
          <CustomCheckbox
            //style={{ cursor: "pointer" }}
            type="checkbox"
            className=" mr-2 mt-3"
            id="recoveryUser"
            value="sd"
            disabled={!isActive}
            checked={accountData.passReset}
            onChange={onChangeRecovery}
          />
          <label
            className="ml-2"
            style={{ cursor: "pointer" }}
            htmlFor="recoveryUser"
          >
            <b>{t("formLabels.recoveryPassword")} </b>
          </label>
        </Col>
      </Row>
      <Row className="justify-content-end mt-3">
        <Col xs={12} md={6} className="text-right">
          {waitingResponse ? (
            <div className="text-center w-100">
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <ActionButton width="280px" type="submit">
              {" "}
              {t("saveChanges")}{" "}
            </ActionButton>
          )}
        </Col>
      </Row>
    </Form>
  );
};

export default ModificationForm;
