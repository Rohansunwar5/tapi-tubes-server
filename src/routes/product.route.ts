import { Router } from "express";
import { createAProduct, editAProduct, getAllProducts, getAProduct } from "../controllers/product.controller";
import isAdminLoggedIn from "../middlewares/isAdminLoggedIn.middleware";
import { uploadProductImages } from "../middlewares/multer.middleware";
import { asyncHandler } from "../utils/asynchandler";

const productRouter = Router();

productRouter.get("/", asyncHandler(getAllProducts));
productRouter.get("/:productId", asyncHandler(getAProduct));

productRouter.post(
  "/create",
  isAdminLoggedIn,
  uploadProductImages,
  asyncHandler(createAProduct)
);

productRouter.put(
  "/edit/:productId",
  isAdminLoggedIn,
  uploadProductImages,
  asyncHandler(editAProduct)
);

// Optionally you can add a delete endpoint if needed by your business logic
// productRouter.delete(
//   "/delete/:productId",
//   isAdminLoggedIn,
//   asyncHandler(deleteAProduct)
// );

export default productRouter;