import { useState, useEffect, useRef } from "react";

export const PersonalitySelector = ({ selectedPersonality, onPersonalityChange }) => {
  const [personalities, setPersonalities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchPersonalities();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const fetchPersonalities = async () => {
    try {
      const response = await fetch("http://localhost:3000/personalities");
      const data = await response.json();
      setPersonalities(data.personalities);
    } catch (error) {
      console.error("Error fetching personalities:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentPersonality = personalities.find(p => p.key === selectedPersonality);

  const handlePersonalitySelect = (key) => {
    console.log("Personality selected:", key);
    onPersonalityChange(key);
    setShowDropdown(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="backdrop-blur-md bg-white bg-opacity-50 hover:bg-opacity-70 text-gray-700 px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 pointer-events-auto"
      >
        <span className="text-xl">{currentPersonality?.icon || "✈️"}</span>
        <span className="hidden md:inline">{currentPersonality?.name || "Loading..."}</span>
        <svg
          className={`w-4 h-4 transition-transform ${showDropdown ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showDropdown && personalities.length > 0 && (
        <div className="absolute top-full mt-2 right-0 backdrop-blur-md bg-white bg-opacity-90 rounded-lg shadow-2xl z-[100] min-w-[280px] max-w-[320px] overflow-hidden pointer-events-auto">
          {personalities.map((personality) => (
            <button
              key={personality.key}
              onClick={() => handlePersonalitySelect(personality.key)}
              className={`w-full text-left px-4 py-3 hover:bg-white hover:bg-opacity-100 transition-all flex items-center gap-3 border-b border-gray-200 last:border-b-0 ${
                selectedPersonality === personality.key ? "bg-blue-100 bg-opacity-80" : ""
              }`}
            >
              <span className="text-2xl">{personality.icon}</span>
              <div className="flex-1">
                <p className="font-semibold text-gray-700">{personality.name}</p>
                <p className="text-xs text-gray-600 line-clamp-1">{personality.description}</p>
              </div>
              {selectedPersonality === personality.key && (
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

