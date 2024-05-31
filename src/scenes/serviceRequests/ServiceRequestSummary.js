import React, { Component } from "react";
import { Col, Container, Row, Button } from "react-bootstrap";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";
import { ActionButton, ScreenNav } from "../../components";
import StatusCircle from "../../components/StatusCircle";
import { IMG } from "../../resources/images";
import { authActions } from "../../state/ducks/auth";
import { userActions } from "../../state/ducks/user";
import { Link } from "react-router-dom";

class ServiceRequestSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createRequest: {
        qty: 0,
        detail: "",
      },
      errorRequest: {
        qty: 0,
        detail: "",
      },
      warningRequest: {
        qty: 0,
        detail: "",
      },
    };
  }

  componentDidMount() {
    const {
      location: { state },
    } = this.props;
    this.setState(state);
  }

  render() {
    const {
      t,
      history,
      location: { state },
    } = this.props;

    const { createRequest, errorRequest, warningRequest } = this.state;

    return (
      <Container fluid>
        <Row className="mt-4">
          <Col>
            <h1>{t("titles.serviceRequest")}</h1>
            <ScreenNav
              history={history}
              previousPage={t("home")}
              previousUrlPage="/home"
              currentPage={t("sideBar.services")}
            />
          </Col>
        </Row>
        <Row style={{ justifyContent: "center", padding: "45px 0px" }}>
          <Col md={8}>
            <Row style={{ justifyContent: "center", marginBottom: "45px" }}>
              <Col>
                <h5>
                  {t("serviceRequestSummaryScreen.infoText")}{" "}
                    <Link to="query">
                    {t("serviceRequestSummaryScreen.queryServiceRequest")}
                    </Link>
                </h5>
              </Col>
            </Row>
            <Row md={12} style={{ alignItems: "center" }}>
              <Col md={4}>
                <img
                  style={{ alignItems: "center" }}
                  src={IMG.logoColor}
                  alt="logo-hubbpack"
                />
              </Col>
              <Col>
                <Row style={{ alignItems: "center", padding: "5px" }}>
                  <Col xs={2}>
                    <StatusCircle
                      number={createRequest && createRequest.qty}
                      status="success"
                    />
                  </Col>
                  <Col>{t("serviceRequestSummaryScreen.requestCreated")}</Col>
                  {/* <Col md={2}>
                    <Link to="#">
                      {t("serviceRequestSummaryScreen.seeDetail")}
                    </Link>
                  </Col> */}
                </Row>
                <Row style={{ alignItems: "center", padding: "5px" }}>
                  <Col md={2}>
                    <StatusCircle
                      number={errorRequest && errorRequest.qty}
                      status="danger"
                    />
                  </Col>
                  <Col>{t("serviceRequestSummaryScreen.requestError")}</Col>
                  {/* <Col md={2}>
                    <Link to="#">
                      {t("serviceRequestSummaryScreen.seeDetail")}
                    </Link>
                  </Col> */}
                </Row>
                <Row style={{ alignItems: "center", padding: "5px" }}>
                  <Col md={2}>
                    <StatusCircle
                      number={warningRequest && warningRequest.qty}
                      status="warning"
                    />
                  </Col>
                  <Col>{t("serviceRequestSummaryScreen.requestWarning")}</Col>
                  {/* <Col md={2}>
                    <Link to="#">
                      {t("serviceRequestSummaryScreen.seeDetail")}
                    </Link>
                  </Col> */}
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row style={{ justifyContent: "center" }}>
          <ActionButton onClick={() => history.push("/service-requests")}>
            {t("formButtons.newServiceRequest")}
          </ActionButton>
        </Row>
      </Container>
    );
  }
}
const mapDispatchToProps = ({ auth, user }) => ({ auth, user });
export default compose(
  connect(mapDispatchToProps, { ...authActions, ...userActions }),
  withTranslation()
)(ServiceRequestSummary);
