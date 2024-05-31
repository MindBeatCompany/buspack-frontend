import { useState } from "react";
import { Col, Row, Form, Modal, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import EmailInput from "../../scenes/login/components/EmailInput";
import { ActionButton } from "../../components";
import { AlertIcon, EmailSentIcon } from "../../resources/icons";
import "./styles.scss";

// Posible refactor usar HighOrder Component y extender de generic modal
const PasswordRecoveryModal = ({
  modalShow,
  setModalShow,
  recoveryPass,
  t,
}) => {
  const [email, setEmail] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [onErrored, setOnErrored] = useState(null);
  const onChange = (e) => {
    const value = e.target.value;
    setEmail(value);
  };
  const onSubmit = (e) => {
    e.preventDefault();

    if (email.trim() === "") {
      setValidationError("Por favor ingrese su email");
      return;
    } else {
      setValidationError("");
      setIsSending(true);
    }
    recoveryPass({
      userName: email,
      callback: ({ success, message }) => {
        setIsSending(false);
        if (success) {
          setOnErrored(null);
          setEmailSent(true);
        } else {
          setOnErrored("Ha ocurrido un error, por favor inténtelo más tarde");
        }
      },
    });
  };

  return (
    <Modal
      show={modalShow}
      onHide={() => setModalShow(false)}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modal-recovery-password"
    >
      <Modal.Body>
        <Row className="justify-content-center mt-5 mb-5">
          <Col xs={10}>
            {!emailSent ? (
              <Form onSubmit={onSubmit}>
                <Row className="justify-content-center">
                  <Col xs={10}>
                    <p>
                      Por favor, ingrese su e-mail registrado en <b>Buspack</b>{" "}
                      para generar una contraseña nueva.
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col className="text-center mb-2">
                    <EmailInput
                      onChange={onChange}
                      value={email}
                      name="email"
                      inputType="email"
                    />
                  </Col>
                </Row>
                {validationError !== "" && (
                  <Row>
                    <Col
                      className="text-center text-danger mb-3"
                      style={{ marginTop: "-10px" }}
                    >
                      <span>{validationError} </span>{" "}
                    </Col>
                  </Row>
                )}
                {onErrored && (
                  <Row className="justify-content-center mb-4">
                    <Col xs={10}>
                      <AlertIcon />
                      <span className="ml-2 onerrored-message">
                        {onErrored}
                      </span>
                    </Col>
                  </Row>
                )}
                <Row className="justify-content-center">
                  <Col xs={10} className="text-center">
                    <ActionButton
                      type="submit"
                      width="100"
                      disabled={isSending}
                    >
                      {t("send")}
                    </ActionButton>
                  </Col>
                </Row>
              </Form>
            ) : (
              <>
                <Row>
                  <Col className="text-left">
                    <EmailSentIcon />
                    <span
                      className="ml-2"
                      style={{ fontFamily: "Gotham Bold" }}
                    >
                      <b> {t("recoveryEmailSent")} </b>
                    </span>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col>
                    <p>{t("emailSentAclaration")} </p>
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col>
                    <ActionButton
                      onClick={() => setModalShow(false)}
                      type="button"
                      width="100"
                    >
                      {t("exit")}
                    </ActionButton>
                  </Col>
                </Row>
              </>
            )}
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

PasswordRecoveryModal.propTypes = {
  modalShow: PropTypes.bool,
  setModalShow: PropTypes.func,
  recoveryPass: PropTypes.func,
  t: PropTypes.func,
};

export default PasswordRecoveryModal;
