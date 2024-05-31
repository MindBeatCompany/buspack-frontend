import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";
import { authActions } from "../../state/ducks/auth";
import { userActions } from "../../state/ducks/user";
import { serviceOrderActions } from "../../state/ducks/serviceOrder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { ScreenNav } from "../../components";
import { Col, Row, Container, Spinner } from "react-bootstrap";
import PreLoadTable from "./components/PreLoadTable";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import "./serviceRequestsPreload.scss";

import { ActionButton, StatusCircle } from "../../components";
class ServiceRequestsPreload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      theaders: [
        this.props.t("serviceRequests.requestId"),
        this.props.t("serviceRequests.recipient"),
        this.props.t("serviceRequests.address"),
        this.props.t("serviceRequests.addressNumber"),
        this.props.t("serviceRequests.addressBuild"),
        this.props.t("serviceRequests.addressFloor"),
        this.props.t("serviceRequests.addressApartment"),
        this.props.t("serviceRequests.localidad"),
        this.props.t("serviceRequests.province"),
        this.props.t("serviceRequests.cpa"),
        this.props.t("serviceRequests.docNumber"),
        this.props.t("serviceRequests.enabledPlace"),
        this.props.t("serviceRequests.pieces"),
        this.props.t("serviceRequests.weight"),
        this.props.t("serviceRequests.details"),
      ],
      bodyRows: [],
      selectedRowsToEdit: [],
      loading: false,
    };
    this.onEdit = this.onEdit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleDeleteRows = this.handleDeleteRows.bind(this);
    this.createRequest = this.createRequest.bind(this);
    //this.handleDeleteRows = this.handleDeleteRows.bind(this);
    this.buildRow = this.buildRow.bind(this);
    this.getRowsWithError = this.getRowsWithError.bind(this);
    this.getSuccessRows = this.getSuccessRows.bind(this);
  }

  componentDidMount() {
    //here we transform an array of objects to an array of values to be used by table component
    // this.buildRow();
  }

  buildRow() {
    const {
      serviceOrder: { serviceOrderList },
    } = this.props;

    const bodyRowsTransformed = [];
    serviceOrderList.forEach((row, idx) => {
      const {
        requestId,
        recipientFullname,
        addressStreet,
        addressNumber,
        addressBuild,
        addressFloor,
        addressApartment,
        locality,
        province,
        cpa,
        docNumber,
        enabledPlace,
        qtyPieces,
        totalWeight,
      } = row;
      // removing some data from Row, like homeDelivery atribute
      let newObj = {
        requestId,
        recipientFullname,
        addressStreet,
        addressNumber,
        addressBuild,
        addressFloor,
        addressApartment,
        locality,
        province,
        cpa,
        docNumber,
        enabledPlace,
        qtyPieces,
        totalWeight,
      };
      bodyRowsTransformed.push([
        ...Object.values(newObj),
        { status: "ok", value: this.showDetails(row) },
      ]);
    });

    this.setState({ bodyRows: bodyRowsTransformed });
  }

  onChange(e) {
    const value = e.target.value;
    const checked = e.target.checked;
    const { selectedRowsToEdit } = this.state;
    if (checked) {
      this.setState({
        selectedRowsToEdit: [...selectedRowsToEdit, Number(value)],
      });
    } else {
      this.setState({
        selectedRowsToEdit: selectedRowsToEdit.filter(
          (r, idx) => r !== Number(value)
        ),
      });
    }
  }

  onEdit() {
    const { isEditing, bodyRows } = this.state;
    if (bodyRows.length === 0) return;
    this.setState(
      {
        isEditing: !isEditing,
        selectedRowsToEdit: [],
      },
      () => {
        this.buildRow();
      }
    );
  }

  // this func returns a html node to be inserted in the table
  showDetails(rowData) {
    const { t } = this.props;
    const { isEditing } = this.state;
    return (
      <span>
        <Link
          to={{
            pathname: "/service-requests/preload/edit",
            state: { ...rowData, editMode: isEditing },
          }}
        >
          {isEditing ? t("edit") : t("showMore")}
        </Link>
      </span>
    );
  }

  handleDeleteRows() {
    const {
      t,
      deleteServiceRequest,
      serviceOrder: { serviceOrderList },
    } = this.props;
    const { selectedRowsToEdit } = this.state;

    Swal.fire({
      title: t("confirmationQuestion"),
      showDenyButton: true,
      icon: "warning",
      confirmButtonText: t("modalButtons.accept"),
      confirmButtonColor: "#F28E2A",
      denyButtonText: t("modalButtons.cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        let newBrows = serviceOrderList.filter(
          (row, idx) => !selectedRowsToEdit.includes(idx)
        );

        this.setState({
          // bodyRows: newBrows,
          isEditing: false,
          selectedRowsToEdit: [],
        });

        deleteServiceRequest({ newOrderList: newBrows });

        Swal.fire({
          title: t("serviceRequests.rowsHaveBeenDeleted"),
          icon: "success",
          confirmButtonText: "Cerrar",
        });
      }
    });
  }

  createRequest() {
    const {
      history,
      createServiceRequest,
      serviceOrder: { serviceOrderList },
    } = this.props;

    if (this.getRowsWithError() != 0) {
      Swal.fire(
        "Oops...",
        `No se pueden crear solicitudes con errores, favor verificar`,
        "info"
      );
      return;
    }

    const callback = ({ success, data, status }) => {
      this.setState({ loading: false });

      if (!success) {
        Swal.fire("Oops... ha ocurrido un error", `${data.message}`, "info");
      } else {
        if (status === 201) {
          history.push({
            pathname: "/service-requests/summary",
            state: data,
          });
        } else {
          Swal.fire("Oops..", `Por favor verificar las solicitudes`, "info");
        }
      }
    };

    let rowsArray = [];
    serviceOrderList.forEach((row) => {
      let keys = Object.keys(row);
      let obj = {};
      keys.forEach((k) => {
        obj = { ...obj, [k]: row[k].value };
      });
      rowsArray.push(obj);
    });

    this.setState({ loading: true });
    createServiceRequest({ data: rowsArray, callback });
  }

  getRowsWithError() {
    // this returns the length of rows with any error
    const rowsError = this.state.bodyRows.filter((br) =>
      br.some((col) => col.status !== "ok")
    );
    return rowsError.length;
  }

  getSuccessRows() {
    const {
      serviceOrder: { serviceOrderList },
    } = this.props;
    return serviceOrderList.length - this.getRowsWithError();
  }

  render() {
    const { t, history } = this.props;
    const { isEditing, theaders, bodyRows, selectedRowsToEdit, loading } =
      this.state;

    return (
      <Container className="services-preload">
        <Row className="pt-4 mt-0 mb-2">
          <Col>
            <h1> {t("serviceRequests.mainTitle")} </h1>
          </Col>
        </Row>

        <Row>
          <Col>
            <ScreenNav
              history={history}
              previousPage={t("serviceRequests.mainTitle")}
              currentPage={t("serviceRequests.requestsPreload")}
            />
          </Col>
        </Row>

        {/*    REQUESTS STATUS CIRCLES    */}
        <Row className="mt-4">
          <Col>
            <Row>
              <Col xs={4} className="pr-0 text-center">
                <StatusCircle
                  number={String(this.getSuccessRows())}
                  status="success"
                />
              </Col>
              <Col className="text-left pl-0 text-container">
                {t("serviceRequests.requestsUploaded")}
              </Col>
            </Row>
          </Col>
          <Col>
            <Row>
              <Col xs={4} className="pr-0 text-center">
                <StatusCircle
                  number={String(this.getRowsWithError())}
                  status="danger"
                />
              </Col>
              <Col className="text-left pl-0 text-container">
                {t("serviceRequests.requestsWithError")}
              </Col>
            </Row>
          </Col>
          <Col>
            <Row>
              <Col xs={4} className="pr-0 text-center">
                <StatusCircle number="0" status="warning" />
              </Col>
              <Col className="text-left pl-0 text-container">
                {" "}
                {t("serviceRequests.warnings")}
              </Col>
            </Row>
          </Col>
          <Col xs={4} className="text-container">
            {isEditing ? (
              <span
                style={{ textDecoration: "underline", cursor: "pointer" }}
                className="text-primary"
                onClick={this.onEdit}
              >
                <strong> {t("serviceRequests.editCancel")}</strong>
              </span>
            ) : (
              <span
                style={{ textDecoration: "underline", cursor: "pointer" }}
                className="text-primary"
                onClick={this.onEdit}
              >
                <strong>{t("serviceRequests.editRequests")}</strong>
              </span>
            )}
            {selectedRowsToEdit.length > 0 && (
              <div className="d-inline-block ml-4">
                <FontAwesomeIcon icon={faTimes} className="text-danger" />
                <span
                  style={{ textDecoration: "underline", cursor: "pointer" }}
                  className="text-danger ml-1"
                  onClick={this.handleDeleteRows}
                >
                  <strong>{t("serviceRequests.deleteSelected")}</strong>
                </span>
              </div>
            )}
          </Col>
        </Row>
        {/* TABLE */}
        <Row className="mt-5">
          <Col>
            <PreLoadTable
              centeredTd
              centeredTh
              theads={theaders}
              bodyRows={bodyRows}
              selectable={isEditing}
              onChangeSelectable={this.onChange}
              buildRow={this.buildRow}
              t={t}
              {...this.props}
            />
          </Col>
        </Row>
        {/* ACTION BUTTONS */}
        {bodyRows.length > 0 && (
          <Row className="justify-content-center align-items-center mt-4 mb-4 d-flex w-50 mr-auto ml-auto">
            <Col>
              <ActionButton
                onClick={() => history.goBack()}
                secondary
                width="100"
              >
                {t("cancel").toUpperCase()}{" "}
              </ActionButton>
            </Col>
            <Col>
              <ActionButton
                disabled={loading}
                onClick={this.createRequest}
                width="100"
              >
                {loading ? (
                  <Spinner animation="border" variant="light" />
                ) : (
                  t("serviceRequests.createRequests").toUpperCase()
                )}
              </ActionButton>
            </Col>
          </Row>
        )}
      </Container>
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
)(ServiceRequestsPreload);
