import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  const images = ["/Home1.jpg", "/Home2.jpg", "/Home3.jpg"];
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef(null);
  const DELAY = 3000;

  useEffect(() => {
    if (!paused) {
      intervalRef.current = setInterval(function () {
        setCurrent(function (p) {
          return (p + 1) % images.length;
        });
      }, DELAY);
    }

    return function () {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [paused]);

  function goTo(index) {
    setCurrent(index);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  return (
    <div
      className="relative w-full h-[500px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Hero carousel - Property Rent"
    >
      {images.map(function (src, i) {
        return (
          <div
            key={src}
            className={
              "absolute inset-0 bg-center bg-cover transition-opacity duration-1000 ease-linear " +
              (i === current ? "opacity-100" : "opacity-0 pointer-events-none")
            }
            style={{ backgroundImage: "url(" + src + ")" }}
            aria-hidden={i === current ? "false" : "true"}
          />
        );
      })}

      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-4 items-center justify-center h-full px-4">
        <h1 className="px-2 text-3xl sm:text-4xl md:text-6xl text-center font-bold text-white">
          Welcome to PropertyRent
        </h1>
        <Link to="/properties" className="px-8 py-2 text-xl font-semibold text-white bg-transparent hover:bg-white hover:text-[var(--color-darkest)] transition duration-300 border-2 border-white rounded-full cursor-pointer">
          Get Started
        </Link>
      </div>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
        {images.map(function (_, idx) {
          return (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              aria-label={"Go to slide " + (idx + 1)}
              className={
                "w-3 h-3 rounded-full transition-all duration-200 focus:outline-none cursor-pointer " +
                (idx === current ? "scale-125 bg-white" : "bg-white/50")
              }
            />
          );
        })}
      </div>
    </div>
  );
}
