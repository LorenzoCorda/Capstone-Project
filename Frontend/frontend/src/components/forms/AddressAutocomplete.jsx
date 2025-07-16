/* import { useState, useEffect } from "react";
import { createElement, PlaceAutocompleteElement } from "@googlemaps/places";

export default function IndirizzoInput({ value, onChange }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    createElement({
      key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    });
    setLoaded(true);
  }, []);

  return (
    loaded && (
      <PlaceAutocompleteElement
        placeholder="Inserisci un indirizzo"
        style={{
          width: "100%",
          height: "48px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          padding: "10px",
        }}
        value={value}
        onInput={(e) => onChange(e.target.value)}
        onPlaceChange={(e) => onChange(e.target.value)}
      />
    )
  );
} */

/* import { Autocomplete } from "@react-google-maps/api";
import { useRef } from "react";

const AddressAutocomplete = ({ value, onChange, onSelect }) => {
  const autocompleteRef = useRef(null);

  const handleLoad = (autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    const address = place.formatted_address;
    const city = place.address_components?.find((comp) =>
      comp.types.includes("locality")
    )?.long_name;

    if (onSelect) onSelect(address, city);
  };

  return (
    <Autocomplete onLoad={handleLoad} onPlaceChanged={handlePlaceChanged}>
      <input
        type="text"
        className="form-control"
        placeholder="Inserisci indirizzo"
        value={value}
        onChange={onChange}
      />
    </Autocomplete>
  );
};

export default AddressAutocomplete; */
