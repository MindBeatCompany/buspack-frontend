import React from "react";

function GoBackArrowIcon({ width, height, onClick }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width ? width : "10"}
      height={height ? height : "18"}
      fill="none"
      viewBox="0 0 10 18"
      onClick={onClick}
    >
      <path
        fill="#F28E2A"
        fillRule="evenodd"
        d="M8.85.296a1.1 1.1 0 01.054 1.555L2.604 8.6l6.3 6.75a1.1 1.1 0 01-1.608 1.5l-7-7.5a1.1 1.1 0 010-1.5l7-7.5A1.1 1.1 0 018.85.295z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}

export default GoBackArrowIcon;
