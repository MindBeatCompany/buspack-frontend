import { createRef } from "react";
import "./styles.scss";
const AuthenticatedLink = ({ url, filename, authHeaders, children }) => {
  const link = createRef();

  const handleAction = async () => {
    if (link.current.href) {
      return;
    }

const result = await fetch(url, {
  headers: {
    ...authHeaders,
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  }
});


    const blob = await result.blob();
    const href = window.URL.createObjectURL(blob);

    link.current.download = filename;
    link.current.href = href;

    link.current.click();
  };

  return (
    <>
      <a
        className="download-link"
        role="button"
        ref={link}
        onClick={handleAction}
      >
        {children}
      </a>
    </>
  );
};
export default AuthenticatedLink;
