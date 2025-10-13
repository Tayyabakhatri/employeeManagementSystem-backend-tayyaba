import express from "express";
import cors from "cors";
import { poolConnect, sql } from "./db/db.js";
import 'dotenv/config';

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;
app.use(cors());


// apis
//getting all employees data
app.get('/api/employees', async (req, res) => {
  try {
    const pool = await poolConnect;
    const result = await pool.request().query("SELECT * FROM dbo.employeesAttendence");
    console.log(result.recordset.length);
    res.status(200).json({
      success: true,
      empData: result.recordset
    })

  } catch (err) {
    console.log("error", err.message);
    res.status(500).json({
      success: false,
      message: err.message
    })

  }
})


// ✅ Delete employee by ID
app.delete('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID"
      });
    }

    const pool = await poolConnect;
    const result = await pool
      .request()
      .input("EmployeeID", sql.Int, parseInt(id))
      .query("DELETE FROM dbo.employeesAttendence WHERE EmployeeID = @EmployeeID");

    // Check if any record was deleted
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully"
    });
  } catch (err) {
    console.error("Error deleting employee:", err.message);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});


//add new employee
app.post('/api/employees', async (req, res) => {
  try {
    const { Employee_Name, Mobile_Number, Employee_Department, Employee_salary } = req.body
    const pool = await poolConnect;
    const result = await pool
      .request()

      .input("Employee_Name", sql.NVarChar(100), Employee_Name)
      .input("Mobile_Number", sql.NVarChar(15), Mobile_Number)
      .input("Employee_Department", sql.NVarChar(50), Employee_Department)
      .input("Employee_salary", sql.Decimal(18, 2), Employee_salary)
      .query(`INSERT INTO dbo.employeesAttendence (Employee_Name,Mobile_Number,Employee_Department,Employee_salary) 
    VALUES (@Employee_Name,@Mobile_Number,@Employee_Department,@Employee_salary)`);
    console.log(result);
    res.status(200).json({
      success: true,
      message: "Employee added successfully"
    })

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
})




//updating employee by id
app.put('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { Employee_Name, Mobile_Number, Employee_Department, Employee_salary } = req.body
    const pool = await poolConnect;
    const result = await pool
      .request()

      .input("EmployeeID", sql.Int, parseInt(id))
      .input("Employee_Name", sql.NVarChar(100), Employee_Name)
      .input("Mobile_Number", sql.NVarChar(15), Mobile_Number)
      .input("Employee_Department", sql.NVarChar(50), Employee_Department)
      .input("Employee_salary", sql.Decimal(18, 2), Employee_salary)
      .query(`UPDATE dbo.employeesAttendence SET Employee_Name=@Employee_Name , Mobile_Number=@Mobile_Number  ,  Employee_Department=@Employee_Department   ,   Employee_salary=@Employee_salary WHERE EmployeeID=@EmployeeID`); 
    
    console.log(result);
    res.status(200).json({
      success: true,
      message: "Employee updated successfully"
    })

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
})


app.listen(port, () => {
  console.log(`Your app listening on port ${port}`);
});
