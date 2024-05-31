import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";
import { authActions } from "../../state/ducks/auth";
import { userActions } from "../../state/ducks/user";
import { Col, Row, Alert } from "react-bootstrap";
import PasswordChangeForm from "./components/PasswordChangeForm";
//import "./styles.scss";

class PasswordChange extends Component {
  constructor(props) {
    super(props);
    this.redirectUser = this.redirectUser.bind(this);
  }
  //   componentDidMount() {
  // const {
  //   auth: {
  //     userData: { roles },
  //   },
  //  firstLogged;
  // } = this.props;

  //     //if you aren't root or firstLoggedUser you have to be redirected (you can't change your password by yourself)
  //     if (!firstLogged && roles === "CORPORATIVO") {
  //       this.redirectUser();
  //     }
  //   }

  redirectUser() {
    const {
      history,
      auth: {
        userData: { roles },
      },
    } = this.props;
    if (roles !== "ADMINISTRADOR") {
      history.push("/home-user");
    } else {
      history.push("/home");
    }
  }

  render() {
    const {
      auth: {
        userData: { firstTimeLogged },
      },
      t,
    } = this.props;

    return (
      <>
        <Row className="mt-4">
          <Col className="text-center">
            <h1>{t("passwordChange")} </h1>
          </Col>
        </Row>
        {firstTimeLogged && (
          <Row className="text-center justify-content-center mt-3">
            <Col xs={10} md={8}>
              <Alert variant="warning">{t("firstTimeLoggedAclaration")}</Alert>
            </Col>
          </Row>
        )}
        <Row className="mt-3">
          <Col className="my-auto">
            <Row className="justify-content-center">
              <Col xs={12} md={6}>
                <PasswordChangeForm
                  {...this.props}
                  redirectUser={this.redirectUser}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </>
    );
  }
}
const mapDispatchToProps = ({ auth, user }) => ({ auth, user });
export default compose(
  connect(mapDispatchToProps, { ...authActions, ...userActions }),
  withTranslation()
)(PasswordChange);
