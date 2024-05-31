import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";
import { authActions } from "../../state/ducks/auth";
import { userActions } from "../../state/ducks/user";
import { Col, Row, Form, Container, Button } from "react-bootstrap";
import { TextInput } from "../../components";
import Swal from "sweetalert2";

class PasswordRecovery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      validationError: "",
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    const value = e.target.value;
    const name = e.target.name;

    this.setState({ [name]: value });
  }

  onSubmit(e) {
    e.preventDefault();

    if (this.state.email.trim() === "") {
      this.setState({ validationError: "Por favor ingrese su email" });
      return;
    } else {
      this.setState({ validationError: "" });
    }
    this.props.recoveryPass({
      userName:this.state.email,
      callback: ({success, message}) => {
        if(success) {
          Swal.fire({
            html:
              "<p><b>Revise su correo</b></br>Si su e-mail coincide con el registrado en la base se le enviará a su correo el usuario y la contraseña temporal para su ingreso. De no recibirlo comuníquese con su administrador.  </p>",
            icon: "success",
            confirmButtonText: "Entendido",
          }).then(() => this.props.history.push("/login"));
        } else {
          Swal.fire({
            html:
              "<p><b>Error</b></br>No se pudo completar la operación.  </p>",
            icon: "error",
            confirmButtonText: "Entendido",
          })
        }
      }
    })


  }

  render() {
    return (
      <>
        <Container fluid>
          <Row className="mt-4" style={{ height: "70vh" }}>
            <Col className="my-auto">
              <Row>
                <Col className="text-center">
                  <h1>Recupera tu usuario y/o contraseña</h1>
                </Col>
              </Row>
              <Row className="justify-content-center mt-5">
                <Col xs={12} md={6}>
                  <Form onSubmit={this.onSubmit}>
                    <TextInput
                      onChange={this.onChange}
                      value={this.state.email}
                      name="email"
                      label="Ingresa tu email"
                      placeholder="Ingresa tu email"
                      inputType="email"
                    />
                    <Row>
                      {this.state.validationError !== "" && (
                        <Col
                          xs={12}
                          className="text-center text-danger mb-3"
                          style={{ marginTop: "-10px" }}
                        >
                          <span>{this.state.validationError} </span>{" "}
                        </Col>
                      )}
                      <Col xs={12} className="text-center">
                        <Button variant="primary" type="submit">
                          Recuperar usuario/contraseña
                        </Button>{" "}
                      </Col>
                    </Row>
                  </Form>
                </Col>
              </Row>
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
)(PasswordRecovery);
