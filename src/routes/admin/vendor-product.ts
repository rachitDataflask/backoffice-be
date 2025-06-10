import { Router } from "express";
import { ROLES } from "../../utils/constants";

// Middleware
import { asyncHandler } from "../../middleware/asyncHandler";
import { checkJwt } from "../../middleware/checkJwt";
import { checkRole } from "../../middleware/checkRole";
import VendorProductController from "../../controllers/admin/VendorProductController";

const router = Router();

// Get all products
router.get("/", asyncHandler(VendorProductController.listAll));

// Get one product
router.get(
  "/:id([0-9a-z]{24})",
  asyncHandler(VendorProductController.getOneById)
);

// Create a new product
router.post("/", asyncHandler(VendorProductController.newVendorProduct));

// Edit one product
router.patch(
  "/:id([0-9a-z]{24})",
  asyncHandler(VendorProductController.editProduct)
);

// Delete one product
router.delete(
  "/:id([0-9a-z]{24})",
  asyncHandler(VendorProductController.deleteProduct)
);

export default router;
