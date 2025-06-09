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

    try {
      if (product_sub_service_id) {
        products = await Product.find({ product_sub_service_id }).populate({
          path: "product_sub_service_id",
          populate: {
            path: "service_id",
            model: "Service",
          },
        });
      } else {
        products = await Product.find().populate({
          path: "product_sub_service_id",
          populate: {
            path: "service_id",
            model: "Service",
          },
        });
      }

      res.send({
        status: ResponseCodes.PRODUCT_LIST.code,
        message: ResponseCodes.PRODUCT_LIST.message,
        data: products,
      });
    } catch (err) {
      next(err);
    }
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
