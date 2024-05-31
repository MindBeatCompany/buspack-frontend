import { Col, Row } from "react-bootstrap";
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";
import { authActions } from "../../state/ducks/auth";
import { userActions } from "../../state/ducks/user";
import { generalSettingsActions } from "../../state/ducks/generalSettings";
import GeneralSettingsForm from "./components/GeneralSettingsForm";


class GeneralSettings extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { t, createSettings, updateSettings, getSettings, history } = this.props;
    return (
      <Row className="general-set-container">
        <Col>
          <Row>
            <Col className="mt-4">
              <h2> {t("sideBar.generalSettings")} </h2>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <GeneralSettingsForm
                t={t}
                history={history}
                getSettings={getSettings}
                update={(data) => {
                  updateSettings({
                    data,
                    callback: ({ success }) => {
                    },
                  });
                }}
                create={(data) => {
                  createSettings({
                    data,
                    callback: ({ success }) => {
                    },
                  });
                }}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}
const mapDispatchToProps = ({ auth, user, generalSettings }) => ({ auth, user, generalSettings });
export default compose(
  connect(mapDispatchToProps, { ...authActions, ...userActions, ...generalSettingsActions }),
  withTranslation()
)(GeneralSettings);
