import React, { useEffect } from "react";
import "./PreLoadTable.scss";
import { Table } from "react-bootstrap";
import { CustomCheckbox } from "../../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationCircle,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";

const PreLoadTable = ({
  theads,
  bodyRows,
  centeredTd,
  centeredTh,
  selectable,
  onChangeSelectable,
  buildRow,
  serviceOrder,
  t,
}) => {
  useEffect(() => {
    buildRow();
    //eslint-disable-next-line
  }, [serviceOrder.serviceOrderList]);

  const getIcon = (status) => {
    switch (status) {
      case "danger":
        return faExclamationCircle;
      case "warning":
        return faExclamationTriangle;

      default:
        break;
    }
  };

  const rowHasError = (row) => {
    console.log(row);
    return row.some((col) => col.status !== "ok");
  };

  return (
    <>
      <Table responsive borderless hover className="generic-table">
        <thead>
          <tr>
            {selectable && <th> </th>}
            {theads.map((header, idx) => (
              <th key={idx} className={`${centeredTh && "text-center"}`}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((rows, rowIdx) => (
            <tr key={rowIdx}>
              {selectable && (
                <td className={`${centeredTd && "text-center"}`} key={rowIdx}>
                  <CustomCheckbox
                    onChange={onChangeSelectable}
                    name=""
                    value={rowIdx}
                  />
                </td>
              )}
              {rows.map((col, idx) => (
                <td key={idx} className={`${centeredTd && "text-center"}`}>
                  {rowHasError(rows) && idx === 0 ? (
                    <FontAwesomeIcon
                      className={`mr-2 text-danger`}
                      icon={getIcon("danger")}
                    />
                  ) : null}
                  {col.value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
      {bodyRows.length === 0 && (
        <div className="text-center">
          <span>
            <strong>{t("thereAreNotElementsToShow")}</strong>
          </span>
        </div>
      )}
    </>
  );
};

export default PreLoadTable;
