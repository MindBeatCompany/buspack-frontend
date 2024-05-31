import "./styles.scss"

const StatusCircle = ({number, status}) => {
  return (
    <div className={`status-circle bg-${status} text-center p-1 pt-2`}>
      <span>{number} </span>
    </div>
  );
};

export default StatusCircle;
