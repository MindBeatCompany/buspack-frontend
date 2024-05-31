import { Col, Row, Container, Spinner, Form, Alert } from "react-bootstrap";
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";
import { authActions } from "../../state/ducks/auth";
import { userActions } from "../../state/ducks/user";
import UsersTable from "./components/UsersTable";
import UploadZone from "./components/UploadZone";
import Swal from "sweetalert2";
import { ActionButton, ModificationFilter, TextInput } from "../../components";
import ScreenNav from "../../components/ScreenNav";
import { EditIcon } from "../../resources/icons";
import "./styles.scss";

class UserModification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      userEditing: {},
      mainData: {
        codeECO: "",
        companyName: "",
      },
      accountId: null,
      showForm: false,
      toDeactivate: [],
      toRecovery: [],
      waitingResponse: false,
      showFilter: false,
      loading: true,
      mainDataBackup: {},
    };
    this.handleEdit = this.handleEdit.bind(this);
    this.handleCancelEdit = this.handleCancelEdit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmitEdit = this.handleSubmitEdit.bind(this);
    this.onChangeRecovery = this.onChangeRecovery.bind(this);
    this.onChangeDeactivate = this.onChangeDeactivate.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
  }

  componentDidMount() {
    this.getList();
  }

  getList() {
    //this.setState({ loading: true });

    // if user is root means that it comes from /account-modification and sent an account by params
    //get users using id passed by state params
    const {
      auth: {
        userData: { roles, account },
      },
      location,
      fetchUsers,
      getUsers,
      user
    } = this.props;
    const isRoot = roles === "ADMINISTRADOR";

    const acc = location.state || account;
    const callback = (data) => {
      this.setState({ loading: false });
      if (data.success) {
        this.setState({
          accountId: acc.id,
          users: data.data.filter((user) => user.isActive),
          accountEditing: data.data[0].account,
          mainData: {
            codeECO: data.data[0].account.codeECO,
            companyName: data.data[0].account.companyName,
          },
        });
      } else {
        Swal.fire("Ha ocurrido un error", data.message, "error");
      }
    };

    if (isRoot) {
      //fetchUsers get users by id. The only one who can do it is an admin root
      fetchUsers({ callback, id: acc.id });
    } else {
      getUsers({ callback });
    }
  }

  handleEdit() {
    // make a backup before edit to recover data in case user cancel the modification
    this.setState({
      showForm: !this.state.showForm,
      mainDataBackup: this.state.mainData,
    });
  }

  handleCancelEdit() {
    this.setState({ showForm: false });
    this.setState({
      mainData: this.state.mainDataBackup,
    });
  }

  onChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    this.setState({ mainData: { ...this.state.mainData, [name]: value } });
  }

  handleSubmitEdit(e) {
    const { t } = this.props;
    e.preventDefault();

    Swal.fire({
      title: t("questionPreSave"),
      confirmButtonText: t("modalButtons.accept"),
      denyButtonText: t("modalButtons.cancel"),
      showDenyButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.props.updateAccount({
          data: {
            companyName: this.state.mainData.companyName,
            codeECO: this.state.mainData.codeECO,
            id: this.state.accountEditing.id,
          },
          callback: ({ success, message }) => {
            this.setState({ showForm: false });
            if (success) {
              Swal.fire(message, "", "success");
            } else {
              Swal.fire(message, "", "error");
            }
          },
        });
      }
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { toDeactivate, toRecovery } = this.state;
    const { deactivateUsers, recoveryUsers, history, t } = this.props;
    Swal.fire({
      title: t("questionPreSave"),
      html:
        toDeactivate.length > 0
          ? `<p> ${t(
              "accountModificationScreen.tableDeactivateAlertMessage"
            )} </p>`
          : "",
      showDenyButton: true,
      confirmButtonText: t("modalButtons.accept"),
      denyButtonText: t("modalButtons.cancel"),
      icon: "info",
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
    const { companyName, codeECO } = this.state.mainData;
    const {
      auth: {
        userData: { roles },
      },
      history,
      t,
    } = this.props;

    const { loading, showForm, showFilter, users, toDeactivate, accountId } =
      this.state;

    const isRoot = roles === "ADMINISTRADOR";
    return (
      <>
        <Container fluid className="pl-5 pr-5 user-modification-screen">
          <Row>
            <Col className="text-left mt-5 mb-3">
              {isRoot ? (
                <h1 style={{ textTransform: "uppercase" }}>
                  {" "}
                  {t("accountModificationScreen.mainTitle")}{" "}
                </h1>
              ) : (
                <h2>{t("titles.userAdministration").toUpperCase()}</h2>
              )}
            </Col>
          </Row>
          <Row>
            <Col>
              <ScreenNav
                history={history}
                previousPage={t("accounts")}
                previousUrlPage="/account-modification"
                currentPage={t("modification")}
              />

              {/* {isRoot ? (
                <ScreenNav
                  history={history}
                  previousPage={t("accounts")}
                  previousUrlPage="/account-modification"
                  currentPage={t("users")}
                />
              ) : (
                <h3>{t("users")} </h3>
              )} */}
            </Col>
          </Row>
          <Row className="mt-4">
            <Col xs={12} md={6} lg={4} xl={3} className="mt-3">
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
            {!isRoot && (
              <Col xs={12} md={6} lg={4} xl={3} className="mt-3">
                <ActionButton
                  onClick={() =>
                    history.push(
                      "/user-account-manager/register-corporate-account"
                    )
                  }
                  width="100"
                >
                  {t("addUser")}
                </ActionButton>
              </Col>
            )}
          </Row>
          <Row className="mt-4">
            <Col>
              <Row className="justify-content-end mb-3">
                <Col xs={12} md={!isRoot ? 12 : 9}>
                  <Form
                    onSubmit={this.handleSubmitEdit}
                    className="eco-company-form"
                  >
                    <Row className="justify-content-end">
                      <Col
                        xs={12}
                        md={5}
                        //style={{ display: "flex", alignItems: "flex-end" }}
                      >
                        <TextInput
                          readOnly={!showForm}
                          value={companyName}
                          onChange={this.onChange}
                          //placeholder="Compañía"
                          label={t("formLabels.company")}
                          name="companyName"
                        />
                      </Col>
                      <Col xs={12} md={5}>
                        <TextInput
                          readOnly={!showForm}
                          value={codeECO}
                          name="codeECO"
                          label={t("formLabels.ecoCode")}
                          onChange={this.onChange}
                          //placeholder={t("formLabel.ecoCode")}
                        />
                      </Col>
                      {!showForm && isRoot && (
                        <Col style={{ display: "flex", alignItems: "center" }}>
                          <EditIcon
                            type="primaryIcon"
                            onClick={() => this.handleEdit()}
                          />
                        </Col>
                      )}
                    </Row>
                    {showForm && (
                      <Row>
                        <Col
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <ActionButton type="submit">Guardar</ActionButton>
                          <div className="d-inline-block ml-3">
                            <ActionButton
                              type="button"
                              onClick={this.handleCancelEdit}
                              secondary
                            >
                              Cancelar
                            </ActionButton>
                          </div>
                        </Col>
                      </Row>
                    )}
                  </Form>
                </Col>
              </Row>
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

          <Row className="justify-content-center mt-4 mb-4">
            <Col xs={12}>
              {loading ? (
                <div className="text-center w-100">
                  <Spinner animation="border" variant="warning"/>
                </div>
              ) : (
                <>
                  {users.length > 0 ? (
                    <UsersTable
                      users={this.state.users}
                      toRecovery={this.state.toRecovery}
                      toDeactivate={this.state.toDeactivate}
                      {...this.props}
                      handleSubmit={this.handleSubmit}
                      onChangeDeactivate={this.onChangeDeactivate}
                      onChangeRecovery={this.onChangeRecovery}
                      waitingResponse={this.state.waitingResponse}
                    />
                  ) : (
                    <Alert variant="warning" className="text-center">
                      No se encontraron usuarios vinculados a esta compañía
                    </Alert>
                  )}
                </>
              )}
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              {isRoot && (
                <UploadZone
                  {...this.props}
                  accountId={accountId}
                  companyName={companyName}
                />
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
)(UserModification);
