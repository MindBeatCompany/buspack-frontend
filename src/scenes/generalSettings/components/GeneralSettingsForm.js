import React, { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { ActionButton, TextInput } from "../../../components";
import "./GeneralSettingsForm.scss";
import Swal from "sweetalert2";
/**
 * ID Agencia de Origen, tipo numero sin decimales, id_agencia_origen idAgenciaOrigen
Nombre Agencia, tipo texto, desc_agencia_origen descAgenciaOrigen
Domicilio Agencia, tipo texto, domicilio_agencia_origen domicilioAgenciaOrigen
Telefono Agencia , tipo texto, telefono_agencia_origen telefonoAgenciaOrigen
Código Postal Agencia, tipo texto, cp_agencia_origen cpAgenciaOrigen
ID Lugar de Origen, tipo numero sin decimales, idog_lugar_origen idLugarOrigen
Lugar de Origen, tipo texto, desc_lugar_origen descLugarOrigen
ID Seguro, tipo numero sin decimales, id_seguro idSeguro
Letra Comprobante, tipo texto, letra_comprobante letraComprobante
Boca Comprobante, tipo texto, boca_comprobante bocaComprobante
ID Retiro a Domicilio, tipo numero sin decimales, idretiro_a_domicilio idRetiroADomicilio
ID Entrega a Domicilio, tipo numero sin decimales, id_entrega_domicilio idEntregaDomicilio
 * @param {*} param0 
 * @returns 
 */
const GeneralSettingsForm = ({ t, update, create, getSettings, history }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [updating, setUpdating] = useState(false);
  const mapDataToState = (data) => ({
    idSeguro: parseInt(data.idSeguro),
    idRetiroADomicilio: parseInt(data.idRetiroADomicilio),
    idEntregaDomicilio: parseInt(data.idEntregaDomicilio),
    idLugarOrigen: parseInt(data.idLugarOrigen),
    letraComprobante: data.letraComprobante,
    bocaComprobante: data.bocaComprobante,
    descLugarOrigen: data.descLugarOrigen,
    idAgenciaOrigen: parseInt(data.idAgenciaOrigen),
    descAgenciaOrigen: data.descAgenciaOrigen,
    domicilioAgenciaOrigen: data.domicilioAgenciaOrigen,
    telefonoAgenciaOrigen: data.telefonoAgenciaOrigen,
    cpAgenciaOrigen: data.cpAgenciaOrigen,
    otrosImportes: parseInt(data.otrosImportes),
    id:0
  });
  const handleFetchAccounts=()=> {
    const callback = (data) => {
      if (data.success) {
        setInitialValues({
          ...mapDataToState(data.data)
        });
        
        setUpdating(true);
      } 
    };
    getSettings({callback:callback});
  }

  useEffect(() => {
    handleFetchAccounts();
  }, []);

  const handleEditMode = () => {
    if(isEditing){
      handleFetchAccounts();
    }
    setIsEditing(!isEditing);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    Swal.fire({
      title: t("saveChangesQuestion"),
      showDenyButton: true,
      icon: "warning",
      confirmButtonText: t("modalButtons.accept"),
      confirmButtonColor: "#F28E2A",
      denyButtonText: t("modalButtons.cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        if (updating) {
          update(mapDataToState(initialValues));
        } else {
          create(initialValues);
        }
        setIsEditing(!isEditing);
        Swal.fire({
          title: t("changesHaveBeenSaved"),
          icon: "success",
          confirmButtonText: "Cerrar",
          confirmButtonColor: "#F28E2A",
        }).then((res) => {
        });
      } else {
        //this.handleReset();
        setIsEditing(false);
      }
    });
  };
  const handleChange=(event) =>{ 
    setInitialValues({
      ...initialValues,
      [event.target.name]: event.target.value,
    });
  }
  return (
    <Form onSubmit={handleSubmit} className="general-settings-form">
      <Row className="mt-3">
        <Col xs={12} md={4} lg={3} className="form-col">
          <TextInput
            label={t("formLabels.originPlace")}
            controlId="descLugarOrigen"
            name="descLugarOrigen"
            onChange={handleChange}
            inputType="text"
            placeholder={
              t("formLabels.placeHolder.enter") + t("formLabels.originPlace")
            }
            value={initialValues.descLugarOrigen}
            readOnly={!isEditing}
          />
        </Col>
        <Col xs={12}  md={4} lg={3} className="form-col">
          <TextInput
            label={t("formLabels.originPlaceId")}
            controlId="idLugarOrigen"
            name="idLugarOrigen"
            onChange={handleChange}
            inputType="number"
            placeholder={
              t("formLabels.placeHolder.enter") + t("formLabels.originPlaceId")
            }
            value={initialValues.idLugarOrigen}
            readOnly={!isEditing}
          />
        </Col>
        <Col xs={12}  md={4} lg={3} className="form-col">
          <TextInput
            label={t("formLabels.secureId")}
            controlId="idSeguro"
            name="idSeguro"
            onChange={handleChange}
            inputType="number"
            placeholder={
              t("formLabels.placeHolder.enter") + t("formLabels.secureId")
            }
            value={initialValues.idSeguro}
            readOnly={!isEditing}
          />
        </Col>
        <Col xs={12}  md={4} lg={3} className="form-col">
          <TextInput
            label={t("formLabels.voucherLetter")}
            controlId="letraComprobante"
            name="letraComprobante"
            onChange={handleChange}
            inputType="text"
            placeholder={
              t("formLabels.placeHolder.enter") + t("formLabels.voucherLetter")
            }
            value={initialValues.letraComprobante}
            readOnly={!isEditing}
          />
        </Col>
        <Col xs={12}  md={4} lg={3} className="form-col">
          <TextInput
            label={t("formLabels.voucherPoint")}
            controlId="bocaComprobante"
            name="bocaComprobante"
            onChange={handleChange}
            inputType="text"
            placeholder={
              t("formLabels.placeHolder.enter") + t("formLabels.voucherPoint")
            }
            value={initialValues.bocaComprobante}
            readOnly={!isEditing}
          />
        </Col>
        <Col xs={12}  md={4} lg={3} className="form-col">
          <TextInput
            label={t("formLabels.takeAwayId")}
            controlId="idRetiroADomicilio"
            name="idRetiroADomicilio"
            onChange={handleChange}
            inputType="number"
            placeholder={
              t("formLabels.placeHolder.enter") + t("formLabels.takeAwayId")
            }
            value={initialValues.idRetiroADomicilio}
            readOnly={!isEditing}
          />
        </Col>
        <Col xs={12}  md={4} lg={3} className="form-col">
          <TextInput
            label={t("formLabels.homeDeliveryId")}
            controlId="idEntregaDomicilio"
            name="idEntregaDomicilio"
            onChange={handleChange}
            inputType="number"
            placeholder={
              t("formLabels.placeHolder.enter") + t("formLabels.homeDeliveryId")
            }
            value={initialValues.idEntregaDomicilio}
            readOnly={!isEditing}
          />
        </Col>
        <Col xs={12}  md={4} lg={3} className="form-col">
          <TextInput
            label={t("formLabels.originAgencyId")}
            controlId="idAgenciaOrigen"
            name="idAgenciaOrigen"
            onChange={handleChange}
            inputType="number"
            placeholder={
              t("formLabels.placeHolder.enter") + t("formLabels.originAgencyId")
            }
            value={initialValues.idAgenciaOrigen}
            readOnly={!isEditing}
          />
        </Col>
        <Col xs={12}  md={4} lg={3} className="form-col">
          <TextInput
            label={t("formLabels.agencyName")}
            controlId="descAgenciaOrigen"
            name="descAgenciaOrigen"
            onChange={handleChange}
            inputType="text"
            placeholder={
              t("formLabels.placeHolder.enter") + t("formLabels.agencyName")
            }
            value={initialValues.descAgenciaOrigen}
            readOnly={!isEditing}
          />
        </Col>
        <Col xs={12}  md={4} lg={3} className="form-col">
          <TextInput
            label={t("formLabels.agencyAddress")}
            controlId="domicilioAgenciaOrigen"
            name="domicilioAgenciaOrigen"
            onChange={handleChange}
            inputType="text"
            placeholder={
              t("formLabels.placeHolder.enter") + t("formLabels.agencyAddress")
            }
            value={initialValues.domicilioAgenciaOrigen}
            readOnly={!isEditing}
          />
        </Col>
        <Col xs={12}  md={4} lg={3} className="form-col">
          <TextInput
            label={t("formLabels.agencyPhone")}
            controlId="telefonoAgenciaOrigen"
            name="telefonoAgenciaOrigen"
            onChange={handleChange}
            inputType="text"
            placeholder={
              t("formLabels.placeHolder.enter") + t("formLabels.agencyPhone")
            }
            value={initialValues.telefonoAgenciaOrigen}
            readOnly={!isEditing}
          />
        </Col>
        <Col xs={12}  md={4} lg={3} className="form-col">
          <TextInput
            label={t("formLabels.agencyZipCode")}
            controlId="cpAgenciaOrigen"
            name="cpAgenciaOrigen"
            onChange={handleChange}
            inputType="text"
            placeholder={
              t("formLabels.placeHolder.enter") + t("formLabels.agencyZipCode")
            }
            value={initialValues.cpAgenciaOrigen}
            readOnly={!isEditing}
            style={{width:'100%'}}
          />
        </Col>
        <Col xs={12}  md={4} lg={3} className="form-col">
          <TextInput
            label={t("formLabels.otherAmounts")}
            controlId="otrosImportes"
            name="otrosImportes"
            onChange={handleChange}
            inputType="number"
            placeholder={
              t("formLabels.placeHolder.enter") + t("formLabels.otherAmounts")
            }
            value={initialValues.otrosImportes}
            readOnly={!isEditing}
            style={{width:'100%'}}
          />
        </Col>
      </Row>
      <Row className="mt-3 mb-4 justify-content-left">
        <Col xs={12} md={12} lg={6}>
          {isEditing ? (
            <Row>
              <Col xs={4} md={4} lg={4} className="pl-0">
                <ActionButton
                  onClick={handleEditMode}
                  secondary
                  width="100"
                  type="submit"
                >
                  {t("cancel")}
                </ActionButton>
              </Col>
              <Col xs={8} md={8} lg={8} className="pr-0">
                <ActionButton width="100" type="submit">
                  {t("saveChanges")}
                </ActionButton>
              </Col>
            </Row>
          ) : (
            <ActionButton width="100" onClick={handleEditMode} secondary>
              {t("edit")}
            </ActionButton>
          )}
        </Col>
      </Row>
    </Form>
  );
};

export default GeneralSettingsForm;
