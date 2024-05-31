import React, { useState, useEffect } from "react";
import { Row, Col, Spinner } from "react-bootstrap";
import {
  ActionButton,
  AuthenticatedLink,
  DropZone,
} from "../../../../components";
import { BASEURL } from "../../../../config/constants";
import Swal from "sweetalert2";

const UploadZone = ({
  t,
  getHeaders,
  auth,
  accountId,
  history,
  sendServiceRequestUpload,
  sendServiceRequestPutArchivo,
}) => {
  const [excelUploaded, setExcelUploaded] = useState(null);
  const [loading, setLoading] = useState(false);
  const [planillaCargada, setPlanillaCargada] = useState(false);

  useEffect(() => {
    if (excelUploaded) window.scrollTo(0, document.body.scrollHeight);
  }, [excelUploaded]);

  const updateExcelFile = (excelFile) => {
    setExcelUploaded(excelFile);
    getAll();
  };

  //const url = `${BASEURL}/service-request/format-request?accountId=${idClienteCorporativo}`;
  //const url = `https://qa.derservicios.com.ar/v1/api/v1/api/service-request/format-request?accountId=${idClienteCorporativo}`;

  const getAll = async () => {
    // const getUrl = `http://localhost:4200/v1/api/service-request/xls-format-localities?accountId=${accountId}`;
    // const getUrl = `https://qa.derservicios.com.ar/v1/api/v1/api/service-request/xls-format-localities?accountId=${accountId}`;
    const getUrl = `${BASEURL}/service-request/xls-format-localities?accountId=${accountId}`;

    const request = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + auth.userData.token,
      },
    };
    const response = await fetch(getUrl, request);
    const respuesta = await response.text();

    setPlanillaCargada(JSON.parse(respuesta).exists);
  };

  // const url = `http://localhost:4200/v1/api/service-request/xls-format-localities/download`;
  // const url = `https://qa.derservicios.com.ar/v1/api/v1/api/service-request/xls-format-localities/download`;
  const url = `${BASEURL}/service-request/xls-format-localities/download?accountId=${accountId}`;

  let headers;
  getHeaders({
    callback: (h) => {
      headers = h;
    },
  });

  const saveFile = () => {
    sendServiceRequestUpload({
      excelUploaded,
      clientId: accountId,
      callback: ({ success, data }) => {
        if (success) {
          Swal.fire({
            title: "Las localidades han sido guardadas exitosamente",
            icon: "success",
            confirmButtonText: `Continuar`,
          }).then(() => {
            history.push({
              pathname: "/account-modification",
            });
          });
        } else {
          Swal.fire({
            title: data,

            icon: "error",
            confirmButtonText: `Continuar`,
          });
        }
      },
    });
  };

  const UploadPlanilla = () => {
    sendServiceRequestPutArchivo({
      excelUploaded,
      clientId: accountId,
      callback: ({ success, data }) => {
        Swal.fire({
          title: "Las localidades han sido modificadas exitosamente",
          icon: "success",
          confirmButtonText: `Continuar`,
        }).then(() => {
          history.push({
            pathname: "/account-modification",
          });
        });
      },
    });
  };

  return (
    <>
      <Row className="mt-3 mb-3">
        <Col>
          <p className="d-inline-block mr-2">
            Para actualizar las Localidades, descargue versi¢n actual, modifique
            lo que considere necesario y vuelva a cargarlo.
          </p>
          <AuthenticatedLink
            url={url}
            authHeaders={headers}
            filename="planilla-localidades"
          >
            <strong className="">{t("downloadLocation")}</strong>
          </AuthenticatedLink>
        </Col>
      </Row>
      <Row className="justify-content-center mt-2 mb-4">
        <Col xs={10} md={10}>
          <DropZone setExcelUploaded={updateExcelFile} />
        </Col>
      </Row>
      {excelUploaded && (
        <Row className="mt-4 mb-4">
          <Col className=" text-right">
            {!planillaCargada ? (
              <ActionButton onClick={saveFile} width={30} disabled={loading}>
                {loading ? (
                  <Spinner animation="border" variant="light" />
                ) : (
                  "Confirmar"
                )}
              </ActionButton>
            ) : (
              <ActionButton
                onClick={UploadPlanilla}
                width={30}
                disabled={loading}
              >
                {loading ? (
                  <Spinner animation="border" variant="light" />
                ) : (
                  "Actualizar"
                )}
              </ActionButton>
            )}
          </Col>
        </Row>
      )}
    </>
  );
};

export default UploadZone;
