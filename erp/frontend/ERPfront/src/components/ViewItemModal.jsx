import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import SimpleBackdrop from "./LAMC/backDropLoader";
const InputField = ({
  segment,
  prefix = "",
  onChange,
  type = "text",
  editable,
}) => {
  return Object.keys(segment).map((key) => {
    const isMaterialCode = key === "Material Code";
    const isDrawing = key === "Drawing";
    // Make field read-only if not editable or if it is Material Code or Drawing
    const isReadOnly = !editable || isMaterialCode || isDrawing;

    return (
      <div className="pt-3" key={key}>
        <label
          className="block text-xs font-medium text-gray-700"
          htmlFor={`${prefix}${key}`}
        >
          {key}
        </label>

        <input
          type={isMaterialCode ? "number" : type}
          id={`${prefix}${key}`}
          name={`${prefix}${key}`}
          value={segment[key] || ""}
          placeholder={key}
          className="w-full text-sm h-8 pt-1 pb-1 pl-2 border border-gray-300 rounded-md shadow-sm"
          readOnly={isReadOnly} // Make field read-only based on isReadOnly
          onChange={editable ? onChange : undefined} // Only add onChange if editable
        />
      </div>
    );
  });
};

const ViewItemModal = ({ isOpen, onClose, viewData, editable = false }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    general: {},
    rm1: {},
    rm2: {},
    stellite: {},
    weight: {},
    processCost: {},
    rawMaterialCost: {},
    rawMaterialCostWithAllowance: {},
    cost: {},
    remarks: "",
  });
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
  useEffect(() => {
    if (viewData && viewData.length > 0) {
      const dataofView = viewData[0] || {};
      setFormData({
        general: {
          Year: dataofView.y || "",
          "Quote No": dataofView.q || "",
          "Serial No": dataofView.sn || "0",
          "Material Code": dataofView.mat_code || "",
          "Client Code": dataofView.cli_code || "",
          "Material Description": dataofView.mat_desc || "",
          Drawing: dataofView.drawing || "",
          "Correct Revision": dataofView.correct_rev || "",
          "Material Grade": dataofView.mat_grade || "",
        },
        rm1: {
          Od: dataofView.rm1_od || "0",
          Id: dataofView.rm1_id || "0",
          Thickness: dataofView.rm1_t || "0",
        },
        rm2: {
          Od: dataofView.rm2_od || "0",
          Id: dataofView.rm2_id || "0",
          Thickness: dataofView.rm2_t || "0",
        },
        stellite: {
          Od: dataofView.ste_od || "0",
          Id: dataofView.ste_id || "0",
          Thickness: dataofView.ste_t || "0",
        },
        weight: {
          Rm1: dataofView.w_rm1 || "0",
          Rm2: dataofView.w_rm2 || "0",
          "Total-Rm-Kg": dataofView.w_tot_rm || "0",
          "Stellite-gm": dataofView.w_st6 || "0",
        },
        processCost: {
          Pm: dataofView.pm || "0",
          Fm: dataofView.fm || "0",
          "Drill/Weld": dataofView.drill || "0",
        },
        rawMaterialCost: {
          "Rm1-Rs/Kg": dataofView.c_rm1 || "0",
          "Rm2-Rs/Kg": dataofView.c_rm2 || "0",
          "Rm1+Rm2 Rate/qty": dataofView["c_rm1+rm2"] || "0",
        },
        rawMaterialCostWithAllowance: {
          "Rm1+Rm2 wt Kg": dataofView["wa_rm1+rm2"] || "0",
          "Rm1+Rm2 Cost": dataofView["ca_rm1+rm2"] || "0",
          "Rm3 Wt g": dataofView.wa_rm3 || "0",
          "Rm3 Cost": dataofView.ca_rm3 || "0",
        },
        cost: {
          "Total Process Cost": dataofView.tpc || "0",
          "Total Cost / No": dataofView.tc || "0",
          "Total Cost No With Margin": dataofView.tcm || "0",
          "INR/Cost With Packing": dataofView.tc_inr || "0",
          "USD/Cost With Packing": dataofView.c_pack || "0", // Updated to correct field
          "Conversion Rate USD": dataofView.conv_rate || "0",
        },
        remarks: dataofView.remarks || "",
      });
    }
  }, [viewData]);
  const handleEditSubmit = async () => {
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
      console.log(mergedData);
      const response = await axios.patch("/api/items/updateItem", {
        mergedData,
      });

      if (response.status === 200) {
        alert("Update successful");
        onClose();
      } else {
        alert("Update failed");
      }
    } catch (error) {
      console.error("Error updating item:", error);
      alert("An error occurred");
    } finally {
      setOpen(false);
    }
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
      document.body.style.overflow = "auto";
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
        <h2 className="text-2xl font-semibold mb-4">View Item Details</h2>
        <form className="sm:grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-rows-4 gap-3">
          {/* General Information */}
          <div className="shadow-2xl p-4 bg-white rounded-md col-span-1 row-span-2">
            <h3 className="text-base font-semibold mb-2">
              General Information
            </h3>
            <InputField
              segment={formData.general}
              prefix="general."
              editable={editable} // Editable flag passed
              type="text"
              onChange={handleChange}
            />
          </div>

          {/* Other Segments */}
          {/* RM1 Segment */}
          <div className="shadow-2xl p-4 bg-white rounded-md col-span-1 row-span-1">
            <h3 className="text-base font-semibold mb-2">RM1</h3>
            <InputField
              segment={formData.rm1}
              prefix="rm1."
              type="number"
              editable={editable} // Editable flag passed
              onChange={handleChange}
            />
          </div>

          {/* RM2 Segment */}
          <div className="shadow-2xl p-4 bg-white rounded-md col-span-1 row-span-1">
            <h3 className="text-base font-semibold mb-2">RM2</h3>
            <InputField
              segment={formData.rm2}
              prefix="rm2."
              type="number"
              editable={editable} // Editable flag passed
              onChange={handleChange}
            />
          </div>

          {/* Stellite Segment */}
          <div className="shadow-2xl p-4 bg-white rounded-md col-span-1 row-span-1">
            <h3 className="text-base font-semibold mb-2">Stellite</h3>
            <InputField
              segment={formData.stellite}
              prefix="stellite."
              type="number"
              editable={editable} // Editable flag
              onChange={handleChange}
            />
          </div>

          {/* Weight Segment */}
          <div className="shadow-2xl p-4 bg-white rounded-md col-span-1 row-span-1">
            <h3 className="text-base font-semibold mb-2">Weight</h3>
            <InputField
              segment={formData.weight}
              prefix="weight."
              type="number"
              editable={editable} // Editable flag passed
              onChange={handleChange}
            />
          </div>

          {/* Process Cost Segment */}
          <div className="shadow-2xl p-4 bg-white rounded-md col-span-1 row-span-1">
            <h3 className="text-base font-semibold mb-2">Process Cost</h3>
            <InputField
              segment={formData.processCost}
              prefix="processCost."
              type="number"
              editable={editable} // Editable flag passed
              onChange={handleChange}
            />
          </div>

          {/* Raw Material Cost Segment */}
          <div className="shadow-2xl p-4 bg-white rounded-md col-span-1 row-span-1">
            <h3 className="text-base font-semibold mb-2">Raw Material Cost</h3>
            <InputField
              segment={formData.rawMaterialCost}
              prefix="rawMaterialCost."
              type="number"
              editable={editable} // Editable flag passed
              onChange={handleChange}
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
              type="number"
              editable={editable} // Editable flag passed
              onChange={handleChange}
            />
          </div>

          {/* Cost Segment */}
          <div className="shadow-2xl p-4 bg-white rounded-md col-span-1 row-span-2">
            <h3 className="text-base font-semibold mb-2">Cost</h3>
            <InputField
              segment={formData.cost}
              prefix="cost."
              type="number"
              editable={editable} // Editable flag passed
              onChange={handleChange}
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
              readOnly={!editable} // Editable flag passed
              onChange={handleChange}
            />
          </div>
        </form>
        <div className="flex justify-center mt-7 mb-7">
          <button
            type="button"
            className="w-3/6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 col-span-auto"
            style={{ height: "2.5rem" }}
            onClick={editable ? handleEditSubmit : onClose}
          >
            {editable ? "Save" : "Close"}
          </button>
        </div>
      </div>
      <SimpleBackdrop open={open} />
    </div>
  );
};

export default ViewItemModal;
