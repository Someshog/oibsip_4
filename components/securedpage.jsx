import React from "react";
import Navbar from "./navbar";
const Securedpage = () => {
  
  return (
    <>
      <Navbar />
      <div className="h-screen w-full text-center bg-black text-white text-4xl flex flex-col  items- justify-center">
        You're accessing a secured page after logging in!
      </div>
    </>
  );
};

export default Securedpage;
