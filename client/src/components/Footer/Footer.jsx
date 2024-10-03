import React from "react";

const Footer = () => {
  return (
    <footer>
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white ">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            <div className="mb-5">
              <h1 className=" text-2xl pb-4">Company</h1>
              123 Street Bro xxx
              <br />
              VietNam
              <br />
              <strong>PhoneNumber:</strong> +84 123 456 789
              <br />
              <strong>Email:</strong> 1vJpP@example.com <br />
            </div>
            <div className="mb-5">
              <h2 className="mb-5 text-2xl">Use Link</h2>
              <ul>
                <li className="pb-4">
                  <a href="/" className="hover:text-red-800">
                    Home
                  </a>
                </li>
                <li className="pb-4">
                  <a href="#" className="hover:text-red-800">
                    Product
                  </a>
                </li>
                <li className="pb-4">
                  <a href="#" className="hover:text-red-800">
                    Blog
                  </a>
                </li>
                <li className="pb-4">
                  <a href="#" className="hover:text-red-800">
                    FAQ
                  </a>
                </li>
                <li className="pb-4">
                  <a href="#" className="hover:text-red-800">
                    FAQ
                  </a>
                </li>
                <li className="pb-4">
                  <a href="#" className="hover:text-red-800">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div className="mb-5">
              <h2 className="mb-5 text-2xl">Useful Link</h2>
              <ul>
                <li className="pb-4">
                  <a href="#" className="hover:text-red-800">
                    Home
                  </a>
                </li>
                <li className="pb-4">
                  <a href="#" className="hover:text-red-800">
                    Product
                  </a>
                </li>
                <li className="pb-4">
                  <a href="#" className="hover:text-red-800">
                    Blog
                  </a>
                </li>
                <li className="pb-4">
                  <a href="#" className="hover:text-red-800">
                    FAQ
                  </a>
                </li>
                <li className="pb-4">
                  <a href="#" className="hover:text-red-800">
                    Support
                  </a>
                </li>
                <li className="pb-4">
                  <a href="#" className="hover:text-red-800">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div className="mb-5">
              <h2 className="mb-5 text-2xl">Support</h2>
              <ul>
                <li className="pb-4">
                  <a href="#" className="hover:text-red-800">
                    FAQ
                  </a>
                </li>
                <li className="pb-4">
                  <a href="#" className="hover:text-red-800">
                    Support
                  </a>
                </li>
                <li className="pb-4">
                  <a href="#" className="hover:text-red-800">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
