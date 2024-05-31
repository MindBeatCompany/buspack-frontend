import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./styles.scss";
import {
  IconMenu,
  IconModif,
  IconAdd,
  IconAdmin,
  MenuClose,
  MarkerService,
  IconDisplayInfo,
  IconQR,
  IconDeliveryTruck,
  ToolsIcon,
} from "../../../../resources/icons";



const SideBar = ({ history, t, user, auth }) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [navClasses, setNavClasses] = useState(["nav", "nav-closed"]);

  let renderNavClasses = navClasses.join(" ");

  const toggleNavClasses = function (isMenu = false) {
    if (navClasses.includes("nav-closed")) {
      if (isMenu) {
        setNavClasses(navClasses.filter((c) => c !== "nav-closed"));
        setSidebarExpanded(false);
      }
    } else {
      setNavClasses([...navClasses, "nav-closed"]);
      setSidebarExpanded(true);
    }
  };

  useEffect(() => {
    renderNavClasses = navClasses.join(" ");
  }, [navClasses]);

  const access = {
    registerCorporateAccount: {
      title: t("sideBar.add"),
      url: "/user-account-manager/register-corporate-account",
      icon: <IconAdd />,
    },
    accountModification: {
      title: t("sideBar.modif"),
      url: "/account-modification",
      icon: <IconModif />,
    },
    rootsModification: {
      title: t("sideBar.admin"),
      url: "/roots-modification",
      icon: <IconAdmin />,
    },
    serviceRequests: {
      title: t("sideBar.services"),
      url: "/service-requests",
      icon: <MarkerService />,
    },
    serviceRequestsQuery: {
      title: t("sideBar.inquiry"),
      url: "/service-requests/query",
      icon: <IconDisplayInfo />,
    },
    printLabel: {
      title: t("sideBar.printLabel"),
      url: "/print-label",
      icon: <IconQR />,
    },
    tracking: {
      title: t("sideBar.tracking"),
      url: "/tracking",
      icon: <IconDeliveryTruck />,
    },
    userModification: {
      title: t("sideBar.userAdmin"),
      url: "/user-modification",
      icon: <IconAdmin />,
    },
    formatModification: {
      title: t("sideBar.userAdmin"),
      url: "/format-modification",
      icon: <IconAdmin />,
    },
    locationModification: {
      title: t("sideBar.userAdmin"),
      url: "/location-modification",
      icon: <IconAdmin />,
    },
    locationResult: {
      title: t("sideBar.userAdmin"),
      url: "/location-result",
      icon: <IconAdmin />,
    },
    generalSettings: {
      title: t("sideBar.generalSettings"),
      url: "/general-settings",
      icon: <ToolsIcon />,
    },
  };

  const NAV_PERMISSIONS = {
    ADMINISTRADOR: [
      "registerCorporateAccount",
      "accountModification",
      "rootsModification",
      "generalSettings",
    ],
    CORPORATIVO_ADMINISTRADOR: [
      "userModification",
      "serviceRequests",
      "serviceRequestsQuery",
      "printLabel",
      "tracking",
    ],
    CORPORATIVO: [
      "serviceRequests",
      "serviceRequestsQuery",
      "printLabel",
      "tracking",
    ],
  };

  const {
    userData: { roles, firstTimeLogged },
  } = auth;
  return (
    <>
      {firstTimeLogged ? null : (
        <nav className={renderNavClasses}>
          <div className="nav__expand" onClick={() => toggleNavClasses(true)}>
            {sidebarExpanded ? <IconMenu /> : <MenuClose />}
          </div>
          <ul className="nav__list">
            {NAV_PERMISSIONS[roles].map((item, idx) => (
              <li className="nav__listitem" key={idx}>
                <Link to={access[item].url} onClick={() => toggleNavClasses()}>
                  {access[item].icon}
                  <div className="expand-text">
                    <p>{access[item].title}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
};

export default SideBar;
