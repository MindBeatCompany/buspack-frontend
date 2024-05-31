import "./styles.scss";
import { Link} from "react-router-dom"

const DashboardModule = ({ title, url }) => {
  return (
    <Link to={url}>
      <div className="dashmodule-card text-center ">
        <div className="dash-box bg-primary"></div>
        <p>{title}</p>
      </div>
    </Link>
  );
};

export default DashboardModule;
