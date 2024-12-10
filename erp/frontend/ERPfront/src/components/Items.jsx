import React, { useState } from "react";
import axios from "axios";
import { Card, Typography } from "@material-tailwind/react";
import SearchForm from "./SearchForm";
import CreateItemModal from "./CreateItemModal";
import ViewItemModal from "./ViewItemModal";
import CircularIndeterminate from "./LAMC/loader_circular";
function Items() {
  const [matCode, setmatCode] = useState("");
  const [desc, setDescName] = useState("");
  const [tableRows, setTableRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalViewOpen, setModalViewOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreate = () => {
    setModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!matCode && !desc) {
        alert("Input is required.");
        return;
      }
      setLoading(true);
      const response = await axios.post("/api/items/search", {
        MaterialCode: matCode,
        DrawingNo: desc,
      });
      setTableRows(response.data);
      setmatCode("");
      setDescName("");
    } catch (error) {
      alert("Item not found");
      console.error("Error searching item:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    setModalEditOpen(true);
    setModalViewOpen(true);
  };
  const handleView = async () => {
    setModalEditOpen(false);
    setModalViewOpen(true);
  };
  const handleDelete = async (matCode) => {
    console.log(matCode);
    if (confirm("Data will be deleted forever. Are you sure?")) {
      try {
        const response = await axios.delete("/api/items/deleteItem", {
          data: { matCode }, // Use `data` to send the request body
        });
        if (response.status === 204) {
          alert(`Deleted item: ${matCode}`);
          setTableRows([]);
        }
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  return (
    <div className="min-h-screen">
      <h1 className="text-center mt-10 mb-10 text-2xl font-bold">ITEMS</h1>
      <div className="flex flex-col items-center justify-center mb-8">
        <button
          type="button"
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-700 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Create
        </button>
        <SearchForm
          unitName={matCode}
          desc={desc}
          setUnitName={setmatCode}
          setDescName={setDescName}
          handleSubmit={handleSubmit}
          placeholder1={"Material Code"}
          placeholder2={"Drawing"}
          or={"OR"}
          butt="Search"
        />
      </div>

      <Card className="h-full w-full mb-11 flex justify-center items-center overflow-auto shadow-none">
        <div className="w-full max-w-6xl border-2 bg-gray-800 border-gray-800 rounded-lg overflow-x-auto">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                <th
                  className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                  style={{ minWidth: "8rem" }}
                >
                  <Typography
                    variant="small"
                    color="white"
                    className="font-normal leading-none opacity-100"
                  >
                    Actions
                  </Typography>
                </th>
                {[
                  "Material Code",
                  "Description",
                  "Grade",
                  "Cost / Qty - USD",
                  "Drawing Number",
                ].map((head) => (
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
              {loading ? (
                <tr>
                  <td colSpan="6" className="bg-gray-200 p-2">
                    <div className="flex justify-center items-center">
                      <CircularIndeterminate />
                    </div>
                  </td>
                </tr>
              ) : (
                tableRows.map(
                  ({ mat_code, mat_desc, mat_grade, c_pack, drawing }) => (
                    <tr
                      key={mat_code}
                      className={`even:bg-gray-100 odd:bg-gray-200`}
                    >
                      <td className="flex items-center space-x-2 pr-6 pl-6 min-h-[4rem]">
                        <Typography
                          as="a"
                          variant="small"
                          color="blue-gray"
                          className="font-medium cursor-pointer text-sm hover:text-blue-600"
                          onClick={handleView}
                        >
                          VIEW
                        </Typography>
                        <Typography
                          as="a"
                          href="#"
                          variant="small"
                          color="blue-gray"
                          className="font-medium cursor-pointer text-sm hover:text-blue-600"
                          onClick={handleEdit}
                        >
                          EDIT
                        </Typography>
                        <Typography
                          as="a"
                          href="#"
                          variant="small"
                          color="blue-gray"
                          className="font-medium cursor-pointer text-sm hover:text-red-600"
                          onClick={() => handleDelete(mat_code)}
                        >
                          DELETE
                        </Typography>
                      </td>
                      <td className="p-4 max-w-xs whitespace-nowrap overflow-hidden text-ellipsis">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal text-base"
                        >
                          {mat_code}
                        </Typography>
                      </td>
                      <td className="p-4 max-w-xs whitespace-nowrap overflow-hidden text-ellipsis">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal text-base"
                        >
                          {mat_desc}
                        </Typography>
                      </td>
                      <td className="p-4 max-w-xs whitespace-nowrap overflow-hidden text-ellipsis">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal text-base"
                        >
                          {mat_grade}
                        </Typography>
                      </td>
                      <td className="p-4 max-w-xs whitespace-nowrap overflow-hidden text-ellipsis">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal text-base"
                        >
                          {c_pack}
                        </Typography>
                      </td>
                      <td className="p-4 max-w-xs whitespace-nowrap overflow-hidden text-ellipsis">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal text-base"
                        >
                          {drawing}
                        </Typography>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <CreateItemModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <ViewItemModal
        viewData={tableRows}
        isOpen={modalViewOpen}
        onClose={() => setModalViewOpen(false)}
        editable={modalEditOpen}
      />
    </div>
  );
}

export default Items;
