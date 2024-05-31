import React, { useState, useEffect } from "react";
import { Row, Col, Spinner } from "react-bootstrap";
import {
  ActionButton,
  AuthenticatedLink,
  DropZone,
} from "../../../../components";
import { BASEURL, URL_CONSTANTS } from "../../../../config/constants";
import Swal from "sweetalert2";

const UploadZone = ({
  t,
  getHeaders,
  companyName,
  accountId,
  updatePricingFile,
  history,
}) => {
  const [excelUploaded, setExcelUploaded] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (excelUploaded) window.scrollTo(0, document.body.scrollHeight);
  }, [excelUploaded]);

  const updateExcelFile = (excelFile) => {
    setExcelUploaded(excelFile);
  };

  const saveFile = () => {
    setLoading(true);

    const callback = ({ success, message }) => {
      setLoading(false);
      if (success) {
        Swal.fire({
          title: "El tarifario ha sido cargado exitosamente",
          icon: "success",
          confirmButtonText: `Continuar`,
        }).then(() => {
          history.go();
        });
      } else {
        Swal.fire("Oops... algo salió mal", message, "error");
      }
    };

    const dataForm = new FormData();
    dataForm.append("file", excelUploaded[0]);

    updatePricingFile({ data: dataForm, callback, accountId });
  };

  const url = `${BASEURL}${URL_CONSTANTS.downloadTarifario}?accountid=${accountId}`;
  let headers;
  getHeaders({
    callback: (h) => {
      headers = h;
    },
  });

  return (
    <>
      <Row className="mt-3 mb-3">
        <Col>
          <strong>
            <p className="d-inline-block mr-2">
              Para actualizar Tarifario, descargue versión actual, modifique lo
              que considere necesario y vuelva a cargarlo.
            </p>
            <AuthenticatedLink
              url={url}
              authHeaders={headers}
              filename="planilla-tarifario"
            >
              {t("downloadPricing")}
            </AuthenticatedLink>
          </strong>
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
            <ActionButton onClick={saveFile} width={30} disabled={loading}>
              {loading ? (
                <Spinner animation="border" variant="light" />
              ) : (
                "Guardar tarifario"
              )}
            </ActionButton>
          </Col>
        </Row>
      )}
    </>
  );
};

export default UploadZone;
