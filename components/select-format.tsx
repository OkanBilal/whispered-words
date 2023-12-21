import React from "react";

interface SelectFormatProps {
  options: Array<string>;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  defaultValue?: string;
}
export default function SelectFormat({
  options,
  onChange,
  defaultValue,
}: SelectFormatProps) {
  return (
    <div className="mt-4">
      <label className="block my-2 text-sm font-medium text-gray-500">
        Select transcript format
      </label>
      <div className="relative flex items-center">
        <select
          onChange={onChange}
          defaultValue={defaultValue}
          className="block text-black appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
        >
          {options.map((item, index) => (
            <option className="text-black" key={index} value={item}>
              {item}
            </option>
          ))}
        </select>
        <div className="absolute pointer-events-none text-gray-700 right-2">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M5.705 7l4.295 4.295L14.295 7 16 8.705l-6 6-6-6z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
