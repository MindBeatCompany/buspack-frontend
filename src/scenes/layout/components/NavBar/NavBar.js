import React, { useState } from "react";
import { Col, Container, Navbar, Row, NavDropdown } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "./styles.scss";
import { ActionButton, GenericModal } from "../../../../components";
import { IconDesplegarMenu, IconHelp, IconLogoBrand, IconConfig } from "../../../../resources/icons";

const NavBar = ({
  t,
  logout,
  location,
  auth: {
    userData,
    userData: { firstTimeLogged },
  },
  history,
}) => {
  const [modalShow, setModalShow] = useState(false);
  const guard = () => {
    if(firstTimeLogged){
      return;
    } 
    history.push(
      userData.roles === "ADMINISTRADOR" ? "/home" : "/home-user"
    );
  };
  return (
    <>
      <GenericModal
        setModalShow={setModalShow}
        modalShow={modalShow}
        title="Ayuda"
        subtitle="Preguntas frecuentes"
        bodyText="¿Puedo cargar mi Tarifario personalizado?
        Si, puedes descargarlo y completar los valores de los servicios que necesites.
        - ¿Puedo cargar varios servicios a la vez?
        Si, puedes cargar varios servicios a la vez."
      />
      <Navbar className="navbar">
        <Navbar.Brand>
          <Container fluid>
            <Row>
              <Col
                onClick={()=>guard()}
                style={{ cursor: "pointer" }}
              >
                <IconLogoBrand />
              </Col>
            </Row>
          </Container>
        </Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          {!firstTimeLogged && <Link to="/user-preferences" className="mr-4">
            <IconConfig />
          </Link>}
          <Link
            to="#"
            className="mr-4"
            onClick={() => setModalShow(true)}
          >
            <IconHelp />
          </Link>
          <h6>
            {userData.companyName} - {userData.userName}
          </h6>
          <FontAwesomeIcon className="user-circle" icon={faUserAlt} />
          <NavDropdown title={<IconDesplegarMenu />} id="nav-dropdown">
              <div style={{whiteSpace: "nowrap"}} className="m-3">
              <ActionButton onClick={() => logout()}>
                Cerrar Sesión
              </ActionButton>
              </div>
          </NavDropdown>

        </Navbar.Collapse>
      </Navbar>
    </>
  );
};
export default NavBar;
