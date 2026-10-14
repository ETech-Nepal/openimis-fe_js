import React from "react";
import { Link } from "@material-ui/core";

// AGPL-3.0 §13 requires offering the source to network users; set REACT_APP_SOURCE_CODE_URL at build time.
const SOURCE_CODE_URL = process.env.REACT_APP_SOURCE_CODE_URL;

// Styled in etech-shell.css (docks into the left drawer when menuLeft is on).

const ExternalLink = ({ href, children }) => (
  <Link href={href} target="_blank" rel="noopener noreferrer">
    {children}
  </Link>
);

const AttributionFooter = () => (
  <footer className="etech-attribution">
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
