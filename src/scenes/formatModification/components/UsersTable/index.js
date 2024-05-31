import React, { useState } from "react";
import { Table, Row, Col, Spinner } from "react-bootstrap";
import "./styles.scss";
import {
  ArrowToggleDown,
  ArrowToggleUp,
  EditIcon,
} from "../../../../resources/icons";
import CustomCheckbox from "../../../../components/CustomCheckbox/CustomCheckbox";
import { ActionButton } from "../../../../components";
import SortData from "../../../../helpers/sortData";

const UsersTable = ({
  users,
  history,
  auth,
  onChangeRecovery,
  onChangeDeactivate,
  toRecovery,
  toDeactivate,
  handleSubmit,
  waitingResponse,
  t,
  secondaryThead,
}) => {
  const handleEdit = (acc) => {
    history.push({
      pathname: "/edit-users",
      state: acc,
    });
  };

  const {
    userData: { id },
  } = auth;

  const [sorting, setSorting] = useState([false, ""]);
  const { items, requestSort } = SortData(users, {
    key: "userName",
    direction: "ascending",
  });
  const applySort = (colName) => {
    requestSort(colName);
    setSorting([!sorting[0], colName]);
  };

  return (
    <>
      {toDeactivate && toRecovery && users && (
        <>
          <Table responsive borderless hover className="users-table">
            <thead className={`${secondaryThead ? "secondaryThead" : ""}`}>
              <tr>
                <th onClick={() => applySort("userName")}>
                  {t("formLabels.userName")}{" "}
                  {sorting[0] && sorting[1] === "userName" ? (
                    <ArrowToggleUp width="14" />
                  ) : (
                    <ArrowToggleDown width="14" />
                  )}{" "}
                </th>
                <th onClick={() => applySort("email")}>
                  {t("formLabels.email")}{" "}
                  {sorting[0] && sorting[1] === "email" ? (
                    <ArrowToggleUp width="14" />
                  ) : (
                    <ArrowToggleDown width="14" />
                  )}
                </th>
                <th onClick={() => applySort("role")}>
                  {t("formLabels.role")}{" "}
                  {sorting[0] && sorting[1] === "role" ? (
                    <ArrowToggleUp width="14" />
                  ) : (
                    <ArrowToggleDown width="14" />
                  )}
                </th>
                <th>{t("formLabels.deactivate")}</th>
                <th>{t("formLabels.recoveryPassword")} </th>
                <th>{t("edit")} </th>
              </tr>
            </thead>
            <tbody>
              {items.map(
                (acc, idx) =>
                  acc.isActive && (
                    <tr key={idx}>
                      <td>{acc.userName}</td>
                      <td>{acc.email}</td>
                      <td>{acc.role.name} </td>
                      <td className="text-left">
                        <CustomCheckbox
                          onChange={onChangeDeactivate}
                          name={acc.id}
                          checked={toDeactivate.includes(acc.id.toString())}
                          disabled={
                            toRecovery.includes(acc.id.toString()) ||
                            acc.id === id
                          }
                        />
                      </td>

                      <td className="text-left">
                        <CustomCheckbox
                          disabled={toDeactivate.includes(acc.id.toString())}
                          name={acc.id}
                          checked={toRecovery.includes(acc.id.toString())}
                          onChange={onChangeRecovery}
                        />
                      </td>

                      <td className="text-left text-warning">
                        <EditIcon
                          type="secondaryIcon"
                          onClick={() => handleEdit(acc)}
                          width="23"
                          height="20"
                        />
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </Table>
          {toDeactivate.length !== 0 || toRecovery.length !== 0 ? (
            <Row className="justify-content-end mt-4">
              <Col xs={12} md={4} className="text-right">
                {waitingResponse ? (
                  <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                  </Spinner>
                ) : (
                  <ActionButton width="100" onClick={handleSubmit}>
                    {t("saveChanges")}
                  </ActionButton>
                )}
              </Col>
            </Row>
          ) : null}
        </>
      )}
    </>
  );
};

export default UsersTable;
