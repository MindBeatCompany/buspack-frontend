import { Col, Row, Container, Spinner, Alert } from "react-bootstrap";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { compose } from "redux";
import { authActions } from "../../state/ducks/auth";
import { userActions } from "../../state/ducks/user";
import AccountsTable from "./components/AccountsTable.js";
import Swal from "sweetalert2";
import { ActionButton, ModificationFilter } from "../../components";
import "./styles.scss";

class AccountModification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: [],
      loading: true,
      showFilter: false,
      toDeactivate: [],
      clienteCoporativo: [],
    };
    this.handleFetchAccounts = this.handleFetchAccounts.bind(this);
    this.onChangeDeactivate = this.onChangeDeactivate.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleFormatModification = this.handleFormatModification.bind(this);
    this.handleLocationModification =
      this.handleLocationModification.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
  }

  handleFetchAccounts() {
    const callback = (data) => {
      this.setState({ loading: false });

      if (data.success) {
        this.setState({ accounts: data.data });
      } else {
        Swal.fire("Ha ocurrido un error", data.message, "error");
      }
    };
    this.props.fetchAccounts({ callback });
  }
  componentDidMount() {
    //get all accounts, save them in the state and pass them to component
    this.handleFetchAccounts();
  }

  onChangeDeactivate = (e) => {
    const { toDeactivate } = this.state;
    const accountId = e.target.name;

    const existId = toDeactivate.includes(accountId);

    if (!existId) {
      this.setState({
        toDeactivate: [...toDeactivate, accountId],
      });
    } else {
      var newArr = toDeactivate.filter((id) => id !== accountId);
      this.setState({
        toDeactivate: [...newArr],
      });
    }
  };

  handleEdit = (acc) => {
    const { history } = this.props;
    history.push({
      pathname: "/user-modification",
      state: acc,
    });
  };

  handleFormatModification = async (acc) => {
    const { history } = this.props;
    history.push({
      pathname: "/format-modification",
      state: acc,
    });
  };

  handleLocationModification = (acc) => {
    const { history } = this.props;
    history.push({
      pathname: "/location-modification",
      state: acc,
    });
  };
  handleZoneAndRates = (acc) => {
    const { history } = this.props;
    history.push({
      pathname: "/zones-and-rates",
      state: acc,
    });
  };

  handleSubmit = () => {
    const { deactivateAccounts, history, t } = this.props;
    const { toDeactivate } = this.state;
    Swal.fire({
      title: t("questionPreSave"),
      html: "<p>Todos los usuarios relacionados con la cuenta <b>serán desactivados.</b> <br/> Si desactiva la cuenta, los nombres de usuario y las transacciones efectuadas en la plataforma se guardarán con fines de auditoría.</p>",
      showDenyButton: true,
      confirmButtonText: t("modalButtons.accept"),
      denyButtonText: t("modalButtons.cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        deactivateAccounts({
          data: toDeactivate,
          isActive: false,
          callback: ({ success }) => {
            if (success) {
              Swal.fire({
                title: "Se desactivaron las cuentas",
                icon: "success",
                confirmButtonText: "Cerrar",
              }).then(() => history.go(0));
            } else {
              Swal.fire({
                title: "No se ha podido completar la operacion",
                confirmButtonText: "Cerrar",
              });
            }
          },
        });
      }
    });
  };

  handleFilter(newList) {
    this.setState({ accounts: newList });
  }

  render() {
    const { loading, accounts, showFilter, toDeactivate } = this.state;
    const { t } = this.props;

    return (
      <Container fluid className="pl-5 pr-5 account-modification-container">
        <Row>
          <Col className="text-left mt-5">
            <h1 style={{ textTransform: "uppercase" }}>
              {" "}
              {t("accountModificationScreen.mainTitle")}{" "}
            </h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <h3 className="mt-3"> {t("accounts")} </h3>
          </Col>
        </Row>

        <Row className="mb-4 mt-3 justify-content-start">
          <Col xs={4}>
            <ActionButton
              onClick={() => {
                this.setState({ showFilter: !this.state.showFilter });
              }}
              width="100"
              secondary={showFilter}
            >
              {t("filter")}
            </ActionButton>
          </Col>
        </Row>

        <Row>
          <Col>
            {showFilter && (
              <ModificationFilter
                {...this.props}
                tableType="accounts"
                itemsToFilter={accounts}
                toDeactivate={toDeactivate}
                handleFilter={this.handleFilter}
              />
            )}
          </Col>
        </Row>

        <Row className="justify-content-center mt-4">
          <Col xs={12}>
            {loading ? (
              <div className="text-center w-100">
                <Spinner animation="border" role="status">
                  <span className="sr-only">Loading...</span>
                </Spinner>
              </div>
            ) : (
              <>
                {accounts.length === 0 ? (
                  <Alert variant="warning" className="text-center">
                    No se encontraron cuentas vinculadas a esta compañía
                  </Alert>
                ) : (
                  <AccountsTable
                    accounts={accounts}
                    onChangeDeactivate={this.onChangeDeactivate}
                    handleEdit={this.handleEdit}
                    handleFormatModification={this.handleFormatModification}
                    handleLocationModification={this.handleLocationModification}
                    handleSubmit={this.handleSubmit}
                    handleZoneAndRates={this.handleZoneAndRates}
                    toDeactivate={toDeactivate}
                    {...this.props}
                  />
                )}
              </>
            )}
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
)(AccountModification);
