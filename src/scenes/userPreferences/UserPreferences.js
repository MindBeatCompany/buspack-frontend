import React, { Component } from "react";
import { Col, Row, Container } from "react-bootstrap";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";
import { authActions } from "../../state/ducks/auth";
import { userActions } from "../../state/ducks/user";
import { PreferencesForm } from "./components";
import { ActionButton } from "../../components";
class UserPreferences extends Component {

  componentDidMount() {
    const {
      auth: { userData },
      getUserPreferences,
    } = this.props;

    if (userData.id !== undefined) {
      getUserPreferences({ id: userData.id });
    }
  }

  
  render() {
    return (
      <Container fluid>
        <Row className="text-center">
          <Col xs={12}>
            <h2 className="mt-4">Preferencias de usuario</h2>
          </Col>
          <Col xs={12}>
            <span>Configurar tiempo de expiración de sesión</span>
          </Col>
        </Row>
        <Row className="text-center mt-4">
          <Col>
            <PreferencesForm
              {...this.props}
              // changeConfiguration={this.handleChangeConfiguration}
            />
          </Col>
        </Row>
        <Row className="mt-3">
          <Col className="text-center">
            <ActionButton secondary onClick={() => this.props.history.goBack()}>
              Volver
            </ActionButton>
          </Col>
        </Row>
      </Container>
    );
  }
}
const mapDispatchToProps = ({ auth, user }) => ({ auth, user });
export default compose(
  connect(mapDispatchToProps, { ...authActions, ...userActions }),
  withTranslation()
)(UserPreferences);
