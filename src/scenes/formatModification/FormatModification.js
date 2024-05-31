import {
  Col,
  Row,
  Container,
  Form,
  NavDropdown,
  Table,
} from "react-bootstrap";
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";
import { authActions } from "../../state/ducks/auth";
import { userActions } from "../../state/ducks/user";
import Swal from "sweetalert2";
import "./styles.scss";
import {
  ActionButton,
  CustomCheckbox,
  ScreenNav,
  TextInput,
} from "../../components";
import { BASEURL } from "../../config/constants";

class FormatModification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      btnActualizar: false,
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
      specialCharacter: "",
      caracter: null,
      format: "xls",
      itemsTable: {
        ID: null,
        "Destinatario De Nombre Y Apellido": null,
        Telefono: null,
        Email: null,
        "Tipo De Documento": null,
        "Numero De Documento": null,
        // "Lugar Habilitado": null,
        CPA: null,
        Provincia: null,
        Localidad: null,
        "Entrega Domicilio": null,
        Domicilio: null,
        "Numero Domicilio": null,
        "Numero Edificio": null,
        "Piso Edificio": null,
        "Departamento Edificio": null,
        "CPA Edificio": null,
        "Cantidad De Piezas": null,
        "Peso Total De La Solicitud": null,
        Observaciones: null,
      },
      longitudes: {
        ID: 10,
        "Destinatario De Nombre Y Apellido": 50,
        Telefono: 20,
        Email: 40,
        "Tipo De Documento": 15,
        "Numero De Documento": 22,
        "Lugar Habilitado": 60,
        CPA: 25,
        Provincia: 100,
        Localidad: 90,
        "Entrega Domicilio": 70,
        Domicilio: 55,
        "Numero Domicilio": 13,
        "Numero Edificio": 14,
        "Piso Edificio": 11,
        "Departamento Edificio": 8,
        "CPA Edificio": 77,
        "Cantidad De Piezas": 25,
        "Peso Total De La Solicitud": 26,
        Observaciones: 200,
      },
      valorCheck: {
        ID: false,
        "Destinatario De Nombre Y Apellido": false,
        Telefono: false,
        Email: false,
        "Tipo De Documento": false,
        "Numero De Documento": false,
        "Lugar Habilitado": false,
        CPA: false,
        Provincia: false,
        Localidad: false,
        "Entrega Domicilio": false,
        Domicilio: false,
        "Numero Domicilio": false,
        "Numero Edificio": false,
        "Piso Edificio": false,
        "Departamento Edificio": false,
        "CPA Edificio": false,
        "Cantidad De Piezas": false,
        "Peso Total De La Solicitud": false,
        Observaciones: false,
      },
      ignorarCheck: {
        ID: false,
        "Destinatario De Nombre Y Apellido": false,
        Telefono: false,
        Email: false,
        "Tipo De Documento": false,
        "Numero De Documento": false,
        "Lugar Habilitado": false,
        CPA: false,
        Provincia: false,
        Localidad: false,
        "Entrega Domicilio": false,
        Domicilio: false,
        "Numero Domicilio": false,
        "Numero Edificio": false,
        "Piso Edificio": false,
        "Departamento Edificio": false,
        "CPA Edificio": false,
        "Cantidad De Piezas": false,
        "Peso Total De La Solicitud": false,
        Observaciones: false,
      },
      inputUnique: {
        ID: null,
        "Destinatario De Nombre Y Apellido": null,
        Telefono: null,
        Email: null,
        "Tipo De Documento": null,
        "Numero De Documento": null,
        "Lugar Habilitado": null,
        CPA: null,
        Provincia: null,
        Localidad: null,
        "Entrega Domicilio": false,
        Domicilio: null,
        "Numero Domicilio": null,
        "Numero Edificio": null,
        "Piso Edificio": null,
        "Departamento Edificio": null,
        "CPA Edificio": null,
        "Cantidad De Piezas": null,
        "Peso Total De La Solicitud": null,
        Observaciones: null,
      },
    };

    this.handleInputSpecialCharacter =
      this.handleInputSpecialCharacter.bind(this);

    this.handleInputIdentificacion = this.handleInputIdentificacion.bind(this);

    this.handleInputLongitudes = this.handleInputLongitudes.bind(this);

    this.handleInputValorCheck = this.handleInputValorCheck.bind(this);
    this.handleCheckboxIgnorarCheck =
      this.handleCheckboxIgnorarCheck.bind(this);
    this.handleCheckboxDefaultValueCheck =
      this.handleCheckboxDefaultValueCheck.bind(this);

    this.handleEdit = this.handleEdit.bind(this);
    this.handleCancelEdit = this.handleCancelEdit.bind(this);
    // this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmitEdit = this.handleSubmitEdit.bind(this);
    this.onChangeRecovery = this.onChangeRecovery.bind(this);
    this.onChangeDeactivate = this.onChangeDeactivate.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
  }

  getInfoCliente = async () => {
    const id = this.props.history;
    const idClienteCorporativo = id.location.state.id;

    // const url = `http://localhost:4200/v1/api/service-request/format-request?accountId=${idClienteCorporativo}`;
    const url = `${BASEURL}/service-request/format-request?accountId=${idClienteCorporativo}`;
    // const url = `https://qa.derservicios.com.ar/v1/api/v1/api/service-request/format-request?accountId=${idClienteCorporativo}`;


    const request = {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.props.auth.userData.token,
      },
    };

    const response = await fetch(url, request);

	  console.log('TOKEN', this.props.auth.userData.token)
	  console.log('Responseeee', response)

    const respuesta = await response.text();

	  console.log('Respuesta-text', respuesta)
    const respuestaFinal = JSON.parse(respuesta);

    const sucess = respuestaFinal.success;

    if (sucess === true) {
      this.setState({ btnActualizar: true });
      Swal.fire({
        title: "El cliente coorporativo tiene un formato de solicitud previo",
        icon: "success",
        confirmButtonText: this.props.t("modalButtons.accept"),
      });

      const StringJson = Object.values(respuestaFinal.data);

      const nuevoID = StringJson[3].requestId.position;

      this.setState({
        itemsTable: {
          ID: parseInt(nuevoID),

          "Destinatario De Nombre Y Apellido": parseInt(
            StringJson[3].recipientFullname.position
          ),
          Telefono: parseInt(StringJson[3].phone.position),
          Email: parseInt(StringJson[3].email.position),
          "Tipo De Documento": parseInt(StringJson[3].docType.position),
          "Numero De Documento": parseInt(StringJson[3].docNumber.position),
          CPA: parseInt(StringJson[3].cpa.position),
          Provincia: parseInt(StringJson[3].province.position),
          Localidad: parseInt(StringJson[3].locality.position),
          "Entrega Domicilio": parseInt(StringJson[3].homeDelivery.position),
          Domicilio: parseInt(StringJson[3].addressStreet.position),
          "Numero Domicilio": parseInt(StringJson[3].addressNumber.position),
          "Numero Edificio": parseInt(StringJson[3].addressBuilding.position),
          "Piso Edificio": parseInt(StringJson[3].addressFloor.position),
          "Departamento Edificio": parseInt(
            StringJson[3].addressApartment.position
          ),
          "CPA Edificio": parseInt(StringJson[3].addressCpa.position),
          "Cantidad De Piezas": parseInt(StringJson[3].qtyPieces.position),
          "Peso Total De La Solicitud": parseInt(
            StringJson[3].totalWeight.position
          ),
          Observaciones: parseInt(StringJson[3].observations.position),
        },
        longitudes: {
          ID: StringJson[3].requestId.length,

          "Destinatario De Nombre Y Apellido":
            StringJson[3].recipientFullname.length,
          Telefono: StringJson[3].phone.length,
          Email: StringJson[3].email.length,
          "Tipo De Documento": StringJson[3].docType.length,
          "Numero De Documento": StringJson[3].docNumber.length,
          CPA: StringJson[3].cpa.length,
          Provincia: StringJson[3].province.length,
          Localidad: StringJson[3].locality.length,
          "Entrega Domicilio": StringJson[3].homeDelivery.length,
          Domicilio: StringJson[3].addressStreet.length,
          "Numero Domicilio": StringJson[3].addressNumber.length,
          "Numero Edificio": StringJson[3].addressBuilding.length,
          "Piso Edificio": StringJson[3].addressFloor.length,
          "Departamento Edificio": StringJson[3].addressApartment.length,
          "CPA Edificio": StringJson[3].addressCpa.length,
          "Cantidad De Piezas": StringJson[3].qtyPieces.length,
          "Peso Total De La Solicitud": StringJson[3].totalWeight.length,
          Observaciones: StringJson[3].observations.length,
        },
        valorCheck: {
          ID: StringJson[3].requestId.defaultValue != null ? true : false,
          "Destinatario De Nombre Y Apellido":
            StringJson[3].recipientFullname.defaultValue != null ? true : false,
          Telefono: StringJson[3].phone.defaultValue != null ? true : false,
          Email: StringJson[3].email.defaultValue != null ? true : false,
          "Tipo De Documento":
            StringJson[3].docType.defaultValue != null ? true : false,
          "Numero De Documento":
            StringJson[3].docNumber.defaultValue != null ? true : false,
          CPA: StringJson[3].cpa.defaultValue != null ? true : false,
          Provincia: StringJson[3].province.defaultValue != null ? true : false,
          Localidad: StringJson[3].locality.defaultValue != null ? true : false,
          "Entrega Domicilio": StringJson[3].homeDelivery.defaultValue,
          Domicilio:
            StringJson[3].addressStreet.defaultValue != null ? true : false,
          "Numero Domicilio":
            StringJson[3].addressNumber.defaultValue != null ? true : false,
          "Numero Edificio":
            StringJson[3].addressBuilding.defaultValue != null ? true : false,
          "Piso Edificio":
            StringJson[3].addressFloor.defaultValue != null ? true : false,
          "Departamento Edificio":
            StringJson[3].addressApartment.defaultValue != null ? true : false,
          "CPA Edificio":
            StringJson[3].addressCpa.defaultValue != null ? true : false,
          "Cantidad De Piezas":
            StringJson[3].qtyPieces.defaultValue != null ? true : false,
          "Peso Total De La Solicitud":
            StringJson[3].totalWeight.defaultValue != null ? true : false,
          Observaciones:
            StringJson[3].observations.defaultValue != null ? true : false,
        },
        ignorarCheck: {
          ID:
            StringJson[3].requestId.position != null
              ? false
              : StringJson[3].requestId.defaultValue != null
              ? false
              : true,
          "Destinatario De Nombre Y Apellido":
            StringJson[3].recipientFullname.position != null
              ? false
              : StringJson[3].recipientFullname.defaultValue != null
              ? false
              : true,
          Telefono:
            StringJson[3].phone.position != null
              ? false
              : StringJson[3].phone.defaultValue != null
              ? false
              : true,
          Email:
            StringJson[3].email.position != null
              ? false
              : StringJson[3].email.defaultValue != null
              ? false
              : true,
          "Tipo De Documento":
            StringJson[3].docType.position != null
              ? false
              : StringJson[3].docType.defaultValue != null
              ? false
              : true,
          "Numero De Documento":
            StringJson[3].docNumber.position != null
              ? false
              : StringJson[3].docNumber.defaultValue != null
              ? false
              : true,
          CPA:
            StringJson[3].cpa.position != null
              ? false
              : StringJson[3].cpa.defaultValue != null
              ? false
              : true,
          Provincia:
            StringJson[3].province.position != null
              ? false
              : StringJson[3].province.defaultValue != null
              ? false
              : true,
          Localidad:
            StringJson[3].locality.position != null
              ? false
              : StringJson[3].locality.defaultValue != null
              ? false
              : true,
          "Entrega Domicilio":
            StringJson[3].homeDelivery.position != null
              ? false
              : !StringJson[3].homeDelivery.defaultValue,
          Domicilio:
            StringJson[3].addressStreet.position != null
              ? false
              : StringJson[3].addressStreet.defaultValue != null
              ? false
              : true,
          "Numero Domicilio":
            StringJson[3].addressNumber.position != null
              ? false
              : StringJson[3].addressNumber.defaultValue != null
              ? false
              : true,
          "Numero Edificio":
            StringJson[3].addressBuilding.position != null
              ? false
              : StringJson[3].addressBuilding.defaultValue != null
              ? false
              : true,
          "Piso Edificio":
            StringJson[3].addressFloor.position != null
              ? false
              : StringJson[3].addressFloor.defaultValue != null
              ? false
              : true,
          "Departamento Edificio":
            StringJson[3].addressApartment.position != null
              ? false
              : StringJson[3].addressApartment.defaultValue != null
              ? false
              : true,
          "CPA Edificio":
            StringJson[3].addressCpa.position != null
              ? false
              : StringJson[3].addressCpa.defaultValue != null
              ? false
              : true,
          "Cantidad De Piezas":
            StringJson[3].qtyPieces.position != null
              ? false
              : StringJson[3].qtyPieces.defaultValue != null
              ? false
              : true,
          "Peso Total De La Solicitud":
            StringJson[3].totalWeight.position != null
              ? false
              : StringJson[3].totalWeight.defaultValue != null
              ? false
              : true,
          Observaciones:
            StringJson[3].observations.position != null
              ? false
              : StringJson[3].observations.defaultValue != null
              ? false
              : true,
        },
        inputUnique: {
          ID: StringJson[3].requestId.defaultValue,
          "Destinatario De Nombre Y Apellido":
            StringJson[3].recipientFullname.defaultValue,
          Telefono: StringJson[3].phone.defaultValue,
          Email: StringJson[3].email.defaultValue,
          "Tipo De Documento": StringJson[3].docType.defaultValue,
          "Numero De Documento": StringJson[3].docNumber.defaultValue,
          CPA: StringJson[3].cpa.defaultValue,
          Provincia: StringJson[3].province.defaultValue,
          Localidad: StringJson[3].locality.defaultValue,
          "Entrega Domicilio": StringJson[3].homeDelivery.defaultValue,
          Domicilio: StringJson[3].addressStreet.defaultValue,
          "Numero Domicilio": StringJson[3].addressNumber.defaultValue,
          "Numero Edificio": StringJson[3].addressBuilding.defaultValue,
          "Piso Edificio": StringJson[3].addressFloor.defaultValue,
          "Departamento Edificio": StringJson[3].addressApartment.defaultValue,
          "CPA Edificio": StringJson[3].addressCpa.defaultValue,
          "Cantidad De Piezas": StringJson[3].qtyPieces.defaultValue,
          "Peso Total De La Solicitud": StringJson[3].totalWeight.defaultValue,
          Observaciones: StringJson[3].observations.defaultValue,
        },
      });
      this.setState({ format: StringJson[0] });
      this.setState({ specialCharacter: StringJson[2] });
      this.setState({ caracter: StringJson[1] });
    } else {
    }
  };
  UpadateInfo = async (acc) => {
    // const url = `https://qa.derservicios.com.ar/v1/api/v1/api/service-request/format-request`;

    // const url = `http://localhost:4200/v1/api/service-request/format-request`;
    const url = `${BASEURL}/service-request/format-request`;
    //const id = this.props.history;

    if (
      this.state.itemsTable["Entrega Domicilio"] != null &&
      !this.state.inputUnique["Entrega Domicilio"]
    ) {
      this.state.inputUnique["Entrega Domicilio"] = null;
    }

    if (this.state.format !== "txt" && this.state.format !== "csv") {
      let dataUpdate = {
        format: this.state.format,
        separator: this.state.caracter,
        accountId: this.state.accountId,
        requestFields: {
          requestId: {
            position: parseInt(parseInt(this.state.itemsTable.ID) - 1),
            required: false,
            length: this.state.longitudes.ID,
            defaultValue: this.state.inputUnique.ID,
          },
          recipientFullname: {
            position: parseInt(
              parseInt(
                this.state.itemsTable["Destinatario De Nombre Y Apellido"]
              ) - 1
            ),
            required: false,
            length: this.state.longitudes["Destinatario De Nombre Y Apellido"],
            defaultValue:
              this.state.inputUnique["Destinatario De Nombre Y Apellido"],
          },
          phone: {
            position: parseInt(parseInt(this.state.itemsTable["Telefono"]) - 1),
            required: false,
            length: this.state.longitudes["Telefono"],
            defaultValue: this.state.inputUnique["Telefono"],
          },
          email: {
            position: parseInt(parseInt(this.state.itemsTable["Email"]) - 1),
            required: false,
            length: this.state.longitudes["Email"],
            defaultValue: this.state.inputUnique["Email"],
          },
          docType: {
            position: parseInt(
              parseInt(this.state.itemsTable["Tipo De Documento"]) - 1
            ),
            required: false,
            length: this.state.longitudes["Tipo De Documento"],
            defaultValue: this.state.inputUnique["Tipo De Documento"],
          },
          docNumber: {
            position: parseInt(
              parseInt(this.state.itemsTable["Numero De Documento"]) - 1
            ),
            required: false,
            length: this.state.longitudes["Numero De Documento"],
            defaultValue: this.state.inputUnique["Numero De Documento"],
          },
          cpa: {
            position: parseInt(parseInt(this.state.itemsTable["CPA"]) - 1),
            required: false,
            defaultValue: this.state.inputUnique["CPA"],
          },
          province: {
            position: parseInt(
              parseInt(this.state.itemsTable["Provincia"]) - 1
            ),
            required: false,
            length: parseInt(this.state.longitudes["Provincia"]),
            defaultValue: this.state.inputUnique["Provincia"],
          },
          locality: {
            position: parseInt(
              parseInt(this.state.itemsTable["Localidad"]) - 1
            ),
            required: false,
            length: this.state.longitudes["Localidad"],
            defaultValue: this.state.inputUnique["Localidad"],
          },
          homeDelivery: {
            position: parseInt(
              parseInt(this.state.itemsTable["Entrega Domicilio"]) - 1
            ),
            required: false,
            defaultValue:
              this.state.inputUnique["Entrega Domicilio"] === null ||
              this.state.inputUnique["Entrega Domicilio"] === false
                ? false
                : true,
          },
          addressStreet: {
            position: parseInt(
              parseInt(this.state.itemsTable["Domicilio"]) - 1
            ),
            required: false,
            length: this.state.longitudes["Domicilio"],
            defaultValue: this.state.inputUnique["Domicilio"],
          },
          addressNumber: {
            position: parseInt(
              parseInt(this.state.itemsTable["Numero Domicilio"]) - 1
            ),
            required: false,
            length: this.state.longitudes["Numero Domicilio"],
            defaultValue: this.state.inputUnique["Numero Domicilio"],
          },
          addressBuilding: {
            position: parseInt(
              parseInt(this.state.itemsTable["Numero Edificio"]) - 1
            ),
            required: false,
            length: this.state.longitudes["Numero Edificio"],
            defaultValue: this.state.inputUnique["Numero Edificio"],
          },
          addressFloor: {
            position: parseInt(
              parseInt(this.state.itemsTable["Piso Edificio"]) - 1
            ),
            required: false,
            length: this.state.longitudes["Piso Edificio"],
            defaultValue: this.state.inputUnique["Piso Edificio"],
          },
          addressApartment: {
            position: parseInt(
              parseInt(this.state.itemsTable["Departamento Edificio"]) - 1
            ),
            required: false,
            length: this.state.longitudes["Departamento Edificio"],
            defaultValue: this.state.inputUnique["Departamento Edificio"],
          },
          addressCpa: {
            position: parseInt(
              parseInt(this.state.itemsTable["CPA Edificio"]) - 1
            ),
            required: false,
            length: this.state.longitudes["CPA Edificio"],
            defaultValue: this.state.inputUnique["CPA Edificio"],
          },
          qtyPieces: {
            position: parseInt(
              parseInt(this.state.itemsTable["Cantidad De Piezas"]) - 1
            ),
            required: false,
            defaultValue: parseInt(
              parseInt(this.state.inputUnique["Cantidad De Piezas"])
            ),
          },
          totalWeight: {
            position: parseInt(
              parseInt(this.state.itemsTable["Peso Total De La Solicitud"]) - 1
            ),
            required: false,
            defaultValue: parseInt(
              parseInt(this.state.inputUnique["Peso Total De La Solicitud"])
            ),
          },
          observations: {
            position: parseInt(
              parseInt(this.state.itemsTable["Observaciones"]) - 1
            ),
            required: false,
            length: this.state.longitudes["Observaciones"],
            defaultValue: this.state.inputUnique["Observaciones"],
          },
        },
      };
      const set = new Set();

      for (const key in this.state.itemsTable) {
        const element = this.state.itemsTable[key];

        if (element === null || isNaN(element)) set.add(key);
        if (!isNaN(parseInt(element)) && parseInt(element) > 0)
          set.add(parseInt(element));
      }

      if (set.size === Object.keys(this.state.itemsTable).length) {
        //Recorre el JSON para verificar que no haya 0 ni numeros repetidos


        const request = {
          method: "PUT",
          body: JSON.stringify(dataUpdate),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.props.auth.userData.token,
          },
        };

        /* Funcion fetch */
        fetch(url, request).then(() => {
          Swal.fire({
            title: "Formato Modificado correctamente",
            icon: "success",
            confirmButtonText: this.props.t("modalButtons.accept"),
          }).then(() => {
            this.props.history.push({
              pathname: "/location-modification",
              state: this.props.history.location,
            });
          });
        });
      } else {
        Swal.fire({
          title: "Hay algún dato en 0, vacío o duplicado",
          icon: "error",
          confirmButtonText: this.props.t("modalButtons.accept"),
        });
      }
    } else {
      let dataUpdate = {
        format: this.state.format,
        separator: this.state.caracter,
        accountId: this.state.accountId,
        quoteChar: this.state.specialCharacter,
        requestFields: {
          requestId: {
            position: parseInt(parseInt(this.state.itemsTable.ID) - 1),
            required: false,
            length: this.state.longitudes.ID,
            defaultValue: this.state.inputUnique.ID,
          },
          recipientFullname: {
            position: parseInt(
              parseInt(
                this.state.itemsTable["Destinatario De Nombre Y Apellido"]
              ) - 1
            ),
            required: false,
            length: this.state.longitudes["Destinatario De Nombre Y Apellido"],
            defaultValue:
              this.state.inputUnique["Destinatario De Nombre Y Apellido"],
          },
          phone: {
            position: parseInt(parseInt(this.state.itemsTable["Telefono"]) - 1),
            required: false,
            length: this.state.longitudes["Telefono"],
            defaultValue: this.state.inputUnique["Telefono"],
          },
          email: {
            position: parseInt(parseInt(this.state.itemsTable["Email"]) - 1),
            required: false,
            length: this.state.longitudes["Email"],
            defaultValue: this.state.inputUnique["Email"],
          },
          docType: {
            position: parseInt(
              parseInt(this.state.itemsTable["Tipo De Documento"]) - 1
            ),
            required: false,
            length: this.state.longitudes["Tipo De Documento"],
            defaultValue: this.state.inputUnique["Tipo De Documento"],
          },
          docNumber: {
            position: parseInt(
              parseInt(this.state.itemsTable["Numero De Documento"]) - 1
            ),
            required: false,
            length: this.state.longitudes["Numero De Documento"],
            defaultValue: this.state.inputUnique["Numero De Documento"],
          },

          cpa: {
            position: parseInt(parseInt(this.state.itemsTable["CPA"]) - 1),
            required: false,
            defaultValue: this.state.inputUnique["CPA"],
          },
          province: {
            position: parseInt(
              parseInt(this.state.itemsTable["Provincia"]) - 1
            ),
            required: false,
            length: parseInt(this.state.longitudes["Provincia"]),
            defaultValue: this.state.inputUnique["Provincia"],
          },
          locality: {
            position: parseInt(
              parseInt(this.state.itemsTable["Localidad"]) - 1
            ),
            required: false,
            length: this.state.longitudes["Localidad"],
            defaultValue: this.state.inputUnique["Localidad"],
          },
          homeDelivery: {
            position: parseInt(
              parseInt(this.state.itemsTable["Entrega Domicilio"]) - 1
            ),
            required: false,
            defaultValue:
              this.state.inputUnique["Entrega Domicilio"] === null ||
              this.state.inputUnique["Entrega Domicilio"] === false
                ? false
                : true,
          },
          addressStreet: {
            position: parseInt(
              parseInt(this.state.itemsTable["Domicilio"]) - 1
            ),
            required: false,
            length: this.state.longitudes["Domicilio"],
            defaultValue: this.state.inputUnique["Domicilio"],
          },
          addressNumber: {
            position: parseInt(
              parseInt(this.state.itemsTable["Numero Domicilio"]) - 1
            ),
            required: false,
            length: this.state.longitudes["Numero Domicilio"],
            defaultValue: this.state.inputUnique["Numero Domicilio"],
          },
          addressBuilding: {
            position: parseInt(
              parseInt(this.state.itemsTable["Numero Edificio"]) - 1
            ),
            required: false,
            length: this.state.longitudes["Numero Edificio"],
            defaultValue: this.state.inputUnique["Numero Edificio"],
          },
          addressFloor: {
            position: parseInt(
              parseInt(this.state.itemsTable["Piso Edificio"]) - 1
            ),
            required: false,
            length: this.state.longitudes["Piso Edificio"],
            defaultValue: this.state.inputUnique["Piso Edificio"],
          },
          addressApartment: {
            position: parseInt(
              parseInt(this.state.itemsTable["Departamento Edificio"]) - 1
            ),
            required: false,
            length: this.state.longitudes["Departamento Edificio"],
            defaultValue: this.state.inputUnique["Departamento Edificio"],
          },
          addressCpa: {
            position: parseInt(
              parseInt(this.state.itemsTable["CPA Edificio"]) - 1
            ),
            required: false,
            length: this.state.longitudes["CPA Edificio"],
            defaultValue: this.state.inputUnique["CPA Edificio"],
          },
          qtyPieces: {
            position: parseInt(
              parseInt(this.state.itemsTable["Cantidad De Piezas"]) - 1
            ),
            required: false,
            defaultValue: parseInt(
              parseInt(this.state.inputUnique["Cantidad De Piezas"])
            ),
          },
          totalWeight: {
            position: parseInt(
              parseInt(this.state.itemsTable["Peso Total De La Solicitud"]) - 1
            ),
            required: false,
            defaultValue: parseInt(
              this.state.inputUnique["Peso Total De La Solicitud"]
            ),
          },
          observations: {
            position: parseInt(
              parseInt(this.state.itemsTable["Observaciones"]) - 1
            ),
            required: false,
            length: this.state.longitudes["Observaciones"],
            defaultValue: this.state.inputUnique["Observaciones"],
          },
        },
      };

      const set = new Set();

      for (const key in this.state.itemsTable) {
        const element = this.state.itemsTable[key];

        if (element === null || isNaN(element)) set.add(key);
        if (!isNaN(parseInt(element)) && parseInt(element) > 0)
          set.add(parseInt(element));
      }
      set.delete("0");

      if (set.size === Object.keys(this.state.itemsTable).length) {
        //Recorre el JSON para verificar que no haya 0 ni numeros repetidos

        const request = {
          method: "PUT",
          body: JSON.stringify(dataUpdate),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.props.auth.userData.token,
          },
        };

        /* Funcion fetch */
        fetch(url, request).then(() => {
          Swal.fire({
            title: "Formato Modificado correctamente",
            icon: "success",
            confirmButtonText: this.props.t("modalButtons.accept"),
          }).then(() => {
            this.props.history.push({
              pathname: "/location-modification",
              state: this.props.history.location,
            });
          });
        });
      } else {
        Swal.fire({
          title: "Hay algún dato en 0, vacío o duplicado",
          icon: "error",
          confirmButtonText: this.props.t("modalButtons.accept"),
        });
      }
    }
  };

  componentDidMount() {
    this.getList();
    this.getInfoCliente();
  }

  getList() {
    const {
      auth: {
        userData: { roles, account },
      },
      location,
      fetchUsers,
      getUsers,
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

  handleSubmitEdit(e) {
    const { t } = this.props;
    e.preventDefault();
    if (this.format !== "txt") {
    }

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
    let data = undefined;
    // const url =
    // "https://qa.derservicios.com.ar/v1/api/v1/api/service-request/format-request";
    // const url = "http://localhost:4200/v1/api/service-request/format-request";
    const url = `${BASEURL}/service-request/format-request`;
    if (this.state.itemsTable["Entrega Domicilio"] != null) {
      this.state.inputUnique["Entrega Domicilio"] = null;
    }
    if (this.format !== "txt") {
      data = {
        format: this.state.format,
        separator: this.state.caracter,
        accountId: this.state.accountId,
        quoteChar: "#",
        requestFields: {
          requestId: {
            position: parseInt(parseInt(this.state.itemsTable.ID) - 1),
            required: false,
            length: this.state.longitudes.ID,
            defaultValue: this.state.inputUnique.ID,
          },
          recipientFullname: {
            position: parseInt(
              parseInt(
                this.state.itemsTable["Destinatario De Nombre Y Apellido"]
              ) - 1
            ),
            required: false,
            length: this.state.longitudes["Destinatario De Nombre Y Apellido"],
            defaultValue:
              this.state.inputUnique["Destinatario De Nombre Y Apellido"],
          },
          phone: {
            position: parseInt(parseInt(this.state.itemsTable["Telefono"]) - 1),
            required: false,
            length: this.state.longitudes["Telefono"],
            defaultValue: this.state.inputUnique["Telefono"],
          },
          email: {
            position: parseInt(parseInt(this.state.itemsTable["Email"]) - 1),
            required: false,
            length: this.state.longitudes["Email"],
            defaultValue: this.state.inputUnique["Email"],
          },
          docType: {
            position: parseInt(
              parseInt(this.state.itemsTable["Tipo De Documento"]) - 1
            ),
            required: false,
            length: this.state.longitudes["Tipo De Documento"],
            defaultValue: this.state.inputUnique["Tipo De Documento"],
          },
          docNumber: {
            position: parseInt(
              parseInt(this.state.itemsTable["Numero De Documento"]) - 1
            ),
            required: false,
            length: this.state.longitudes["Numero De Documento"],
            defaultValue: this.state.inputUnique["Numero De Documento"],
          },
          cpa: {
            position: parseInt(parseInt(this.state.itemsTable["CPA"]) - 1),
            required: false,
            length: parseInt(100),
            defaultValue: this.state.inputUnique["CPA"],
          },
          province: {
            position: parseInt(
              parseInt(this.state.itemsTable["Provincia"]) - 1
            ),
            required: false,
            length: parseInt(this.state.longitudes["Provincia"]),
            defaultValue: this.state.inputUnique["Provincia"],
          },
          locality: {
            position: parseInt(
              parseInt(this.state.itemsTable["Localidad"]) - 1
            ),
            required: false,
            length: this.state.longitudes["Localidad"],
            defaultValue: this.state.inputUnique["Localidad"],
          },
          homeDelivery: {
            position: parseInt(
              parseInt(this.state.itemsTable["Entrega Domicilio"]) - 1
            ),
            required: false,
            defaultValue:
              this.state.inputUnique["Entrega Domicilio"] === null ||
              this.state.inputUnique["Entrega Domicilio"] === false
                ? false
                : true,
          },
          addressStreet: {
            position: parseInt(
              parseInt(this.state.itemsTable["Domicilio"]) - 1
            ),
            required: false,
            length: this.state.longitudes["Domicilio"],
            defaultValue: this.state.inputUnique["Domicilio"],
          },
          addressNumber: {
            position: parseInt(
              parseInt(this.state.itemsTable["Numero Domicilio"]) - 1
            ),
            required: false,
            length: this.state.longitudes["Numero Domicilio"],
            defaultValue: this.state.inputUnique["Numero Domicilio"],
          },
          addressBuilding: {
            position: parseInt(
              parseInt(this.state.itemsTable["Numero Edificio"]) - 1
            ),
            required: false,
            length: this.state.longitudes["Numero Edificio"],
            defaultValue: this.state.inputUnique["Numero Edificio"],
          },
          addressFloor: {
            position: parseInt(
              parseInt(this.state.itemsTable["Piso Edificio"]) - 1
            ),
            required: false,
            length: this.state.longitudes["Piso Edificio"],
            defaultValue: this.state.inputUnique["Piso Edificio"],
          },
          addressApartment: {
            position: parseInt(
              parseInt(this.state.itemsTable["Departamento Edificio"]) - 1
            ),
            required: false,
            length: this.state.longitudes["Departamento Edificio"],
            defaultValue: this.state.inputUnique["Departamento Edificio"],
          },
          addressCpa: {
            position: parseInt(
              parseInt(this.state.itemsTable["CPA Edificio"]) - 1
            ),
            required: false,
            length: this.state.longitudes["CPA Edificio"],
            defaultValue: this.state.inputUnique["CPA Edificio"],
          },
          qtyPieces: {
            position: parseInt(
              parseInt(this.state.itemsTable["Cantidad De Piezas"]) - 1
            ),
            required: false,
            defaultValue: parseInt(
              parseInt(this.state.inputUnique["Cantidad De Piezas"])
            ),
          },
          totalWeight: {
            position: parseInt(
              parseInt(this.state.itemsTable["Peso Total De La Solicitud"]) - 1
            ),
            required: false,
            defaultValue: parseInt(
              parseInt(this.state.inputUnique["Peso Total De La Solicitud"])
            ),
          },
          observations: {
            position: parseInt(
              parseInt(this.state.itemsTable["Observaciones"]) - 1
            ),
            required: false,
            length: this.state.longitudes["Observaciones"],
            defaultValue: this.state.inputUnique["Observaciones"],
          },
        },
      };
      const set = new Set();

      for (const key in this.state.itemsTable) {
        const element = this.state.itemsTable[key];

        if (element === null) set.add(key);
        if (!isNaN(parseInt(element)) && parseInt(element) > 0)
          set.add(parseInt(element));
      }
      set.delete("0");

      if (set.size === Object.keys(this.state.itemsTable).length) {
        //Recorre el JSON para verificar que no haya 0 ni numeros repetidos


        const request = {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.props.auth.userData.token,
          },
        };

        /* Funcion fetch */
        fetch(url, request).then(() => {
          Swal.fire({
            title: "Formato guardado correctamente",
            icon: "success",
            confirmButtonText: this.props.t("modalButtons.accept"),
          }).then(
            this.props.history.push({
              pathname: "/location-modification",
              state: this.props.history.location,
            })
          );
        });
      } else {
        Swal.fire({
          title: "Hay algún dato en 0, vacío o duplicado",
          icon: "error",
          confirmButtonText: this.props.t("modalButtons.accept"),
        });
      }
    } else {
      data = {
        format: this.state.format,
        separator: this.state.caracter,
        accountId: this.state.accountId,
        requestFields: {
          requestId: {
            position: parseInt(parseInt(this.state.itemsTable.ID) - 1),
            required: false,
            length: this.state.longitudes.ID,
            defaultValue: this.state.inputUnique.ID,
          },
          recipientFullname: {
            position: parseInt(
              parseInt(
                this.state.itemsTable["Destinatario De Nombre Y Apellido"]
              ) - 1
            ),
            required: false,
            length: this.state.longitudes["Destinatario De Nombre Y Apellido"],
            defaultValue:
              this.state.inputUnique["Destinatario De Nombre Y Apellido"],
          },
          phone: {
            position: parseInt(parseInt(this.state.itemsTable["Telefono"]) - 1),
            required: false,
            length: this.state.longitudes["Telefono"],
            defaultValue: this.state.inputUnique["Telefono"],
          },
          email: {
            position: parseInt(parseInt(this.state.itemsTable["Email"]) - 1),
            required: false,
            length: this.state.longitudes["Email"],
            defaultValue: this.state.inputUnique["Email"],
          },
          docType: {
            position: parseInt(
              parseInt(this.state.itemsTable["Tipo De Documento"]) - 1
            ),
            required: false,
            length: this.state.longitudes["Tipo De Documento"],
            defaultValue: this.state.inputUnique["Tipo De Documento"],
          },
          docNumber: {
            position: parseInt(
              parseInt(this.state.itemsTable["Numero De Documento"]) - 1
            ),
            required: false,
            length: this.state.longitudes["Numero De Documento"],
            defaultValue: this.state.inputUnique["Numero De Documento"],
          },
          cpa: {
            position: parseInt(parseInt(this.state.itemsTable["CPA"]) - 1),
            required: false,
            length: parseInt(100),
            defaultValue: this.state.inputUnique["CPA"],
          },
          province: {
            position: parseInt(
              parseInt(this.state.itemsTable["Provincia"]) - 1
            ),
            required: false,
            length: parseInt(this.state.longitudes["Provincia"]),
            defaultValue: this.state.inputUnique["Provincia"],
          },
          locality: {
            position: parseInt(
              parseInt(this.state.itemsTable["Localidad"]) - 1
            ),
            required: false,
            length: this.state.longitudes["Localidad"],
            defaultValue: this.state.inputUnique["Localidad"],
          },
          homeDelivery: {
            position: parseInt(
              parseInt(this.state.itemsTable["Entrega Domicilio"]) - 1
            ),
            required: false,
            defaultValue:
              this.state.inputUnique["Entrega Domicilio"] === null ||
              this.state.inputUnique["Entrega Domicilio"] === false
                ? false
                : true,
          },
          addressStreet: {
            position: parseInt(
              parseInt(this.state.itemsTable["Domicilio"]) - 1
            ),
            required: false,
            length: this.state.longitudes["Domicilio"],
            defaultValue: this.state.inputUnique["Domicilio"],
          },
          addressNumber: {
            position: parseInt(
              parseInt(this.state.itemsTable["Numero Domicilio"]) - 1
            ),
            required: false,
            defaultValue: this.state.inputUnique["Numero Domicilio"],
          },
          addressBuilding: {
            position: parseInt(
              parseInt(this.state.itemsTable["Numero Edificio"]) - 1
            ),
            required: false,
            length: this.state.longitudes["Numero Edificio"],
            defaultValue: this.state.inputUnique["Numero Edificio"],
          },
          addressFloor: {
            position: parseInt(
              parseInt(this.state.itemsTable["Piso Edificio"]) - 1
            ),
            required: false,
            length: this.state.longitudes["Piso Edificio"],
            defaultValue: this.state.inputUnique["Piso Edificio"],
          },
          addressApartment: {
            position: parseInt(
              parseInt(this.state.itemsTable["Departamento Edificio"]) - 1
            ),
            required: false,
            length: this.state.longitudes["Departamento Edificio"],
            defaultValue: this.state.inputUnique["Departamento Edificio"],
          },
          addressCpa: {
            position: parseInt(
              parseInt(this.state.itemsTable["CPA Edificio"]) - 1
            ),
            required: false,
            length: this.state.longitudes["CPA Edificio"],
            defaultValue: this.state.inputUnique["CPA Edificio"],
          },
          qtyPieces: {
            position: parseInt(
              parseInt(this.state.itemsTable["Cantidad De Piezas"]) - 1
            ),
            required: false,
            defaultValue: parseInt(
              this.state.inputUnique["Cantidad De Piezas"]
            ),
          },
          totalWeight: {
            position: parseInt(
              parseInt(this.state.itemsTable["Peso Total De La Solicitud"]) - 1
            ),
            required: false,
            defaultValue: parseInt(
              parseInt(this.state.inputUnique["Peso Total De La Solicitud"])
            ),
          },
          observations: {
            position: parseInt(
              parseInt(this.state.itemsTable["Observaciones"]) - 1
            ),
            required: false,
            length: this.state.longitudes["Observaciones"],
            defaultValue: this.state.inputUnique["Observaciones"],
          },
        },
      };
      const set = new Set();

      for (const key in this.state.itemsTable) {
        const element = this.state.itemsTable[key];

        if (element === null) set.add(key);
        if (!isNaN(parseInt(element)) && parseInt(element) > 0)
          set.add(parseInt(element));
      }
      set.delete("0");

      if (set.size === Object.keys(this.state.itemsTable).length - 1) {
        //Recorre el JSON para verificar que no haya 0 ni numeros repetidos

        const request = {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.props.auth.userData.token,
          },
        };

        /* Funcion fetch */
        fetch(url, request).then(() => {
          Swal.fire({
            title: "Formato guardado correctamente",
            icon: "success",
            confirmButtonText: this.props.t("modalButtons.accept"),
          }).then(
            this.props.history.push({
              pathname: "/location-modification",
              state: this.props.history.location,
            })
          );
        });
      } else {
        Swal.fire({
          title: "Hay algún dato en 0, vacío o duplicado",
          icon: "error",
          confirmButtonText: this.props.t("modalButtons.accept"),
        });
      }
    }
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

  handleInputIdentificacion(e) {
    const nombre = e.target.name;
    const valor = e.target.value;

    this.setState((prev) => ({
      ...prev,
      itemsTable: { ...prev.itemsTable, [nombre]: valor },
    }));
  }

  handleInputSpecialCharacter(e) {
    const valor = e.target.value;

    this.setState((prev) => ({
      ...prev,
      specialCharacter: valor,
    }));
  }

  handleInputLongitudes(e) {
    const nombre = e.target.name;
    const valor = e.target.value;
    const valorEntero = parseInt(valor);

    this.setState((prev) => ({
      ...prev,
      longitudes: { ...prev.longitudes, [nombre]: valorEntero },
    }));
  }

  handleInputValorCheck(e) {
    const nombre = e.target.name;
    const valor = e.target.value;
    this.setState((prev) => ({
      ...prev,
      inputUnique: { ...prev.inputUnique, [nombre]: valor },
    }));
    this.setState((prev) => ({
      ...prev,
      itemsTable: { ...prev.itemsTable, [nombre]: null },
    }));
  }

  handleCheckboxIgnorarCheck(e) {
    const nombre = e.target.name;
    const valor = e.target.value;

    if (nombre === "Entrega Domicilio" && valor) {
      this.setState((prev) => ({
        ...prev,
        ignorarCheck: {
          ...prev.ignorarCheck,
          [nombre]: !prev.ignorarCheck[nombre],
        },
        valorCheck: {
          ...prev.valorCheck,
          [nombre]: false,
        },
        inputUnique: {
          ...prev.inputUnique,
          "Entrega Domicilio": false,
        },
        itemsTable: { ...prev.itemsTable, [nombre]: null },
      }));
    } else {
      this.setState((prev) => ({
        ...prev,
        ignorarCheck: {
          ...prev.ignorarCheck,
          [nombre]: !prev.ignorarCheck[nombre],
        },
      }));
      this.setState((prev) => ({
        ...prev,
        itemsTable: { ...prev.itemsTable, [nombre]: null },
      }));
    }
  }

  handleCheckboxDefaultValueCheck(e) {
    const nombre = e.target.name;
    const valor = e.target.checked;

    if (nombre === "Entrega Domicilio" && valor) {
      this.setState((prev) => ({
        ...prev,
        valorCheck: {
          ...prev.valorCheck,
          [nombre]: true,
        },
        ignorarCheck: {
          ...prev.ignorarCheck,
          [nombre]: false,
        },
        inputUnique: {
          ...prev.inputUnique,
          "Entrega Domicilio": true,
        },
      }));
      this.setState((prev) => ({
        ...prev,
        itemsTable: { ...prev.itemsTable, [nombre]: null },
      }));
    } else if (nombre === "Entrega Domicilio" && !valor) {
      this.setState((prev) => ({
        ...prev,
        valorCheck: {
          ...prev.valorCheck,
          [nombre]: null,
        },
        inputUnique: {
          ...prev.inputUnique,
          "Entrega Domicilio": false,
        },
      }));
    } else {
      if (valor) {
        this.setState((prev) => ({
          ...prev,
          valorCheck: {
            ...prev.valorCheck,
            [nombre]: !prev.valorCheck[nombre],
          },
          inputUnique: { ...prev.inputUnique, [nombre]: null },
        }));
      } else {
        this.setState((prev) => ({
          ...prev,
          valorCheck: {
            ...prev.valorCheck,
            [nombre]: null,
          },
          inputUnique: {
            ...prev.inputUnique,
            [nombre]: null,
          },
        }));
      }
    }
  }

  render() {
    const { companyName } = this.state.mainData;
    const {
      auth: {
        userData: { roles },
      },
      history,
      t,
    } = this.props;


    const itemsTable = [
      "ID",
      "Destinatario De Nombre Y Apellido",
      "Tipo De Documento",
      "Numero De Documento",
      "Telefono",
      "Email",
      "Localidad",
      "Provincia",
      "CPA",
      "Entrega Domicilio",
      "Domicilio",
      "Numero Domicilio",
      "Numero Edificio",
      "Piso Edificio",
      "Departamento Edificio",
      "CPA Edificio",
      "Cantidad De Piezas",
      "Peso Total De La Solicitud",
      "Observaciones",
    ];

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
                currentPage={t("formatAdministration")}
              />
            </Col>
          </Row>
          <h5 className="mt-5 m-3">
            ADMINISTRADOR DE FORMATOS PARA SOLICITUDES - {companyName}
          </h5>
          <div className="d-flex justify-content-start gap-5 mt-5 ms-5 m-3">
            <NavDropdown
              style={{ width: "15%", padding: 0 }}
              className="custom-select"
              title={this.state.format}
              id="nav-dropdown"
            >
              <NavDropdown.Item
                eventKey="4.1"
                onClick={() => {
                  this.setState({ format: "xls" });
                  this.setState({ caracter: null });
                }}
              >
                XLS (Excel)
              </NavDropdown.Item>
              <NavDropdown.Item
                eventKey="4.2"
                onClick={() => {
                  this.setState({ format: "csv" });
                  this.setState({ caracter: "comma" });
                }}
              >
                CSV
              </NavDropdown.Item>
              <NavDropdown.Item
                eventKey="4.3"
                onClick={() => {
                  this.setState({ format: "txt" });
                  this.setState({ caracter: "tab" });
                }}
              >
                TXT
              </NavDropdown.Item>
            </NavDropdown>

            {this.state.format === "txt" ? (
              <>
                <p className="mx-3 mt-2">Caracter Separador</p>
                <NavDropdown
                  style={{ width: "15%", padding: 0 }}
                  className="custom-select"
                  title={this.state.caracter}
                  id="nav-dropdown"
                >
                  <NavDropdown.Item
                    eventKey="4.2"
                    onClick={() => {
                      this.setState({ caracter: `tab` });
                    }}
                  >
                    TAB (Tabulacion)
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    eventKey="4.2"
                    onClick={() => {
                      this.setState({ caracter: `doubleComma` });
                    }}
                  >
                    " " (doble comilla)
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    eventKey="4.3"
                    onClick={() => {
                      this.setState({ caracter: `semicolon` });
                    }}
                  >
                    ; (punto y coma)
                  </NavDropdown.Item>
                </NavDropdown>
                <p className="mx-3 mt-2">Caracter Especial</p>
                <TextInput
                  required="true"
                  controlId={this.state.specialCharacter}
                  name={this.state.specialCharacter}
                  inputType="text"
                  value={this.state.specialCharacter}
                  onChange={this.handleInputSpecialCharacter}
                />
              </>
            ) : (
              <></>
            )}
            {this.state.format === "csv" ? (
              <>
                <p className="mx-3 mt-2">Caracter Separador</p>
                <NavDropdown
                  style={{ width: "15%", padding: 0 }}
                  className="custom-select"
                  title={this.state.caracter}
                  id="nav-dropdown"
                >
                  <NavDropdown.Item
                    eventKey="4.1"
                    onClick={() => {
                      this.setState({ caracter: `comma` });
                    }}
                  >
                    , (coma)
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    eventKey="4.3"
                    onClick={() => {
                      this.setState({ caracter: `semicolon` });
                    }}
                  >
                    ; (punto y coma)
                  </NavDropdown.Item>
                </NavDropdown>
                <p className="mx-3 mt-2">Caracter Especial</p>
                <TextInput
                  required="true"
                  controlId={this.state.specialCharacter}
                  name={this.state.specialCharacter}
                  inputType="text"
                  value={this.state.specialCharacter}
                  onChange={this.handleInputSpecialCharacter}
                />
              </>
            ) : (
              <></>
            )}
          </div>

          <div className="d-flex m-3">
            <Form className="w-100" onSubmit={this.handleSubmit}>
              <Table responsive borderless hover className="accounts-table">
                <thead>
                  <tr className="bg-orange-light">
                    <th></th>
                    <th className="text-center">Posición / Columna</th>
                    <th className="text-center">Longitud Campo</th>
                    <th className="text-center">Ignorar</th>
                    <th className="text-center">Obligatorio</th>
                    <th className="text-center">Valor Único</th>
                    <th className="text-center">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {itemsTable.map((acc, idx) => (
                    <tr key={idx}>
                      <td style={{ width: "25%" }}>{acc}</td>
                      {this.state.valorCheck[acc] ||
                      this.state.ignorarCheck[acc] ? (
                        <>
                          <td style={{ width: "10%" }}>
                            <TextInput
                              controlId={acc}
                              name={acc}
                              disabled={true}
                              inputType="number"
                              value={this.state.itemsTable[acc]}
                              onChange={this.handleInputIdentificacion}
                            />
                          </td>

                          {this.state.valorCheck[acc] ||
                          this.state.ignorarCheck[acc] ||
                          acc === "CPA" ||
                          acc === "Entrega Domicilio" ||
                          acc === "Cantidad De Piezas" ||
                          acc === "Peso Total De La Solicitud" ? (
                            <td
                              className="text-center"
                              style={{ width: "10%" }}
                            >
                              <TextInput
                                controlId={acc}
                                name={acc}
                                value={this.state.longitudes[acc]}
                                disabled={true}
                                inputType="number"
                                onChange={this.handleInputLongitudes}
                              />
                            </td>
                          ) : (
                            <td
                              className="text-center"
                              style={{ width: "10%" }}
                            >
                              <TextInput
                                controlId={acc}
                                name={acc}
                                inputType="number"
                                value={this.state.longitudes[acc]}
                                onChange={this.handleInputLongitudes}
                              />
                            </td>
                          )}
                        </>
                      ) : (
                        <>
                          <td style={{ width: "10%" }}>
                            <TextInput
                              controlId={acc}
                              name={acc}
                              inputType="number"
                              value={this.state.itemsTable[acc]}
                              onChange={this.handleInputIdentificacion}
                            />
                          </td>
                          {acc === "CPA" ||
                          acc === "Entrega Domicilio" ||
                          acc === "Cantidad De Piezas" ||
                          acc === "Peso Total De La Solicitud" ? (
                            <td
                              className="text-center"
                              style={{ width: "10%" }}
                            >
                              <TextInput
                                controlId={acc}
                                name={acc}
                                value={this.state.longitudes[acc]}
                                disabled={true}
                                inputType="number"
                                onChange={this.handleInputLongitudes}
                              />
                            </td>
                          ) : (
                            <td
                              className="text-center"
                              style={{ width: "10%" }}
                            >
                              <TextInput
                                controlId={acc}
                                name={acc}
                                inputType="number"
                                value={this.state.longitudes[acc]}
                                onChange={this.handleInputLongitudes}
                              />
                            </td>
                          )}
                        </>
                      )}
                      {this.state.valorCheck[acc] &&
                      acc !== "Entrega Domicilio" ? (
                        <></>
                      ) : (
                        <></>
                      )}
                      <td className="text-center">
                        <CustomCheckbox
                          name={acc}
                          value={this.state.ignorarCheck[acc]}
                          checked={this.state.ignorarCheck[acc]}
                          onChange={this.handleCheckboxIgnorarCheck}
                        />
                      </td>
                      <td className="text-center">
                        <CustomCheckbox
                          name={acc}
                          id={idx}
                          type="checkbox"
                          disabled={true}
                        />
                      </td>
                      <td className="text-center">
                        <CustomCheckbox
                          name={acc}
                          value={this.state.valorCheck[acc]}
                          checked={this.state.valorCheck[acc]}
                          onChange={this.handleCheckboxDefaultValueCheck}
                        />
                      </td>
                      {this.state.valorCheck[acc] &&
                      acc !== "Entrega Domicilio" ? (
                        <td style={{ width: "12%" }} className="text-center">
                          <TextInput
                            controlId={acc}
                            name={acc}
                            onChange={this.handleInputValorCheck}
                            inputType="text"
                            value={this.state.inputUnique[acc]}
                          />
                        </td>
                      ) : acc === "Entrega Domicilio" &&
                        this.state.valorCheck[acc] ? (
                        <td>
                          SI
                        </td>
                      ) : acc === "Entrega Domicilio" &&
                        this.state.ignorarCheck[acc] ? (
                        <td>
                          NO
                        </td>
                      ) : (
                        <td></td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div
                style={{ gap: "10px" }}
                className="d-flex justify-content-center align-items-center w-50 mr-auto ml-auto"
              >
                {this.state.btnActualizar ? (
                  <ActionButton onClick={this.UpadateInfo}>
                    Actualizar
                  </ActionButton>
                ) : (
                  <ActionButton type="submit">Aceptar</ActionButton>
                )}

                <br />
                <br />
                <ActionButton
                  secondary
                  onClick={() => {
                    history.push({
                      pathname: "/account-modification",
                    });
                  }}
                >
                  Volver
                </ActionButton>
              </div>
            </Form>
          </div>
        </Container>
      </>
    );
  }
}
const mapDispatchToProps = ({ auth, user }) => ({ auth, user });
export default compose(
  connect(mapDispatchToProps, { ...authActions, ...userActions }),
  withTranslation()
)(FormatModification);
