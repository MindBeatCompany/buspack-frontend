import React, { useState, useEffect } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import { ActionButton } from "../../../components";

const SelectCompanyModal = ({ modalCallback, companies }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [autocompleteSuccess, setAutocompleteSucess] = useState(false);

  useEffect(() => {
    if (companies.length > 1) {
      setShowModal(true);
    }
  }, [companies]);

  const handleClose = () => setShowModal(false);

  const selectCompany = () => {
    const comp = companies.find((c) => c.codigo === selectedCompany);
    modalCallback(comp);

    setAutocompleteSucess(true);
    setTimeout(() => {
      setShowModal(false);
      setAutocompleteSucess(false);
    }, 2000);
  };

  const onChange = (e) => {
    const value = e.target.value;

    setSelectedCompany(value);
  };

  return (
    <Modal centered show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          <b>Seleccione una compañía</b>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {companies.map((company) => (
          <Row key={company.codigo}>
            <Col
              className="mb-2"
              style={{ display: "flex", alignItems: "center" }}
            >
              <input
                className="mr-2 mb-4"
                onChange={onChange}
                id={company.idClientEntity}
                type="radio"
                name="company"
                value={company.codigo}
              />
              <label htmlFor={company.codigo}>
                <b>{company.denominacion}</b> <br></br>
                {company.codigo}<br></br>
                {company.identidadcliente}
              </label>
            </Col>
          </Row>
        ))}
      </Modal.Body>
      <Modal.Footer>
        {autocompleteSuccess ? (
          <Row>
            <Col>
              <div className=" text-left">
                <span className="text-success">
                  <b>Compañía, ECOcode y código de cliente fueron autocompletados</b>
                </span>
              </div>
            </Col>
          </Row>
        ) : (
          <Row className="justify-content-center">
            <Col>
              <ActionButton width={100} secondary onClick={handleClose}>
                CERRAR
              </ActionButton>
            </Col>
            <Col>
              <ActionButton
                disabled={!selectedCompany}
                width={100}
                onClick={selectCompany}
              >
                SELECCIONAR
              </ActionButton>
            </Col>
          </Row>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default SelectCompanyModal;
