import React, { Component } from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";
import { authActions } from "../../state/ducks/auth";
import { LogoLogin } from "../../components";
import { FormRegister } from "./components";
import "./styles.scss";
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handelOnClick() {
    const { i18n, history, t } = this.props;
    const language = localStorage.getItem("i18nextLng").split("-")[0];
    if (language === "es") {
      i18n.changeLanguage("en");
    } else if (localStorage.getItem("i18nextLng").split("-")[0] === "en") {
      i18n.changeLanguage("es");
    }
  }

  render() {
    const { history, t } = this.props;
    return (
      <Container fluid className="login">
        <LogoLogin />
        <FormRegister history={history} />
        <Row>
          <Col>
            <Button
              variant="info"
              width={1 / 2}
              className="p-2 margin-top-15"
              type="button"
              onClick={() => this.handelOnClick()}
            >
              {t("changeLanguage")}
            </Button>
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
)(Register);
