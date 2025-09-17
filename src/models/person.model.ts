import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const personSchema = new mongoose.Schema (
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxLength: 100,
        },
        designation: {
            type: String,
            required: true,
            trim: true,
            maxLength: 100,
        },
        description: {
            type: String,
            trim: true,
        },
        image: {
            type: imageSchema,
            required: true,
        }
    }, { timestamps: true }
)

personSchema.index({ name: 1 });

export interface IPerson extends mongoose.Schema {
  _id: string;
  name: string;
  designation: string;
  description?: string;
  image: { url: string };
}

export default mongoose.model<IPerson>("Person", personSchema);