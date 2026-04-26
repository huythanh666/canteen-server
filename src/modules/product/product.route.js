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
  productController.getDetailProduct,
);

productRoute.use(checkRolePermission);

productRoute.put(
  "/updateProduct/:id",
  validate(productSchema),
  productController.updateProduct,
);
productRoute.delete("/deleteProduct/:id", productController.deleteProduct);
productRoute.post(
  "/createProduct",
  validate(productSchema),
  productController.createProduct,
);
productRoute.post(
  "/createProductRecipe",
  productController.createProductRecipe,
);

export default productRoute;
