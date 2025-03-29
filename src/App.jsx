import React from "react";
import Home from "./pages/Home";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import FormData from "./pages/FormData";
import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
              <Footer />
            </>
          }
        />
        <Route path="/g7xv2m9qz5b4" element={<FormData />} />
      </Routes>
    </div>
  );
};

export default App;
