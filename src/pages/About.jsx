import React from "react";
import { us } from "../constants/about";

const About = () => {
  return (
    <main className=" min-h-screen sm:px-[4%] py-8 bg-[#12151a]">
      <section className=" gap-y-20 flex  flex-wrap ">
        {us.map((us, i) => {
          return us.isRight ? (
            <div key={i} className={` flex items-center `}>
              <div className={` ${us.style} w-fit  text-center`}>
                <div className="rounded-full sm:w-20 lg:w-72 lg:h-72 sm:h-20 bg-gray-600 mb-3"></div>
                <h1 className=" sm:text-xl lg:text-[28px] font-semibold text-[#EEEEEE]">
                  {us.name}
                </h1>
              </div>
              <p className={`${us.desClass} text-[#eeeeee95] px-3 pb-4 w-[100%]`}>
                {us.description}
              </p>
            </div>
          ) : (
            <div key={i} className={` flex items-center `}>
              <p className={`${us.desClass} text-[#eeeeee95] w-[100%]`}>
                {us.description}
              </p>
              <div className={`text-center ${us.style} w-fit `}>
                <div className="rounded-full sm:w-20 lg:w-72 lg:h-72 sm:h-20 bg-gray-600 mb-3"></div>
                <h1 className=" sm:text-xl lg:text-[28px] font-semibold text-[#EEEEEE]">
                  {us.name}
                </h1>
              </div>
            </div>
          );
        })}
      </section>
      <footer className="text-white">
        <p>This is ankush yadav</p>
      </footer>
    </main>
  );
};

export default About;
