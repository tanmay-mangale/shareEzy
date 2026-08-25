import React, { useState } from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative mx-auto mt-10 flex h-18 w-3/4 items-center justify-between rounded-4xl border-r-4 border-b-6 border-black bg-purple-200 px-6 font-gilroy sm:px-10 md:px-15">

      {/* Logo */}
      <div className="text-xl font-bold">
        ShareEzy
      </div>

      {/* Desktop About */}
      <div className="hidden md:flex">
        <Link
          to="/about"
          className="text-xl font-semibold"
        >
          About
        </Link>
      </div>

      {/* Mobile Hamburger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-3xl font-bold md:hidden"
      >
        ☰
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute right-0 top-20 z-50 w-40 rounded-2xl border-2 border-black bg-purple-200 p-4 shadow-[4px_5px_0px_#000] md:hidden">

          <Link
            to="/about"
            onClick={() => setIsOpen(false)}
            className="block rounded-xl px-3 py-1 text-lg font-semibold hover:bg-white"
          >
            About
          </Link>

        </div>
      )}

    </div>
  );
};

export default NavBar;