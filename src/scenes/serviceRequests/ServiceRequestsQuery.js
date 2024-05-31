import React, { Component } from "react";
import { Badge, Button, Col, Container, Form, Row } from "react-bootstrap";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";
import {
  ActionButton,
  GenericTable,
  LoaderSpinner,
  ScreenNav,
  TextInput,
} from "../../components";
import BadgeForStatus from "../../components/BadgeForStatus";
import DatePicker from "../../components/DatePicker";
import { authActions } from "../../state/ducks/auth";
import { userActions } from "../../state/ducks/user";
import { serviceOrderActions } from "../../state/ducks/serviceOrder";
import { serviceRequestQueryActions } from "../../state/ducks/serviceRequestQuery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { trackingActions } from "../../state/ducks/tracking";
import { Link } from "react-router-dom";

class ServiceRequestsQuery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {
        fromDate: new Date(),
        toDate: new Date(),
        numberOrder: "",
        numberGuide: "",
        idPiece: "",
      },
      validationFormError: null,
      theaders: [
        this.props.t("printLabelTable.piece"),
        this.props.t("serviceRequests.date"),
        this.props.t("serviceRequests.order"),
        this.props.t("serviceRequests.name"),
        this.props.t("serviceRequests.address"),
        this.props.t("serviceRequests.cpa"),
        this.props.t("serviceRequests.city"),
        this.props.t("serviceRequests.province"),
        this.props.t("serviceRequests.box"),
        this.props.t("serviceRequests.send"),
        this.props.t("serviceRequests.guide"),
        this.props.t("serviceRequests.state"),
        this.props.t("serviceRequests.actions"),
      ],
      dataTable: null,
      isLoading: false,
    };
    this.handleValidation = this.handleValidation.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

  componentDidMount() {
    const { getSaidToken } = this.props;
    getSaidToken({
      callback:({success})=>{
      }
    })
  }

  getDataTable = (formValues) => {

    this.setState({ isLoading: true });

    const callback = ({success, data})=>{

      if(success) {
        let dataUnProcess = null;
        dataUnProcess = data.data;
        this.processData(dataUnProcess);
      }
      this.setState({ isLoading: false });
    }
    this.props.getQuery({
      fromDate: formValues.fromDate,
      toDate: formValues.toDate,
      requestId: formValues.numberOrder,
      voucher: formValues.numberGuide,
      delivery: formValues.idPiece,
      callback
    })
  };

  processData = (dataTable) => {
    let processData = dataTable;
    if(dataTable.length !== 0) {

        processData = dataTable.map((row) => {
          const {
            address,
            caja,
            city,
            cpa,
            createdAt,
            envio,
            estado,
            acciones,
            pieceId,
            province,
            recipientFullname,
            requestId,
            voucher,
          } = row;
          const Estado = <BadgeForStatus state={estado} />;
          const Acciones = <Link
                            to={{
                              pathname: "/service-requests/preload/editDetail",
                              state: { ...row, editMode: "edit" },
                            }}
                          >Detalle
                          </Link>;
          return [pieceId,createdAt,requestId,recipientFullname,address,cpa,city,province, caja, envio, voucher, Estado, Acciones];
          
        });  
    }
    this.setState({ dataTable: processData });
    this.setState({ isLoading: false });
    
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ validationFormError: false });
    this.handleValidation();
    const { formValues } = this.state;
    if (this.handleValidation()) {
      this.setState({ isLoading: false });
      return;
    }

    this.getDataTable(formValues);
  };

  handleChange = ({ target }) => {
    const { formValues } = this.state;
    formValues[target.name] = target.value;
    this.setState({ formValues });
  };

  handleEdit = (row) => {
    console.log("row")
    console.log(row)
  };

  handleValidation = () => {
    const { fromDate, toDate, numberOrder, numberGuide, idPiece } =
      this.state.formValues;
    let values = [numberOrder, numberGuide, idPiece];

    // if (fromDate && toDate) return false;

    /* if ((fromDate && !toDate) || (!fromDate && toDate)) {
      this.setState({
        validationFormError:
          "Debe ingresar ambas fechas (desde/hasta) para poder realizar una búsqueda",
      });
      return true;
    } */

    // if (!values.find((val) => val.trim() !== "")) {
    //   this.setState({
    //     validationFormError:
    //       "Debe completar al menos un campo para poder realizar una búsqueda",
    //   });
    //   this.setState({ isLoading: false });
    //   return true;
    // }
    this.setState({ isLoading: false });
    this.setState({ validationFormError: null });
    return false;
  };

  render() {
    const { t, history } = this.props;
    const { formValues, isLoading, theaders, dataTable, validationFormError } =
      this.state;

    return (
      <>
        <Container fluid>
          <Form onSubmit={this.handleSubmit}>
            <Row className="mt-4">
              <Col xs={6}>
                <h1>{t("titles.queryRequest")}</h1>
                <ScreenNav
                  history={history}
                  previousPage={t("home")}
                  previousUrlPage="/home"
                  currentPage={t("sideBar.inquiry")}
                />
              </Col>
            </Row>
            <Row
              className="justify-content-start pt-3"
              style={{ overFlowX: "hidden", overFlowY: "hidden" }}
            >
              <Col xs={6}>
                <DatePicker
                  name={"fromDate"}
                  controlId={"fromDate"}
                  selected={formValues.fromDate}
                  onChange={(date) =>
                    this.setState({
                      formValues: { ...this.state.formValues, fromDate: date },
                    })
                  }
                  label={t("formLabels.fromDate")}
                />
              </Col>
              <Col xs={6}>
                <DatePicker
                  name={"toDate"}
                  controlId={"toDate"}
                  selected={formValues.toDate}
                  onChange={(date) =>
                    this.setState({
                      formValues: { ...this.state.formValues, toDate: date },
                    })
                  }
                  label={t("formLabels.toDate")}
                />
              </Col>
              <Col xs={4}>
                <TextInput
                  label={t("formLabels.numberOrder")}
                  controlId="numberOrder"
                  name="numberOrder"
                  onChange={(e) => this.handleChange(e)}
                  inputType="text"
                  placeholder={
                    t("formLabels.placeHolder.enter") +
                    t("formLabels.numberOrder")
                  }
                  // required={true}
                  value={formValues.numberOrder}
                />
                {/* {formErrors.numberOrder && (
                  <div>
                    <span className="text-danger">
                      {formErrors.numberOrder}
                    </span>
                  </div>
                )} */}
              </Col>
              <Col xs={4}>
                <TextInput
                  label={t("formLabels.numberGuide")}
                  controlId="numberGuide"
                  name="numberGuide"
                  onChange={(e) => this.handleChange(e)}
                  inputType="text"
                  placeholder={
                    t("formLabels.placeHolder.enter") +
                    t("formLabels.numberGuide")
                  }
                  value={formValues.numberGuide}
                  // required={true}
                />
                {/* {formErrors.numberGuide && (
                  <div>
                    <span className="text-danger">
                      {formErrors.numberGuide}
                    </span>
                  </div>
                )} */}
              </Col>
              <Col  xs={4}>
                <TextInput
                  label={t("formLabels.idPiece")}
                  controlId="idPiece"
                  name="idPiece"
                  onChange={(e) => this.handleChange(e)}
                  inputType="text"
                  placeholder={
                    t("formLabels.placeHolder.enter") + t("formLabels.idPiece")
                  }
                  value={formValues.idPiece} // required={true}
                />
                {/* {formErrors.idPiece && (
                  <div>
                    <span className="text-danger">{formErrors.idPiece}</span>
                  </div>
                )} */}
              </Col>
            </Row>
            {validationFormError && (
              <Row>
                <Col>
                  <FontAwesomeIcon
                    className="text-danger mr-2"
                    icon={faExclamationCircle}
                  />
                  <span className="text-danger">
                    <strong>{validationFormError}</strong>
                  </span>
                </Col>
              </Row>
            )}
            <Row className="justify-content-end pt-3">
              <Col xs={12} md={4}>
                <ActionButton type="Submit" width="100" disabled={isLoading}>
                  {t("formButtons.searchOrder")}
                </ActionButton>
              </Col>
            </Row>

            {/* {dataTable && (
              <Row
                className="justify-content-end pt-3"
              >
                <Col xs={12} md={4}>
                  <ActionButton width="100" disabled={isLoading}>
                    {t("formButtons.exportCSV").toUpperCase()}
                  </ActionButton>
                </Col>
              </Row>
            )} */}
          </Form>

          <Row className="justify-content-center pt-3">
            {isLoading && (
              <Col xs={12} md={2} className="text-center">
                <LoaderSpinner />
              </Col>
            )}

            {dataTable && !isLoading && (
              <Col>
                <GenericTable
                  showState={true}
                  centeredTd
                  centeredTh
                  theads={theaders}
                  bodyRows={dataTable}
                  t={t}
                />
              </Col>
            )}
          </Row>
        </Container>
      </>
    );
  }
}
const mapDispatchToProps = ({ auth, user, serviceOrder }) => ({ auth, user, serviceOrder });
export default compose(
  connect(mapDispatchToProps, { ...authActions, ...userActions, ...serviceOrderActions, ...serviceRequestQueryActions, ...trackingActions }),
  withTranslation()
)(ServiceRequestsQuery);
