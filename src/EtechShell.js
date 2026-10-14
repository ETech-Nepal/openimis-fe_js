import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Avatar, IconButton, Tooltip } from "@material-ui/core";
import { Menu as MenuIcon, MenuOpen as MenuOpenIcon, ChevronRight } from "@material-ui/icons";
import { useLocation, useModulesManager } from "@openimis/fe-core";
import { claimsDashboardContributions } from "./EtechClaimsDashboard";

// Top bar contribution for the fe-core left drawer layout (menuLeft: true):
// drawer collapse toggle + breadcrumb on the left, signed-in user on the right.
// Layout and the collapsed "rail" drawer are styled in etech-shell.css.

const NAV_CLASS = "etech-nav";
const COLLAPSED_CLASS = "etech-nav-collapsed";
const STORAGE_KEY = "etech.nav.collapsed";
// with no saved choice, start collapsed on screens where 300px of menu is a lot
const AUTO_COLLAPSE_BELOW = 1280;

const readCollapsed = () => {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved !== null) return saved === "1";
  } catch (e) {
    // storage unavailable (private mode, blocked): fall through to the default
  }
  return window.innerWidth < AUTO_COLLAPSE_BELOW;
};

const useNavCollapsed = (enabled) => {
  const [collapsed, setCollapsed] = useState(readCollapsed);

  useLayoutEffect(() => {
    document.body.classList.toggle(NAV_CLASS, enabled);
    document.body.classList.toggle(COLLAPSED_CLASS, enabled && collapsed);
  }, [enabled, collapsed]);
  useLayoutEffect(() => () => document.body.classList.remove(NAV_CLASS, COLLAPSED_CLASS), []);

  const toggle = useCallback(() => {
    setCollapsed((was) => {
      try {
        window.localStorage.setItem(STORAGE_KEY, was ? "0" : "1");
      } catch (e) {
        // not persisted, still toggles for this page view
      }
      return !was;
    });
  }, []);

  return [collapsed, toggle];
};

// the most specific menu entry whose route is the current path or a parent of it
const findMenuEntry = (entries, pathname) =>
  entries
    .filter((e) => e.route && (pathname === e.route || pathname.startsWith(`${e.route}/`)))
    .sort((a, b) => b.route.length - a.route.length)[0];

// Menu section headers only exist as rendered drawer accordions, so read the
// section of the current page from there (selected item first, then by label).
const findDrawerSection = (label) => {
  const drawer = document.querySelector(".MuiDrawer-paperAnchorDockedLeft");
  if (!drawer) return null;
  let item = drawer.querySelector(".MuiListItem-root.Mui-selected");
  if (!item && label) {
    item = [...drawer.querySelectorAll(".MuiAccordionDetails-root .MuiListItemText-primary")].find(
      (n) => n.textContent === label,
    );
  }
  const header = item
    ?.closest(".MuiAccordion-root")
    ?.querySelector(".MuiAccordionSummary-content .MuiTypography-root");
  return header?.textContent || null;
};

const Breadcrumb = () => {
  const modulesManager = useModulesManager();
  const { pathname } = useLocation();
  const entry = useMemo(() => findMenuEntry(modulesManager.getMenuEntries(), pathname), [modulesManager, pathname]);
  const pageRef = useRef(null);
  const [section, setSection] = useState(null);

  useEffect(() => {
    setSection(findDrawerSection(pageRef.current?.textContent));
  }, [entry]);

  return (
    <nav className="etech-topbar-crumbs" aria-label="Breadcrumb">
      {entry && section && (
        <>
          <span className="etech-topbar-section">{section}</span>
          <ChevronRight className="etech-topbar-sep" fontSize="small" />
        </>
      )}
      <span className="etech-topbar-page" ref={pageRef} aria-current="page">
        {entry ? entry.text : "Home"}
      </span>
    </nav>
  );
};

const initialsOf = (name) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

const UserChip = () => {
  const user = useSelector((state) => state.core?.user);
  if (!user) return null;
  const { other_names: first = "", last_name: last = "" } = user.i_user || {};
  const name = (first === last ? first : `${first} ${last}`).trim() || user.username;
  return (
    <div className="etech-topbar-user" title={user.username}>
      <Avatar className="etech-topbar-avatar">{initialsOf(name)}</Avatar>
      <div className="etech-topbar-user-text">
        <span className="etech-topbar-user-name">{name}</span>
        {user.username && user.username !== name && (
          <span className="etech-topbar-user-login">{user.username}</span>
        )}
      </div>
    </div>
  );
};

const EtechTopBar = () => {
  const modulesManager = useModulesManager();
  const menuLeft =
    !!modulesManager.getConf("openimis-fe-core_js", "menuLeft") || !!modulesManager.getConf("fe-core", "menuLeft");
  const [collapsed, toggle] = useNavCollapsed(menuLeft);
  if (!menuLeft) return null;
  const label = collapsed ? "Expand menu" : "Collapse menu";
  return (
    <>
      <div className="etech-topbar-start">
        <Tooltip title={label}>
          <IconButton className="etech-topbar-toggle" onClick={toggle} aria-label={label} aria-expanded={!collapsed}>
            {collapsed ? <MenuIcon /> : <MenuOpenIcon />}
          </IconButton>
        </Tooltip>
        <Breadcrumb />
      </div>
      <UserChip />
    </>
  );
};

// registered as a local module in ModulesManager
const etechShellModule = {
  "core.AppBar": [EtechTopBar],
  ...claimsDashboardContributions,
};

export default etechShellModule;
