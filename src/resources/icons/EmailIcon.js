const EmailIcon = (width, height) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height={height ? height : "20"}
      fill="none"
      viewBox="0 0 30 22"
      className="mb-1"
    >
      <path
        fill="#BAB5B5"
        fillRule="evenodd"
        d="M0 5.05A5.05 5.05 0 015.05 0h19a5.05 5.05 0 015.05 5.05v11a5.05 5.05 0 01-5.05 5.05h-19A5.05 5.05 0 010 16.05v-11zM5.05 2.1A2.95 2.95 0 002.1 5.05v11A2.95 2.95 0 005.05 19h19A2.95 2.95 0 0027 16.05v-11a2.95 2.95 0 00-2.95-2.95h-19z"
        clipRule="evenodd"
      ></path>
      <path
        fill="#BAB5B5"
        fillRule="evenodd"
        d="M27.64 3.918l-10.778 7.33a4.05 4.05 0 01-4.618-.045l-10.3-7.296 1.213-1.714 10.3 7.297a1.95 1.95 0 002.224.02L26.46 2.183l1.181 1.736z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};

export default EmailIcon;
