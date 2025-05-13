import mongoose from "mongoose";

// Item Interface
export interface IItem {
  name: string;
  description: string;
  sub_service_id: mongoose.Types.ObjectId;
}

// Item Document Interface
interface ItemDoc extends mongoose.Document {
  name: string;
  description: string;
  sub_service_id: mongoose.Types.ObjectId;
}

// Item Schema
const itemSchema = new mongoose.Schema<IItem>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: [2, "Item name too short"],
      maxLength: [50, "Item name too long"],
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minLength: [5, "Item description too short"],
      maxLength: [100, "Item description too long"],
    },
    sub_service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubService",
      required: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt timestamps
);

// Static method for creating a new Item document
interface ItemModelInterface extends mongoose.Model<ItemDoc> {
  build(attr: IItem): ItemDoc;
}

// Add a static build method to the Item model
itemSchema.statics.build = (attr: IItem) => {
  return new Item(attr);
};

// Configure schema to transform output JSON
itemSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.createdAt;
    delete returnedObject.updatedAt;
  },
});

// Create the SubBuilding model
const Item = mongoose.model<ItemDoc, ItemModelInterface>("Item", itemSchema);

export { Item };
