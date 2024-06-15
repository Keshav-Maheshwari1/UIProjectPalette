import React, { useEffect, useState } from "react";
import brain from "../assets/brain.svg";
import { projects } from "../constants/Projects";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Mousewheel } from "swiper/modules";
import { Link } from "react-router-dom";

const Home = () => {
  const [width, setWidth] = useState(innerWidth);

  useEffect(() => {
    onresize = () => {
      setWidth(innerWidth);
    };
  }, []);

  return (
    <main className="w-[100%] h-full bg-[#222831]">
      <section className="h-[80vh] w-[100%]">
        <img
          src={brain}
          alt="image of a brain"
          className="h-[100%] w-[100%] "
        />
      </section>
      <section className="">
        <h1 className=" lg:ml-20 underline text-[2rem] font-semibold pb-2 text-pink-400 ">
          Projects
        </h1>
        <Swiper
          pagination={{ clickable: true }}
          loop={true}
          spaceBetween={30}
          slidesPerView={width > 700 ? (width > 1280 ? 4 : 2) : "auto"}
          className="mySwiper pb-10 xl:max-w-[1220px] lg:max-w-screen-[1000] md:max-w-screen-sm max-w-[300px]  "
          modules={[Autoplay, Pagination, Mousewheel]}
          lazy="true"
          autoplay={{
            delay: 3000,
            disableOnInteraction: true,
          }}
        >
          {projects.map((pro, i) => (
            <SwiperSlide key={i} id="swiperSlide">
              <img src={pro.img} className=" rounded-lg couraselImgs" alt="" />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
      <section className=""></section>
      <section className=""></section>
    </main>
  );
};

export default Home;
