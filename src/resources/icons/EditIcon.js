import PropTypes from "prop-types";
import { getIconColor } from "./getIconColor";

const EditIcon = ({ onClick, width, height, type }) => {
  return (
    <button type="button" class="btn" data-toggle="tooltip" data-placement="top" title="Modificación">
      <svg
        onClick={onClick}
        xmlns="http://www.w3.org/2000/svg"
        width={`${width ? width : "28"}`}
        height={`${height ? height : "25"}`}
        fill={getIconColor(type)}
        viewBox="0 0 28 25"
      >
        <g fill="" clipPath="url(#clip0)">
          <path d="M27.065 23.157h-16.8a.933.933 0 00-.936.924c0 .509.421.925.936.925h16.8A.933.933 0 0028 24.08a.932.932 0 00-.935-.924zM25.328 4.476a2.75 2.75 0 00-.818-1.959L22.75.78c-1.058-1.046-2.905-1.046-3.957 0l-3.73 3.685-.035.035-.035.034L2.548 16.831l-.035.035-.035.035-.848.837a.925.925 0 00-.25.44L.022 23.866a.893.893 0 00.251.86.944.944 0 00.877.249l5.758-1.34a.896.896 0 00.444-.249L24.516 6.434c.52-.52.812-1.219.812-1.958zM7.57 20.563l-3.08-3.044L15.683 6.457l3.08 3.044L7.57 20.563zm-5.383 2.276l.947-3.98.035-.035 3.08 3.044-.035.035-4.027.936zm21.003-17.71l-3.104 3.067-3.08-3.045 3.103-3.067c.35-.346.965-.346 1.321 0l1.76 1.739a.912.912 0 010 1.305z"></path>
        </g>
        <defs>
          <clipPath id="clip0">
            <path fill="#fff" d="M0 0H28V25H0z"></path>
          </clipPath>
        </defs>
      </svg>
    </button>
  );
};

EditIcon.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.string,
};

export default EditIcon;
