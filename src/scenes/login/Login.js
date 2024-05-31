import React, { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";
import { UnauthenticatedSessionControl } from "react-session-control";
import { authActions } from "../../state/ducks/auth";
import { FormLogin } from "./components";
import "./styles.scss";
import { IMG } from "../../resources/images/index";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleSessionControlLogin = this.handleSessionControlLogin.bind(this);
  }
  handleSessionControlLogin() {
    this.props.history.push("/home");
  }
  handelOnClick() {
    const { i18n } = this.props;
    const language = localStorage.getItem("i18nextLng").split("-")[0];
    if (language === "es") {
      i18n.changeLanguage("en");
    } else if (localStorage.getItem("i18nextLng").split("-")[0] === "en") {
      i18n.changeLanguage("es");
    }
  }
  render() {
    const { history } = this.props;
    return (
      <Container fluid className="login">
        <UnauthenticatedSessionControl
          storageTokenKey="token"
          onLogin={this.handleSessionControlLogin}
        />
        <Row className="vh-100">
          <Col
            className="d-none d-lg-block  img-login-container p-0"
            xs={6}
          ></Col>
          <Col xs={12} lg={6} className="pl-5 p-3">
            <Row className="">
              <Col className="text-right">
                <img src={IMG.logoColor} />
              </Col>
            </Row>
            <Row className="pl-5 p-3 form-container">
              <Col className="my-auto">
                <Row>
                  <Col className="justify-content-start mb-4 ml-2">
                    <h2>LOGIN</h2>
                  </Col>
                </Row>
                <Row>
                  <Col xs={10}>
                    <FormLogin history={history} />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapDispatchToProps = ({ auth }) => ({ auth });
export default compose(
  connect(mapDispatchToProps, { ...authActions }),
  withTranslation()
)(Login);
