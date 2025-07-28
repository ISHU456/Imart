import React from "react";
import { assets } from "../assets/assets";


const Contact = () => {
  return (
    <section className="bg-gray-100 py-10 px-4" id="contact">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
        <p className="text-gray-700 mb-8">Feel free to reach out to me through any of the following platforms:</p>
        <img src={assets.profile} alt="Profile" className="mx-auto mb-8 w-40 h-40 sm:w-48 sm:h-48 rounded-full object-contain shadow-lg border-4 border-white bg-white"
        />

        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <div className="bg-white shadow-lg rounded-2xl p-6 flex items-center gap-4 hover:shadow-xl transition-all">
            <div>
              <p className="font-semibold">Email</p>
              <a href="mailto:your-email@gmail.com" className="text-blue-600 hover:underline">
                ishuanand1974@gmail.com
              </a>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-6 flex items-center gap-4 hover:shadow-xl transition-all">

            <div>
              <p className="font-semibold">Phone</p>
              <a href="tel:+91XXXXXXXXXX" className="text-blue-600 hover:underline">
                +919754331357
              </a>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-6 flex items-center gap-4 hover:shadow-xl transition-all">

            <div>
              <p className="font-semibold">LinkedIn</p>
              <a href="https://www.linkedin.com/in/ishu-anand-malviya-435440258" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              linkedin.com/in/ishu-anand-malviya-435440258
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
