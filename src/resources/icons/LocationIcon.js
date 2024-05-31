import PropTypes from "prop-types";
import { getIconColor } from "./getIconColor";

const LocationIcon = ({ onClick, width, height, type }) => {
  return (
    <svg 
    onClick={onClick}
    xmlns="http://www.w3.org/2000/svg"
    width={`${width ? width : "28"}`}
    height={`${height ? height : "25"}`}
    fill={getIconColor(type)}
    viewBox="0 0 28 25"
    >        
        <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Outlined" transform="translate(-649.000000, -1262.000000)">
            <g id="Communication" transform="translate(100.000000, 1162.000000)">
                <g id="Outlined-/-Communication-/-location_on" transform="translate(544.000000, 98.000000)">
                    <g>
                        <polygon id="Path" points="0 0 24 0 24 24 0 24"></polygon>
                        <path d="M12,2 C8.13,2 5,5.13 5,9 C5,14.25 12,22 12,22 C12,22 19,14.25 19,9 C19,5.13 15.87,2 12,2 Z M7,9 C7,6.24 9.24,4 12,4 C14.76,4 17,6.24 17,9 C17,11.88 14.12,16.19 12,18.88 C9.92,16.21 7,11.85 7,9 Z" id="🔹-Icon-Color" fill="#1D1D1D"></path>
                        <circle id="🔹-Icon-Color" fill="#1D1D1D" cx="12" cy="9" r="2.5"></circle>
                    </g>
                </g>
            </g>
        </g>
    </g>
  </svg>
  );
};

LocationIcon.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.string,
};

export default LocationIcon;
