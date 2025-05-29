const express = require("express");
const controller = require("../controllers/memberCardController");
const { auth, authorize } = require("../middlewares/auth");
const router = express.Router();

const ALLOW_ROLE = ["manager", "admin", "staff"];

router.post("/", auth, authorize(...ALLOW_ROLE), controller.createMemberCard);
router.get("/", auth, authorize(...ALLOW_ROLE), controller.getMemberCards);
router.get("/:id", auth, authorize(...ALLOW_ROLE), controller.getMemberCardById);
router.put("/:id", auth, authorize(...ALLOW_ROLE), controller.updateMemberCard);
router.delete("/:id", auth, authorize(...ALLOW_ROLE), controller.deleteMemberCard);

module.exports = router;
