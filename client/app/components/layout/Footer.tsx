import React from "react";

const Footer = () => {
  return (
    <footer className="py-6 px-8">
      <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between mb-6 border-y-2 border-lightText py-8">
        <h2 className="text-2xl font-bold text-gray-900 px-6">EgWinch</h2>
        <p className="text-darkText max-w-md text-center md:text-left md:mt-0 px-6">
          Egwinch connects you with trusted winch drivers for easy, stress-free
          moving. Book your move or become a driver today!
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {["Product", "Help", "Support", "Track Your Driver"].map(
          (header, index) => (
            <div key={index}>
              <h3 className="font-bold text-gray-900 mb-2">{header}</h3>
              <ul className="text-gray-700 opacity-60 space-y-1">
                <li>
                  <a href="#">Dummy Link 1</a>
                </li>
                <li>
                  <a href="#">Dummy Link 2</a>
                </li>
                <li>
                  <a href="#">Dummy Link 3</a>
                </li>
              </ul>
            </div>
          )
        )}

        <div>
          <h3 className="font-bold text-gray-900 mb-2">
            Subscribe to Our Newsletter
          </h3>
          <form className="flex flex-col space-y-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-2 border rounded-md"
            />
            <button className="bg-primary text-white py-4 px-[10px] rounded-md">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
