import React, { useState } from "react";
import { useFormik } from "formik";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";
import { Col, Spinner, Form } from "react-bootstrap";
import { authActions } from "../../../../state/ducks/auth";
import { ActionButton, AuthenticatedLink } from "../../../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
const initialValues = {
    request_id: "",
    voucher: "",
    delivery: "",
    dateFrom: "",
    dateTo: "",
};

const FormPieces = ({
    t,
    showTable,
    setShowTable,
    printTickets,
    printTickets2,
    printTickets3,
    printTickets4,
    getPrintLabel,
    handleResponse,
}) => {
    const [loading, setLoading] = useState(false);
    const [validationError, setValidationError] = useState(false);

    const formik = useFormik({
        initialValues,
        onSubmit: (values) => {
            const callback = ({ success, data }) => {
                if (success) {
                    setLoading(false);
                    handleResponse(data);
                    setShowTable();
                }
            };
            const val = Object.values(values);
            if (!val.some((v) => v.trim() !== "")) {
                setValidationError(true);
                return;
            }
            setValidationError(false);
            setLoading(true);
            getPrintLabel({
                requestId: values.request_id,
                voucher: values.voucher,
                delivery: values.delivery,
                dateFrom: values.dateFrom,
                dateTo: values.dateTo,
                callback,
            });
        },
    });

    return (
        <Form onSubmit={formik.handleSubmit}>
            <Form.Row className="mb-3">
                <Form.Group as={Col} controlId="formGridRequestId">
                    <Form.Label>{t("printLabelTable.idRequest")}</Form.Label>
                    <Form.Control
                        type="text"
                        name="request_id"
                        value={formik.values.request_id}
                        onChange={formik.handleChange}
                    />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridVoucher">
                    <Form.Label>{t("printLabelScreen.tracking")}</Form.Label>
                    <Form.Control
                        type="text"
                        name="voucher"
                        value={formik.values.voucher}
                        onChange={formik.handleChange}
                    />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridDelivery">
                    <Form.Label>{t("printLabelScreen.piece")}</Form.Label>
                    <Form.Control
                        type="text"
                        name="delivery"
                        value={formik.values.delivery}
                        onChange={formik.handleChange}
                    />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridDateFrom">
                    <Form.Label>Fecha Desde</Form.Label>
                    <Form.Control
                        type="date"
                        name="dateFrom"
                        value={formik.values.dateFrom}
                        onChange={formik.handleChange}
                    />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridDateTo">
                    <Form.Label>Fecha hasta</Form.Label>
                    <Form.Control
                        type="date"
                        name="dateTo"
                        value={formik.values.dateTo}
                        onChange={formik.handleChange}
                    />
                </Form.Group>
            </Form.Row>

            {validationError && (
                <div className="alert alert-danger">
                    <FontAwesomeIcon icon={faExclamationCircle} />{" "}
                    {t("formPieces.validationError")}
                </div>
            )}

            <div className="d-flex align-items-center">
                <ActionButton type="submit" className="mr-2" disabled={loading}>
                    {loading ? (
                        <Spinner animation="border" size="sm" />
                    ) : (
                        t("printLabelScreen.search")
                    )}
                </ActionButton>
                {showTable && (
                    <>
                        <ActionButton
                            type="button"
                            className="mr-2"
                            onClick={($event) => printTickets($event)}
                        >
                            Imprimir A4 Estandar
                        </ActionButton>

                        <ActionButton className="mr-2" onClick={printTickets2}>
                            Imprimir 10x20
                        </ActionButton>
                        <ActionButton className="mr-2" onClick={printTickets3}>
                            Imprimir 10x15
                        </ActionButton>
                        <ActionButton onClick={printTickets4}>
                            Imprimir 10x10
                        </ActionButton>
                    </>
                )}
            </div>
        </Form>
    );
};

const mapDispatchToProps = ({ auth, printLabels, user, tracking }) => ({
    auth,
    printLabels,
    user,
    tracking,
});
export default compose(
    connect(mapDispatchToProps, { ...authActions }),
    withTranslation()
)(FormPieces);
