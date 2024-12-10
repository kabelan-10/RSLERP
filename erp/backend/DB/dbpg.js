// dbpg.js

import pkg from 'pg';  // Import the entire 'pg' module as a default import
const { Pool } = pkg;

// Create a new pool instance with configuration options
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "RSLERP",
    password: "k1062005",
    port: 5432,           // Default PostgreSQL port
    
});

// Export the pool instance
export default pool;
