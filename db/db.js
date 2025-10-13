import sql from "mssql";
import dotenv from "dotenv";
dotenv.config()

const config = {
  user: process.env.DB_USER,     
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,  
  database: process.env.DATABASE_NAME,   
  
  options: {
    encrypt: false,              // local ke liye false
    trustServerCertificate: true // local ke liye true
  },
  port :parseInt(process.env.DB_PORT) 
};







 const poolConnect = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log("✅ Connected to SQL Server");
    return pool;
  })
  .catch(err => {
    console.error("❌ Database connection failed:", err);
    throw err;  
  });

export { sql,poolConnect };

