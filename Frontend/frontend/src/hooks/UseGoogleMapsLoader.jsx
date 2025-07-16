/* import { useEffect, useState } from "react";

export const useGoogleMapsLoader = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (window.google && window.google.maps) {
      setLoaded(true);
    }
  }, []);

  return loaded;
}; */

/* import { useEffect, useState } from "react";

export const useGoogleMapsLoader = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (window.google && window.google.maps) {
      setLoaded(true);
      return;
    }

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error("Manca la chiave API di Google Maps!");
      return;
    }

    const src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;

    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      existingScript.addEventListener("load", () => setLoaded(true));
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => setLoaded(true);
    document.head.appendChild(script);
  }, []);

  return loaded;
}; */
