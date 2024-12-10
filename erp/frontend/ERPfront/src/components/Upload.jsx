import React, { useState } from "react";
import axios from "axios";

function Upload() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [checkboxChecked, setCheckboxChecked] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (
      selectedFile &&
      selectedFile.type !==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
      selectedFile.type !== "application/vnd.ms-excel"
    ) {
      setError("Please upload an Excel file.");
      setFile(null);
    } else {
      setFile(selectedFile);
      setError("");
    }
  };

  const handleCheckboxChange = (event) => {
    setCheckboxChecked(event.target.checked);
  };

  const handleSubmitUpload = async (event) => {
    event.preventDefault();

    if (!file) {
      setError("Please choose a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("CheckboxChecked", checkboxChecked); // Add checkbox state to form data

    try {
      const response = await axios.post("/api/upload/uploadExcel", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess("File uploaded successfully");
      setError(""); // Clear any previous error
      console.log("File uploaded successfully:", response.data);
    } catch (error) {
      // Check if the response contains 'nooverride' flag
      if (
        error.response &&
        error.response.data &&
        error.response.data.nooverride
      ) {
        setError("One  or more similar items found.");
      } else {
        setError("Failed to upload file.");
      }
      console.error("Error uploading file:", error);
      setSuccess(""); // Clear any previous success message
    }
  };

  return (
    <div className="flex mt-11 mb-11 flex-col min-h-screen">
      <h1 className="text-center mt-10 mb-10 text-2xl font-bold">
        UPLOAD ITEMS
      </h1>
      <form className="max-w-2xl mx-auto px-4" onSubmit={handleSubmitUpload}>
        <label
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-900"
          htmlFor="file_upload"
        >
          Upload Excel File
        </label>
        <input
          className="block w-full p-5 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          aria-describedby="file_upload_help"
          id="file_upload"
          type="file"
          onChange={handleFileChange}
          accept=".xlsx,.xls"
        />
        <div className="flex items-center mt-4">
          <input
            id="checkbox"
            type="checkbox"
            checked={checkboxChecked}
            onChange={handleCheckboxChange}
            className="mr-2"
          />
          <label
            htmlFor="checkbox"
            className="text-sm text-gray-900 dark:text-gray-900"
          >
            Over-Write
          </label>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-500 mt-2">{success}</p>}
        <button
          type="submit"
          className="w-full py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Upload
        </button>
      </form>
    </div>
  );
}

export default Upload;
