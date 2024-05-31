import React, { useState } from "react";
import { useFormik } from "formik";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";
import { Col, Spinner, Form } from "react-bootstrap";
import * as Yup from "yup";
import { authActions } from "../../../../state/ducks/auth";
import { ActionButton, AuthenticatedLink } from "../../../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

const initialValues = {
  request_id: "",
  voucher: "",
  delivery: "",
};

const FormPieces = ({
  t,
  showTable,
  setShowTable,
  printTickets,
  getPrintLabel,
  handleResponse
}) => {
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState(false);

  // const validation = Yup.object().shape({
  //   ticket: Yup.string().required(t("loginScreen.enterYourEmail")),
  //   tracking: Yup.string().required(t("registerScreen.enterYourFirstName")),
  //   piece: Yup.string().required(t("registerScreen.enterYourLastName")),
  // });
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      const callback = ({success, data})=>{

        if(success){
          setLoading(false);
          handleResponse(data);
          setShowTable();
        }
      }
      const val = Object.values(values);
      if (!val.some((v) => v.trim() !== "")) {
        setValidationError(true);
        return;
      }
      setValidationError(false);
      setLoading(true);
      getPrintLabel({
        requestId: values.request_id,
        voucher: values.voucher,
        delivery: values.delivery,
        callback
      })
     
    },
  });
  
  let headers = {
    "Access-Control-Allow-Origin": "*",
  };

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Form.Row className="align-items-center mt-3">
        <Col xs={6} md={3} className="mt-3">
          <Form.Label>{t("printLabelTable.idRequest")}</Form.Label>
          <Form.Control
            name="request_id"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.request_id}
          />
        </Col>
        <Col xs={6} md={3} className="mt-3">
          <Form.Label>{t("printLabelScreen.tracking")}</Form.Label>
          <Form.Control
            name="voucher"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.voucher}
          />
        </Col>
        <Col xs={6} md={3} className="mt-3">
          <Form.Label>{t("printLabelScreen.piece")}</Form.Label>
          <Form.Control
            name="delivery"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.delivery}
          />
        </Col>

        <Col xs={6} md={3} className="mt-3">
          <Form.Label style={{ color: "white" }}>Buscar</Form.Label>
          <ActionButton disabled={loading} width="100" type="submit">
            {loading ? (
              <Spinner animation="border" variant="light" />
            ) : (
              t("printLabelScreen.search")
            )}
          </ActionButton>
        </Col>
        {validationError && (
          <Col xs={12} className="mt-3">
            <FontAwesomeIcon
              className="text-danger mr-2"
              icon={faExclamationCircle}
            />
            <span className="text-danger">
              <strong>
                Debe completar al menos un campo para poder realizar una
                búsqueda.
              </strong>
            </span>
          </Col>
        )}
        <Col xs={6} md={3}>
          <Form.Label style={{ color: "white" }}>Imprimir Etiquetas</Form.Label>
          {showTable && (
            <ActionButton width="100" type="button" onClick={($event)=>printTickets($event)}>
              {t("printLabelScreen.print")}
            </ActionButton>
          )}
        </Col>
      </Form.Row>
    </Form>
  );
};
const mapStateToProps = ({ auth }) => ({ auth });
export default compose(
  connect(mapStateToProps, { ...authActions }),
  withTranslation()
)(FormPieces);
