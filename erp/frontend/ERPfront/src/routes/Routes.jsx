import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../components/Home";
import About from "../components/About";
import UOM from "../components/UOM";
import Upload from "../components/Upload";
import Items from "../components/Items";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/UOM" element={<UOM />} />
      <Route path="/Upload" element={<Upload />} />
      <Route path="/Items" element={<Items />} />
    </Routes>
  );
}

export default AppRoutes;
