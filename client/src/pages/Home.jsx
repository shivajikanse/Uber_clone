import React, { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";

function Home() {
  //useState
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState("");
  const [vehiclepanel, Setvehiclepanel] = useState(false);
  const [confirRidePanel, SetConfirmRidePanel] = useState(false);
  const [VehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);

  //use Ref
  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const vehiclePanelRef = useRef(null);
  const ConfirmRidePanelRef = useRef(null);
  const VehicleFoundPanelRef = useRef(null);
  const waitingForDriverRef = useRef(null);

  const submitHandler = async (e) => {
    e.preventDefault();
  };

  useGSAP(
    function () {
      if (panelOpen) {
        gsap.to(panelRef.current, {
          height: "70%",
        });
        gsap.to(panelCloseRef.current, {
          opacity: 1,
        });
      } else {
        gsap.to(panelRef.current, {
          height: "0%",
        });
        gsap.to(panelCloseRef.current, {
          opacity: 0,
        });
      }
    },
    [panelOpen],
  );

  useGSAP(
    function () {
      if (vehiclepanel) {
        gsap.to(vehiclePanelRef.current, {
          transform: "translateY(0%)",
        });
      } else {
        gsap.to(vehiclePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [vehiclepanel],
  );

  useGSAP(
    function () {
      if (confirRidePanel) {
        gsap.to(ConfirmRidePanelRef.current, {
          transform: "translateY(0%)",
        });
      } else {
        gsap.to(ConfirmRidePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [confirRidePanel],
  );

  useGSAP(
    function () {
      if (waitingForDriver) {
        gsap.to(waitingForDriverRef.current, {
          transform: "translateY(0%)",
        });
      } else {
        gsap.to(waitingForDriverRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [waitingForDriver],
  );

  useGSAP(
    function () {
      if (VehicleFound) {
        gsap.to(VehicleFoundPanelRef.current, {
          transform: "translateY(0%)",
        });
      } else {
        gsap.to(VehicleFoundPanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [VehicleFound],
  );

  return (
    <div className="h-screen relative overflow-hidden">
      <img
        className="w-16 absolute left-5 top-5"
        src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
        alt=""
      />
      <div className="h-screen w-screen">
        {/* image for temporary use  */}
        {/* <LiveTracking /> */}
      </div>
      <div className=" flex flex-col justify-end h-screen absolute top-0 w-full">
        <div className="h-[30%] p-6 bg-white relative">
          {/* icon */}
          <h5
            ref={panelCloseRef}
            onClick={() => {
              setPanelOpen(false);
            }}
            className="absolute opacity-0 right-6 top-6 text-2xl"
          >
            <i className="ri-arrow-down-wide-line"></i>
          </h5>
          <h4 className="text-2xl font-semibold">Find a trip</h4>
          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
            className="relative py-3"
          >
            <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
            <input
              onClick={() => {
                setPanelOpen(true);
              }}
              value={pickup}
              onChange={(e) => {
                setPickup(e.target.value);
              }}
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full"
              type="text"
              placeholder="Add a pick-up location"
            />
            <input
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
              }}
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full  mt-3"
              type="text"
              placeholder="Enter your destination"
            />
          </form>

          {/* <button className="bg-black text-white px-4 py-2 rounded-lg mt-3 w-full">
            Find Trip
          </button> */}
        </div>

        <div ref={panelRef} className="bg-white h-0 ">
          <LocationSearchPanel
            panelOpen={panelOpen}
            setPanelOpen={setPanelOpen}
            vehiclepanel={vehiclepanel}
            Setvehiclepanel={Setvehiclepanel}
          />
        </div>
      </div>
      <div
        ref={vehiclePanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <VehiclePanel
          SetConfirmRidePanel={SetConfirmRidePanel}
          Setvehiclepanel={Setvehiclepanel}
        />
      </div>

      <div
        ref={ConfirmRidePanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12"
      >
        <ConfirmRide
          SetConfirmRidePanel={SetConfirmRidePanel}
          confirRidePanel={confirRidePanel}
          setVehicleFound={setVehicleFound}
        />
      </div>
      <div
        ref={VehicleFoundPanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12"
      >
        <LookingForDriver setVehicleFound={setVehicleFound} />
      </div>
      <div
        ref={waitingForDriverRef}
        className="fixed w-full  z-10 bottom-0  bg-white px-3 py-6 pt-12"
      >
        <WaitingForDriver
          // ride={ride}
          setVehicleFound={setVehicleFound}
          setWaitingForDriver={setWaitingForDriver}
          waitingForDriver={waitingForDriver}
        />
      </div>
    </div>
  );
}

export default Home;
