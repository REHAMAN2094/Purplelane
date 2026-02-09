const express = require("express");
const router = express.Router();

const { createAdmin, createService } = require("../controllers/admin_controller");
const { createDepartment, getAllDepartments,
  getDepartmentById } = require("../controllers/department.controller");
const { createEmployee, getAllEmployees, getEmployeeById } = require("../controllers/employee.controller");
const { createScheme, getAllSchemes, getSchemeById, updateScheme } = require("../controllers/scheme.controller");
const { login } = require("../controllers/authentication");

router.post("/employee/create", createEmployee);
router.get("/employees", getAllEmployees);
router.get("/employee/:id", getEmployeeById);

router.post("/login", login);

router.post("/department/create", createDepartment);

router.post("/create", createAdmin);
router.get("/departments", getAllDepartments);
router.get("/department/:id", getDepartmentById);
router.post("/create-service", createService);

const authenticate = require("../middleware/authenticate");

router.post("/scheme/create", authenticate, createScheme);
router.get("/scheme", getAllSchemes); // Public read? Or authenticated? Assuming public for now or consistent with others
router.get("/scheme/:id", getSchemeById);
router.put("/scheme/:id", authenticate, updateScheme);

module.exports = router;

