// product.service.ts
import { BadRequestError } from "../errors/bad-request.error";
import { InternalServerError } from "../errors/internal-server.error";
import { NotFoundError } from "../errors/not-found.error";
import { ProductDescriptionRepository } from "../repository/product.repository";
import { uploadToCloudinary } from "../utils/cloudinary.util";
import { uploadToS3 } from "../utils/s3.util";

interface CreateProductParams {
  name: string;
  description: string;
  benefits: Array<{ point: string; description?: string }>;
  applications: Array<{ point: string; description?: string }>;
  mainImage?: Express.Multer.File;
  extraImages: Express.Multer.File[];
  sizeCharts?: Express.Multer.File[]; // Added
  sizeChartTitles?: string[]; // Added - for optional titles
}

interface EditProductParams {
  productId: string;
  name?: string;
  description?: string;
  benefits?: Array<{ point: string; description?: string }>;
  applications?: Array<{ point: string; description?: string }>;
  mainImage?: Express.Multer.File;
  extraImages?: Express.Multer.File[];
  sizeCharts?: Express.Multer.File[]; // Added
  sizeChartTitles?: string[]; // Added
}

class ProductService {
  constructor(private readonly _productRepository: ProductDescriptionRepository) {}

  private async handleImageUpload(
    file: Express.Multer.File
  ): Promise<string> {
    return uploadToS3(file, "tapi-tubes/products");
  }

  async getAllProducts() {
    const allProducts = await this._productRepository.getAllProducts();
    if (!allProducts || allProducts.length === 0) throw new NotFoundError("No products found");
    return allProducts;
  }

  async getProductById(productId: string) {
    const product = await this._productRepository.getProductById(productId);
    if (!product) throw new NotFoundError("Product not found");
    return product;
  }

  async createProduct(params: CreateProductParams) {
    const { name, description, benefits, applications, mainImage, extraImages, sizeCharts, sizeChartTitles } = params;

    if (!mainImage) throw new BadRequestError("Main image is required");
    // if (!extraImages || extraImages.length !== 2) throw new BadRequestError("Two extra images are required");

    const mainImageUrl = await this.handleImageUpload(mainImage);
    const extraImageUrls = await Promise.all(
      extraImages.map(img => this.handleImageUpload(img))
    );

    let sizeChartUrls: Array<{ url: string; title?: string }> = [];

    if (sizeCharts && sizeCharts.length > 0) {
      sizeChartUrls = await Promise.all(
        sizeCharts.map(async (img, index) => ({
          url: await this.handleImageUpload(img),
          title: sizeChartTitles?.[index],
        }))
      );
    }


    const productData = {
      name,
      description,
      benefits,
      applications,
      mainImage: { url: mainImageUrl, publicId: "" },
      extraImages: extraImageUrls.map(url => ({ url, publicId: "" })),
      ...(sizeChartUrls.length > 0 && { sizeCharts: sizeChartUrls }),
    };


    const createdProduct = await this._productRepository.createProduct(productData);

    if (!createdProduct) throw new InternalServerError("Product creation failed");

    return createdProduct;
  }

  async editProduct(params: EditProductParams) {
    const {
      productId,
      name,
      description,
      benefits,
      applications,
      mainImage,
      extraImages,
      sizeCharts,
      sizeChartTitles,
    } = params;

    const existingProduct = await this._productRepository.getProductById(productId);
    if (!existingProduct) throw new NotFoundError("Product not found");

    /* ---------------- MAIN IMAGE ---------------- */
    let mainImageData = existingProduct.mainImage;

    if (mainImage) {
      const uploadedUrl = await this.handleImageUpload(mainImage);
      mainImageData = { url: uploadedUrl };
    }

    /* ---------------- EXTRA IMAGES ---------------- */
    let extraImageData = existingProduct.extraImages;

    if (extraImages && extraImages.length > 0) {
      const uploadedExtras = await Promise.all(
        extraImages.map(async (img) => ({
          url: await this.handleImageUpload(img),
        }))
      );
      extraImageData = uploadedExtras;
    }

    /* ---------------- SIZE CHARTS ---------------- */
    let sizeChartData = existingProduct.sizeCharts;

    if (sizeCharts && sizeCharts.length > 0) {
      sizeChartData = await Promise.all(
        sizeCharts.map(async (img, index) => ({
          url: await this.handleImageUpload(img),
          title: sizeChartTitles?.[index],
        }))
      );
    }

    /* ---------------- UPDATE PAYLOAD ---------------- */
    const updateData: any = {
      mainImage: mainImageData,
      extraImages: extraImageData,
      sizeCharts: sizeChartData,
    };

    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (benefits) updateData.benefits = benefits;
    if (applications) updateData.applications = applications;

    const updatedProduct = await this._productRepository.updateProduct(
      productId,
      updateData
    );

    if (!updatedProduct) {
      throw new InternalServerError("Product update failed");
    }

    return updatedProduct;
  }


  async deleteProduct(productId: string) {
    const existingProduct = await this._productRepository.getProductById(productId);
    if (!existingProduct) throw new NotFoundError("Product not found");

    const deletedProduct = await this._productRepository.deleteProduct(productId);
    if (!deletedProduct) throw new InternalServerError("Product deletion failed");

    return deletedProduct;
  }
}

export default new ProductService(new ProductDescriptionRepository());