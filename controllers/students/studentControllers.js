const mySQLPool = require("../../config/db");

//! GET all students
const getAllStudents = async (req, res) => {
  try {
    const data = await mySQLPool.query("SELECT * FROM students");
    if (data.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No students found",
      });
    } else {
      res.status(200).send({
        success: true,
        message: "All students fetched successfully",
        total: data[0].length,
        data: data[0],
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting all students",
      error: error.message,
    });
  }
};
//! GET student by id
const getSingleStudentById = async (req, res) => {
  try {
    const studentId = req.params.id;
    if (!studentId) {
      return res.status(404).send({
        success: false,
        message: "Please provide/Invalid student id",
      });
    }
    const [data] = await mySQLPool.query(
      "SELECT * FROM students WHERE id = ?",
      [studentId]
    );
    if (data.length === 0) {
      return res.status(404).send({
        success: false,
        message: "Student not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Single student fetched successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getAllStudents,
  getSingleStudentById,
};
