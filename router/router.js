const Service = require("../controller/controller");

const router = require("express").Router();

router.post("/add", Service.add);
router.post("/find", Service.manager);
router.post("/count", Service.employee);



module.exports = router;