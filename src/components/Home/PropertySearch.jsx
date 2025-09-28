import React, { useEffect, useRef, useState } from "react";
import {IoMdArrowDropdown, IoMdLocate} from "react-icons/io";

export default function PropertySearchSection({
  onSearch,
  locations = ["New York", "Los Angeles", "Chicago", "San Francisco", "Brooklyn", "Queens"],
  priceSteps = [0, 250, 500, 750, 1000, 1250, 1500, 1750, 2000, 2500, 3000],
  initial = {},
}) {
  const [location, setLocation] = useState(initial.location || "");
  const [showLoc, setShowLoc] = useState(false);

  const [priceMin, setPriceMin] = useState(initial.priceMin ?? "");
  const [priceMax, setPriceMax] = useState(initial.priceMax ?? "");
  const [showPriceMin, setShowPriceMin] = useState(false);
  const [showPriceMax, setShowPriceMax] = useState(false);

  const [beds, setBeds] = useState(initial.beds || "Any");
  const [showBeds, setShowBeds] = useState(false);

  const [baths, setBaths] = useState(initial.baths || "Any");
  const [showBaths, setShowBaths] = useState(false);

  const locRef = useRef(null);
  const priceMinRef = useRef(null);
  const priceMaxRef = useRef(null);
  const bedsRef = useRef(null);
  const bathsRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (locRef.current && !locRef.current.contains(e.target)) setShowLoc(false);
      if (priceMinRef.current && !priceMinRef.current.contains(e.target)) setShowPriceMin(false);
      if (priceMaxRef.current && !priceMaxRef.current.contains(e.target)) setShowPriceMax(false);
      if (bedsRef.current && !bedsRef.current.contains(e.target)) setShowBeds(false);
      if (bathsRef.current && !bathsRef.current.contains(e.target)) setShowBaths(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const filteredLocations = locations.filter((l) =>
    l.toLowerCase().includes(location.toLowerCase())
  );

  function clear() {
    setLocation("");
    setPriceMin("");
    setPriceMax("");
    setBeds("Any");
    setBaths("Any");
  }

  function submit(e) {
    e.preventDefault();
    const values = {
      location: location.trim(),
      priceMin: priceMin === "" ? null : Number(priceMin),
      priceMax: priceMax === "" ? null : Number(priceMax),
      beds,
      baths,
    };
    if (typeof onSearch === "function") onSearch(values);
  }

  function formatPrice(v) {
    if (v === "" || v == null) return "Any";
    if (v >= 1000) return `$${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k`;
    return `$${v}`;
  }

  const inputBase = "bg-white text-[var(--color-darkest)] placeholder:text-[var(--color-dark)]";

  return (
    <section className="w-full py-12 px-4 bg-[var(--color-bg)]">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-2xl font-semibold text-[var(--color-darkest)] mb-2 text-center">
          Find Your Perfect Property
        </h3>
        <p className="text-sm text-[var(--color-dark)] text-center mb-6">
          Use the menus to quickly refine your search.
        </p>

        <form
          onSubmit={submit}
          className="grid gap-4 grid-cols-1 lg:grid-cols-12 items-end bg-white rounded-xl p-5 shadow-sm"
        >
          <div className="lg:col-span-5" ref={locRef}>
            <label className="block text-xs text-[var(--color-dark)] mb-2">Location</label>
            <div className="relative flex items-center bg-white border border-[var(--color-dark)] rounded-md overflow-hidden">
              <div className="px-3 py-2 text-[var(--color-dark)]">
                <IoMdLocate className="h-5 w-5"/>
              </div>

              <input
                type="text"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setShowLoc(true);
                }}
                onFocus={() => setShowLoc(true)}
                placeholder="City, neighborhood or address"
                className={`flex-1 px-3 py-2 ${inputBase} focus:outline-none`}
                aria-label="Location"
              />

              {location ? (
                <button
                  type="button"
                  onClick={() => setLocation("")}
                  className="px-3 text-[var(--color-dark)]"
                  aria-label="Clear location"
                >
                  ✕
                </button>
              ) : (
                <IoMdArrowDropdown className="mx-2"/>
              )}
            </div>

            {showLoc && filteredLocations.length > 0 && (
              <ul className="absolute max-w-115 z-30 left-50 right-0 mt-2 bg-white border border-[var(--color-dark)] rounded-md shadow-md max-h-48 overflow-auto">
                {filteredLocations.map((loc) => (
                  <li
                    key={loc}
                    onClick={() => {
                      setLocation(loc);
                      setShowLoc(false);
                    }}
                    className="px-4 py-2 text-[var(--color-darkest)] hover:bg-[var(--color-primary)] hover:text-white cursor-pointer"
                  >
                    {loc}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="lg:col-span-3 grid grid-cols-2 gap-2">
            <div ref={priceMinRef}>
              <label className="block text-xs text-[var(--color-dark)] mb-2">Min Price</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowPriceMin((s) => !s);
                    setShowPriceMax(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md border border-[var(--color-dark)] ${inputBase}`}
                >
                  {formatPrice(priceMin)}
                </button>

                {showPriceMin && (
                  <ul className="absolute z-30 left-0 right-0 mt-2 bg-white border border-[var(--color-dark)] rounded-md shadow-md max-h-44 overflow-auto">
                    <li
                      onClick={() => {
                        setPriceMin("");
                        setShowPriceMin(false);
                      }}
                      className="px-4 py-2 text-[var(--color-darkest)] hover:bg-[var(--color-primary)] hover:text-white cursor-pointer"
                    >
                      Any
                    </li>
                    {priceSteps.map((p) => (
                      <li
                        key={`min-${p}`}
                        onClick={() => {
                          setPriceMin(p);
                          if (priceMax !== "" && p > Number(priceMax)) setPriceMax("");
                          setShowPriceMin(false);
                        }}
                        className="px-4 py-2 text-[var(--color-darkest)] hover:bg-[var(--color-primary)] hover:text-white cursor-pointer"
                      >
                        {formatPrice(p)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div ref={priceMaxRef}>
              <label className="block text-xs text-[var(--color-dark)] mb-2">Max Price</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowPriceMax((s) => !s);
                    setShowPriceMin(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md border border-[var(--color-dark)] ${inputBase}`}
                >
                  {formatPrice(priceMax)}
                </button>

                {showPriceMax && (
                  <ul className="absolute z-30 left-0 right-0 mt-2 bg-white border border-[var(--color-dark)] rounded-md shadow-md max-h-44 overflow-auto">
                    <li
                      onClick={() => {
                        setPriceMax("");
                        setShowPriceMax(false);
                      }}
                      className="px-4 py-2 text-[var(--color-darkest)] hover:bg-[var(--color-primary)] hover:text-white cursor-pointer"
                    >
                      Any
                    </li>
                    {priceSteps.map((p) => (
                      <li
                        key={`max-${p}`}
                        onClick={() => {
                          setPriceMax(p);
                          if (priceMin !== "" && p < Number(priceMin)) setPriceMin("");
                          setShowPriceMax(false);
                        }}
                        className="px-4 py-2 text-[var(--color-darkest)] hover:bg-[var(--color-primary)] hover:text-white cursor-pointer"
                      >
                        {formatPrice(p)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2" ref={bedsRef}>
            <label className="block text-xs text-[var(--color-dark)] mb-2">Beds</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowBeds((s) => !s)}
                className={`w-full text-left px-3 py-2 rounded-md border border-[var(--color-dark)] ${inputBase}`}
              >
                {beds}
              </button>

              {showBeds && (
                <ul className="absolute z-30 left-0 right-0 mt-2 bg-white border border-[var(--color-dark)] rounded-md shadow-md max-h-40 overflow-auto">
                  {["Any", "1+", "2+", "3+", "4+"].map((b) => (
                    <li
                      key={`b-${b}`}
                      onClick={() => {
                        setBeds(b);
                        setShowBeds(false);
                      }}
                      className="px-4 py-2 text-[var(--color-darkest)] hover:bg-[var(--color-primary)] hover:text-white cursor-pointer"
                    >
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="lg:col-span-2" ref={bathsRef}>
            <label className="block text-xs text-[var(--color-dark)] mb-2">Baths</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowBaths((s) => !s)}
                className={`w-full text-left px-3 py-2 rounded-md border border-[var(--color-dark)] ${inputBase}`}
              >
                {baths}
              </button>

              {showBaths && (
                <ul className="absolute z-30 left-0 right-0 mt-2 bg-white border border-[var(--color-dark)] rounded-md shadow-md max-h-40 overflow-auto">
                  {["Any", "1+", "2+", "3+"].map((bt) => (
                    <li
                      key={`bt-${bt}`}
                      onClick={() => {
                        setBaths(bt);
                        setShowBaths(false);
                      }}
                      className="px-4 py-2 text-[var(--color-darkest)] hover:bg-[var(--color-primary)] hover:text-white cursor-pointer"
                    >
                      {bt}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="lg:col-span-12 flex justify-center gap-3 mt-2">
            <button
              type="button"
              onClick={clear}
              className="px-4 py-2 rounded-full bg-white border border-[var(--color-secondary)] text-[var(--color-darkest)] hover:bg-[var(--color-light)] transition-colors cursor-pointer"
            >
              Clear
            </button>

            <button
              type="submit"
              className="px-7 py-2 rounded-full bg-[var(--color-secondary)] hover:bg-[var(--color-darker)] text-white font-medium shadow transition-colors focus:outline-none cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>

        <p className="mt-3 text-xs text-[var(--color-dark)]">Tip: Try neighborhood names in Location for more precise results.</p>
      </div>
    </section>
  );
}
