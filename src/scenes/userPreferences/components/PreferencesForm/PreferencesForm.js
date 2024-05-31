import React, { useState, useEffect } from "react";
import RangeSlider from "react-bootstrap-range-slider";
import { Form, Col, Row, Button, Alert } from "react-bootstrap";
import { ActionButton } from "../../../../components";
import Swal from "sweetalert2";

const PreferencesForm = ({ changeConfiguration, user, auth: { userData } }) => {
  const [sessionTime, setSessionTime] = useState(10);
  const [selectedOption, setSelectedOption] = useState("range");
  // IMPORTANT! 1440 minutes equals an entire day and 0 minutes means "Never"
  const [loading, setLoading] = useState(false);

  const { idleTimeInSeconds } = user;

  useEffect(() => {
    if (idleTimeInSeconds < 3600 && idleTimeInSeconds > 0) {
      setSessionTime(idleTimeInSeconds / 60);
    }

    if (idleTimeInSeconds === 86400) {
      setSelectedOption("1440");
    }
    if (idleTimeInSeconds === 0) {
      setSelectedOption("0");
    }
    if (idleTimeInSeconds !== 0 && idleTimeInSeconds !== 86400) {
      setSelectedOption("range");
    }
  }, [idleTimeInSeconds]);

  const onChangeOption = (e) => {
    setSelectedOption(e.target.id);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const callback = (success) => {
      setLoading(false);
      if (success) {
        Swal.fire("Se han aplicado los cambios correctamente!", "", "success");
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops... algo salió mal",
          text: "Vuelve a intentar más tarde",
        });
      }
    };

    changeConfiguration({
      idleTimeInSeconds:
        selectedOption === "range" ? sessionTime : selectedOption,
      id: userData.id,
      callback,
    });
  };

  return (
    <Form onSubmit={onSubmit}>
      <fieldset>
        <Form.Group as={Row} className="mb-3">
          <Col className="text-center">
            <div className="d-inline ml-2 mr-2">
              <Form.Check
                inline
                type="radio"
                label="Elegir rango en minutos"
                name="sessionOption"
                id="range"
                onChange={onChangeOption}
                checked={selectedOption === "range"}
              />
            </div>
            <div className="d-inline ml-2 mr-2">
              <Form.Check
                inline
                type="radio"
                label="Nunca expirar sesión"
                name="sessionOption"
                id="0"
                onChange={onChangeOption}
                checked={selectedOption === "0"}
              />
            </div>
            <div className="d-inline ml-2 mr-2">
              <Form.Check
                inline
                type="radio"
                label="Expirar luego de 24 horas"
                name="sessionOption"
                id="1440"
                onChange={onChangeOption}
                checked={selectedOption === "1440"}
              />
            </div>
          </Col>
        </Form.Group>
      </fieldset>
      {selectedOption === "range" ? (
        <Form.Group>
          <Row>
            <Col xs={12}>
              <Form.Label className="mr-4">
                Tiempo de expiración (en minutos):
              </Form.Label>
            </Col>
            <Col xs={12}>
              <RangeSlider
                value={sessionTime}
                onChange={(e) => setSessionTime(e.target.value)}
                max={60}
                min={10}
              />
            </Col>
          </Row>
        </Form.Group>
      ) : (
        <Row className="justify-content-center">
          <Col xs={6}>
            <Alert variant="danger">
              Por seguridad se recomienda elegir valores entre 10 y 60 minutos.
            </Alert>
          </Col>
        </Row>
      )}
      <Row>
        <Col>
          <ActionButton type="submit" disabled={loading}>
            {" "}
            Aplicar cambios
          </ActionButton>
        </Col>
      </Row>
    </Form>
  );
};

export default PreferencesForm;
