import React, { useState } from "react";
import { Form, Col, Row } from "react-bootstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import PasswordInput from "../../../components/PasswordInput";
import Swal from "sweetalert2";
import { ActionButton } from "../../../components";

const initialValues = {
  currentPassword: "",
  newPassword: "",
  repeatPassword: "",
};

const PasswordChange = ({
  redirectUser,
  changePassword,
  addValue,
  auth: { userData },
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const signupSchema = Yup.object().shape({
    currentPassword: Yup.string().required(
      "Por favor ingresa tu contraseña actual"
    ),
    newPassword: Yup.string()
      .required("Por favor ingresa una nueva contraseña")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()+_\-=}{[\]|:;"/?.><,`~])[A-Za-z\d!@#$%^&*()+_\-=}{[\]|:;"/?.><,`~]{8,}$/,
        "Su contraseña debe tener al menos: 8 caracteres, una letra mayúscula, un número, una letra minúscula y un símbolo"
      ),
    repeatPassword: Yup.string().when("newPassword", {
      is: (val) => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf(
        [Yup.ref("newPassword")],
        "Las contraseñas no coinciden"
      ),
    }),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: signupSchema,
    onSubmit: (values) => {
      changePassword({
        ...values,
        callback: (result) => {
          if (result.success) {
            Swal.fire(
              "Contraseña cambiada exitosamente",
              "Será redirigido al inicio",
              "success"
            );
            redirectUser();
            addValue("userData", { ...userData, firstTimeLogged: false });
          } else {
            Swal.fire("Hubo un problema", result.message, "error");
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
        <PasswordInput
          name="currentPassword"
          label="Tu contraseña actual"
          showPassword={showPassword}
          placeholder="Introduce una contraseña"
          value={formik.values.currentPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          formikClasses={getInputClasses("currentPassword")}
          setShowPassword={setShowPassword}
        />
        {formik.touched.currentPassword && formik.errors.currentPassword ? (
          <Row>
            <Col className="formikError">
              <small>{formik.errors.currentPassword}</small>
            </Col>
          </Row>
        ) : null}
        <PasswordInput
          name="newPassword"
          label="Nueva contraseña"
          showPassword={showPassword}
          placeholder="Ingresa tu nueva contraseña"
          value={formik.values.newPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          formikClasses={getInputClasses("newPassword")}
          setShowPassword={setShowPassword}
        />
        {formik.touched.newPassword && formik.errors.newPassword ? (
          <Row>
            <Col className="formikError">
              <small>{formik.errors.newPassword}</small>
            </Col>
          </Row>
        ) : null}
        <PasswordInput
          name="repeatPassword"
          label="Repite tu contraseña"
          showPassword={showPassword}
          placeholder="Repite tu contraseña"
          value={formik.values.repeatPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          formikClasses={getInputClasses("repeatPassword")}
          setShowPassword={setShowPassword}
        />
        {formik.touched.repeatPassword && formik.errors.repeatPassword ? (
          <Row>
            <Col className="formikError">
              <small>{formik.errors.repeatPassword}</small>
            </Col>
          </Row>
        ) : null}
        <Row>
          <Col className="text-center mt-3">
            <ActionButton type="submit">
              Cambiar contraseña
            </ActionButton>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default PasswordChange;
