import React from "react";
import { Link } from "@material-ui/core";

// AGPL-3.0 §13 requires offering the source to network users; set REACT_APP_SOURCE_CODE_URL at build time.
const SOURCE_CODE_URL = process.env.REACT_APP_SOURCE_CODE_URL;

const style = {
  position: "fixed",
  bottom: 0,
  left: 0,
  zIndex: 1100,
  padding: "4px 12px",
  fontSize: 11,
  color: "#5B6778",
  backgroundColor: "rgba(245, 246, 248, 0.9)",
  borderTopRightRadius: 6,
};

const ExternalLink = ({ href, children }) => (
  <Link href={href} target="_blank" rel="noopener noreferrer">
    {children}
  </Link>
);

const AttributionFooter = () => (
  <footer style={style}>
    © Etech · Etech Insure is based on <ExternalLink href="https://openimis.org">openIMIS</ExternalLink> ·{" "}
    <ExternalLink href="https://www.gnu.org/licenses/agpl-3.0.html">GNU AGPL v3</ExternalLink>
    {SOURCE_CODE_URL && (
      <>
        {" "}
        · <ExternalLink href={SOURCE_CODE_URL}>Source code</ExternalLink>
      </>
    )}{" "}
    · No warranty
  </footer>
);

export default AttributionFooter;
