import React from "react";
import { Card, Typography } from "@material-tailwind/react";

function SearchForm({
  unitName,
  desc,
  setUnitName,
  setDescName,
  handleSubmit,
  placeholder1,
  placeholder2,
  or,
  butt,
}) {
  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center mt-5 space-x-3.5 p-4 bg-gray-800 dark:bg-gray-900 rounded-lg w-full max-w-xl"
    >
      <button
        type="submit"
        className="px-4 py-2 bg-blue-700 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {butt}
      </button>

      <div className="flex-1">
        <label htmlFor="uName" className="sr-only">
          Unit Name
        </label>
        <input
          onChange={(e) => setUnitName(e.target.value)}
          id="uName"
          type="text"
          name="UOM"
          maxLength="20"
          value={unitName}
          placeholder={`Enter ${placeholder1}`}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <Typography
        variant="small"
        color="blue-gray"
        className="font-normal text-base text-white "
      >
        {or}
      </Typography>
      <div className="flex-1">
        <label htmlFor="uDes" className="sr-only">
          Description
        </label>
        <input
          onChange={(e) => setDescName(e.target.value)}
          id="uDes"
          type="text"
          name="Desc"
          value={desc}
          maxLength="20"
          placeholder={`Enter ${placeholder2}`}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </form>
  );
}

export default SearchForm;
