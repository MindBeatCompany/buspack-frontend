import React from "react";
import PropTypes from "prop-types";
import { getIconColor } from "./getIconColor";

function ArrowToggle({ width, height, type, onClick }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={`${width ? width : "16"}`}
      height={`${height ? height : "7"}`}
      fill={type ? getIconColor(type) : "#ffffff"}
      viewBox="0 0 16 7"
      onClick={onClick}
    >
      <path
        fill=""
        fillRule="evenodd"
        d="M.275.266C.661-.072 1.308-.09 1.721.226L8 5.017 14.279.225c.413-.315 1.06-.297 1.446.04.385.339.363.868-.05 1.184L8.698 6.775c-.393.3-1.003.3-1.396 0L.325 1.449C-.088 1.133-.11.604.275.266z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}

ArrowToggle.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
};

export default ArrowToggle;
