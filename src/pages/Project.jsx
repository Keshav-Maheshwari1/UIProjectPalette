import React, { useState } from "react";
import laptop from "../assets/laptop.svg";

const Project = () => {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("all");
  const items = [
    {
      id: 1,
      imgSrc: laptop,
      description: "Elevation in your skills",
      ageGroup: "6-10",
    },
    {
      id: 2,
      imgSrc: laptop,
      description: "Elevation in your skills",
      ageGroup: "10-12",
    },
    {
      id: 3,
      imgSrc: laptop,
      description: "Elevation in your skills",
      ageGroup: "12-16",
    },
    {
      id: 4,
      imgSrc: laptop,
      description: "Elevation in your skills",
      ageGroup: "16-20",
    },
    {
      id: 5,
      imgSrc: laptop,
      description: "Elevation in your skills",
      ageGroup: "20-24",
    },
    {
      id: 6,
      imgSrc: laptop,
      description: "Elevation in your skills",
      ageGroup: "24-30",
    },
  ];

  const ageGroups = [
    { label: "All", value: "all" },
    { label: "6-10", value: "6-10" },
    { label: "10-12", value: "10-12" },
    { label: "12-16", value: "12-16" },
    { label: "16-20", value: "16-20" },
    { label: "20-24", value: "20-24" },
    { label: "24-30", value: "24-30" },
  ];
  const handleAgeGroupChange = (e) => {
    setSelectedAgeGroup(e.target.value);
  };
  const filteredItems =
    selectedAgeGroup === "all"
      ? items
      : items.filter((item) => item.ageGroup === selectedAgeGroup);
  return (
    <main className="bg-[#222831] w-[100%] px-[10%] ">
      <p className="text-[#EEEEEE] text-center">This is Demo</p>
      <div className=" mx-auto p-4">
        <div className="mb-4">
          <label htmlFor="age-group" className="mr-2 text-[#DDDDDD]">
            Filter by Age Group:
          </label>
          <select
            id="age-group"
            value={selectedAgeGroup}
            onChange={handleAgeGroupChange}
            className="p-2 rounded bg-gray-800 text-[#EEEEEE]"
          >
            {ageGroups.map((group) => (
              <option key={group.value} value={group.value}>
                {group.label}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid:cols-2 lg:grid-cols-3 gap-9 h-[100%]">
          {filteredItems.map((item) => (
            <div key={item.id} className="border p-4 shadow-custom-light w-[100%] h-[100%] hover:cursor-pointer" onClick={handleAgeGroupChange}>
              <img
                src={item.imgSrc}
                alt={item.description}
                className="w-full h-[3/4] object-cover rounded"
              />
              <p className="mt-2 text-lg text-[#EEEEEE] ">{item.description}</p>
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                Build Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Project;
