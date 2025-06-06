// import { NextFunction, Request, Response } from "express";
// import { Error } from "mongoose";
// import { ClientError } from "../../exceptions/clientError";
// import { NotFoundError } from "../../exceptions/notFoundError";
// import { processErrors } from "../../utils/errorProcessing";
// import { ResponseCodes } from "../../utils/constants";
// import { IProduct, Product } from "../../models/product";

// class ProductController {
//   static listAll = async (req: Request, res: Response, next: NextFunction) => {
//     // Get the Product Sub Service ID from the url
//     const { product_sub_service_id } = req.query; // Access query parameter
//     let products = [];

//     if (product_sub_service_id) {
//       // Execute the query with product_sub_service_id
//       products = await Product.find({ product_sub_service_id }).populate(
//         "product_sub_service_id"
//       );
//     } else {
//       // Execute the query
//       products = await Product.find().populate("product_sub_service_id");
//     }

//     // Send the product object
//     res.send({
//       status: ResponseCodes.PRODUCT_LIST.code,
//       message: ResponseCodes.PRODUCT_LIST.message,
//       data: products,
//     });
//   };

//   static getOneById = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) => {
//     // Get the ID from the url
//     const id: string = req.params.id;

//     // Mongoose automatically casts the id to ObjectID
//     const product = await Product.findById(id);
//     if (!product) throw new NotFoundError(`Product with ID ${id} not found`);

//     res.send({
//       status: ResponseCodes.PRODUCT_DETAILS.code,
//       message: ResponseCodes.PRODUCT_DETAILS.message,
//       data: product?.toJSON(),
//     });
//   };

//   static newProduct = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) => {
//     // Get parameters from the body
//     const { product_sub_service_id, name, capacity } = req.body;
//     let product;

//     try {
//       product = Product.build({
//         product_sub_service_id,
//         name,
//         capacity,
//       } as IProduct);

//       // Save the product
//       await product.save();
//     } catch (e: any) {
//       console.error(e);
//       const error = e as Error.ValidationError;
//       throw new ClientError(processErrors(error));
//     }

//     // If all ok, send response
//     res.send({
//       status: ResponseCodes.PRODUCT_CREATED.code,
//       message: ResponseCodes.PRODUCT_CREATED.message,
//       data: product.toJSON(),
//     });
//   };

//   static editProduct = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) => {
//     // Get the ID from the url
//     const id = req.params.id;

//     // Get values from the body
//     const { product_sub_service_id, name, capacity } = req.body;

//     // Mongoose automatically casts the id to ObjectID
//     const product = await Product.findById(id);
//     if (!product) throw new NotFoundError(`Product with ID ${id} not found`);

//     // Edit the properties
//     product.product_sub_service_id = product_sub_service_id;
//     product.name = name;
//     product.capacity = capacity;

//     // Save and catch all validation errors
//     try {
//       await product.save();
//     } catch (e) {
//       const error = e as Error.ValidationError;
//       throw new ClientError(processErrors(error));
//     }

//     res.send({
//       status: ResponseCodes.PRODUCT_UPDATED.code,
//       message: ResponseCodes.PRODUCT_UPDATED.message,
//       data: product.toJSON(),
//     });
//   };

//   static deleteProduct = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) => {
//     // Get the ID from the url
//     const id = req.params.id;

//     // Mongoose automatically casts the id to ObjectID
//     const product = await Product.findById(id);
//     if (!product) throw new NotFoundError(`Product with ID ${id} not found`);

//     await product.delete();

//     // After all send response
//     res.send({
//       status: ResponseCodes.PRODUCT_DELETED.code,
//       message: ResponseCodes.PRODUCT_DELETED.message,
//     });
//   };
// }

// export default ProductController;

import { NextFunction, Request, Response } from "express";
import { Error } from "mongoose";
import { ClientError } from "../../exceptions/clientError";
import { NotFoundError } from "../../exceptions/notFoundError";
import { processErrors } from "../../utils/errorProcessing";
import { ResponseCodes } from "../../utils/constants";
import { IProduct, Product } from "../../models/product";

class ProductController {
  static listAll = async (req: Request, res: Response, next: NextFunction) => {
    const { product_sub_service_id } = req.query;
    let products = [];

    if (product_sub_service_id) {
      products = await Product.find({ product_sub_service_id }).populate(
        "product_sub_service_id"
      );
    } else {
      products = await Product.find().populate("product_sub_service_id");
    }

    res.send({
      status: ResponseCodes.PRODUCT_LIST.code,
      message: ResponseCodes.PRODUCT_LIST.message,
      data: products,
    });
  };

  static getOneById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const id: string = req.params.id;

    const product = await Product.findById(id);
    if (!product) throw new NotFoundError(`Product with ID ${id} not found`);

    res.send({
      status: ResponseCodes.PRODUCT_DETAILS.code,
      message: ResponseCodes.PRODUCT_DETAILS.message,
      data: product?.toJSON(),
    });
  };

  static newProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { product_sub_service_id, name, capacity, unit } = req.body;
    let product;

    try {
      product = Product.build({
        product_sub_service_id,
        name,
        capacity,
        unit,
      } as IProduct);

      await product.save();
    } catch (e: any) {
      console.error(e);
      const error = e as Error.ValidationError;
      throw new ClientError(processErrors(error));
    }

    res.send({
      status: ResponseCodes.PRODUCT_CREATED.code,
      message: ResponseCodes.PRODUCT_CREATED.message,
      data: product.toJSON(),
    });
  };

  static editProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id;
    const { product_sub_service_id, name, capacity, unit } = req.body;

    const product = await Product.findById(id);
    if (!product) throw new NotFoundError(`Product with ID ${id} not found`);

    product.product_sub_service_id = product_sub_service_id;
    product.name = name;
    product.capacity = capacity;
    product.unit = unit;

    try {
      await product.save();
    } catch (e) {
      const error = e as Error.ValidationError;
      throw new ClientError(processErrors(error));
    }

    res.send({
      status: ResponseCodes.PRODUCT_UPDATED.code,
      message: ResponseCodes.PRODUCT_UPDATED.message,
      data: product.toJSON(),
    });
  };

  static deleteProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id;

    const product = await Product.findById(id);
    if (!product) throw new NotFoundError(`Product with ID ${id} not found`);

    await product.delete();

    res.send({
      status: ResponseCodes.PRODUCT_DELETED.code,
      message: ResponseCodes.PRODUCT_DELETED.message,
    });
  };
}

export default ProductController;
