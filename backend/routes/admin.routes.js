const express = require("express");
const router = express.Router();

const { createAdmin } = require("../controllers/admin_controller");
const { createDepartment , getAllDepartments,
  getDepartmentById} = require("../controllers/department.controller");
const {createEmployee} = require("../controllers/employee.controller");

const {login} = require("../controllers/authentication");

router.post("/employee/create", createEmployee);
router.post("/login", login);

router.post("/department/create", createDepartment);

router.post("/create", createAdmin);
router.get("/departments", getAllDepartments);
router.get("/department/:id", getDepartmentById);

module.exports = router;
