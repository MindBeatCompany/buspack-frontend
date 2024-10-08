// PrintLabel Component

import React from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";
import { Col, Row, Container } from "react-bootstrap";
import { authActions } from "../../state/ducks/auth";
import { printLabelActions } from "../../state/ducks/printLabel";
import ScreenNav from "../../components/ScreenNav";
import { GenericTable } from "../../components";
import FormPieces from "./components/FormPieces/FormPieces";
import BadgeForStatus from "../../components/BadgeForStatus";
import FileSaver from "file-saver";

// Function to map data out for print
function mapDataOut(data, ecoCode) {
    return {
        idRequest: data[6],
        pieceId: data[0],
        shipping: data[7],
        cpa: data[3],
        recipient: data[1],
        address: data[2],
        status: data[9].props.state,
        ecoCode,
        city: data[4],
        province: data[5],
    };
}

class PrintLabel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditing: false,
            theaders: [
                this.props.t("printLabelTable.piece"),
                this.props.t("printLabelTable.name"),
                this.props.t("printLabelTable.address"),
                this.props.t("printLabelTable.cpa"),
                this.props.t("printLabelTable.city"),
                this.props.t("printLabelTable.province"),
                this.props.t("printLabelTable.idRequest"),
                this.props.t("printLabelTable.shipping"),
                this.props.t("printLabelTable.tracking"),
                this.props.t("Telefono"),
                this.props.t("Observaciones"),
                this.props.t("Origin"),
            ],
            bodyRows: [],
            selectedRowsToPrint: [],
            showTable: false,
        };
        this.onChange = this.onChange.bind(this);
        this.onChangeAll = this.onChangeAll.bind(this);
        this.printTickets = this.printTickets.bind(this);
        this.printTickets2 = this.printTickets2.bind(this);
        this.printTickets3 = this.printTickets3.bind(this);
        this.printTickets4 = this.printTickets4.bind(this);
        this.clearSelectedRows = this.clearSelectedRows.bind(this);
    }

    // Clear selected rows
    clearSelectedRows() {
        this.setState({ selectedRowsToPrint: [] });
    }

    // Handle row selection
    onChange(e) {
        const value = Number(e.target.value);
        const checked = e.target.checked;
        const { selectedRowsToPrint } = this.state;
        if (checked) {
            this.setState({
                selectedRowsToPrint: [...selectedRowsToPrint, value],
            });
        } else {
            this.setState({
                selectedRowsToPrint: selectedRowsToPrint.filter(
                    (r) => r !== value
                ),
            });
        }
    }

    // Handle select all rows
    onChangeAll(e) {
        const checked = e.target.checked;
        const { bodyRows } = this.state;
        if (checked) {
            this.setState({
                selectedRowsToPrint: bodyRows.map((row, idx) => idx),
            });
        } else {
            this.setState({
                selectedRowsToPrint: [],
            });
        }
    }

    // Handle the response from API
    handleResponse(data) {
        const bodyRowsTransformed = [];
        const textMock = {
            ["Pieza a retirar en Cliente"]: "PROCESANDO SU PEDIDO",
            ["Pieza en manos del Transportista"]: "EN CAMINO",
            ["En Agencia Origen"]: "EN SUCURSAL DE DESTINO",
            ["En camino"]: "EN SUCURSAL DE DESTINO",
            ["En Camino"]: "EN DISTRIBUCION",
            ["Entregado"]: "ENTREGADO",
        };
        data.data.forEach((row) => {
            const {
                address,
                cpa,
                city,
                observations,
                phone,
                province,
                recipientFullname,
                requestId,
                voucher,
                shipping,
                pieceId,
                origin,
            } = row;
            let newObj = {
                pieces: pieceId,
                recipientFullname,
                address,
                cpa,
                city,
                province,
                idRequest: requestId,
                shipping,
                voucher,
                status: <BadgeForStatus state={textMock[row.status]} />,
                phone,
                observations,
                origin,
            };
            bodyRowsTransformed.push([...Object.values(newObj)]);
        });

        this.setState({ bodyRows: bodyRowsTransformed });
    }

    // Original print function
    printTickets(e) {
        e.preventDefault();
        this.sendToPrint("print-labels/pdfA4");
    }

    // Additional print functions
    printTickets2(e) {
        e.preventDefault();
        this.sendToPrint("print-labels/pdf10x20");
    }

    printTickets3(e) {
        e.preventDefault();
        this.sendToPrint("print-labels/pdf10x15");
    }

    printTickets4(e) {
        e.preventDefault();
        this.sendToPrint("print-labels/pdf10x10");
    }

    // Common function to send data for printing
    sendToPrint(url) {
        const { selectedRowsToPrint } = this.state;
        const {
            auth: { userData },
            user,
            sendToPrint,
        } = this.props;

        const arrayOfData = selectedRowsToPrint
            .map((num) => this.state.bodyRows[num])
            .map((data) => {
                return {
                    ...mapDataOut(data, userData.codeECO),
                    companyName: userData.account.companyName,
                    clientName: userData.userName,
                    ed: data[7] === "Entrega en domicilio" ? "ED" : "",
                    voucher: data[8],
                    phone: data[10],
                    observations: data[11],
                    origin: data[12],
                };
            });
        sendToPrint({
            url,
            data: arrayOfData,
            callback: (blob) => {
                FileSaver.saveAs(blob, "etiquetas.pdf");
            },
        });
    }
    filterOutLastThree = (array) => {
        return array.slice(0, -3);
    };

    filterOutLastThreeBodyRows = (array) => {
        return array.map(row => row.slice(0, -3));
    };

    render() {
        const {
            t,
            history,
            auth: { userData },
            getPrintLabel,
        } = this.props;
        const { theaders, bodyRows } = this.state;
        return (
            <Container fluid className="pl-5 pr-5">
                <Row className="mt-4">
                    <Col>
                        <h1>{t("printLabelScreen.title")}</h1>
                        <ScreenNav
                            history={history}
                            previousPage={t("home")}
                            previousUrlPage="/home"
                            currentPage={t("printLabelScreen.title")}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <FormPieces
                            setShowTable={() => {
                                this.setState({ showTable: true });
                                this.clearSelectedRows();
                            }}
                            showTable={this.state.showTable}
                            printTickets={this.printTickets}
                            printTickets2={this.printTickets2}
                            printTickets3={this.printTickets3}
                            printTickets4={this.printTickets4}
                            getPrintLabel={getPrintLabel}
                            handleResponse={(data) => this.handleResponse(data)}
                        />
                    </Col>
                    <Col className="mt-3">
                        {this.state.showTable && (
                            <GenericTable
                                showState={false}
                                theads={this.filterOutLastThree(theaders)}
                                bodyRows={this.filterOutLastThreeBodyRows(bodyRows)}
                                selectable={true}
                                selectedRowsToPrint={
                                    this.state.selectedRowsToPrint
                                }
                                onChangeSelectable={($event) => {
                                    this.onChange($event);
                                }}
                                onChangeAllSelectable={($event) => {
                                    this.onChangeAll($event);
                                }}
                                t={t}
                            ></GenericTable>
                        )}
                    </Col>
                </Row>
            </Container>
        );
    }
}

const mapDispatchToProps = ({ auth, printLabels, user, tracking }) => ({
    auth,
    printLabels,
    user,
    tracking,
});
export default compose(
    connect(mapDispatchToProps, { ...authActions, ...printLabelActions }),
    withTranslation()
)(PrintLabel);

