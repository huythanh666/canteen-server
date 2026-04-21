import express from "express";
import productController from "./product.controller.js";
import {
  checkRolePermission,
  requireAuth,
} from "../../middlewares/auth.middleware.js";
import { productSchema } from "./product.schema.js";
import { validate } from "../../middlewares/zod.middleware.js";

const productRoute = express.Router();

productRoute.use(requireAuth);

productRoute.get("/getAllProduct", productController.getAllProduct);
productRoute.get(
  "/getDetailProductById/:id",
  productController.getDetailProductById,
);

productRoute.use(checkRolePermission);

productRoute.put(
  "/updateProductById/:id",
  validate(productSchema),
  productController.updateProductById,
);
productRoute.delete(
  "/deleteProductById/:id",
  productController.deleteProductById,
);
productRoute.post(
  "/createProduct",
  validate(productSchema),
  productController.createProduct,
);

export default productRoute;
