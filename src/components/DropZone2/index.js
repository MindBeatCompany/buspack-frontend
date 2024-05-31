import React, { useMemo } from "react";
import { useDropzone } from "react-dropzone";
import "./styles.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  fontSize: "1.5rem",
  paddingTop: "90px",
  paddingBottom: "90px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const activeStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

function DropZoneStandard({ setExcelUploadedStandard, setTypeExcelStandard }) {
  // console.log("ejecuto");
  console.log(setTypeExcelStandard);
  // when the file is accepted the following func'll be executed
  const onDropAccepted = (acceptedFiles) => {
    //setExcelUploaded(acceptedFiles);
    setExcelUploadedStandard(acceptedFiles);
  };

  const {
    getRootProps,
    acceptedFiles,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    //"application/vnd.ms-excel, text/plain, application/vnd.ms-excel, ",
    accept: [
      "application/vnd.ms-excel",
      "text/plain",
      "application/vnd.ms-excel",
      "application/vnd.ms-excel",
      "application/vnd.ms-excel.sheet.macroEnabled.12",
      "application/msexcel",
      "application/x-msexcel",
      "application/x-ms-excel",
      "application/x-excel",
      "application/x-dos_ms_excel",
      "application/xls",
      "text/csv",
      "application/x-xls",
      "application/x-msi",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/text/comma-separated-values",
    ],
    maxFiles: 1,
    onDropAccepted,
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  const archivos = acceptedFiles.map((archivo) => (
    <li
      key={archivo.lastModified}
      className="bg-white flex-1 p-3 mb-4 shadow-lg rounded border-success"
    >
      <p className=" text-xl">
        <b>{archivo.path}</b>
      </p>
      <div className="text-center">
        <span
          width={100}
          className="readyBtn"
          onClick={($event) => {
            $event.preventDefault();
            $event.stopPropagation();
          }}
        >
          Listo para subir <FontAwesomeIcon icon={faCheck} />
        </span>
      </div>
    </li>
  ));
  return (
    <div className="w-100">
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} disabled={!setTypeExcelStandard} />
        {isDragActive ? (
          <p className="text-center">Suelte su archivo sobre el cuadrante</p>
        ) : (
          <>
            {acceptedFiles.length === 0 ? (
              <p className="text-center">
                Arrastre su planilla hasta aquí, o bien haga click para cargar
                su archivo
              </p>
            ) : null}{" "}
          </>
        )}
        {acceptedFiles.length > 0 && <ul>{archivos} </ul>}
      </div>
    </div>
  );
}
export default DropZoneStandard;
