import express from "express";
const router = express.Router();
import pool from "../DB/dbpg.js";

const Updater = `UPDATE public.item_master_o
SET 
  y = $1,
  q = $2,
  sn = $3,
  mat_code = $4,
  cli_code = $5,
  mat_desc = $6,
  drawing = $7,
  correct_rev = $8,
  mat_grade = $9,
  rm1_od = $10,
  rm1_id = $11,
  rm1_t = $12,
  rm2_od = $13,
  rm2_id = $14,
  rm2_t = $15,
  ste_od = $16,
  ste_id = $17,
  ste_t = $18,
  w_rm1 = $19,
  w_rm2 = $20,
  w_tot_rm = $21,
  w_st6 = $22,
  pm = $23,
  fm = $24,
  drill = $25,
  c_rm1 = $26,
  c_rm2 = $27,
  "c_rm1+rm2" = $28,
  "wa_rm1+rm2" = $29,
  "ca_rm1+rm2" = $30,
  wa_rm3 = $31,
  ca_rm3 = $32,
  tpc = $33,
  tc = $34,
  tcm = $35,
  tc_inr = $36,
  c_pack = $37,
  conv_rate = $38,
  remarks = $39
WHERE mat_code = $4 AND drawing $7; `

let unitfinder = ``;
router.patch('/updateItem', async (req, res) => {
  console.log("UPDATE");
  console.log(req.body);

  const { mergedData } = req.body;

const {
    Year: y, 
    "Quote No": q, 
    'Serial No': sn, 
    'Material Code': mat_code, 
    'Client Code': cli_code, 
    'Material Description': mat_desc, 
    Drawing: drawing, 
    'Correct Revision': correct_rev, 
    'Material Grade': mat_grade,
    Od_rm1: rm1_od, 
    Id_rm1: rm1_id, 
    Thickness_rm1: rm1_t, 
    Od_rm2: rm2_od, 
    Id_rm2: rm2_id, 
    Thickness_rm2: rm2_t,
    Od_stellite: ste_od,
    Id_stellite: ste_id,
    Thickness_stellite: ste_t,
    Rm1: w_rm1,
    Rm2: w_rm2,
    'Total-Rm-Kg': w_tot_rm, 
    'Stellite-gm': w_st6, 
    Pm: pm, 
    Fm: fm, 
    'Drill/Weld': drill, 
    'Rm1-Rs/Kg': c_rm1, 
    'Rm2-Rs/Kg': c_rm2, 
    'Rm1+Rm2 Rate/qty': c_rm1_rm2, 
    'Rm1+Rm2 wt Kg': wa_rm1_rm2, 
    'Rm1+Rm2 Cost': ca_rm1_rm2, 
    'Rm3 Wt g': wa_rm3, 
    'Rm3 Cost': ca_rm3, 
    'Total Process Cost': tpc, 
    'Total Cost / No': tc, 
    'Total Cost No With Margin': tcm, 
    'INR/Cost With Packing': tc_inr, 
    'USD/Cost With Packing': c_pack, 
    'Conversion Rate USD': conv_rate, 
    remarks
} = mergedData || {};
  const query = `
    UPDATE public.item_master_o 
    SET 
      y = $1, q = $2, sn = $3, cli_code = $4, mat_desc = $5, drawing = $6, 
      correct_rev = $7, mat_grade = $8, rm1_od = $9, rm1_id = $10, 
      rm1_t = $11, rm2_od = $12, rm2_id = $13, rm2_t = $14, ste_od = $15, 
      ste_id = $16, ste_t = $17, w_rm1 = $18, w_rm2 = $19, w_tot_rm = $20, 
      w_st6 = $21, pm = $22, fm = $23, drill = $24, c_rm1 = $25, c_rm2 = $26, 
      "c_rm1+rm2" = $27, "wa_rm1+rm2" = $28, "ca_rm1+rm2" = $29, wa_rm3 = $30, 
      ca_rm3 = $31, tpc = $32, tc = $33, tcm = $34, tc_inr = $35, c_pack = $36, 
      conv_rate = $37, remarks = $38
    WHERE mat_code = $39 AND drawing = $6 RETURNING *
  `;

  try {
    const reu = await pool.query(query, [
      y, q, sn, cli_code, mat_desc, drawing, correct_rev, mat_grade,
      rm1_od, rm1_id, rm1_t, rm2_od, rm2_id, rm2_t, ste_od, ste_id, ste_t,
      w_rm1, w_rm2, w_tot_rm, w_st6, pm, fm, drill, c_rm1, c_rm2, c_rm1_rm2,
      wa_rm1_rm2, ca_rm1_rm2, wa_rm3, ca_rm3, tpc, tc, tcm, tc_inr, c_pack,
      conv_rate, remarks, mat_code
    ]);

    console.log(`Rows affected: ${reu.rowCount}`);
    if (reu.rows.length > 0) {
      console.log(reu.rows[0]);
      res.status(200).send('Updated');
    } else {
      res.status(404).send('No rows updated');
    }
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).send('Update failed');
  }
});
const searchQuery = (name)=>{
  unitfinder = `
  SELECT y, q, sn, mat_code, cli_code, mat_desc, drawing, correct_rev, mat_grade, rm1_od, rm1_id, rm1_t, 
        rm2_od, rm2_id, rm2_t, ste_od, ste_id, ste_t, w_rm1, w_rm2, w_tot_rm, w_st6, pm, fm, drill, 
        c_rm1, c_rm2, "c_rm1+rm2", "wa_rm1+rm2", "ca_rm1+rm2", wa_rm3, ca_rm3, tpc, tc, tcm, 
        tc_inr, c_pack, conv_rate, remarks FROM public.item_master_o
  WHERE ${name} = $1
`;

}
router.post('/create', async (req, res) => {
  console.log("CREATE");

  const { mergedData } = req.body;
  console.log(mergedData);
  
  const {
    Year: y, 
    "Quote No": q, 
    'Serial No': sn, 
    'Material Code': mat_code, 
    'Client Code': cli_code, 
    'Material Description': mat_desc, 
    Drawing: drawing, 
    'Correct Revision': correct_rev, 
    'Material Grade': mat_grade,
    Od_rm1: rm1_od, 
    Id_rm1: rm1_id, 
    Thickness_rm1: rm1_t, 
    Od_rm2: rm2_od, 
    Id_rm2: rm2_id, 
    Thickness_rm2: rm2_t,
    Od_stellite: ste_od,
    Id_stellite: ste_id,
    Thickness_stellite: ste_t,
    Rm1: w_rm1,
    Rm2: w_rm2,
    'Total-Rm-Kg': w_tot_rm, 
    'Stellite-gm': w_st6, 
    Pm: pm, 
    Fm: fm, 
    'Drill/Weld': drill, 
    'Rm1-Rs/Kg': c_rm1, 
    'Rm2-Rs/Kg': c_rm2, 
    'Rm1+Rm2 Rate/qty': c_rm1_rm2, 
    'Rm1+Rm2 wt Kg': wa_rm1_rm2, 
    'Rm1+Rm2 Cost': ca_rm1_rm2, 
    'Rm3 Wt g': wa_rm3, 
    'Rm3 Cost': ca_rm3, 
    'Total Process Cost': tpc, 
    'Total Cost / No': tc, 
    'Total Cost No With Margin': tcm, 
    'INR/Cost With Packing': tc_inr, 
    'USD/Cost With Packing': c_pack, 
    'Conversion Rate USD': conv_rate, 
    remarks
  } = mergedData;

  const checkQuery = `
    SELECT * FROM public.item_master_o 
    WHERE mat_code = $1 AND drawing = $2
  `;

  const insertQuery = `
    INSERT INTO public.item_master_o (
      y, q, sn, mat_code, cli_code, mat_desc, drawing, correct_rev, mat_grade, 
      rm1_od, rm1_id, rm1_t, rm2_od, rm2_id, rm2_t, ste_od, ste_id, 
      ste_t, w_rm1, w_rm2, w_tot_rm, w_st6, pm, fm, drill, c_rm1, 
      c_rm2, "c_rm1+rm2", "wa_rm1+rm2", "ca_rm1+rm2", wa_rm3, ca_rm3, 
      tpc, tc, tcm, tc_inr, c_pack, conv_rate, remarks
    ) 
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 
      $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, 
      $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37 , $38 , $39
    )
    RETURNING *
  `;

  try {
    // Check if item with mat_code and drawing already exists
    const existingItem = await pool.query(checkQuery, [mat_code, drawing]);

    if (existingItem.rows.length > 0) {
      res.status(409).json({ msg: 'Item with this Material Code and Drawing already exists' });
    } else {
      // Proceed with insert
      const result = await pool.query(insertQuery, [
        y, q, sn, mat_code, cli_code, mat_desc, drawing, correct_rev, mat_grade,
        rm1_od, rm1_id, rm1_t, rm2_od, rm2_id, rm2_t, ste_od, ste_id, ste_t,
        w_rm1, w_rm2, w_tot_rm, w_st6, pm, fm, drill, c_rm1, c_rm2, c_rm1_rm2,
        wa_rm1_rm2, ca_rm1_rm2, wa_rm3, ca_rm3, tpc, tc, tcm, tc_inr, c_pack,
        conv_rate, remarks
      ]);

      console.log(`Rows affected: ${result.rowCount}`);
      if (result.rows.length > 0) {
        res.status(200).json({ msg: 'Item created successfully' });
      } else {
        res.status(400).json({ msg: 'Creation failed' });
      }
    }
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ msg: 'Server error. Please try again later.' });
  }
});

router.delete('/deleteItem' , async(req,res)=>{
  console.log(req.body);
  const { matCode } = req.body;
  try {
    console.log(`DADADADS ${matCode}`)
    const result = await pool.query('DELETE FROM public.item_master_o WHERE mat_code = $1', [matCode]);
    console.log(`Delete result: ${result.rowCount} rows affected`);
    res.status(204).end(); // No content to return
  } catch (err) {
    console.error('Error deleting unit', err.stack);
    res.status(500).json({ error: "Internal server error" });
  }
  
});
router.post('/search', async (req, res) => {
  const { MaterialCode, DrawingNo } = req.body;
  console.log("Received data:", { MaterialCode, DrawingNo });

  try {
    if (MaterialCode) {
      searchQuery("mat_code");
      const result = await pool.query(unitfinder, [MaterialCode]);
      console.log("Query result:", result.rows); // Log the query result
      res.json(result.rows);
    }
    else if (DrawingNo) {
      searchQuery("drawing");
      const result = await pool.query(unitfinder, [DrawingNo]);
      console.log("Query result:", result.rows); // Log the query result
      res.json(result.rows);
    }
    else {
      res.status(400).json({ message: "MaterialCode or DrawingNo is required" });
    }
    // Send the query result as a JSON response
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "Error executing query" });
  }
});

export default router;
