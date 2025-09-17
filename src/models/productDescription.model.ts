import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true,
        },
    },
    {
        _id: false
    }
)

const benefitSchema = new mongoose.Schema(
    {
    point: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    point: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    benefits: {
      type: [benefitSchema],
      required: true,
    },
    applications: {
      type: [applicationSchema],
      required: true,
    },
    mainImage: { 
      type: imageSchema, 
      required: true, 
    },
    extraImages: {
        type: [imageSchema],
        required: true,
        maxLength: 2,
    }
  },
  { timestamps: true }
);

productSchema.index({ name: 1 });

export interface IProduct extends mongoose.Schema {
  _id: string;
  name: string;
  description: string;
  benefits: Array<{
    point: string;
    description?: string;
  }>;
  applications: Array<{
    point: string;
    description?: string;
  }>;
    mainImage: { url: string };
    extraImages: Array<{ url: string }>;

}

export default mongoose.model<IProduct>("Product", productSchema);