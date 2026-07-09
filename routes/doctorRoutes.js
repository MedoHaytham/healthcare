const express=require("express");
const doctorController=require("../controllers/doctorController");  
const authController=require("../controllers/authController");

const router=express.Router();
router.get("/",doctorController.getAllDoctors);
router.get("/:id",doctorController.getDoctor);


router.use(authController.protect,authController.restrictTo("admin"));
router.post("/",doctorController.addDoctor);
router.patch("/:id",doctorController.updateDoctor);
router.delete("/:id",doctorController.deleteDoctor);

module.exports=router;  