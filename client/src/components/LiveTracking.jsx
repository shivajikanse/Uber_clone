import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// ✅ Set access token correctly
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const LiveTracking = () => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    // 🔥 Prevent double initialization (React Strict Mode safe)
    if (mapRef.current) return;

    if (!mapContainer.current) return;

    // 🗺 Initialize map
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/navigation-day-v1",
      center: [78.9629, 20.5937], // Default center (India)
      zoom: 14,
    });

    // 📍 Create marker
    markerRef.current = new mapboxgl.Marker()
      .setLngLat([78.9629, 20.5937])
      .addTo(mapRef.current);

    // 📡 Start live tracking
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const lngLat = [longitude, latitude];

        // Update marker position
        markerRef.current.setLngLat(lngLat);

        // Smooth follow effect
        mapRef.current.flyTo({
          center: lngLat,
          speed: 1.2,
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      },
    );

    // 🧹 Cleanup
    return () => {
      navigator.geolocation.clearWatch(watchId);
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return <div ref={mapContainer} style={{ width: "100%", height: "100vh" }} />;
};

export default LiveTracking;
