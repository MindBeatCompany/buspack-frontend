import React, { Component } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import { compose } from "redux";
import { RouteWithSubRoutes } from "../../config/routes";
import { authActions } from "../../state/ducks/auth";
import { userActions } from "../../state/ducks/user";
import { NavBar, SideBar } from "./components/";
import {
  AuthenticatedSessionControl,
  LogoutTypes,
} from "react-session-control";
import "./styles.scss";

class Layout extends Component {
  constructor(props) {
    super(props);
    this.handleSessionControlLogout =
      this.handleSessionControlLogout.bind(this);
  }

  handleSessionControlLogout(logoutType) {
    switch (logoutType) {
      case LogoutTypes.button:
        this.props.logout();
        break;
      case LogoutTypes.inactivity:
        this.props.logout();
        break;
      case LogoutTypes.lostToken:
        this.props.logout();
        break;
      default:
        return;
    }
  }

  render() {
    const { routes } = this.props;
    return (
      <Container fluid className="layout">
        <NavBar {...this.props} />

        <Row>
          <SideBar {...this.props} />
          <Col className="views">
            <Switch>
              {routes.map((route) => (
                <RouteWithSubRoutes key={`${route.path}`} {...route} />
              ))}
              <Redirect to="/home" />
            </Switch>
          </Col>
        </Row>
        {this.props.user.idleTimeInSeconds > 0 && (
          <AuthenticatedSessionControl
            title={"Alerta Inactividad"}
            message={"Estuviste inactivo por un periodo de tiempo extendido. ¿Quiere permanecer en el sistema?"}
            timerMessage={"Se desconectará en "}
            logoutButtonText={"Cerrar Sessión"}
            continueButtonText={"Permanecer"}
            inactivityTimeout={this.props.user.idleTimeInSeconds}
            modalInactivityTimeout={10}
            storageTokenKey="token"
            onLogout={this.handleSessionControlLogout}
          />
        )}
      </Container>
    );
  }
}
const mapDispatchToProps = ({ auth, user }) => ({ auth, user });
export default compose(
  connect(mapDispatchToProps, { ...authActions, ...userActions }),
  withTranslation()
)(Layout);
