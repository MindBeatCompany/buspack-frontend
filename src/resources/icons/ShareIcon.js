import PropTypes from "prop-types";
import { getIconColor } from "./getIconColor";

const ShareIcon = ({ onClick, width, height, type }) => {
  return (  
  <>    
    <button type="button" class="btn" data-toggle="tooltip" data-placement="top" title="Administrador de Formatos">
      <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill={getIconColor(type)} class="bi bi-share-fill" viewBox="0 0 16 16">
      <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5z"/>
      </svg>    
    </button>
  </>
  );
};

ShareIcon.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.string,
};

export default ShareIcon;
