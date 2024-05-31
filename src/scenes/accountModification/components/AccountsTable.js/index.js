import React, { useState } from "react";
import { Table, Row, Col } from "react-bootstrap";
import "./styles.scss";
import {
  ArrowToggleDown,
  ArrowToggleUp,
  EditIcon,
  ShareIcon,
  LocationIcon,
} from "../../../../resources/icons";
import { ActionButton } from "../../../../components";
import CustomCheckbox from "../../../../components/CustomCheckbox/CustomCheckbox";
import SortData from "../../../../helpers/sortData";
import ZoneandratesIcon from "../../../../resources/icons/ZonesandratesIcon";

const AccountsTable = ({
  accounts,
  t,
  auth: {
    userData: { id },
  },
  handleEdit,
  handleFormatModification,
  handleZoneAndRates,
  handleLocationModification,
  onChangeDeactivate,
  handleSubmit,
  toDeactivate,
}) => {
  const [sorting, setSorting] = useState([false, ""]);

  const { items, requestSort } = SortData(accounts, {
    key: "codeECO",
    direction: "ascending",
  });
  const applySort = (colName) => {
    requestSort(colName);
    setSorting([!sorting[0], colName]);
  };
  console.log("Estoy en accountsTable", accounts);
  return (
    <>
      <Table responsive borderless hover className="accounts-table">
        <thead>
          <tr>
            <th onClick={() => applySort("codeECO")}>
              {t("accountModificationScreen.codeEco")}
              {sorting[0] && sorting[1] === "codeECO" ? (
                <ArrowToggleUp width="14" />
              ) : (
                <ArrowToggleDown width="14" />
              )}
            </th>
            <th onClick={() => applySort("companyName")}>
              Compañía{" "}
              {sorting[0] && sorting[1] === "companyName" ? (
                <ArrowToggleUp width="14" />
              ) : (
                <ArrowToggleDown width="14" />
              )}
            </th>
            <th onClick={() => applySort("accountType")}>
              Tipo{" "}
              {sorting[0] && sorting[1] === "accountType" ? (
                <ArrowToggleUp width="14" />
              ) : (
                <ArrowToggleDown width="14" />
              )}
            </th>
            <th>Inactivar</th>
            <th>{t("action")} </th>
          </tr>
        </thead>
        <tbody>
          {items.map((acc, idx) => (
            <tr key={idx}>
              <td>{acc.codeECO}</td>
              <td>{acc.companyName}</td>
              <td>{acc.accountType} </td>
              <td className="text-left">
                <CustomCheckbox
                  name={acc.id}
                  checked={toDeactivate.includes(acc.id.toString())}
                  onChange={onChangeDeactivate}
                  disabled={id === acc.id}
                />
              </td>

              <td className="text-center text-warning">
                <EditIcon
                  onClick={() => handleEdit(acc)}
                  width="23"
                  height="20"
                />
                <span className=""></span>
                <ShareIcon
                  onClick={() => handleFormatModification(acc)}
                  width="23"
                  height="20"
                />
                <span className="mx-1"></span>
                <ZoneandratesIcon
                  onClick={() => handleZoneAndRates(acc)}
                  width="23"
                  height="20"
                />
                {/* <LocationIcon
                onClick={() => handleLocationModification(acc)}
                width="23"
                height="20"
                /> */}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {toDeactivate.length !== 0 && (
        <Row className="justify-content-end mt-4 mb-3">
          <Col xs={4} className="text-right">
            <ActionButton width="100" onClick={handleSubmit}>
              {" "}
              {t("saveChanges")}{" "}
            </ActionButton>
          </Col>
        </Row>
      )}
    </>
  );
};

export default AccountsTable;
