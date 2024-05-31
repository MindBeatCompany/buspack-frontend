import React, { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";
import { authActions } from "../../state/ducks/auth";
import { userActions } from "../../state/ducks/user";
import RegisterForm from "../../components/RegisterForm";
import Swal from "sweetalert2";
import ScreenNav from "../../components/ScreenNav";

class CorporateRegister extends Component {
  constructor(props) {
    super(props);
    this.createAccounts = this.createAccounts.bind(this);
    this.getRoleId = this.getRoleId.bind(this);
  }

  getRoleId(roleName) {
    const { roles } = this.props.user;
    const idx = roles.findIndex((rol) => rol.name === roleName);
    return roles[idx].id;
  }

  createAccounts(accounts, formCallback) {
    const { createUser, history,t } = this.props;
    //building payload
    let allUsers = accounts.map((acc) => ({
      firstName: acc.name,
      lastName: acc.lastname,
      email: acc.email,
      userName: acc.userName,
      isActive: true,
      rol: this.getRoleId(acc.userRol),
    }));

    const usersPayload = {
      companyName: accounts[0].company,
      codeEco: accounts[0].ecoCode,
      accountType: "Administradores",
      users: allUsers,
    };

    const callback = (success, message) => {
      if (success) {
        formCallback(true);
        Swal.fire({
          title: t("createSuccesUsers"),
          icon: "success",
          confirmButtonText: t("modalButtons.continue"),
        }).then((response) => {
          if (response.isConfirmed) history.push("/home");
        });
      } else {
        Swal.fire("Oops... algo salió mal", message, "error");
      }
    };

    Swal.fire({
      title: t('questionPreSave'),
      showDenyButton: true,
      confirmButtonText: t("modalButtons.createUser"),
      denyButtonText: t("modalButtons.cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        createUser({ data: usersPayload, callback });
      }
    });
  }
  render() {
    //account roles that admins can create
    const rolesAllowed = ["ADMINISTRADOR"];
    const {
      t,
      auth: { userData },
      history,
    } = this.props;

    //company and ecoCode for "ADMINISTRADORES" are constants
    const initialValues = {
      ecoCode: userData.codeECO,
      company: userData.companyName,
      idClientEntity: userData.id_clientEntity,
    };
    return (
      <Container fluid>
        <Row className="mt-4">
          <Col>
            <h2>{t("titles.regUserRoot").toUpperCase()}</h2>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <ScreenNav
              history={history}
              previousPage={t("subTitles.roots")}
              previousUrlPage={"/roots-modification"}
              currentPage={t("subTitles.regUserRoot")}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <RegisterForm
              //isRoot = true means that current user has an "ADMINISTRADOR" role
              isRoot={true}
              rootRegister={true} // it means that user is creating an admin account
              rolesAllowed={rolesAllowed}
              createAccounts={this.createAccounts}
              //"firstForm" is the form that includes inputs as "Company" and "ECO Code"
              hiddenFirstForm
              initialValues={initialValues}
              {...this.props}
            />
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
)(CorporateRegister);
