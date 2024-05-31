import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faPaperPlane,
  faTruck,
  faArchive,
  faCalendarCheck,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import "./PackageStatusBar.scss";

const estados = {
  ["Procesando su pedido"]: faSpinner,
  ["En camino"]: faPaperPlane,
  ["En sucursal de destino"]: faArchive,
  ["En distribucion"]: faTruck,
  ["Entregado"]: faCalendarCheck,
};

const lista_de_estados = ["Procesando su pedido", "En camino", "En sucursal de destino", "En distribucion", "Entregado"];
let buspackStatus = [{estado: null, fecha: null}, {estado: null, fecha: null}, {estado: null, fecha: null}, {estado: null, fecha: null}, {estado: null, fecha: null}];
const PackageStatusBar = ({ packageStatus, deliveryStatus, t }) => {
  const [pkgsStatus, setPkgsStatus] = useState(packageStatus);
  const [currentSt, setCurrentSt] = useState({
    estado: deliveryStatus.estado,
    fecha: deliveryStatus.fechaestado
  });

  useEffect(() => {
    buspackStatus = [{estado: null, fecha: null}, {estado: null, fecha: null}, {estado: null, fecha: null}, {estado: null, fecha: null}, {estado: null, fecha: null}];
    for (let i = 0; i < pkgsStatus.length; i++){
      if(pkgsStatus[i].estado == lista_de_estados[0]){
        buspackStatus[0] = pkgsStatus[i];
      }
      if(pkgsStatus[i].estado == lista_de_estados[1]){
        buspackStatus[1] = pkgsStatus[i];
      }
      if(pkgsStatus[i].estado == lista_de_estados[2]){
        buspackStatus[2] = pkgsStatus[i];
      }
      if(pkgsStatus[i].estado == lista_de_estados[3]){
        buspackStatus[3] = pkgsStatus[i];
      }
      if(pkgsStatus[i].estado == lista_de_estados[4]){
        buspackStatus[4] = pkgsStatus[i];
      }
    }
    let currentStatusIdx = pkgsStatus.findIndex(
      (st) => st.estado === currentSt.estado
    );
    setCurrentSt({
      estado: pkgsStatus[currentStatusIdx].estado,
      fecha: pkgsStatus[currentStatusIdx].fecha,
    });
  }, []);

  const getEstadosIcon = (estado) => {
    return estados[estado];
  };

  const getIconColor = (index, status) => {
    if (currentSt.estado == status){
      return;
    }
    if(lista_de_estados.indexOf(status) > lista_de_estados.indexOf(currentSt.estado)){
      return "next-status-color";
    }
    if(lista_de_estados.indexOf(currentSt.estado) > lista_de_estados.indexOf(status)){
      return "past-status-color";
    }
  };  

  return (
    <>
      <Row className="package-status text-center pl-4 pr-4 mb-4">
        <Col
          xs={12}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Row className="justify-content-center">
            {lista_de_estados.map((state, index) => (
              <>
                <Col
                  sm={3}
                  md="auto"
                  key={index}
                  className={`icon-container ${
                    state ? "text-success" : getIconColor(index, state)
                  }`}
                >
                  <FontAwesomeIcon
                    className={`icon-status ${getIconColor(index, state)}`}
                    icon={getEstadosIcon(state)}
                  />
                  <p className="mt-4">{buspackStatus[index]&&buspackStatus[index].fecha}</p>
                </Col>
                {index < lista_de_estados.length - 1 && (
                  <Col sm={1} md="auto" className="pb-5 narrow-container">
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className={getIconColor(index, state)}
                    />
                  </Col>
                )}
              </>
            ))}
           
          </Row>
        </Col>
        <Col xs={12} className="status-info ">
          <h1 className="text-success"> {currentSt.estado} </h1>
          {/* <p>
            {t("trackingScreen.deliveryPackageDateAclaration") +
              " " +
              deliveryStatus.fechadeestado}{" "}
          </p>
          <div className="mt-3">
            <Link to="#">Ver detalle de Seguimiento</Link>{" "}
          </div> */}
        </Col>
      </Row>
    </>
  );
};

export default PackageStatusBar;