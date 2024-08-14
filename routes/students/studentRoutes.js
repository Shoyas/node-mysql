const express = require("express");
const { getAllStudents, getSingleStudentById } = require("../../controllers/students/studentControllers");

//! Router Object
const router = express.Router();

//! Routes
router.get("/list", getAllStudents);
router.get("/:id", getSingleStudentById);


module.exports = router;