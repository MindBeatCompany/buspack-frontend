import React, { Component } from "react";
import { Container, Row, Col, Form, Spinner } from "react-bootstrap";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";
import { authActions } from "../../state/ducks/auth";
import { userActions } from "../../state/ducks/user";
import RegisterForm from "../../components/RegisterForm";
import SearchInput from "../../components/SearchInput";
import ActionButton from "../../components/ActionButton";
import Swal from "sweetalert2";
import { ScreenNav } from "../../components";
import { serviceOrderActions } from "../../state/ducks/serviceOrder";
import SelectCompanyModal from "./components/SelectCompanyModal";

const mapRegistroToCompanyInData = (registro) => {
  return {
    idClientEntity: registro.identidadcliente ? registro.identidadcliente : "",
    idClientAgent: registro.idagentecliente ? registro.idagentecliente : "",
    codeECO: registro.codigo ? registro.codigo : "",
    cuit: registro.cuit ? registro.cuit : "",
    companyName: registro.denominacion ? registro.denominacion : "",
    addressStreet: registro.calle ? registro.calle : "",
    addressNumber: registro.nro ? registro.nro : "",
    addressFloor: registro.piso ? registro.piso : "",
    addressApartment: registro.dpto ? registro.dpto : "",
    addressBuilding: registro.edificio ? registro.edificio : "",
    locality: registro.localidad ? registro.localidad : "",
    province: registro.provincia ? registro.provincia : "",
    country: registro.pais ? registro.pais : "",
  };
};

class CorporateRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingCuit: false,
      companiesToSelect: [],
      autocomplete: false, //this attribute show/hide the modal to select a specific company
      cuit: "",
      customerData: [],
      company: {
        idClientEntity: "",
        idClientAgent: "",
        codeECO: "",
        companyName: "",
        addressStreet: "",
        addressNumber: "",
        addressFloor: "",
        addressApartment: "",
        addressBuilding: "",
        locality: "",
        province: "",
        country: "",
        cuit: "",
      },
    };
    this.createAccounts = this.createAccounts.bind(this);
    this.getRoleId = this.getRoleId.bind(this);
    this.searchCuit = this.searchCuit.bind(this);
    this.onChangeCuit = this.onChangeCuit.bind(this);
    this.validateCuit = this.validateCuit.bind(this);
    this.setCompany = this.setCompany.bind(this);
  }

  getRoleId(roleName) {
    const { roles } = this.props.user;
    const idx = roles.findIndex((rol) => rol.name === roleName);
    return roles[idx].id;
  }

  onChangeCuit(e, validations = []) {
    const { value } = e.target;
    if (
      validations === null ||
      validations.every((validation) => validation(value))
    ) {
      this.setState({ ...this.state, cuit: value });
      //setAccountData({ ...accountData, [name]: value });
    } else {
      e.preventDefault();
    }
  }

  searchCuit(e) {
    e.preventDefault();

    this.setState({ loadingCuit: true });

    const { cuit } = this.state;
    const { getCustomerByCuit } = this.props;

    const callback = ({ data, success }) => {
      this.setState({ loadingCuit: false });

      if (!data.registros || data.registros.length === 0) {
        Swal.fire(
          "No se encontraron registros coincidentes"
        );
        return;
      }

      if (!success) {
        Swal.fire(
          "Oops... algo salió mal",
          data.message
            ? data.message
            : "No existe ningún registro con ese CUIT",
          "error"
        );
        return;
      }

      if (data.registros.length === 1) {
        this.setCompany(data.registros[0]);

        this.setState({ autocomplete: true });

        setTimeout(() => {
          this.setState({ autocomplete: false });
        }, 2500);
      }

      if (data.registros.length > 1) {
        this.setState({ companiesToSelect: data.registros });
      }
    };

    getCustomerByCuit({ data: { code: cuit }, callback });
  }

  setCompany(company) {
    company = mapRegistroToCompanyInData(company);

    this.setState({
      ...this.state,
      company: { ...company },
    });
  }

  validateCuit(value) {
    return /^\d*$/.test(value);
  }

  createAccounts(accounts, formCallback, excelFile) {
    const {
      createUser,
      createCorporateUser,
      auth: { userData },
      history,
      t,
    } = this.props;
    const { company } = this.state;

    //checking if at least one account is "ADMINISTRADOR CORPORATIVO"
    if (userData.roles === "ADMINISTRADOR") {
      let existAdminAccount = accounts.find(
        (account) => account.userRol === "CORPORATIVO_ADMINISTRADOR"
      );
      if (!existAdminAccount) {
        Swal.fire(
          "",
          "Debe añadir al menos un usuario Corporativo Administrador",
          "info"
        );
        return;
      }
    }

    // Checking excel file is uploaded
    if (!excelFile) {
      Swal.fire("", "Debe cargar un tarifario", "info");
      return;
    }

    const isRoot = userData.roles === "ADMINISTRADOR";

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
      ...company,
      companyName: accounts[0].company
        ? accounts[0].company
        : company.companyName,
      accountType: "Cuenta Corporativa",
      codeEco: accounts[0].ecoCode ? accounts[0].ecoCode : company.codeECO,
      users: allUsers,
    };

    const callback = (success, message) => {
      formCallback(success);

      if (success) {
        Swal.fire({
          title: "Cuenta/s creadas exitosamente!",
          icon: "success",
          confirmButtonText: `Continuar`,
        }).then((response) => {
          if (response.isConfirmed) history.goBack();
        });
      } else {
        Swal.fire("Oops... algo salió mal", message, "error");
      }
    };

    Swal.fire({
      title: t("questionPreSave"),
      showDenyButton: true,
      confirmButtonText: t("modalButtons.accept"),
      denyButtonText: t("modalButtons.cancel"),
    }).then((result) => {
      if (result.isConfirmed && isRoot) {
        const dataForm = new FormData();
        dataForm.append("data", JSON.stringify(usersPayload));
        dataForm.append("file", excelFile[0]);
        createUser({ data: dataForm, callback });
      } else {
        createCorporateUser({ data: usersPayload, callback });
      }
    });
  }

  render() {
    const rolesAllowed = ["CORPORATIVO_ADMINISTRADOR", "CORPORATIVO"];

    const {
      auth: {
        userData: { roles, companyName, codeECO, idClientEntity },
      },
      history,
      t,
    } = this.props;

    const { cuit, company, loadingCuit, companiesToSelect, autocomplete } =
      this.state;

    //isRoot = true means that current user has an "ADMINISTRADOR" role
    const isRoot = roles === "ADMINISTRADOR";

    const initialValues = {
      company: isRoot ? company.companyName : companyName,
      ecoCode: isRoot ? company.codeECO : codeECO,
      idClientEntity: isRoot ? company.idClientEntity : idClientEntity,
    };

    return (
      <Container fluid>
        <SelectCompanyModal
          modalCallback={this.setCompany}
          companies={companiesToSelect}
        />
        <Row className="mt-4">
          <Col>
            {isRoot ? (
              <h2>{t("titles.registeAccountAndUser").toUpperCase()}</h2>
            ) : (
              <h2>{t("titles.userAdministration").toUpperCase()}</h2>
            )}
          </Col>
        </Row>
        <Row>
          <Col>
            {isRoot ? (
              <ScreenNav
                history={history}
                previousPage={t("accounts")}
                previousUrlPage="/account-modification"
                currentPage={t("users")}
              />
            ) : (
              <ScreenNav
                history={history}
                previousPage={t("Usuarios")}
                previousUrlPage="/user-modification"
                currentPage={t("register")}
              />
            )}
          </Col>
        </Row>
        {isRoot ? (
          <Row>
            <Col className="mt-5 ml-3">
              <Form onSubmit={this.searchCuit}>
                <Row>
                  <Col xs={12} md={6} className="text-left text-lg-right p-0">
                    <SearchInput
                      onChange={(e) =>
                        this.onChangeCuit(e, [this.validateCuit])
                      }
                      value={cuit}
                      name="cuit"
                      placeholder={"Ingrese CUIT"}
                    />
                    {autocomplete && (
                      <Col xs={12}>
                        <div className=" text-left">
                          <span className="text-success">
                            <b>Compañía, ECOcode y código de cliente fueron autocompletados</b>
                          </span>
                        </div>
                      </Col>
                    )}
                  </Col>

                  <Col xs={12} md={4} className="p-0 ml-2">
                    <ActionButton
                      disabled={loadingCuit}
                      type="submit"
                      width="70"
                    >
                      {loadingCuit ? (
                        <Spinner animation="border" variant="light" />
                      ) : (
                        t("search")
                      )}
                    </ActionButton>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        ) : (
          ""
        )}
        <Row>
          <Col>
            <RegisterForm
              isRoot={isRoot}
              rolesAllowed={rolesAllowed}
              rootRegister={false} // it means that ADMIN_CORPO is creating an admin_CORPO
              createAccounts={this.createAccounts}
              initialValues={initialValues}
              registerAccount={true}
              {...this.props}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapDispatchToProps = ({ auth, user, serviceOrder }) => ({
  auth,
  user,
  serviceOrder,
});
export default compose(
  connect(mapDispatchToProps, {
    ...authActions,
    ...userActions,
    ...serviceOrderActions,
  }),
  withTranslation()
)(CorporateRegister);
