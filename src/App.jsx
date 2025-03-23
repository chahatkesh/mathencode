import React from "react";
import Home from "./pages/Home";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";

const App = () => {
  return (
    <div>
      <Navbar />
      <Home />
      <Footer />
    </div>
  );
};

export default App;
