import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";
import { authActions } from "../../state/ducks/auth";
import { userActions } from "../../state/ducks/user";
import { trackingActions } from "../../state/ducks/tracking";
import { Col, Row, Spinner, Container } from "react-bootstrap";
import TrackingForm from "./components/TrackingForm";
import PackageStatusBar from "./components/PackageStatusBar";
import TicketsList from "./components/TicketsList";

class Tracking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      packageStatus: [],
      tickets: [],
      searchMode: undefined,
      loading: false,
      deliveryStatus:{}
    };
    this.changeSearchMode = this.changeSearchMode.bind(this);
  }

  componentDidMount() {
    const { getSaidToken } = this.props;
    getSaidToken({
      callback:({success})=>{
      }
    })
    this.getList(); 
  }

  getList() {
    const{ getAllDeliveries} = this.props;
    getAllDeliveries({
      callback:({success, data})=>{
        if(success){
          this.setState({ ...this.state, tickets: data })
        }
      }
    });
  }

  changeSearchMode(mode, value) {
    const { getDeliveryState, tracking } = this.props;
    if (mode) this.setState({searchMode: mode });
    if (value){
      this.setState({loading: true});
      getDeliveryState({
        data:{
          numero:value,
          token: tracking.token.token
        },
        callback:({success, data})=>{
            if(success){
              this.setState({
                ...this.state, packageStatus:data.estados,
                loading: false,
                deliveryStatus:data.estadodelivery
              })
            }
        }
      })
    }
  }

  render() {
    const { t } = this.props;
    const { packageStatus, searchMode, loading, tickets, deliveryStatus } = this.state;
    return (
      <Container fluid>
        <Row className="mt-4">
          <Col>
            <h1> {t("sideBar.tracking")} </h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <TrackingForm changeSearchMode={this.changeSearchMode} t={t} />
          </Col>
        </Row>
        {loading ? (
          <Row className="mt-5">
            <Col className="text-center">
              <Spinner animation="border" variant="warning" />
            </Col>
          </Row>
        ) : (
          <>
            {searchMode === "pieceId" && (
              <PackageStatusBar t={t} packageStatus={packageStatus} deliveryStatus={deliveryStatus}/>
            )}
            {searchMode && searchMode !== "pieceId" ? (
              <Row className="mt-5 justify-content-center">
                <Col md={12}  lg={8} className="pl-1 pr-1">
                  <TicketsList
                    t={t}
                    tickets={tickets}
                    searchMode={searchMode}
                  />
                </Col>
              </Row>
            ) : null}
          </>
        )}
      </Container>
    );
  }
}
const mapDispatchToProps = ({ auth, user, tracking }) => ({ auth, user, tracking });
export default compose(
  connect(mapDispatchToProps, { ...authActions, ...userActions, ...trackingActions}),
  withTranslation()
)(Tracking);
