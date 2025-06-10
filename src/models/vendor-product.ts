import mongoose from "mongoose";

export interface IVendorProduct {
  name: string;
  capacity: number;
  unit: string;
  product_sub_service_id: mongoose.Types.ObjectId;
  location_id: mongoose.Types.ObjectId;
  service_id: mongoose.Types.ObjectId;
}

interface VendorProductDoc extends mongoose.Document {
  name: string;
  capacity: number;
  unit: string;
  product_sub_service_id: mongoose.Types.ObjectId;
  location_id: mongoose.Types.ObjectId;
  service_id: mongoose.Types.ObjectId;
}

const vendorProductSchema = new mongoose.Schema<IVendorProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: [2, "Product name too short"],
      maxLength: [50, "Product name too long"],
    },
    capacity: {
      type: Number,
      required: true,
      trim: true,
      maxLength: [50, "Capacity out of bounds"],
    },
    unit: {
      type: String,
      required: true,
      trim: true,
    },
    product_sub_service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductSubService",
      required: true,
    },
    location_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
  },
  { timestamps: true }
);

interface VendorProductModelInterface extends mongoose.Model<VendorProductDoc> {
  build(attr: IVendorProduct): VendorProductDoc;
}

vendorProductSchema.statics.build = (attr: IVendorProduct) => {
  return new VendorProduct(attr);
};

vendorProductSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.createdAt;
    delete returnedObject.updatedAt;
  },
});

const VendorProduct = mongoose.model<
  VendorProductDoc,
  VendorProductModelInterface
>("VendorProduct", vendorProductSchema);

export { VendorProduct };
