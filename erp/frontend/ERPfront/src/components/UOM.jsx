import React, { useEffect, useState } from "react";
import { Card, Typography } from "@material-tailwind/react";
import axios from "axios";
import SearchForm from "./SearchForm"; // Adjust the path if needed

const TABLE_HEAD = ["Actions", "Unit Name", "Description"];

const UOM = () => {
  const [unitName, setUnitName] = useState("");
  const [desc, setDescName] = useState("");
  const [tableRows, setTableRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUnit, setEditUnit] = useState({
    old_unit_name: "",
    unit_name: "",
    description: "",
  });

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await axios.get("/api/uom/units");
        console.log(response.data);
        setTableRows(response.data);
      } catch (error) {
        console.error("Error fetching units:", error);
      }
    };

    fetchUnits();
  }, []);

  const handleEdit = (unit_name, description) => {
    setEditUnit({ old_unit_name: unit_name, unit_name, description });
    setModalOpen(true);
  };

  const handleDelete = async (name) => {
    const encodedName = encodeURIComponent(name);
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        const response = await axios.delete(`/api/uom/delete`, {
          data: { encodedName },
        });
        if (response.status === 204) {
          alert(`Deleted ${name}`);
          setTableRows(tableRows.filter((row) => row.unit_name !== name));
        }
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!unitName) {
        alert("Unit Name is required.");
        return;
      }
      const response = await axios.get(`/api/uom/units/${unitName}`);
      if (response.data.exists) {
        alert("Unit Name already exists. Please choose a different name.");
        return;
      }

      await axios.post("/api/uom/add", {
        unitName,
        desc,
      });

      setUnitName("");
      setDescName("");
      alert("Added successfully");

      const updatedResponse = await axios.get("/api/uom/units");
      setTableRows(updatedResponse.data);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleCloseModal = () => {
    setEditUnit({ old_unit_name: "", unit_name: "", description: "" });
    setModalOpen(false);
  };

  const handleUpdate = async () => {
    try {
      if (!editUnit.unit_name) {
        alert("Unit Name is required.");
        return;
      }

      const { old_unit_name, unit_name, description } = editUnit;

      console.log("Sending edit data:", {
        old_unit_name,
        new_unit_name: unit_name,
        description,
      });

      // Check if the new unit name already exists (excluding the old unit name)
      const response = await axios.get(`/api/uom/units/${unit_name}`);
      if (response.data.exists && old_unit_name !== unit_name) {
        alert("Unit Name already exists. Please choose a different name.");
        return;
      }
      // Update the unit
      const updateResponse = await axios.put("/api/uom/edit", {
        old_unit_name,
        new_unit_name: unit_name,
        description,
      });

      if (updateResponse.status === 200) {
        alert("Updated successfully");

        // Fetch the updated list
        const updatedResponse = await axios.get("/api/uom/units");
        setTableRows(updatedResponse.data);
      }

      handleCloseModal();
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditUnit((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen">
      <h1 className="text-center mt-10 mb-10 text-2xl font-bold">UOM</h1>

      {/* Search Form Component */}
      <div className="flex justify-center mt-10 mb-8">
        <SearchForm
          unitName={unitName}
          setUnitName={setUnitName}
          desc={desc}
          setDescName={setDescName}
          handleSubmit={handleSubmit}
          butt="Add"
        />
      </div>

      <Card className="h-full w-full mb-11 flex justify-center items-center overflow-auto shadow-none">
        <div className="w-full max-w-4xl border-2 bg-gray-800 border-gray-800 rounded-lg">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="white"
                      className="font-normal leading-none opacity-100"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map(({ unit_name, description }) => (
                <tr
                  key={unit_name}
                  className={`even:bg-gray-100 odd:bg-gray-200`}
                >
                  <td className="flex items-center space-x-2 pr-6 pl-6  min-h-[4rem]">
                    <Typography
                      as="a"
                      href="#"
                      variant="small"
                      color="blue-gray"
                      className="font-medium cursor-pointer text-sm hover:text-blue-600"
                      onClick={() => handleEdit(unit_name, description)}
                    >
                      EDIT
                    </Typography>
                    <Typography
                      as="a"
                      href="#"
                      variant="small"
                      color="blue-gray"
                      className="font-medium cursor-pointer text-sm hover:text-red-600"
                      onClick={() => handleDelete(unit_name)}
                    >
                      DELETE
                    </Typography>
                  </td>
                  <td className="p-4 max-w-xs whitespace-normal break-words">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal text-base"
                    >
                      {unit_name}
                    </Typography>
                  </td>
                  <td className="p-4 max-w-xs whitespace-normal break-words">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal text-sm"
                    >
                      {description}
                    </Typography>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative">
            <span
              className="absolute top-4 right-4 text-gray-600 text-3xl cursor-pointer"
              onClick={handleCloseModal}
            >
              &times;
            </span>
            <h2 className="text-2xl font-semibold mb-4">Edit UOM</h2>
            <form className="space-y-4">
              <input
                type="text"
                name="unit_name"
                maxLength="20"
                value={editUnit.unit_name}
                onChange={handleEditChange}
                placeholder="Enter Unit Name"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="description"
                value={editUnit.description}
                onChange={handleEditChange}
                maxLength="20"
                placeholder="Enter Description"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleUpdate}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UOM;
