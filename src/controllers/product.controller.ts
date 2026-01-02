// product.controller.ts
import { NextFunction, Request, Response } from "express";
import productService from "../services/product.service";

interface MulterFiles {
  mainImage?: Express.Multer.File[];
  extraImages?: Express.Multer.File[];
  sizeCharts?: Express.Multer.File[]; 
}

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  const response = await productService.getAllProducts();
  next(response);
};

export const getAProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;
  const response = await productService.getProductById(productId);
  next(response);
};

export const createAProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { name, description } = req.body;

  let benefits = req.body.benefits;
  let applications = req.body.applications;
  let sizeChartTitles = req.body.sizeChartTitles; 

  if (typeof benefits === "string") {
    benefits = JSON.parse(benefits);
  }
  if (typeof applications === "string") {
    applications = JSON.parse(applications);
  }
  if (typeof sizeChartTitles === "string") {
    sizeChartTitles = JSON.parse(sizeChartTitles);
  }

  const files = req.files as MulterFiles;
  const mainImage = files?.mainImage?.[0];
  const extraImages = files?.extraImages || [];
  const sizeCharts = files?.sizeCharts || []; 

  const response = await productService.createProduct({
    name,
    description,
    benefits,
    applications,
    mainImage,
    extraImages,
    sizeCharts, 
    sizeChartTitles, 
  });
  
  next(response);
};

export const editAProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;
  const { name, description } = req.body;

  let benefits = req.body.benefits;
  let applications = req.body.applications;
  let sizeChartTitles = req.body.sizeChartTitles; 

  if (typeof benefits === "string") {
    benefits = JSON.parse(benefits);
  }
  if (typeof applications === "string") {
    applications = JSON.parse(applications);
  }
  if (typeof sizeChartTitles === "string") {
    sizeChartTitles = JSON.parse(sizeChartTitles);
  }

  const files = req.files as MulterFiles;
  const mainImage = files?.mainImage?.[0];
  const extraImages = files?.extraImages || [];
  const sizeCharts = files?.sizeCharts || []; 

  const response = await productService.editProduct({
    productId,
    name,
    description,
    benefits,
    applications,
    mainImage,
    extraImages,
    sizeCharts, 
    sizeChartTitles, 
  });
  next(response);
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;
  const response = await productService.deleteProduct(productId);
  next(response);
};