import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { Form, Col, Row, Button, Container } from "react-bootstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import { connect } from "react-redux";
import { compose } from "redux";
import {
  TextInput,
  PasswordInput,
  LoaderSpinner,
  AlertMessage,
} from "../../../../components";
import { authActions } from "../../../../state/ducks/auth/";

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  repeatPassword: "",
};
const FormRegister = ({ t, register, clear, history, auth }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    clear();
  }, []);
  const signupSchema = Yup.object().shape({
    email: Yup.string()
      .email(t("loginScreen.wrongEmailFormat"))
      .required(t("loginScreen.enterYourEmail")),
    firstName: Yup.string().required(t("registerScreen.enterYourFirstName")),
    lastName: Yup.string().required(t("registerScreen.enterYourLastName")),
    password: Yup.string().required(t("loginScreen.enterYourPassword")),
    repeatPassword: Yup.string().when("password", {
      is: (val) => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf(
        [Yup.ref("password")],
        t("registerScreen.password")
      ),
    }),
  });
  const formik = useFormik({
    initialValues,
    validationSchema: signupSchema,
    onSubmit: (values) => {
      register({
        data: values,
        callback: (success, error) => {
          if (success) {
            history.push("/");
          } else {
            setErrorMessage(error);
            setShowErrorMessage(true);
          }
        },
      });
    },
  });
  const getInputClasses = (fieldname) => {
    if (formik.touched[fieldname] && formik.errors[fieldname]) {
      return "is-invalid";
    }
    if (formik.touched[fieldname] && !formik.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };
  return (
    <>
      <Form onSubmit={formik.handleSubmit}>
        <TextInput
          name="firstName"
          inputType="text"
          className="textInput"
          placeholder={t("registerScreen.firstName")}
          value={formik.values.firstName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          formikClasses={getInputClasses("firstName")}
        />
        {formik.touched.firstName && formik.errors.firstName ? (
          <Row>
            <Col className="formikError">
              <small>{formik.errors.firstName}</small>
            </Col>
          </Row>
        ) : null}
        <TextInput
          name="lastName"
          inputType="text"
          className="textInput"
          placeholder={t("registerScreen.lastName")}
          value={formik.values.lastName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          formikClasses={getInputClasses("lastName")}
        />
        {formik.touched.lastName && formik.errors.lastName ? (
          <Row>
            <Col className="formikError">
              <small>{formik.errors.lastName}</small>
            </Col>
          </Row>
        ) : null}
        <TextInput
          name="email"
          inputType="email"
          className="textInput"
          placeholder={t("loginScreen.email")}
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          formikClasses={getInputClasses("email")}
        />
        {formik.touched.email && formik.errors.email ? (
          <Row>
            <Col className="formikError">
              <small>{formik.errors.email}</small>
            </Col>
          </Row>
        ) : null}
        <PasswordInput
          name="password"
          label="Password"
          showPassword={showPassword}
          placeholder="Password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          formikClasses={getInputClasses("password")}
          setShowPassword={setShowPassword}
        />
        {formik.touched.password && formik.errors.password ? (
          <Row>
            <Col className="formikError">
              <small>{formik.errors.password}</small>
            </Col>
          </Row>
        ) : null}
        <PasswordInput
          name="repeatPassword"
          label="Repeat Password"
          showPassword={showPassword}
          value={formik.values.repeatPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          formikClasses={getInputClasses("password")}
        />
        {formik.touched.password && formik.errors.repeatPassword ? (
          <Row>
            <Col className="formikError">
              <small>{formik.errors.repeatPassword}</small>
            </Col>
          </Row>
        ) : null}
        <Container fluid>
          <Row>
            <Col>
              <div className="w-50 p-2">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-100"
                  disabled={auth.loading}
                >
                  {t("login")} {auth.loading && <LoaderSpinner />}
                </Button>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="w-50 p-2">
                <Button
                  type="button"
                  onClick={() => history.push("/")}
                  variant="secondary"
                  className="w-100"
                >
                  {t("toBack")}
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </Form>
      <AlertMessage
        show={showErrorMessage}
        message={errorMessage}
        messagetitle={"Hubo un error al intentar ingresar"}
        header={"Error"}
        onHide={() => setShowErrorMessage(false)}
      />
    </>
  );
};
const mapStateToProps = ({ auth }) => ({ auth });
export default compose(
  connect(mapStateToProps, { ...authActions }),
  withTranslation()
)(FormRegister);
