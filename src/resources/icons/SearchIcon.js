import React from "react";

function SearchIcon({ width, height, onClick }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width ? width : "24"}
      height={height ? height : "25"}
      fill="none"
      onClick={onClick}
      viewBox="0 0 24 25"
    >
      <path
        fill="#BAB5B5"
        fillRule="evenodd"
        d="M17 9.5a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0zm-2.098 7.816A9.457 9.457 0 019.5 19 9.5 9.5 0 1119 9.5c0 2.518-.98 4.807-2.579 6.507l7.286 7.286a1 1 0 01-1.414 1.414l-7.391-7.391z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}

export default SearchIcon;
