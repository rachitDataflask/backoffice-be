import { Router } from "express";
// import FinalDesignController from '../../controllers/admin/FinalDesignController';
import FinalProductController from "../../controllers/admin/FinalProductController";
import { ROLES } from "../../utils/constants";

// Middleware
import { asyncHandler } from "../../middleware/asyncHandler";
import { checkJwt } from "../../middleware/checkJwt";
import { checkRole } from "../../middleware/checkRole";
import { FinalProduct } from "../../models/final-product";

const router = Router();

// Get all levels
// router.get('/', [checkJwt, checkRole([ROLES.USER, ROLES.ADMIN])], asyncHandler(FinalDesignController.listAll));

// Get one level
// router.get('/:id([0-9a-z]{24})', [checkJwt, checkRole([ROLES.USER, ROLES.ADMIN])], asyncHandler(FinalDesignController.getOneById));

// Create a new level
router.post(
  "/",
  [checkJwt, checkRole([ROLES.USER, ROLES.ADMIN])],
  asyncHandler(FinalProductController.newFinalProduct)
);

router.post(
  "/filter",
  [checkJwt, checkRole([ROLES.USER, ROLES.ADMIN])],
  asyncHandler(FinalProductController.getFinalProductByFilter)
);

router.patch(
  "/:id([0-9a-fA-F]{24})",
  [checkJwt, checkRole([ROLES.USER, ROLES.ADMIN])],
  asyncHandler(FinalProductController.updateFinalProduct)
);

// Edit one level
// router.patch('/:id([0-9a-z]{24})', [checkJwt, checkRole([ROLES.USER, ROLES.ADMIN])], asyncHandler(FinalDesignController.editFinalDesign));

// Delete one level
// router.delete('/:id([0-9a-z]{24})', [checkJwt, checkRole([ROLES.ADMIN])], asyncHandler(FinalDesignController.deleteFinalDesign));

export default router;
