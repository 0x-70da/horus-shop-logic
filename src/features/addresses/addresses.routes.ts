// features/addresses/addresses.routes.ts
import { Router, Router as ExpressRouter } from "express";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "./addresses.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router: ExpressRouter = Router();
router.use(authMiddleware);

router.get("/", getAddresses);
router.post("/", createAddress);
router.patch("/:addressId", updateAddress);
router.delete("/:addressId", deleteAddress);
router.patch("/:addressId/set-default", setDefaultAddress);

export default router;
