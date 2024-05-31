import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";
import { authActions } from "../../state/ducks/auth";
import { userActions } from "../../state/ducks/user";
import { serviceOrderActions } from "../../state/ducks/serviceOrder";
import { Col, Row, Container } from "react-bootstrap";
import EditFormDetail from "./components/EditFormDetail";
import { ScreenNav } from "../../components";

//import "./styles.scss";

class ServiceRequestsEditDetail extends Component {
  constructor(props) {
    console.log(props);
    super(props);
  }

  render() {
    const { t, history } = this.props;
    return (
      <Container fluid>
        <Row className="mt-5">
          <Col>
            <ScreenNav
              history={history}
              previousPage={t("serviceRequests.requestsPreload")}
              currentPage={t("serviceRequests.requestDetail")}
            />
          </Col>
        </Row>

        <Row className="mt-5">
          <Col>
            <EditFormDetail {...this.props} />
          </Col>
        </Row>
      </Container>
    );
  }
}
const mapDispatchToProps = ({ auth, user, serviceOrder }) => ({
  auth,
  user,
  serviceOrder
});
export default compose(
  connect(mapDispatchToProps, {
    ...authActions,
    ...userActions,
    ...serviceOrderActions
  }),
  withTranslation()
)(ServiceRequestsEditDetail);
