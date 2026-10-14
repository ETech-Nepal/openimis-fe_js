import React from "react";
import { useSelector } from "react-redux";
import { BarChart } from "@material-ui/icons";
import { MainMenuContribution } from "@openimis/fe-core";

// "Claims dashboard" menu entry and page: embeds the OpenSearch Dashboards board that
// openimis-dist_dkr/claims-dashboard keeps filled with openIMIS claims. The iframe URL
// is relative, so it keeps the published port (8445); nginx gates /opensearch/ on the
// same right as below (opensearch_reports auth_check).

const DASHBOARDS_RIGHT = 199001;
const ROUTE = "/etech/claimsDashboard";
const DASHBOARD_URL = "/opensearch/app/dashboards#/view/etech-claims-dashboard?embed=true";

const useHasRight = () =>
  useSelector((state) => (state.core?.user?.i_user?.rights ?? []).includes(DASHBOARDS_RIGHT));

const ClaimsDashboardMenu = (props) => {
  const allowed = useHasRight();
  if (!allowed) return null;
  const entries = [{ text: "Claims dashboard", icon: <BarChart />, route: ROUTE, id: "etech.claimsDashboard" }];
  return <MainMenuContribution {...props} header="Dashboards" entries={entries} menuId="EtechDashboardsMenu" />;
};

const ClaimsDashboardPage = () => {
  const allowed = useHasRight();
  if (!allowed) return null;
  return (
    <iframe
      title="Etech claims dashboard"
      src={DASHBOARD_URL}
      style={{ border: 0, width: "100%", height: "calc(100vh - 80px)", display: "block" }}
    />
  );
};

export const claimsDashboardContributions = {
  "core.MainMenu": [{ name: "EtechDashboardsMenu", component: ClaimsDashboardMenu }],
  "core.Router": [{ path: ROUTE.slice(1), component: ClaimsDashboardPage }],
};
