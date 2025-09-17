import { BadRequestError } from "../errors/bad-request.error";
import { InternalServerError } from "../errors/internal-server.error";
import { NotFoundError } from "../errors/not-found.error";
import { ProductDescriptionRepository } from "../repository/product.repository";
;
import { uploadToCloudinary } from "../utils/cloudinary.util";

interface CreateProductParams {
  name: string;
  description: string;
  benefits: Array<{ point: string; description?: string }>;
  applications: Array<{ point: string; description?: string }>;
  mainImage?: Express.Multer.File;
  extraImages: Express.Multer.File[];
}

interface EditProductParams {
  productId: string;
  name?: string;
  description?: string;
  benefits?: Array<{ point: string; description?: string }>;
  applications?: Array<{ point: string; description?: string }>;
  mainImage?: Express.Multer.File;
  extraImages?: Express.Multer.File[];
}

class ProductService {
  constructor(private readonly _productRepository: ProductDescriptionRepository) {}

   private async handleImageUpload(file: Express.Multer.File): Promise<{ url: string; publicId: string }> {
        const uploadResult = await uploadToCloudinary(file);
        
        const urlParts = uploadResult.split('/');
        const fileWithExtension = urlParts[urlParts.length - 1];
        const publicId = `sweety/${fileWithExtension.split('.')[0]}`;
        
        return {
        url: uploadResult,
        publicId: publicId
        };
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
    const { name, description, benefits, applications, mainImage, extraImages } = params;

    if (!mainImage) throw new BadRequestError("Main image is required");
    if (!extraImages || extraImages.length !== 2) throw new BadRequestError("Two extra images are required");

    const mainImageUrl = await this.handleImageUpload(mainImage);
    const extraImageUrls = await Promise.all(extraImages.map(img => this.handleImageUpload(img)));

    const productData = {
      name,
      description,
      benefits,
      applications,
      mainImage: mainImageUrl,
      extraImages: extraImageUrls,
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
    } = params;

    const existingProduct = await this._productRepository.getProductById(productId);
    if (!existingProduct) throw new NotFoundError("Product not found");

    let mainImageUrl = existingProduct.mainImage;
    if (mainImage) {
      mainImageUrl = await this.handleImageUpload(mainImage);
    }

    let extraImageUrls = existingProduct.extraImages;
    if (extraImages && extraImages.length > 0) {
      extraImageUrls = await Promise.all(extraImages.map(img => this.handleImageUpload(img)));
    }

    const updateData: any = {
      mainImage: mainImageUrl,
      extraImages: extraImageUrls,
    };

    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (benefits) updateData.benefits = benefits;
    if (applications) updateData.applications = applications;

    const updatedProduct = await this._productRepository.updateProduct(productId, updateData);

    if (!updatedProduct) throw new InternalServerError("Product update failed");

    return updatedProduct;
  }
}

export default new ProductService(new ProductDescriptionRepository());
