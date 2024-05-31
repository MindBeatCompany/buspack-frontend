import { Col, Row, Container } from "react-bootstrap";
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";
import { authActions } from "../../state/ducks/auth";
import { DashboardModule } from "../../components";
import "./styles.scss";

class UserAccountManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allModules: [
        {
          title: "Alta de cuentas y Usuarios corporativos",
          url: "/user-account-manager/register-corporate-account",
        },
      ],
    };
  }
  componentDidMount() {
    //if current user is root it will push an extra module
    const { roles } = this.props.auth.userData;
    let isRoot = roles === "ADMINISTRADOR";
    if (isRoot)
      this.setState({
        allModules: [
          ...this.state.allModules,
          {
            title: "Modificación de Cuentas y Usuarios corporativos",
            url: `/account-modification`,
          },
          {
            title: "Usuarios Administradores",
            url: "/roots-modification",
          },
        ],
      });
  }

  render() {
    const { roles } = this.props.auth.userData;

    return (
      <>
        <Row className="mt-4">
          <Col className="text-center">
            <h1>Administración de Cuentas y Usuarios</h1>
          </Col>
        </Row>
        <Row className="account-dash">
          <Col className="my-auto">
            <Row className="justify-content-center">
              {this.state.allModules.map((mdle, idx) => (
                <Col xs={12} md={5} key={idx} className="mt-3">
                  <DashboardModule title={mdle.title} url={mdle.url} />
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </>
    );
  }
}
const mapDispatchToProps = ({ auth }) => ({ auth });
export default compose(
  connect(mapDispatchToProps, { ...authActions }),
  withTranslation()
)(UserAccountManager);
