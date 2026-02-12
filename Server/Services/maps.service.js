import axios from "axios";
import Captain from "../models/captain.model.js";

export const getAddressCoordinate = async (address) => {
  const apiKey = process.env.MAPBOX_ACCESS_TOKEN;
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    address,
  )}.json`;

  try {
    const response = await axios.get(url, {
      params: {
        access_token: apiKey,
        limit: 1,
        country: "IN",
      },
    });

    //  MAPBOX CORRECT CHECK
    const feature = response.data?.features?.[0];

    if (!feature) {
      console.log("Mapbox error:", response.data);
      throw new Error("Unable to fetch coordinates");
    }

    const [lng, lat] = feature.center;

    return {
      lat: lat,
      lng: lng,
    };
  } catch (error) {
    console.error("Mapbox Service Error:", error.message);
    throw error;
  }
};

export const getDistanceTimeMatrix = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error("origin and destination are required");
  }

  const apiKey = process.env.MAPBOX_ACCESS_TOKEN;

  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;

  try {
    const response = await axios.get(url, {
      params: {
        access_token: apiKey,
        geometries: "geojson",
        overview: "simplified",
      },
    });

    const route = response.data?.routes?.[0];

    if (!route) {
      throw new Error("Unable to fetch distance and time");
    }

    return {
      distance: route.distance, // meters
      duration: route.duration, // seconds
    };
  } catch (error) {
    console.error(
      "Mapbox Directions Error:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

//Suggestion
export const getSuggestion = async (input) => {
  if (!input) {
    throw new Error("Input is required");
  }

  const apiKey = process.env.MAPBOX_ACCESS_TOKEN;

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    input,
  )}.json`;

  try {
    const response = await axios.get(url, {
      params: {
        access_token: apiKey,
        autocomplete: true,
        limit: 5,
        country: "IN",
        types: "place,locality,neighborhood,address",
      },
    });

    // if (!response.data.features) {
    //   return [];
    // }

    // Format response for frontend
    return response.data.features.map((place) => ({
      name: place.place_name,
      lng: place.center[0],
      lat: place.center[1],
    }));
  } catch (error) {
    console.error(
      "Mapbox Autocomplete Error:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

//Captain in radius
export const getCaptainsInTheRadius = async (lat, lng, radius) => {
  console.log("Searching captains near:");
  console.log("Latitude:", lat);
  console.log("Longitude:", lng);
  console.log("Radius:", radius);
  const captains = await Captain.find({
    location: {
      $geoWithin: {
        $centerSphere: [
          [lng, lat], // ✅ lng first, lat second
          radius / 6371, // radius in KM
        ],
      },
    },
  });

  return captains;
};
