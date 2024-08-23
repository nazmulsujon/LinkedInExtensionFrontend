import React, { useState } from 'react';

interface Option {
  _id: string;
  name: string;
}

interface CustomSelectProps {
  options: Option[];
  onSelect: (option: Option) => void;
  selectedValue?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, onSelect, selectedValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | undefined>(selectedValue);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSelect = (option: Option) => {
    setSelectedOption(option._id);
    setIsOpen(false);
    onSelect(option);
  };

  return (
    <div className="relative inline-block w-full p-[2px] rounded-md bg-gradient-to-r from-purple-600 to-cyan-500">
      <button
        onClick={handleToggle}
        className="max-w-full w-full flex justify-between items-center truncate bg-gray-200 border border-gray-300 rounded-md px-4 py-2 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 text-[1.1rem] font-semibold">
        <span className="truncate">
          {selectedOption ? options.find(option => option._id === selectedOption)?.name : 'Select an option'}
        </span>

        <svg
          className="size-5 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg">
          {options.map(option => (
            <li
              key={option._id}
              onClick={() => handleSelect(option)}
              className={`flex justify-between items-center px-4 py-2 cursor-pointer text-[1.1rem] font-semibold ${
                option._id === selectedOption ? 'bg-green-600 text-white' : 'hover:bg-gray-100 hover:text-black'
              }`}>
              <span className="max-w-[12.5rem] truncate">{option.name}</span>

              {option._id === selectedOption && (
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
