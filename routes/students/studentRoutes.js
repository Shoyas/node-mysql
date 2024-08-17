const express = require("express");
const {
  getAllStudents,
  getSingleStudentById,
  createNewStudent,
  updateStudentById,
  deleteSingleStudentById,
  multipleDeleteStudents,
} = require("../../controllers/students/studentControllers");
const {
  authenticateToken,
  authorizeRole,
} = require("../../utils/authenticate");

//! Router Object
const router = express.Router();

//! Routes
router.get("/list", getAllStudents);
router.get("/:id", getSingleStudentById);
router.post(
  "/create",
  authenticateToken,
  authorizeRole([process.env.USER_ADMIN]),
  createNewStudent
);
router.patch(
  "/update/:id",
  authenticateToken,
  authorizeRole([process.env.USER_ADMIN, process.env.USER_ADMIN]),
  updateStudentById
);
router.delete(
  "/delete/:id",
  authenticateToken,
  authorizeRole([process.env.USER_ADMIN]),
  deleteSingleStudentById
);
router.delete(
  "/multiple-delete",
  authenticateToken,
  authorizeRole([process.env.USER_ADMIN]),
  multipleDeleteStudents
);

module.exports = router;
