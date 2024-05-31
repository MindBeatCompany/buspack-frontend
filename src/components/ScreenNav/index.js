import "./styles.scss";
import PropTypes from "prop-types";
import { GoBackArrowIcon } from "../../resources/icons";

const ScreenNav = ({ history, previousPage, previousUrlPage, currentPage }) => {
  //previousPage must be the previous page's title
  // currentPage must be the current page's title, where user is interacting
  //history is an reac-router's object and we use it to navigate through screens
  return (
    <div className="screen-nav">
      <h3
        className="clickeable d-inline"
        onClick={() => {
          previousUrlPage ? history.push(previousUrlPage) : history.goBack();
        }}
      >
        {previousPage} <GoBackArrowIcon />
      </h3>
      <h3 className=" d-inline"> {currentPage} </h3>
    </div>
  );
};

ScreenNav.propTypes = {
  previousPage: PropTypes.string.isRequired,
  //previousUrlPage: PropTypes.string.isRequired,
  currentPage: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
};

export default ScreenNav;
