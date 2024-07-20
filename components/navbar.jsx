import React from "react";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <nav className="text-black w-full flex font-medium justify-around bg-white text-center items-center text-4xl h-14">
      Login-Auth
      <Link to="/">Logout</Link>
    </nav>
  );
};

export default Navbar;
