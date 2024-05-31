import { Col, Row, Container, Spinner, Alert, Form } from "react-bootstrap";
import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { authActions } from "../../state/ducks/auth";
import { userActions } from "../../state/ducks/user";
import { withTranslation } from "react-i18next";
import UsersTable from "../userModification/components/UsersTable";
import Swal from "sweetalert2";
import { ActionButton, ModificationFilter, TextInput } from "../../components";

class RootsModification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      toDeactivate: [],
      toRecovery: [],
      waitingResponse: false,
      showFilter: false,
      loading: true,
    };
    this.onChangeRecovery = this.onChangeRecovery.bind(this);
    this.onChangeDeactivate = this.onChangeDeactivate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
  }

  componentDidMount() {
    // if user is root means that it comes from /account-modification and sent an account by params
    //get users using id passed by state params
    const {
      auth: {
        userData: {
          account: { id },
        },
      },
      fetchUsers,
      t,
    } = this.props;

    const callback = (data) => {
      this.setState({ loading: false });
      if (data.success) {
        this.setState({
          users: data.data,
        });
      } else {
        Swal.fire("Ha ocurrido un error", data.message, "error");
      }
    };
    fetchUsers({ callback, id });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { toDeactivate, toRecovery } = this.state;
    const { deactivateUsers, recoveryUsers, history, t } = this.props;
    Swal.fire({
      title: t("questionPreSave"),
      html:
        toDeactivate.length > 0
          ? "<p>Si desactiva usuarios, los nombres de usuario y las transacciones efectuadas en la plataforma se guardarán con fines de auditoría.</p>"
          : "",
      showDenyButton: true,
      confirmButtonText: t("modalButtons.accept"),
      denyButtonText: t("modalButtons.cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.setState({ waitingResponse: true });

        const goDeactivate = () => {
          if (toDeactivate.length > 0) {
            deactivateUsers({
              data: toDeactivate,
              isActive: false,
              callback: ({ success, data }) => {
                this.setState({ waitingResponse: false });
                if (success) {
                  Swal.fire({
                    title: t("userDeactivate"),
                    icon: "success",
                    confirmButtonText: t("modalButtons.close"),
                  }).then(() => history.go(0));
                  // this.setState({
                  //   ...this.state,
                  //   users: this.state.users.filter(
                  //     (u) => !data.some((d) => d.id === u.id)
                  //   ),
                  //   toDeactivate: [],
                  // });
                } else {
                  Swal.fire(
                    "No se ha podido completar la operación",
                    "",
                    "error"
                  );
                }
              },
            });
          }
        };

        if (toRecovery.length > 0) {
          recoveryUsers({
            data: { ids: toRecovery },
            callback: ({ success }) => {
              this.setState({ waitingResponse: false });
              Swal.fire({
                title: success ? t("succesPassReset") : "error",
                confirmButtonText: t("modalButtons.accept"),
                icon: success ? "success" : "error",
              }).then(() => {
                goDeactivate();
                setTimeout(() => {
                  history.go(0);
                }, 1000);
              });
              // if (success) {
              //   this.setState({ toRecovery: [] });
              // }
            },
          });
        } else {
          goDeactivate();
        }
      }
    });
  }

  onChangeDeactivate(e) {
    const { toDeactivate } = this.state;
    const accountId = e.target.name;

    const existId = toDeactivate.includes(accountId);
    if (!existId) {
      this.setState({
        toDeactivate: [...toDeactivate, accountId],
      });
    } else {
      var newArr = this.state.toDeactivate.filter((id) => id !== accountId);
      this.setState({ toDeactivate: newArr });
    }
  }

  onChangeRecovery(e) {
    const { toRecovery } = this.state;
    const accountId = e.target.name;

    const existId = toRecovery.includes(accountId);
    if (!existId) {
      this.setState({
        toRecovery: [...toRecovery, accountId],
      });
    } else {
      var newArr = toRecovery.filter((ecoCode) => ecoCode !== accountId);
      this.setState({ toRecovery: newArr });
    }
  }
  handleFilter(newList) {
    this.setState({ users: newList });
  }
  render() {
    const { history, t } = this.props;
    const { showFilter, users, toDeactivate, loading } = this.state;

    return (
      <>
        <Container fluid>
          <Row>
            <Col className="text-left mt-5 mb-3">
              <h1 style={{ textTransform: "uppercase" }}>
                {t("rootModificationScreen.mainTitle")}{" "}
              </h1>
            </Col>
          </Row>
          <Row>
            <Col>
              <h3> {t("rootModificationScreen.roots")} </h3>
            </Col>
          </Row>
          <Row className="mb-4 mt-3 justify-content-start">
            <Col xs={12} md={4} className="mt-3">
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
            <Col xs={12} md={4} className="mt-3">
              <ActionButton
                onClick={() =>
                  history.push("/user-account-manager/register-admin-account")
                }
                width="100"
              >
                {" "}
                {t("addUser")}{" "}
              </ActionButton>
            </Col>
          </Row>

          <Row>
            <Col>
              {showFilter && (
                <ModificationFilter
                  {...this.props}
                  tableType="users"
                  itemsToFilter={users}
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
                  {users.length === 0 ? (
                    <Alert variant="warning" className="text-center">
                      No se encontraron usuarios
                    </Alert>
                  ) : (
                    <UsersTable
                      users={this.state.users}
                      toRecovery={this.state.toRecovery}
                      toDeactivate={this.state.toDeactivate}
                      {...this.props}
                      handleSubmit={this.handleSubmit}
                      onChangeDeactivate={this.onChangeDeactivate}
                      onChangeRecovery={this.onChangeRecovery}
                      waitingResponse={this.state.waitingResponse}
                      secondaryThead
                    />
                  )}
                </>
              )}
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
)(RootsModification);
