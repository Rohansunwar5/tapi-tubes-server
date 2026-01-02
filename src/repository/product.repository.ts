import productDescriptionModel from "../models/productDescription.model";

export interface ICreateProductParams {
  name: string;
  description: string;
  benefits: Array<{ point: string; description?: string }>;
  applications: Array<{ point: string; description?: string }>;
  mainImage: { url: string };
  extraImages: Array<{ url: string }>;
  sizeCharts?: Array<{ url: string; title?: string }>;
}

export class ProductDescriptionRepository {
    private _model = productDescriptionModel;

    async getAllProducts() {
        return this._model.find();
    }

    async getProductById(productId: string) {
        return this._model.findById(productId);
    }

    async createProduct(params: ICreateProductParams) {
        return this._model.create(params);
    }

    async updateProduct(productId: string, updateData: Partial<ICreateProductParams>) {
        return this._model.findByIdAndUpdate(productId, updateData, {new: true});
    }

    async deleteProduct(productId: string) {
        return this._model.findByIdAndDelete(productId);
    }
}