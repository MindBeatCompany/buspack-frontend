import React, { useState, useEffect } from "react";
import { Col, Row, Form, Table, Spinner } from "react-bootstrap";
import TextInput from "../TextInput";
import PropTypes from "prop-types";
import "./styles.scss";
import { validateForm } from "../../helpers/formValidation";
import { ActionButton } from "..";
import { EditIcon } from "../../resources/icons";
import TrashIcon from "../../resources/icons/TrashIcon";
import DropZone from "../DropZone";
import Swal from "sweetalert2";
import {
  BASEURL,
  URL_CONSTANTS,
  FILENAME_CONSTANTS,
} from "../../config/constants";
import AuthenticatedLink from "../AuthenticatedLink";

const RegisterForm = ({
  t,
  isRoot,
  rolesAllowed,
  createAccounts,
  initialValues,
  getRoles,
  user,
  registerAccount,
  getHeaders,
  rootRegister
}) => {
  const [accountData, setAccountData] = useState({
    company: "",
    ecoCode: "",
    name: "",
    lastname: "",
    email: "",
    userName: "",
    userRol: "",
    idClientEntity: "",
  });
  const [accountsList, setAccountsList] = useState([]);
  const [isEdit, setIsEdit] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [excelUploaded, setExcelUploaded] = useState(null);

  // headers to be used to download the tarif excel
  const [headers, setHeaders] = useState(null);

  useEffect(() => {
    getRoles();

    getHeaders({
      callback: (h) => {
        setHeaders(h);
      },
    });
  }, []);

  useEffect(() => {
    if (user.roles) {
      let arrRoles = user.roles.filter((rol) =>
        rolesAllowed.includes(rol.name)
      );
      setRoles(arrRoles);

      // select the first role in the list by default
      setAccountData({
        ...accountData,
        userRol: arrRoles.length > 0 ? arrRoles[0].name : "",
      });
    }
  }, [user.roles]);

  useEffect(() => {

    if (initialValues) {
      let { company, ecoCode, idClientEntity } = initialValues;
      setAccountData({
        ...accountData,
        company,
        ecoCode,
        idClientEntity,
        userRol: roles.length > 0 ? roles[0].name : "",
      });
    }
  }, [initialValues]);

  const onChange = (e) => {
    const { value, name } = e.target;

    setAccountData({ ...accountData, [name]: value });
  };

  const { company, ecoCode, name, lastname, email, userName, userRol, idClientEntity } =
    accountData;

  const onSubmit = (e) => {
    e.preventDefault();

    //validate form data
    const validatedForm = validateForm(accountData, isRoot);
    if (validatedForm[0]) {
      setValidationErrors(validatedForm[1]);
      return;
    }
    if (isEdit !== "") {
      var items = [...accountsList];
      items[isEdit] = accountData;
      setAccountsList(items);
      setIsEdit("");
    } else {
      setAccountsList([...accountsList, accountData]);
    }

    setValidationErrors({});
    setIsEdit("");

    //Restart initial form values
    setAccountData({
      company,
      ecoCode,
      idClientEntity,
      name: "",
      lastname: "",
      email: "",
      userName: "",
      userRol: roles[0].name,
    });
  };

  const handleEdit = (account, index) => {
    setIsEdit(index);
    setAccountData(account);
  };

  const handleDelete = (idx) => {
    let accounts = accountsList.filter(
      (acc) => accountsList.indexOf(acc) !== idx
    );
    setAccountsList(accounts);
  };

  const createUsers = () => {
    // Validate if excel file was uploaded, only when user is creating a corporate user
    if (rootRegister && !excelUploaded) {
      Swal.fire({
        icon: "warning",
        text: t("registerScreen.noPricingError"),
        confirmButtonText: t("modalButtons.accept"),
      });
      return;
    }
    setIsLoading(true);

    //if accouns creation was successful, restart accounts list
    const formCallback = (success) => {
      setIsLoading(false);

      if (success) setAccountsList([]);
    };
    createAccounts(accountsList, formCallback, excelUploaded);
  };

  const isDisabledSaveButton = () => {
    if (accountsList.length === 0 || isEdit !== "" || isLoading) {
      return true;
    } else {
      return false;
    }
  };

  const tableHeaders = [
    t("tables.headersName.user"),
    t("tables.headersName.name"),
    t("tables.headersName.lastName"),
    t("tables.headersName.rol"),
  ];

  const url = `${BASEURL}${URL_CONSTANTS.downloadTarifario}`;
  // let headers;

  return (
    <Form className="mt-4 register-form" onSubmit={onSubmit}>
      {registerAccount && (
        <>
          {/* if current user isn't an ADMINISTRADOR the following form'll be hidden */}
          <Row>
            <Col>
              <h5>{t("subTitles.users")}</h5>
            </Col>
          </Row>
          <Row className="justify-content-start">
            <Col xs={12} md={6} lg={3}>
              <TextInput
                label={t("formLabels.company")}
                controlId="company"
                name="company"
                onChange={onChange}
                inputType="text"
                readOnly={!isRoot}
                placeholder={
                  t("formLabels.placeHolder.enter") + t("formLabels.company")
                }
                value={company}
                disabled={true}
              />
              {validationErrors && validationErrors.company && (
                <span className="text-danger d-block validationErrors">
                  {" "}
                  {validationErrors.company}{" "}
                </span>
              )}
            </Col>
            <Col xs={12} md={6} lg={3}>
              <TextInput
                readOnly={!isRoot}
                label={t("formLabels.ecoCode")}
                controlId="ecoCode"
                name="ecoCode"
                onChange={onChange}
                inputType="text"
                placeholder={
                  t("formLabels.placeHolder.enter") + t("formLabels.ecoCode")
                }
                value={ecoCode}
                disabled={true}
              />
              {validationErrors && validationErrors.ecoCode && (
                <span className="text-danger d-block validationErrors">
                  {" "}
                  {validationErrors.ecoCode}{" "}
                </span>
              )}
            </Col>
            <Col xs={12} md={6} lg={3}>
              <TextInput
                label={t("formLabels.idClientEntity")}
                controlId="idClientEntity"
                name="idClientEntity"
                onChange={onChange}
                inputType="text"
                readOnly={!isRoot}
                placeholder={
                  t("formLabels.placeHolder.enter") + t("formLabels.idClientEntity")
                }
                value={idClientEntity}
                disabled={true}
              />
              {validationErrors && validationErrors.idClientEntity && (
                <span className="text-danger d-block validationErrors">
                  {" "}
                  {validationErrors.idClientEntity}{" "}
                </span>
              )}
            </Col>
          </Row>
        </>
      )}
      {/* ------------------- HERE USER FORM STARTS ----------------------- */}
      <Row
        className="justify-content-start pt-3"
        style={{ overFlowX: "hidden", overFlowY: "hidden" }}
      >
        <Col xs={12} md={6} lg={3}>
          <TextInput
            label={t("formLabels.name")}
            controlId="name"
            name="name"
            onChange={onChange}
            inputType="text"
            placeholder={
              t("formLabels.placeHolder.enter") + t("formLabels.name")
            }
            value={name}
          />
          {validationErrors && validationErrors.name && (
            <span className="text-danger d-block validationErrors">
              {" "}
              {validationErrors.name}{" "}
            </span>
          )}
        </Col>
        <Col xs={12} md={6} lg={3}>
          <TextInput
            label={t("formLabels.lastName")}
            controlId="lastname"
            name="lastname"
            onChange={onChange}
            inputType="text"
            placeholder={
              t("formLabels.placeHolder.enter") + t("formLabels.lastName")
            }
            value={lastname}
          />
          {validationErrors && validationErrors.lastname && (
            <span className="text-danger d-block validationErrors">
              {" "}
              {validationErrors.lastname}{" "}
            </span>
          )}
        </Col>
        <Col xs={12} md={6} lg={3}>
          <TextInput
            label={t("formLabels.email")}
            controlId="email"
            name="email"
            onChange={onChange}
            inputType="email"
            placeholder={
              t("formLabels.placeHolder.enter") + t("formLabels.email")
            }
            value={email}
          />
          {validationErrors && validationErrors.email && (
            <span className="text-danger d-block validationErrors">
              {" "}
              {validationErrors.email}{" "}
            </span>
          )}
        </Col>
        <Col xs={12} md={6} lg={3}>
          <TextInput
            label={t("formLabels.userName")}
            controlId="userName"
            name="userName"
            onChange={onChange}
            inputType="text"
            placeholder={
              t("formLabels.placeHolder.enter") + t("formLabels.userName")
            }
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
      <Row className="justify-content-start">
        <Col xs={12} md={6} lg={3}>
          <Form.Group controlId="userRol">
            <Form.Label>
              <b>{t("formLabels.role")}</b>
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
      </Row>
      <Row className="text-right">
        <Col>
          <ActionButton
            type="submit"
            width="280px"
            variant={isEdit !== "" ? "warning" : "primary-btn"}
          >
            {isEdit !== ""
              ? t("formButtons.editEnd")
              : t("formButtons.addUser")}
          </ActionButton>
        </Col>
      </Row>
      {accountsList.length > 0 && (
        <Table bordered hover className="accountsTable mt-4">
          <thead>
            <tr>
              {tableHeaders.map((theader, index) => (
                <th key={index}>{theader.toUpperCase()}</th>
              ))}
              <th>EDITAR</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {accountsList.map((account, index) => (
              <tr
                key={index}
                className={index === isEdit ? "selectedToEdit shadow" : ""}
              >
                <td>{account.userName} </td>
                <td>{account.name} </td>
                <td>{account.lastname} </td>
                <td>{account.userRol} </td>
                <td>
                  <span style={{ cursor: "pointer" }}>
                    <EditIcon                      
                      type={index === isEdit ? "primaryIcon" : "secondaryIcon"}
                      onClick={() => handleEdit(account, index)}
                    />
                  </span>
                </td>
                <td>
                  <span style={{ cursor: "pointer" }}>
                    <TrashIcon
                      onClick={() => handleDelete(index)}
                      select={isEdit !== ""}
                    />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {isRoot & (accountsList.length > 0) & registerAccount ? (
        <>
          <Row className="mt-5">
            <Col>
              <p className="d-inline-block mr-2">
                {t("registerScreen.pricingExcelAclaration")}
                <AuthenticatedLink
                  url={url}
                  authHeaders={headers}
                  filename={FILENAME_CONSTANTS.planillaTarifario}
                >
                  Descargar planilla.
                </AuthenticatedLink>
              </p>
            </Col>
          </Row>

          <Row className="justify-content-center mt-3">
            <Col xs={10} md={10}>
              <DropZone setExcelUploaded={setExcelUploaded} />
            </Col>
          </Row>
        </>
      ) : null}

      <Row className="text-right pt-3 mb-4">
        <Col>
          <ActionButton
            onClick={createUsers}
            disabled={isDisabledSaveButton()}
            type="submit"
            width="280px"
          >
            {isLoading ? <Spinner /> : t("formButtons.save")}
          </ActionButton>
        </Col>
      </Row>
    </Form>
  );
};

RegisterForm.propTypes = {
  isRoot: PropTypes.bool.isRequired,
  rolesAllowed: PropTypes.array.isRequired,
  createAccounts: PropTypes.func.isRequired,
  hiddenFirstForm: PropTypes.bool,
  initialValues: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
};

export default RegisterForm;
