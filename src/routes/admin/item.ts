import { Router } from "express";
import ItemController from "../../controllers/admin/ItemController";
import { ROLES } from "../../utils/constants";

// Middleware
import { asyncHandler } from "../../middleware/asyncHandler";
import { checkJwt } from "../../middleware/checkJwt";
import { checkRole } from "../../middleware/checkRole";

const router = Router();

// Get all Items
router.get(
  "/",
  [checkJwt, checkRole([ROLES.USER, ROLES.ADMIN])],
  asyncHandler(ItemController.listAll)
);

// Get one item
router.get(
  "/:id([0-9a-z]{24})",
  [checkJwt, checkRole([ROLES.USER, ROLES.ADMIN])],
  asyncHandler(ItemController.getOneById)
);

// Create a new item
router.post(
  "/",
  [checkJwt, checkRole([ROLES.USER, ROLES.ADMIN])],
  asyncHandler(ItemController.newItem)
);

// Edit one item
router.patch(
  "/:id([0-9a-z]{24})",
  [checkJwt, checkRole([ROLES.USER, ROLES.ADMIN])],
  asyncHandler(ItemController.editItem)
);

// Delete one item
router.delete(
  "/:id([0-9a-z]{24})",
  [checkJwt, checkRole([ROLES.ADMIN])],
  asyncHandler(ItemController.deleteItem)
);

export default router;
