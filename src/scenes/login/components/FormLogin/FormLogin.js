import React, { useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Form, Col, Row, Container } from "react-bootstrap";
import { authActions } from "../../../../state/ducks/auth/";
import { CAPTCHA_KEY } from "../../../../config/env.js";
import "./styles.scss";
import {
  LoaderSpinner,
  PasswordRecoveryModal,
  ActionButton,
} from "../../../../components";
import ReCAPTCHA from "react-google-recaptcha";
import EmailInput from "../EmailInput";
import PasswordInputLogin from "../PasswordInputLogin";
import { AlertIcon } from "../../../../resources/icons";
import { ENV } from "../../../../config/env"


const initialValues = {
  password: "",
  userName: "",
};

const FormLogin = ({
  t,
  login,
  history,
  auth,
  clear,
  user,
  resetState,
  recoveryPass,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [captchaCompleted, setCaptchaCompleted] = useState(false);
  const [captchaErrorMsg, setCaptchaErrorMsg] = useState(false);
  const [passwordRecovery, setPasswordRecovery] = useState(false);
  const [failedLogin, setFailedLogin] = useState(false);
  useEffect(() => {
    clear();
    if (!user) {
      resetState();
    }
  }, []);
  const SigninSchema = Yup.object().shape({
    password: Yup.string().required(t("loginScreen.enterYourPassword")),
    userName: Yup.string().required("Ingresa tu email o usuario"),
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

  const getUrl = (firstTimeLogged, rol) => {
    if (firstTimeLogged) {
      return "/password-change";
    }
    if (rol === "ADMINISTRADOR") {
      return "/home";
    }
    return "/home-user";
  };

  const formik = useFormik({
    initialValues,
    validationSchema: SigninSchema,
    onSubmit: (values) => {
      // if (!captchaCompleted && ENV !== 'dev') {
      //   onErroredCaptcha();
      //   return;
      // }
      login({
        data: values,
        callback: (success, data) => {
          if (success) {
            setErrorMessage("");
            setFailedLogin(false);
            history.push(getUrl(data.firstTimeLogged, data.roles));
          } else {
            setErrorMessage(data);
            setFailedLogin(true);
          }
        },
      });
    },
  });

  const onChangeCaptcha = (value) => {
    //console.log("Captcha value:", value);
    setCaptchaCompleted(true);
    setCaptchaErrorMsg(false);
  };

  //function that'll be executed when the challenge erorred/fail or when it wasn't completed by the user
  const onErroredCaptcha = () => {
    setCaptchaCompleted(false);
    setCaptchaErrorMsg(true);
  };

  const { userName, password } = formik.values;
  return (
    <>
      <Form onSubmit={formik.handleSubmit} autoComplete="off">
        <label className="ml-2">{t("loginScreen.email")} </label>
        <EmailInput
          name="userName"
          inputType="text"
          value={formik.values.userName}
          //placeholder="Correo electrónico o usuario"
          onError={failedLogin}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          formikClasses={getInputClasses("email")}
          isWriting={userName !== ""}
        />
        {formik.touched.userName && formik.errors.userName ? (
          <Row>
            <Col className="formikError">
              <small>{formik.errors.userName}</small>
            </Col>
          </Row>
        ) : null}

        <label className="ml-2 mt-2">Contraseña</label>
        <PasswordInputLogin
          name="password"
          onError={failedLogin}
          isWriting={password !== ""}
          showPassword={showPassword}
          placeholder={t("loginScreen.password")}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          //formikClasses={getInputClasses("password")}
          setShowPassword={setShowPassword}
        />

        {formik.touched.password && formik.errors.password ? (
          <Row>
            <Col className="formikError">
              <small>{formik.errors.password}</small>
            </Col>
          </Row>
        ) : null}

        <Container fluid>
          {errorMessage !== "" && (
            <Row className="justify-content-center text-center mt-4 mb-4">
              <Col xs={12} className="text-left error-msg-login p-0">
                <div className="d-inline-block mr-2 ml-3 mb-1">
                  <AlertIcon width="20" height="20" />
                </div>
                <div className="d-inline mb-1">
                  <span>{errorMessage}</span>
                </div>
              </Col>
            </Row>
          )}
          <Row>
            <Col className="mb-4 p-0">
              <span
                className="recovery-pass-link"
                onClick={() => {
                  setPasswordRecovery(true);
                }}
              >
                ¿Olvidó su contraseña?
              </span>
            </Col>
          </Row>
          {ENV !== 'dev' && (
            <Row>
              <Col xs={12}>

              </Col>
            </Row>
          )}
          {/* {captchaErrorMsg && (
            <Row className="mt-2 text-danger">
              <Col className="text-center">
                <p> Debe completar el captcha para continuar </p>
              </Col>
            </Row>
          )} */}
          <Row>
            <Col className="p-0 mt-4 text-left">
              <ActionButton type="submit" width="100" disabled={auth.loading}>
                {t("loginScreen.enter")} {auth.loading && <LoaderSpinner />}
              </ActionButton>
            </Col>
          </Row>
        </Container>
      </Form>
      {passwordRecovery && (
        <PasswordRecoveryModal
          bodyText="Recuperar contraseña"
          title="Recuperar contraseña"
          subtitle="Recuperar contraseña"
          modalShow={passwordRecovery}
          setModalShow={setPasswordRecovery}
          recoveryPass={recoveryPass}
          history={history}
          t={t}
        />
      )}
    </>
  );
};

const mapStateToProps = ({ auth, user }) => ({ auth, user });
export default compose(
  connect(mapStateToProps, { ...authActions }),
  withTranslation()
)(FormLogin);