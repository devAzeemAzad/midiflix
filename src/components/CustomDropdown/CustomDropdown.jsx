import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const CustomDropdown = ({ 
  value, 
  onChange, 
  options, 
  borderColor = "orange-500",
  placeholder = "Select..." 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div ref={dropdownRef} className="relative">
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`px-5 py-3 rounded-xl bg-white/10 backdrop-blur-xl text-white border border-${borderColor}/30 shadow-lg hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-${borderColor} font-semibold transition-all duration-300 cursor-pointer flex items-center justify-between gap-3 min-w-[180px]`}
      >
        <span>{selectedOption?.label || placeholder}</span>
        <ChevronDown 
          size={18} 
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden z-[100] max-h-[300px] overflow-y-auto">
          {options.map((opt, index) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`w-full px-5 py-3 text-left font-medium transition-all duration-200 ${
                opt.value === value
                  ? `bg-${borderColor}/20 text-${borderColor} border-l-4 border-${borderColor}`
                  : 'text-white hover:bg-white/10 hover:text-orange-400'
              } ${index !== options.length - 1 ? 'border-b border-white/10' : ''}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
