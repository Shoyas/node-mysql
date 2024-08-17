const mySQLPool = require("../../config/db");
const { handleError, sendResponse } = require("../../utils/responseHandler");
const { validationFields } = require("../../utils/validation");

//! Create New Student
const createNewStudent = async (req, res) => {
  try {
    const requiredFields = ["name", "roll", "className", "fees", "group"];
    const validation = validationFields(requiredFields, req.body);
    if (!validation.success) {
      return sendResponse(res, 400, false, validation.message);
    }
    const { name, roll, className, fees, group } = req.body;
    //! Insert student's data into DB
    const result = await mySQLPool.query(
      "INSERT INTO students (name, roll,  className, fees, `group`) VALUES (?, ?, ?, ?, ?)",
      [name, roll, className, fees, group]
    );
    //! Get total number of students in the DB
    const [rows] = await mySQLPool.query(
      "SELECT COUNT(*) AS total FROM students"
    );
    const total = rows[0].total;
    //! Making response data format
    const responseData = {
      name,
      roll,
      className,
      fees,
      group,
    };
    return sendResponse(
      res,
      201,
      true,
      "Student created successfully",
      responseData,
      total
    );
  } catch (error) {
    return handleError(res, error, "Internal Server Error");
  }
};

//! GET all students
const getAllStudents = async (req, res) => {
  try {
    const data = await mySQLPool.query("SELECT * FROM students");
    console.log(data);
    if (data.length === 0) {
      return sendResponse(res, 404, false, "No students found");
    } else {
      return sendResponse(
        res,
        200,
        true,
        "All students fetched successfully",
        data[0]
      );
    }
  } catch (error) {
    return handleError(res, error, "Error while getting all students");
  }
};
//! GET student by id
const getSingleStudentById = async (req, res) => {
  try {
    const studentId = req.params.id;
    if (!studentId) {
      return sendResponse(res, 404, false, "Please provide/Invalid student id");
    } else {
      const [data] = await mySQLPool.query(
        "SELECT * FROM students WHERE id=?",
        [studentId]
      );
      if (data.length === 0) {
        return sendResponse(res, 404, false, "Student not found");
      } else {
        return sendResponse(
          res,
          200,
          true,
          "Single student fetched successfully",
          data[0]
        );
      }
    }
  } catch (error) {
    return handleError(res, error, "Internal Server Error");
  }
};

//! Update student by id
const updateStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, roll, className, fees, group } = req.body;
    //! Update student's data into DB
    const [result] = await mySQLPool.query(
      "UPDATE students SET name=?, roll=?, className=?, fees=?, `group`=? WHERE id=?",
      [name, roll, className, fees, group, id]
    );
    if (result.affectedRows === 0) {
      return sendResponse(res, 404, false, "Student not found");
    }
    //! Get the updated data of students
    const [rows] = await mySQLPool.query(
      "SELECT COUNT(*) AS total FROM students"
    );
    const total = rows[0].total;

    //! Making response data format
    const responseData = {
      name,
      roll,
      className,
      fees,
      group,
    };

    return sendResponse(
      res,
      200,
      true,
      "Student updated successfully",
      responseData,
      total
    );
  } catch (error) {
    return handleError(res, error, "Internal Server Error");
  }
};

const deleteSingleStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return sendResponse(res, 404, false, "Please provide/Invalid student id");
    }

    //! Delete single student from DB
    const [result] = await mySQLPool.query("DELETE FROM students WHERE id=?", [
      id,
    ]);
    if (result.affectedRows === 0) {
      return sendResponse(res, 404, false, "Student not found");
    }
    //! Get the updated total number of students
    const [rows] = await mySQLPool.query(
      "SELECT COUNT(*) AS total FROM students"
    );
    const total = rows[0].total;
    return sendResponse(
      res,
      200,
      true,
      "Student deleted successfully",
      null,
      total
    );
  } catch (error) {
    return handleError(res, error, "Internal Server Error");
  }
};

const multipleDeleteStudents = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return sendResponse(
        res,
        404,
        false,
        "Please provide/Invalid student ids"
      );
    }
    //! Convert the array of ids into a comma-separated string for the query
    const placeholders = ids.map(() => "?").join(",");
    //! Delete the selected students from DB
    const [result] = await mySQLPool.query(
      `DELETE FROM students WHERE id IN (${placeholders})`,
      ids
    );
    if (result.affectedRows === 0) {
      return sendResponse(res, 404, false, "Student not found for deleting");
    }
    //! Get the updated total number of students
    const [rows] = await mySQLPool.query(
      "SELECT COUNT(*) AS total FROM students"
    );
    const total = rows[0].total;
    return sendResponse(
      res,
      200,
      true,
      `${result.affectedRows} students deleted successfully`,
      null,
      total
    );
  } catch (error) {
    return handleError(res, error, "Internal Server Error");
  }
};

module.exports = {
  getAllStudents,
  getSingleStudentById,
  createNewStudent,
  updateStudentById,
  deleteSingleStudentById,
  multipleDeleteStudents,
};
