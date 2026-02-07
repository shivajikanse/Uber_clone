import React from "react";

const LocationSearchPanel = (props) => {
  const locations = [
    "24B , near kapoor cafe Sheriyan coding scholl bhopal ",
    "22c Near Malkhotra cafe sheriyan coding school ",
    "1Ba Near sharma's cafe Sheriyan coding School Bhopal ",
  ];

  return (
    <div>
      {/* Display fetched suggestions */}
      {locations.map((elem, index) => (
        <div
          key={index}
          onClick={() => {
            props.Setvehiclepanel(true);
            props.setPanelOpen(false);
          }}
          className="flex gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl items-center my-2 justify-start"
        >
          <h2 className="bg-[#eee] h-8 flex items-center justify-center w-12 rounded-full">
            <i className="ri-map-pin-fill"></i>
          </h2>
          <h4 className="font-medium">{elem}</h4>
        </div>
      ))}
    </div>
  );
};

export default LocationSearchPanel;
