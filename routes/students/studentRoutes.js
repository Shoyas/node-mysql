const express = require("express");
const {
  getAllStudents,
  getSingleStudentById,
  createNewStudent,
} = require("../../controllers/students/studentControllers");

//! Router Object
const router = express.Router();

//! Routes
router.get("/list", getAllStudents);
router.get("/:id", getSingleStudentById);
router.post("/create", createNewStudent);

module.exports = router;
