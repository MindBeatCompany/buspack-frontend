import { getIconColor } from "./getIconColor";

const ArrowToggleUp = ({ width, height, type }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={`${width ? width : "16"}`}
      height={`${height ? height : "7"}`}
      fill={type ? getIconColor(type) : "#ffffff"}
      version="1.1"
      viewBox="0 0 16 7"
    >
      <path
        fill=""
        fillRule="evenodd"
        d="M.275 6.734c.386.338 1.033.356 1.446.04L8 1.983l6.279 4.793c.413.315 1.06.297 1.446-.04.385-.339.363-.868-.05-1.184L8.698.225c-.393-.3-1.003-.3-1.396 0L.325 5.551c-.413.316-.435.845-.05 1.183z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};
export default ArrowToggleUp;
