import React, { useState, useRef, useEffect } from "react";
import SimpleBackdrop from "./LAMC/backDropLoader";
import axios from "axios";

const InputField = ({ segment, prefix = "", onChange, type = "text" }) => {
  return Object.keys(segment).map((key) => (
    <div className="pt-3" key={key}>
      <label
        className="block text-xs font-medium text-gray-700"
        htmlFor={`${prefix}${key}`}
      >
        {key}
      </label>
      <input
        type={key === "Material Code" ? "number" : `${type}`}
        // type={type}
        id={`${prefix}${key}`}
        name={`${prefix}${key}`}
        value={segment[key]}
        placeholder={key}
        className="w-full text-sm h-8 pt-1 pb-1 pl-2 border border-gray-300 rounded-md shadow-sm"
        onChange={onChange}
      />
    </div>
  ));
};

const CreateItemModal = ({ isOpen, onClose }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    general: {
      Year: "",
      "Quote No": "",
      "Serial No": "",
      "Material Code": "",
      "Client Code": "",
      "Material Description": "",
      Drawing: "",
      "Correct Revision": "",
      "Material Grade": "",
    },
    rm1: {
      Od: "",
      Id: "",
      Thickness: "",
    },
    rm2: {
      Od: "",
      Id: "",
      Thickness: "",
    },
    stellite: {
      Od: "",
      Id: "",
      Thickness: "",
    },
    weight: {
      Rm1: "",
      Rm2: "",
      "Total-Rm-Kg": "",
      "Stellite-gm": "",
    },
    processCost: {
      Pm: "",
      Fm: "",
      "Drill/Weld": "",
    },
    rawMaterialCost: {
      "Rm1-Rs/Kg": "",
      "Rm2-Rs/Kg": "",
      "Rm1+Rm2 Rate/qty": "",
    },
    rawMaterialCostWithAllowance: {
      "Rm1+Rm2 wt Kg": "",
      "Rm1+Rm2 Cost": "",
      "Rm3 Wt g": "",
      "Rm3 Cost": "",
    },
    cost: {
      "Total Process Cost": "",
      "Total Cost / No": "",
      "Total Cost No With Margin": "",
      "INR/Cost With Packing": "",
      "USD/Cost With Packing": "",
      "Conversion Rate USD": "",
    },
    remarks: "",
  });
  const handleCreateSubmit = async () => {
    try {
      setOpen(true);
      const mergedData = {
        Year: formData.general?.Year || "",
        "Quote No": formData.general?.["Quote No"] || "",
        "Serial No": formData.general?.["Serial No"] || "0",
        "Material Code": formData.general?.["Material Code"] || "0",
        "Client Code": formData.general?.["Client Code"] || "",
        "Material Description":
          formData.general?.["Material Description"] || "",
        Drawing: formData.general?.Drawing || "0",
        "Correct Revision": formData.general?.["Correct Revision"] || "",
        "Material Grade": formData.general?.["Material Grade"] || "",

        Od_rm1: formData.rm1?.Od_rm1 || "0",
        Id_rm1: formData.rm1?.Id_rm1 || "0",
        Thickness_rm1: formData.rm1?.Thickness_rm1 || "0",

        Od_rm2: formData.rm2?.Od_rm2 || "0",
        Id_rm2: formData.rm2?.Id_rm2 || "0",
        Thickness_rm2: formData.rm2?.Thickness_rm2 || "0",

        Od_stellite: formData.stellite?.Od_stellite || "0",
        Id_stellite: formData.stellite?.Id_stellite || "0",
        Thickness_stellite: formData.stellite?.Thickness_stellite || "0",

        Rm1: formData.weight?.Rm1 || "0",
        Rm2: formData.weight?.Rm2 || "0",
        "Total-Rm-Kg": formData.weight?.["Total-Rm-Kg"] || "0",
        "Stellite-gm": formData.weight?.["Stellite-gm"] || "0",

        Pm: formData.processCost?.Pm || "0",
        Fm: formData.processCost?.Fm || "0",
        "Drill/Weld": formData.processCost?.["Drill/Weld"] || "0",

        "Rm1-Rs/Kg": formData.rawMaterialCost?.["Rm1-Rs/Kg"] || "0",
        "Rm2-Rs/Kg": formData.rawMaterialCost?.["Rm2-Rs/Kg"] || "0",
        "Rm1+Rm2 Rate/qty":
          formData.rawMaterialCost?.["Rm1+Rm2 Rate/qty"] || "0",

        "Rm1+Rm2 wt Kg":
          formData.rawMaterialCostWithAllowance?.["Rm1+Rm2 wt Kg"] || "0",
        "Rm1+Rm2 Cost":
          formData.rawMaterialCostWithAllowance?.["Rm1+Rm2 Cost"] || "0",
        "Rm3 Wt g": formData.rawMaterialCostWithAllowance?.["Rm3 Wt g"] || "0",
        "Rm3 Cost": formData.rawMaterialCostWithAllowance?.["Rm3 Cost"] || "0",

        "Total Process Cost": formData.cost?.["Total Process Cost"] || "0",
        "Total Cost / No": formData.cost?.["Total Cost / No"] || "0",
        "Total Cost No With Margin":
          formData.cost?.["Total Cost No With Margin"] || "0",
        "INR/Cost With Packing":
          formData.cost?.["INR/Cost With Packing"] || "0",
        "USD/Cost With Packing":
          formData.cost?.["USD/Cost With Packing"] || "0",
        "Conversion Rate USD": formData.cost?.["Conversion Rate USD"] || "0",

        remarks: formData.remarks || "",
      };

      // await new Promise((resolve) => setTimeout(resolve, 5000));

      const response = await axios.post("/api/items/create", {
        mergedData,
      });

      if (response.status === 200) {
        alert("Item created successfully!");
        setFormData({
          general: {
            Year: "",
            "Quote No": "",
            "Serial No": "",
            "Material Code": "",
            "Client Code": "",
            "Material Description": "",
            Drawing: "",
            "Correct Revision": "",
            "Material Grade": "",
          },
          rm1: {
            Od: "",
            Id: "",
            Thickness: "",
          },
          rm2: {
            Od: "",
            Id: "",
            Thickness: "",
          },
          stellite: {
            Od: "",
            Id: "",
            Thickness: "",
          },
          weight: {
            Rm1: "",
            Rm2: "",
            "Total-Rm-Kg": "",
            "Stellite-gm": "",
          },
          processCost: {
            Pm: "",
            Fm: "",
            "Drill/Weld": "",
          },
          rawMaterialCost: {
            "Rm1-Rs/Kg": "",
            "Rm2-Rs/Kg": "",
            "Rm1+Rm2 Rate/qty": "",
          },
          rawMaterialCostWithAllowance: {
            "Rm1+Rm2 wt Kg": "",
            "Rm1+Rm2 Cost": "",
            "Rm3 Wt g": "",
            "Rm3 Cost": "",
          },
          cost: {
            "Total Process Cost": "",
            "Total Cost / No": "",
            "Total Cost No With Margin": "",
            "INR/Cost With Packing": "",
            "USD/Cost With Packing": "",
            "Conversion Rate USD": "",
          },
          remarks: "",
        });
        onClose();
      } else if (response.status === 409) {
        alert(response.data.msg); // For conflict (item exists)
      } else {
        alert("Creation failed"); // For other non-200 statuses
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        alert(error.response.data.msg); // Specific error message from server
      } else {
        alert("An error occurred during creation. Please try again.");
      }
      console.error("Error creating item:", error);
    } finally {
      setOpen(false);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    setFormData((prev) => {
      const updateNested = (data, keys, value) => {
        if (keys.length === 1) {
          return { ...data, [keys[0]]: value };
        }
        return {
          ...data,
          [keys[0]]: updateNested(data[keys[0]], keys.slice(1), value),
        };
      };

      return updateNested(prev, keys, value);
    });
  };

  const modalRef = useRef(null); // Create a ref for the modal content

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose(); // Close modal if click is outside
    }
  };
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.body.style.overflow = "auto";
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.body.style.overflow = "auto"; // Clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={modalRef}
        className="bg-gray-300 p-6 rounded-lg shadow-xl max-w-5xl w-auto relative max-h-screen overflow-auto"
      >
        <span
          className="absolute top-4 right-4 text-gray-600 text-3xl cursor-pointer"
          onClick={onClose}
        >
          &times;
        </span>
        <h2 className="text-2xl font-semibold mb-4">Create New Item</h2>
        <form className="sm:grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-rows-4 gap-3">
          {/* General Information */}
          <div className="shadow-2xl p-4 bg-white rounded-md col-span-1 row-span-2">
            <h3 className="text-base font-semibold mb-2">
              General Information
            </h3>
            <InputField
              segment={formData.general}
              prefix="general."
              onChange={handleChange}
            />
          </div>

          {/* RM1 Segment */}
          <div className="shadow-2xl p-4 bg-white rounded-md col-span-1 row-span-1">
            <h3 className="text-base font-semibold mb-2">RM1</h3>
            <InputField
              segment={formData.rm1}
              prefix="rm1."
              onChange={handleChange}
              type="number" // Make this input accept only numbers
            />
          </div>

          {/* RM2 Segment */}
          <div className="shadow-2xl p-4 bg-white rounded-md col-span-1 row-span-1">
            <h3 className="text-base font-semibold mb-2">RM2</h3>
            <InputField
              segment={formData.rm2}
              prefix="rm2."
              onChange={handleChange}
              type="number" // Make this input accept only numbers
            />
          </div>

          {/* Stellite Segment */}
          <div className="shadow-2xl p-4 bg-white rounded-md col-span-1 row-span-1">
            <h3 className="text-base font-semibold mb-2">Stellite</h3>
            <InputField
              segment={formData.stellite}
              prefix="stellite."
              onChange={handleChange}
              type="number" // Make this input accept only numbers
            />
          </div>

          {/* Weight Segment */}
          <div className="shadow-2xl p-4 bg-white rounded-md col-span-1 row-span-1">
            <h3 className="text-base font-semibold mb-2">Weight</h3>
            <InputField
              segment={formData.weight}
              prefix="weight."
              onChange={handleChange}
              type="number" // Make this input accept only numbers
            />
          </div>

          {/* Process Cost Segment */}
          <div className="shadow-2xl p-4 bg-white rounded-md col-span-1 row-span-1">
            <h3 className="text-base font-semibold mb-2">Process Cost</h3>
            <InputField
              segment={formData.processCost}
              prefix="processCost."
              onChange={handleChange}
              type="number" // Make this input accept only numbers
            />
          </div>

          {/* Raw Material Cost Segment */}
          <div className="shadow-2xl p-4 bg-white rounded-md col-span-1 row-span-1">
            <h3 className="text-base font-semibold mb-2">Raw Material Cost</h3>
            <InputField
              segment={formData.rawMaterialCost}
              prefix="rawMaterialCost."
              onChange={handleChange}
              type="number" // Make this input accept only numbers
            />
          </div>

          {/* Raw Material Cost with Allowance Segment */}
          <div className="shadow-2xl p-4 bg-white rounded-md col-span-1 row-span-1">
            <h3 className="text-base font-semibold mb-2">
              Raw Material Cost with Allowance
            </h3>
            <InputField
              segment={formData.rawMaterialCostWithAllowance}
              prefix="rawMaterialCostWithAllowance."
              onChange={handleChange}
              type="number" // Make this input accept only numbers
            />
          </div>

          {/* Cost Segment */}
          <div className="shadow-2xl p-4 bg-white rounded-md col-span-1 row-span-2">
            <h3 className="text-base font-semibold mb-2">Cost</h3>
            <InputField
              segment={formData.cost}
              prefix="cost."
              onChange={handleChange}
              type="number" // Make this input accept only numbers
            />
          </div>

          {/* Remarks */}
          <div className="shadow-2xl p-4 bg-white rounded-md col-span-1 row-span-1">
            <label
              className="block text-xs font-medium text-gray-700"
              htmlFor="remarks"
            >
              REMARKS
            </label>
            <input
              type="text"
              name="remarks"
              value={formData.remarks}
              placeholder="Remarks"
              className="w-full text-sm h-8 pt-1 pb-1 pl-2 border border-gray-300 rounded-md shadow-sm"
              onChange={handleChange}
            />
          </div>
          {/* Submit Button */}
        </form>

        <div className="flex justify-center mt-7 mb-7">
          <button
            type="button"
            className="w-3/6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 col-span-auto"
            style={{ height: "2.5rem" }}
            onClick={handleCreateSubmit}
          >
            Create
          </button>
        </div>
      </div>
      <SimpleBackdrop open={open} />
    </div>
  );
};

export default CreateItemModal;
