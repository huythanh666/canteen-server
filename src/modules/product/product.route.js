import express from "express";
import productController from "./product.controller.js";
import {
  checkRolePermission,
  requireAuth,
} from "../../middlewares/auth.middleware.js";
import uploadImage from "../../middlewares/cloudinary.middleware.js";

const productRoute = express.Router();

productRoute.use(requireAuth);

productRoute.get("/getAllProduct", productController.getAllProduct);
productRoute.get(
  "/getDetailProductById/:id",
  productController.getDetailProduct,
);

productRoute.use(checkRolePermission);

productRoute.put("/updateProduct/:id", productController.updateProduct);
productRoute.delete("/deleteProduct/:id", productController.deleteProduct);
productRoute.post(
  "/createProduct",
  uploadImage("image"),
  productController.createProduct,
);
productRoute.post(
  "/createProductRecipe",
  productController.createProductRecipe,
);

export default productRoute;
