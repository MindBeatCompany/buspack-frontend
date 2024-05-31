import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";
import { authActions } from "../../state/ducks/auth";
import { userActions } from "../../state/ducks/user";
import "./styles.scss";
class Home extends Component {

  render() {
    const {
      t,
      auth: { userData },
    } = this.props;
    const isRoot = userData.roles === "ADMINISTRADOR";
    return (
      <div id="home-scene">
        <div className="title">
          <h1>
            {t("titles.welcome")} {userData.userName}
          </h1>
          {isRoot && (
            <>
              <h2>{t("titles.adminAccAndUser").toUpperCase()}</h2>
            </>
          )}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = ({ auth, user }) => ({ auth, user });
export default compose(
  connect(mapDispatchToProps, { ...authActions, ...userActions }),
  withTranslation()
)(Home);
