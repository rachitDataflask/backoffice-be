import { Router } from "express";
import FinalItemController from "../../controllers/admin/FinalItemController";
import { ROLES } from "../../utils/constants";

// Middleware
import { asyncHandler } from "../../middleware/asyncHandler";
import { checkJwt } from "../../middleware/checkJwt";
import { checkRole } from "../../middleware/checkRole";

const router = Router();

// Get all levels
// router.get('/', [checkJwt, checkRole([ROLES.USER, ROLES.ADMIN])], asyncHandler(FinalDesignController.listAll));

// Get one level
// router.get('/:id([0-9a-z]{24})', [checkJwt, checkRole([ROLES.USER, ROLES.ADMIN])], asyncHandler(FinalDesignController.getOneById));

// Create a new level
router.post(
  "/",
  [checkJwt, checkRole([ROLES.USER, ROLES.ADMIN])],
  asyncHandler(FinalItemController.newFinalItem)
);

router.post("/filter", asyncHandler(FinalItemController.getFinalItemByFilter));

router.patch(
  "/:id([0-9a-fA-F]{24})",
  asyncHandler(FinalItemController.updateFinalItem)
);

// Edit one level
// router.patch('/:id([0-9a-z]{24})', [checkJwt, checkRole([ROLES.USER, ROLES.ADMIN])], asyncHandler(FinalDesignController.editFinalDesign));

// Delete one level
// router.delete('/:id([0-9a-z]{24})', [checkJwt, checkRole([ROLES.ADMIN])], asyncHandler(FinalDesignController.deleteFinalDesign));

export default router;
