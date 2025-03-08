import { useState } from "react";

interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
}

const useLocationSuggestions = () => {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
      );
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error("Error fetching location suggestions:", err);
      setError("Failed to fetch location suggestions.");
    } finally {
      setLoading(false);
    }
  };

  return { suggestions, fetchSuggestions, loading, error };
};

export default useLocationSuggestions;
