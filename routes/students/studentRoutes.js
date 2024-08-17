const express = require("express");
const {
  getAllStudents,
  getSingleStudentById,
  createNewStudent,
  updateStudentById,
  deleteSingleStudentById,
  multipleDeleteStudents,
} = require("../../controllers/students/studentControllers");

//! Router Object
const router = express.Router();

//! Routes
router.get("/list", getAllStudents);
router.get("/:id", getSingleStudentById);
router.post("/create", createNewStudent);
router.patch("/update/:id", updateStudentById);
router.delete("/delete/:id", deleteSingleStudentById);
router.delete("/multiple-delete", multipleDeleteStudents);

module.exports = router;
