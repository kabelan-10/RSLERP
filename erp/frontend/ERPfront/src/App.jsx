// App.js
import React from "react";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/Routes.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  return (
    <>
      <Navbar />
      <AppRoutes />
      <Footer />
    </>
  );
}

export default App;
