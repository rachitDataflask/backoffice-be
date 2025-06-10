import { NextFunction, Request, Response } from "express";
import { Error } from "mongoose";
import { ClientError } from "../../exceptions/clientError";
import { NotFoundError } from "../../exceptions/notFoundError";
import { processErrors } from "../../utils/errorProcessing";
import { ResponseCodes } from "../../utils/constants";
import { IVendorProduct, VendorProduct } from "../../models/vendor-product";

class VendorProductController {
  static listAll = async (req: Request, res: Response, next: NextFunction) => {
    const { product_sub_service_id } = req.query;
    let vendorproducts = [];

    try {
      if (product_sub_service_id) {
        vendorproducts = await VendorProduct.find({
          product_sub_service_id,
        }).populate({
          path: "product_sub_service_id",
          populate: {
            path: "service_id",
            model: "Service",
          },
        });
      } else {
        vendorproducts = await VendorProduct.find().populate({
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
        data: vendorproducts,
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

    const vendorproduct = await VendorProduct.findById(id);
    if (!vendorproduct)
      throw new NotFoundError(`Product with ID ${id} not found`);

    res.send({
      status: ResponseCodes.PRODUCT_DETAILS.code,
      message: ResponseCodes.PRODUCT_DETAILS.message,
      data: vendorproduct?.toJSON(),
    });
  };

  static newVendorProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const {
      product_sub_service_id,
      name,
      capacity,
      unit,
      service_id,
      location_id,
    } = req.body;
    let vendorproduct;

    try {
      vendorproduct = VendorProduct.build({
        product_sub_service_id,
        name,
        capacity,
        unit,
        service_id,
        location_id,
      } as IVendorProduct);

      await vendorproduct.save();
    } catch (e: any) {
      console.error(e);
      const error = e as Error.ValidationError;
      throw new ClientError(processErrors(error));
    }

    res.send({
      status: ResponseCodes.PRODUCT_CREATED.code,
      message: ResponseCodes.PRODUCT_CREATED.message,
      data: vendorproduct.toJSON(),
    });
  };

  static editProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id;
    const { product_sub_service_id, name, capacity, unit } = req.body;

    const vendorproduct = await VendorProduct.findById(id);
    if (!vendorproduct)
      throw new NotFoundError(`Product with ID ${id} not found`);

    vendorproduct.product_sub_service_id = product_sub_service_id;
    vendorproduct.name = name;
    vendorproduct.capacity = capacity;
    vendorproduct.unit = unit;

    try {
      await vendorproduct.save();
    } catch (e) {
      const error = e as Error.ValidationError;
      throw new ClientError(processErrors(error));
    }

    res.send({
      status: ResponseCodes.PRODUCT_UPDATED.code,
      message: ResponseCodes.PRODUCT_UPDATED.message,
      data: vendorproduct.toJSON(),
    });
  };

  static deleteProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id;

    const vendorproduct = await VendorProduct.findById(id);
    if (!vendorproduct)
      throw new NotFoundError(`Product with ID ${id} not found`);

    await vendorproduct.delete();

    res.send({
      status: ResponseCodes.PRODUCT_DELETED.code,
      message: ResponseCodes.PRODUCT_DELETED.message,
    });
  };
}

export default VendorProductController;
