import mongoose, { Schema } from "mongoose";

// BuildingCalculation Interface
export interface IFinalItem {
  location_id: mongoose.Types.ObjectId;
  building_id: mongoose.Types.ObjectId;
  service_id: mongoose.Types.ObjectId;
  sub_service_id: mongoose.Types.ObjectId;
  item_id: mongoose.Types.ObjectId;
  item_data: Record<string, any>;
}

// BuildingCalculation Document Interface
interface FinalItemDoc extends mongoose.Document {
  location_id: mongoose.Types.ObjectId;
  building_id: mongoose.Types.ObjectId;
  service_id: mongoose.Types.ObjectId;
  sub_service_id: mongoose.Types.ObjectId;
  item_id: mongoose.Types.ObjectId;
  item_data: Record<string, any>;
}

// BuildingCalculation Schema
const finalItemSchema = new mongoose.Schema<IFinalItem>(
  {
    location_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    building_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Building",
      required: true,
    },
    service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    sub_service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubService",
      required: true,
    },
    item_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    item_data: {
      type: Map,
      of: Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt timestamps
);

// Static method for creating a new BuildingCalculation document
interface FinalItemModelInterface extends mongoose.Model<FinalItemDoc> {
  build(attr: IFinalItem): FinalItemDoc;
}

// Add a static build method to the BuildingCalculation model
finalItemSchema.statics.build = (attr: IFinalItem) => {
  return new FinalItem(attr);
};

// Configure schema to transform output JSON
finalItemSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.createdAt;
    delete returnedObject.updatedAt;
  },
});

// Create the FinalItem model
const FinalItem = mongoose.model<FinalItemDoc, FinalItemModelInterface>(
  "FinalItem",
  finalItemSchema
);

export { FinalItem };
