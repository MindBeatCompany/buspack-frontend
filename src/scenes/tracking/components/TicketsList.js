import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./TicketsList.scss";

const TicketsList = ({ tickets, searchMode, t }) => {
  const [ticketsToShow, setTicketsToShow] = useState([]);

  const mapModesToStatus = {
    onRoadTickets: ["En Agencia Origen"],
    deliveringTickets: ["", "Otro"],
    activeTickets: ["Pieza a retirar en Cliente"],
  };

  useEffect(() => {
    setTicketsToShow(
      tickets.filter((tk) => mapModesToStatus[searchMode].includes(tk.status))
    );
  }, [searchMode]);

  return (
    <>
      {ticketsToShow.map((tk, index) => (
        <>
          <Row className="tk-list-tracking">
            <Col>
              <span className="badge-tk badge-number">
                Pedido {tk.requestId}
              </span>
            </Col>
            <Col>
              <span className="badge-tk  badge-status">
                {tk.status}
              </span>
            </Col>
            <Col>
              <Link to="#">Ver detalle del Seguimiento</Link>
            </Col>
          </Row>
          <hr></hr>
        </>
      ))}
    </>
  );
};

export default TicketsList;
