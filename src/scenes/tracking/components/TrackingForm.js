import React, { useState, useEffect } from "react";
import { Col, Row, Form } from "react-bootstrap";
import { TextInput, ActionButton } from "../../../components";
import "./TrackingForm.scss";

const TrackingForm = ({ t, changeSearchMode }) => {
  const [activeFilter, setActiveFilter] = useState("");
  const [validationErr, setValidationErr] = useState(false);
  const [pieceId, setPieceId] = useState("");
  const [value, setValues] = useState();
  useEffect(() => {
    changeSearchMode(activeFilter, value);
  }, [activeFilter]);

  useEffect(() => {
    if (pieceId.length > 0) {
      setValues(pieceId);
    }
  }, [pieceId]);

  const handleFilter = (term) => {
    setActiveFilter(term);
  };

  const onChange = (e) => {
    let value = e.target.value;
    setPieceId(value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (pieceId.trim() === "") {
      setValidationErr(true);
      return;
    }
    setValidationErr(false);
    setActiveFilter("pieceId");
    changeSearchMode(activeFilter, value);
  };

  return (
    <Form className="tracking-form" onSubmit={onSubmit}>
      <Row>
        <Col xs={6} md={3} xl={2} className="pl-1 pr-1 mt-3">
          <TextInput
            onChange={onChange}
            value={pieceId}
            label={`${t("printLabelTable.idRequest")} / ${t("printLabelScreen.piece")} / ${t("printLabelScreen.tracking")}`}
          /> 
        </Col>
        <Col xs={6} md={3} xl={1} className="filterButton pl-1 pr-1 mt-3">
          <ActionButton width="100" type="submit">{t("search")}</ActionButton>
        </Col>
        <Col sm={12} md={6} xl={3} className="filterButton pl-1 pr-1 mt-3">
          <ActionButton
            width="100"
            secondary={activeFilter !== "activeTickets"}
            type="button"
            onClick={() => handleFilter("activeTickets")}
          >
            {t("trackingScreen.showActiveTickets")}
          </ActionButton>
        </Col>
        <Col sm={12} md={6} xl={3} className="filterButton pl-1 pr-1 mt-3">
          <ActionButton
            width="100"
            secondary={activeFilter !== "onRoadTickets"}
            type="button"
            onClick={() => handleFilter("onRoadTickets")}
          >
            {t("trackingScreen.showOnRoadTickets")}
          </ActionButton>
        </Col>
        <Col sm={12} md={6} xl={3} className="filterButton pl-1 pr-1 mt-3">
          <ActionButton
            width="100"
            secondary={activeFilter !== "deliveringTickets"}
            type="button"
            onClick={() => handleFilter("deliveringTickets")}
          >
            {t("trackingScreen.showDeliveringTickets")}
          </ActionButton>
        </Col>
      </Row>
      {validationErr && (
        <Row className="mt-2 ">
          <Col>
            <span className="text-danger validation-err">
              Debe ingresar un id de pieza
            </span>
          </Col>
        </Row>
      )}
    </Form>
  );
};

export default TrackingForm;
