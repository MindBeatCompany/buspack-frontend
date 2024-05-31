import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";
import { authActions } from "../../state/ducks/auth";
import { userActions } from "../../state/ducks/user";
import { Col, Row, Spinner, Container } from "react-bootstrap";
import { DropZone, AuthenticatedLink, ActionButton } from "../../components";

import {
  BASEURL,
  FILENAME_CONSTANTS,
  URL_CONSTANTS,
} from "../../config/constants";
import { serviceOrderActions } from "../../state/ducks/serviceOrder";
import ScreenNav from "../../components/ScreenNav";
import Swal from "sweetalert2";
import CheckRadio from "../../components/CheckRadio";
import DropZoneStandard from "../../components/DropZone2";
import DropZonePersonalizado from "../../components/DropZone3";
import "./serviceRequests.scss";

class ServiceRequests extends Component {
  constructor(props) {
    super(props);
    this.state = {
      excelUploaded: null,
      loading: false,
      excelUploadedStandard: null,
      typeExcel: true,
      typeExcelStandard: false,
    };
    this.sendFilesPersonalizado = this.sendFilesPersonalizado.bind(this);
    this.sendFilesStandard = this.sendFilesStandard.bind(this);
    this.setExcelUploaded = this.setExcelUploaded.bind(this);
    this.setExcelUploadedStandard = this.setExcelUploadedStandard.bind(this);
    this.setTypeExcel = this.setTypeExcel.bind(this);
    this.setTypeExcelStandard = this.setTypeExcelStandard.bind(this);
  }

  componentDidMount() {
    const { resetServiceOrder } = this.props;
    resetServiceOrder();
  }

  sendFilesPersonalizado() {
    const { excelUploaded, typeExcel } = this.state;
    this.setState({ loading: true });
    this.props.sendServiceRequestPersonalizado({
      excelUploaded,
      typeExcel,
      callback: ({ success, data }) => {
        this.setState({ loading: false });
        if (success) {
          this.props.history.push("/service-requests/preload");
        } else {
          console.log(data);
          Swal.fire({
            title: data,
            icon: "error",
            confirmButtonText: `Continuar`,
          });
        }
      },
    });
  }

  sendFilesStandard() {
    const { excelUploadedStandard, typeExcelStandard } = this.state;
    this.setState({ loading: true });
    this.props.sendServiceRequestStandard({
      excelUploadedStandard,
      typeExcelStandard,
      callback: ({ success, data }) => {
        this.setState({ loading: false });
        if (success) {
          this.props.history.push("/service-requests/preload");
        } else {
          console.log(data);
          Swal.fire({
            title: data,
            icon: "error",
            confirmButtonText: Continuar,
          });
        }
      },
    });
  }

  setExcelUploaded(excelFile) {
    this.setState({ excelUploaded: excelFile });
  }
  setExcelUploadedStandard(excelFile) {
    this.setState({ excelUploadedStandard: excelFile });
  }

  setTypeExcel(typeBool) {
    this.setState({ typeExcel: typeBool });
    this.setState({ typeExcelStandard: !typeBool });
  }

  setTypeExcelStandard(typeBool) {
    this.setState({ typeExcelStandard: !typeBool });
    this.setState({ typeExcel: typeBool });
  }

  render() {
    const { history, getHeaders, t } = this.props;
    const url = `${BASEURL}${URL_CONSTANTS.downloadPlanilla}`;
    let headers;
    getHeaders({
      callback: (h) => {
        headers = h;
      },
    });

    const {
      excelUploaded,
      loading,
      excelUploadedStandard,
      typeExcel,
      typeExcelStandard,
    } = this.state;

    return (
      <>
        <Container fluid>
          <Row className="mt-4">
            <Col>
              <h1>Solicitudes de Servicio</h1>
              <ScreenNav
                history={history}
                previousPage={t("home")}
                previousUrlPage="/home"
                currentPage={t("sideBar.services")}
              />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <p className="d-inline-block mr-2">
                {t("serviceRequests.excelDownloadAclaration")}
              </p>{" "}
            </Col>
          </Row>
          <div className="d-flex mt-5 w-100">
            <div class="form-check text-center">
              <input
                type="radio"
                class="form-check-input"
                id="radio1"
                name="optradio"
                value="option1"
                onClick={() => {
                  this.setTypeExcel(true);
                }}
                checked={typeExcel}
              />
              Personalizada
              <div>(TXT, CSV o EXCEL)</div>
              <label class="form-check-label" for="radio1"></label>
              <Row className="mt-5 pr-5 d-flex justify-content-center">
                <Col xs={12} md={12}>
                  <DropZonePersonalizado
                    setExcelUploaded={this.setExcelUploaded}
                    setTypeExcel={typeExcel}
                  />
                </Col>
              </Row>
              {excelUploaded && (
                <div className="mt-4 row">
                  <div className="col text-center btnConfirmarRequest">
                    <ActionButton
                      onClick={() => this.sendFilesPersonalizado()}
                      disabled={loading}
                    >
                      {loading ? (
                        <Spinner animation="border" variant="light" />
                      ) : (
                        "Confirmar"
                      )}
                    </ActionButton>
                  </div>
                </div>
              )}
            </div>
            <div class="form-check text-center">
              <input
                type="radio"
                class="form-check-input"
                id="radio2"
                name="optradio"
                value="option2"
                checked={typeExcelStandard}
                onClick={() => {
                  this.setTypeExcelStandard(false);
                }}
              />
              Standard
              <div>
                <AuthenticatedLink
                  url={url}
                  authHeaders={headers}
                  filename={FILENAME_CONSTANTS.planilla}
                >
                  Descargar planilla modelo
                </AuthenticatedLink>
              </div>
              <label class="form-check-label" for="radio2"></label>
              <Row className="mt-5 pr-5 d-flex justify-content-center">
                <Col xs={12} md={12}>
                  <DropZoneStandard
                    setExcelUploadedStandard={this.setExcelUploadedStandard}
                    setTypeExcelStandard={typeExcelStandard}
                  />
                </Col>
              </Row>
              {excelUploadedStandard && (
                <div className="mt-4 row">
                  <div className="col text-center btnConfirmarRequest">
                    <ActionButton
                      onClick={() => this.sendFilesStandard()}
                      disabled={loading}
                    >
                      {loading ? (
                        <Spinner animation="border" variant="light" />
                      ) : (
                        "Confirmar"
                      )}
                    </ActionButton>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </>
    );
  }
}
const mapDispatchToProps = ({ auth, user, serviceOrder }) => ({
  auth,
  user,
  serviceOrder,
});
export default compose(
  connect(mapDispatchToProps, {
    ...authActions,
    ...userActions,
    ...serviceOrderActions,
  }),
  withTranslation()
)(ServiceRequests);
