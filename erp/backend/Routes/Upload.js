import express from 'express';
import multer from 'multer';
import xlsx from 'xlsx';
import pool from "../DB/dbpg.js"; // Import the PostgreSQL connection pool

const router = express.Router();

// Configure multer to store uploaded files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to handle Excel file upload
router.post('/uploadExcel', upload.single('file'), async (req, res) => {
  const buffer = req.file.buffer;
  const checkboxChecked = req.body.CheckboxChecked === 'true'; // Extract checkbox value
  console.log(checkboxChecked);
  // Read and parse the Excel file
  const workbook = xlsx.read(buffer, { type: 'buffer' });
  const sheetNames = workbook.SheetNames;
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[0]], {
    header: 1,
    range: 2, // Skip the header row
  });

  console.log('Checkbox checked:', checkboxChecked);
  console.log('Data from file:', data);
  const client = await pool.connect();
  const processRow = (row) => {
    if (!row.length) return null; // Skip empty rows

    // Ensure row has exactly 39 elements, fill missing with null
    while (row.length < 39) {
      row.push(null);
    }

    // Convert empty strings or placeholders to null
    return row.map(field => field === '' || field === '<1 empty item>' ? null : field);
  };
  if (checkboxChecked) {
    try {
      // Get a client from the pool
      await client.query('BEGIN'); // Start a transaction
      // Insert or update records in the database
      const query = `
      INSERT INTO public.item_master_o (
        y, q, sn, mat_code, cli_code, mat_desc, drawing, correct_rev, mat_grade, rm1_od, rm1_id, rm1_t, 
        rm2_od, rm2_id, rm2_t, ste_od, ste_id, ste_t, w_rm1, w_rm2, w_tot_rm, w_st6, pm, fm, drill, 
        c_rm1, c_rm2, "c_rm1+rm2", "wa_rm1+rm2", "ca_rm1+rm2", wa_rm3, ca_rm3, tpc, tc, tcm, 
        tc_inr, c_pack, conv_rate, remarks
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, 
              $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, 
              $37, $38, $39)
      ON CONFLICT (mat_code) 
      DO UPDATE SET 
        y = EXCLUDED.y, q = EXCLUDED.q, sn = EXCLUDED.sn, cli_code = EXCLUDED.cli_code, 
        mat_desc = EXCLUDED.mat_desc, drawing = EXCLUDED.drawing, correct_rev = EXCLUDED.correct_rev, 
        mat_grade = EXCLUDED.mat_grade, rm1_od = EXCLUDED.rm1_od, rm1_id = EXCLUDED.rm1_id, 
        rm1_t = EXCLUDED.rm1_t, rm2_od = EXCLUDED.rm2_od, rm2_id = EXCLUDED.rm2_id, 
        rm2_t = EXCLUDED.rm2_t, ste_od = EXCLUDED.ste_od, ste_id = EXCLUDED.ste_id, ste_t = EXCLUDED.ste_t, 
        w_rm1 = EXCLUDED.w_rm1, w_rm2 = EXCLUDED.w_rm2, w_tot_rm = EXCLUDED.w_tot_rm, w_st6 = EXCLUDED.w_st6, 
        pm = EXCLUDED.pm, fm = EXCLUDED.fm, drill = EXCLUDED.drill, c_rm1 = EXCLUDED.c_rm1, 
        c_rm2 = EXCLUDED.c_rm2, "c_rm1+rm2" = EXCLUDED."c_rm1+rm2", "wa_rm1+rm2" = EXCLUDED."wa_rm1+rm2", 
        "ca_rm1+rm2" = EXCLUDED."ca_rm1+rm2", wa_rm3 = EXCLUDED.wa_rm3, ca_rm3 = EXCLUDED.ca_rm3, 
        tpc = EXCLUDED.tpc, tc = EXCLUDED.tc, tcm = EXCLUDED.tcm, tc_inr = EXCLUDED.tc_inr, 
        c_pack = EXCLUDED.c_pack, conv_rate = EXCLUDED.conv_rate, remarks = EXCLUDED.remarks;
    `;
      for (const row of data) {
        const processedRow = processRow(row);
        if (processedRow) {
          console.log("success");
          await client.query(query, processedRow);
        }
      }
      await client.query('COMMIT'); // Commit the transaction
      client.release();
      res.send('File uploaded and processed successfully.');
    } catch (error) {
      await client.query('ROLLBACK'); // Rollback the transaction on error
      console.error('Error processing file:', error);
      client.release();
      res.status(500).send('Error processing file.');

    }
  } else {
    try { // Get a client from the pool
      await client.query('BEGIN'); // Start a transaction
      // Insert
      const query = `
          INSERT INTO public.item_master_o (
            y, q, sn, mat_code, cli_code, mat_desc, drawing, correct_rev, mat_grade, rm1_od, rm1_id, rm1_t, 
            rm2_od, rm2_id, rm2_t, ste_od, ste_id, ste_t, w_rm1, w_rm2, w_tot_rm, w_st6, pm, fm, drill, 
            c_rm1, c_rm2, "c_rm1+rm2", "wa_rm1+rm2", "ca_rm1+rm2", wa_rm3, ca_rm3, tpc, tc, tcm, 
            tc_inr, c_pack, conv_rate, remarks
          ) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, 
                  $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, 
                  $37, $38, $39)
        `;
      for (const row of data) {
        const processedRow = processRow(row);
        if (processedRow) {
          console.log("success");
          await client.query(query, processedRow);
        }

      }

      await client.query('COMMIT'); // Commit the transaction
      client.release();
      res.send('File uploaded and processed successfully.');
    } catch (error) {
      await client.query('ROLLBACK'); // Rollback the transaction on error
      client.release();
      console.error('Error processing file:', error);
      const nooverride = true;
      res.status(400).json({ nooverride, error: "Checkbox not checked. No data processed." });
    }
  }

});

export default router;
