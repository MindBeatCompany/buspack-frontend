import "./styles.scss";
import { Table } from "react-bootstrap";
import CustomCheckbox from "../CustomCheckbox/CustomCheckbox";

const GenericTable = ({
  showState,
  theads,
  bodyRows,
  centeredTd,
  centeredTh,
  selectable,
  onChangeSelectable,
  onChangeAllSelectable,
  selectedRowsToPrint,
  t,
}) => {  
  return (
    <>
      <Table responsive borderless hover className="generic-table">
        <thead>
          <tr>
            {selectable && 
            <th className="text-center"> 
              <CustomCheckbox
                    onChange={onChangeAllSelectable}
                    name="checkAll"
                    checked={selectedRowsToPrint.length === bodyRows.length} 
                  />
              </th>}
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
                <td className="text-center" key={rowIdx}>
                  <CustomCheckbox                  
                    onChange={onChangeSelectable}
                    name=""                    
                    checked={selectedRowsToPrint.includes(rowIdx)}
                    value={rowIdx}
                  />
                </td>
              )}
              {rows.map((col, idx) => {
                if (showState) {
                  return (
                    <td key={idx} className={`${centeredTd && "text-center"}`}>
                      {col}
                    </td>
                  );
                } else {
                  if (typeof col == "string") { // Oculto el campo de estado
                    return (
                      <td key={idx} className={`${centeredTd && "text-center"}`}>
                        {col}
                      </td>
                    );
                  }
                }
              })}
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

export default GenericTable;
