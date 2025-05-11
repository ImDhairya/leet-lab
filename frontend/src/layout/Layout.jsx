import React from "react";
import {Outlet} from "react-router-dom";
import Nabvar from "../components/Nabvar";

const Layout = () => {
  return (
    <div>
      <Nabvar />
      <Outlet />
    </div>
  );
};

export default Layout;
