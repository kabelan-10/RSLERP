import express from "express";
const router = express.Router();
import pool from "../DB/dbpg.js";
// Endpoint to check if a unit name already exists
const unitfinder ='SELECT COUNT(*) AS count FROM uom WHERE unit_name = $1';
router.get('/units/:unitName', async (req, res) => {
    const { unitName } = req.params;
    try {
      const result = await pool.query(unitfinder, [unitName]);
      const exists = result.rows[0].count > 0;
      res.json({ exists });
    } catch (err) {
      console.error('Error checking unit existence', err.stack);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  router.delete('/delete', async (req, res) => {
      const { encodedName:unitName } = req.body;
      console.log(`Deleting unit with name: ${unitName}`);
      try {
        const result = await pool.query('DELETE FROM uom WHERE unit_name = $1', [unitName]);
        console.log(`Delete result: ${result.rowCount} rows affected`);
        res.status(204).end(); // No content to return
      } catch (err) {
        console.error('Error deleting unit', err.stack);
        res.status(500).json({ error: "Internal server error" });
      }
    });
    
    // Endpoint to edit a units
    router.put('/edit', async (req, res) => {
      const { old_unit_name: oldUnitName, new_unit_name: newUnitName, description } = req.body;
    
      console.log("Updating unit:", {
        oldUnitName,
        newUnitName,
        description,
      });
    
      try {
        // Update the unit in the database
        const updateResult = await pool.query(
          'UPDATE uom SET unit_name = $1, description = $2 WHERE unit_name = $3',
          [newUnitName, description, oldUnitName]
        );
    
        console.log("Update result:", updateResult.rowCount);
    
        if (updateResult.rowCount === 0) {
          console.log("No rows updated. Unit might not exist.");
          return res.status(404).json({ error: "Unit not found" });
        }
    
        res.status(200).json({ success: "Unit updated" });
    
      } catch (err) {
        console.error('Error updating unit', err.stack);
        res.status(500).json({ error: "Internal server error" });
      }
    });
    
    
    
  // Endpoint to add a new unit
  router.post('/add', async (req, res) => {
    const { unitName, desc } = req.body;
    
    console.log("Received data:", { unitName, desc });

    if (!unitName) {
      console.log("Empty strings detected");
      return res.status(400).json({ error: "Unit Name and Description are required" });
    }
  
    try {
      await pool.query('INSERT INTO uom (unit_name, description) VALUES ($1, $2)', [unitName, desc]);
      console.log("Unit added successfully");
      res.status(201).json({ success: "Unit added" });
  
    } catch (err) {
      console.error('Error executing query', err.stack);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // Endpoint to fetch all units
  router.get('/units', async (req, res) => {
    try {
      // Fetch all units, ordering by id in descending order
      const result = await pool.query('SELECT * FROM uom ORDER BY id DESC');
      console.log("Units fetched:", result.rows);
      res.json(result.rows);
    } catch (err) {
      console.error('Error fetching units', err.stack);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
export default router;
