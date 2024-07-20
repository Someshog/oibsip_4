import React from "react";
import { useEffect, useState } from "react";
import "./App.css";
import Home from "../components/home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Securedpage from "../components/securedpage.jsx";

function App() {
  let [user, setUser] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("useractive") === "true") {
      console.log(localStorage.getItem("useractive"));
      setUser(true);
    }
  }, [localStorage.getItem("useractive")]);

  let router = createBrowserRouter([
    {
      path: `/:id`,
      element: user ? <Securedpage /> : null,
    },
    {
      path: "/",
      element: <Home />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router}>
        <Home />
      </RouterProvider>
    </>
  );
}

export default App;
