import { Col, Row, Container } from "react-bootstrap";
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";
import { authActions } from "../../state/ducks/auth";
import { userActions } from "../../state/ducks/user";
import ModificationForm from "./components/ModificationForm";
import { ScreenNav } from "../../components";

class EditAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accountInfo: {
        email: "",
        firstName: "",
        lastName: "",
        codeECO: "",
        companyName: "",
        userName: "",
        id: "",
        role: "",
      },
    };
    this.getRolesAllowed = this.getRolesAllowed.bind(this);
  }

  componentDidMount() {
    const account = this.props.history.location.state;
    if (account) {
      this.setState({
        accountInfo: account,
        rolesAllowed: this.getRolesAllowed(account.role.name),
      });
    }
  }

  getRolesAllowed(roles) {
    if (roles === "ADMINISTRADOR") {
      return ["ADMINISTRADOR"];
    } else {
      return ["CORPORATIVO_ADMINISTRADOR", "CORPORATIVO"];
    }
  }

  getAccounts() {}

  render() {
    const { accountInfo } = this.state;
    const {
      t,
      auth: { userData },
    } = this.props;
    const isRoot = accountInfo.role.name === "ADMINISTRADOR";
    const currentUserIsRoot = userData.roles === "ADMINISTRADOR";

    return (
      <>
        <Container fluid>
          <Row className="mt-5">
            <Col>
              <h1 style={{ textTransform: "uppercase" }}>
                {isRoot
                  ? t("rootModificationScreen.mainTitle")
                  : t("accountModificationScreen.mainTitle")}
              </h1>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <ScreenNav
                {...this.props}
                previousPage={
                  isRoot ? t("rootModificationScreen.roots") : t("users")
                }
                currentPage={t("accountModificationScreen.editTitle")}
              />
            </Col>
          </Row>
          <Row className="mt-5 mb-5">
            <Col>
              <ModificationForm
                rolesAllowed={this.state.rolesAllowed}
                accountInfo={this.state.accountInfo}
                isRoot={isRoot}
                currentUserIsRoot={currentUserIsRoot}
                {...this.props}
              />
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
const mapDispatchToProps = ({ auth, user }) => ({ auth, user });
export default compose(
  connect(mapDispatchToProps, { ...authActions, ...userActions }),
  withTranslation()
)(EditAccount);
