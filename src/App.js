
import React from "react";


import LandingPage from "./components/LandingPage.js";


// sections for this page/view

export default function App() {
  React.useEffect(() => {
    document.body.classList.toggle("index-page");
    // Specify how to clean up after this effect:
    return function cleanup() {
      document.body.classList.toggle("index-page");
    };
  },[]);
  return (
    <>
     
      <div className="wrapper">
        <LandingPage />
      </div>
    </>
  );
}
