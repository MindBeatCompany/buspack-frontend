const TrashIcon = ({ onClick, select }) => {
  return (
    <svg
      onClick={select ? null : onClick}
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="27"
      fill={select ? "#9A9A9A" : "#22324e"}
      viewBox="0 0 25 27"
    >
      <path
        fill=""
        d="M21.003 3.375H17.46V1.967C17.454.881 16.6 0 15.547 0H8.453C7.4 0 6.546.88 6.546 1.967v1.408H3.002C1.345 3.375 0 4.762 0 6.471v2.81c0 .464.368.844.818.844h1.366v13.78C2.184 25.612 3.529 27 5.186 27H18.82c1.656 0 3.001-1.387 3.001-3.096V10.125h1.366c.45 0 .818-.38.818-.844v-2.81c-.005-1.71-1.35-3.096-3.002-3.096zM8.183 1.967c0-.153.122-.28.27-.28h7.094c.148 0 .27.127.27.28v1.408H8.183V1.967zm12.002 21.938c0 .775-.614 1.407-1.365 1.407H5.18c-.751 0-1.365-.632-1.365-1.408V10.125H20.18v13.78h.005zm2.178-15.468H1.636V6.471c0-.776.614-1.409 1.366-1.409h18.001c.752 0 1.366.633 1.366 1.409v1.966h-.006z"
      ></path>
      <path
        fill=""
        d="M12.003 22.502c.45 0 .818-.38.818-.844v-7.314c0-.464-.368-.844-.818-.844-.45 0-.819.38-.819.844v7.314a.83.83 0 00.819.844zM7.364 22.502c.45 0 .818-.38.818-.844v-7.314c0-.464-.368-.844-.818-.844-.45 0-.818.38-.818.844v7.314c0 .464.368.844.818.844zM16.636 22.502c.45 0 .818-.38.818-.844v-7.314c0-.464-.368-.844-.818-.844-.45 0-.818.38-.818.844v7.314c0 .464.368.844.818.844z"
      ></path>
    </svg>
  );
};
export default TrashIcon;
