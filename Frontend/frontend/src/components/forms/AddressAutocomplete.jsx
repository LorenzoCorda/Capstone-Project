import { useRef, useEffect } from "react";

const AddressAutocomplete = ({ value, onChange, onSelect, mapsLoaded }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (!mapsLoaded || !inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["address"],
        componentRestrictions: { country: "it" },
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place || !place.formatted_address) return;

      const address = place.formatted_address;
      const cityComponent = place.address_components?.find((comp) =>
        comp.types.includes("locality")
      );
      const city = cityComponent?.long_name || "";
      onSelect(address, city);
    });

    return () => {
      window.google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, [mapsLoaded]);

  return (
    <input
      ref={inputRef}
      type="text"
      className="form-control"
      placeholder="Inserisci indirizzo..."
      value={value}
      onChange={onChange}
    />
  );
};

export default AddressAutocomplete;
