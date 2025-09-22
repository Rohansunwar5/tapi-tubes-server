// routes/person.route.ts
import { Router } from "express";
import isAdminLoggedIn from "../middlewares/isAdminLoggedIn.middleware";
import { asyncHandler } from "../utils/asynchandler";
import {
  createAPerson,
  deleteAPerson,
  editAPerson,
  getAPerson,
  getAllPersons,
} from "../controllers/person.controller";
import multer from "multer";
import { uploadPersonImage } from "../middlewares/multer.middleware";

const upload = multer();

const personRouter = Router();

personRouter.get("/", asyncHandler(getAllPersons));
personRouter.get("/:personId", asyncHandler(getAPerson));

personRouter.post(
  "/create",
  isAdminLoggedIn,
  uploadPersonImage,
  asyncHandler(createAPerson)
);

personRouter.put(
  "/edit/:personId",
  isAdminLoggedIn,
  uploadPersonImage,
  asyncHandler(editAPerson)
);

personRouter.delete(
  "/delete/:personId",
  isAdminLoggedIn,
  asyncHandler(deleteAPerson)
);

export default personRouter;
