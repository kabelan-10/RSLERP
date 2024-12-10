import React from "react";
import { Link } from "react-router-dom";
import rsl from "../assets/Black White Minimalist SImple Monogram Typography Logo.png";

function Footer() {
  return (
    <footer className="w-full bg-white border-gray-800 dark:bg-gray-900 dark:border-gray-700 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center py-10">
          <Link to="/" className="flex items-center mb-6">
            <img src={rsl} className="h-12" alt="Logo" />
          </Link>
          <div className="mt-4 flex space-x-4">
            <Link
              to="/"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            >
              Home
            </Link>
          </div>
        </div>

        <div className="py-7 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ©<Link to="/">RSL </Link> 2024, All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
