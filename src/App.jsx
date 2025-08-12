import React from "react";
import Home from "./pages/Home";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import FormData from "./pages/FormData";
import CourseDetail from "./pages/CourseDetail";
import Career from "./pages/Career";
import TutorApplications from "./pages/TutorApplications";
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
        <Route
          path="/career"
          element={
            <>
              <Navbar />
              <Career />
              <Footer />
            </>
          }
        />
        <Route
          path="/course/:id"
          element={
            <>
              <Navbar />
              <CourseDetail />
              <Footer />
            </>
          }
        />
        <Route path="/g7xv2m9qz5b4" element={<FormData />} />
        <Route path="/g7xv2m7yterfi" element={<TutorApplications />} />
      </Routes>
    </div>
  );
};

export default App;
