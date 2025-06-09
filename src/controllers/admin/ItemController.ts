import { NextFunction, Request, Response } from "express";
import { Error } from "mongoose";
import { ClientError } from "../../exceptions/clientError";
import { NotFoundError } from "../../exceptions/notFoundError";
import { processErrors } from "../../utils/errorProcessing";
import { ResponseCodes } from "../../utils/constants";
import { IItem, Item } from "../../models/item";

class ItemController {
  static listAll = async (req: Request, res: Response, next: NextFunction) => {
    const { sub_service_id } = req.query;
    let items = [];

    // if (sub_service_id) {
    //   items = await Item.find({ sub_service_id }).populate(
    //     "sub_service_id"
    //   );
    // } else {
    //   items = await Item.find().populate("sub_service_id");
    // }

    // res.send({
    //   status: ResponseCodes.ITEM_LIST.code,
    //   message: ResponseCodes.ITEM_LIST.message,
    //   data: items,
    // });

    try {
      if (sub_service_id) {
        items = await Item.find({ sub_service_id }).populate({
          path: "sub_service_id",
          populate: {
            path: "service_id",
            model: "Service",
          },
        });
      } else {
        items = await Item.find().populate({
          path: "sub_service_id",
          populate: {
            path: "service_id",
          },
        });
      }

      res.send({
        status: ResponseCodes.PRODUCT_LIST.code,
        message: ResponseCodes.PRODUCT_LIST.message,
        data: items,
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
    // Get the ID from the url
    const id: string = req.params.id;

    // Mongoose automatically casts the id to ObjectID
    const item = await Item.findById(id);
    if (!item) throw new NotFoundError(`Item with ID ${id} not found`);

    res.send({
      status: ResponseCodes.ITEM_DETAILS.code,
      message: ResponseCodes.ITEM_DETAILS.message,
      data: item?.toJSON(),
    });
  };

  static newItem = async (req: Request, res: Response, next: NextFunction) => {
    // Get parameters from the body
    const { sub_service_id, name, description } = req.body;
    let item;

    try {
      item = Item.build({
        sub_service_id,
        name,
        description,
      } as IItem);

      // Save the item
      await item.save();
    } catch (e: any) {
      console.error(e);
      const error = e as Error.ValidationError;
      throw new ClientError(processErrors(error));
    }

    // If all ok, send response
    res.send({
      status: ResponseCodes.ITEM_CREATED.code,
      message: ResponseCodes.ITEM_CREATED.message,
      data: item.toJSON(),
    });
  };

  static editItem = async (req: Request, res: Response, next: NextFunction) => {
    // Get the ID from the url
    const id = req.params.id;

    // Get values from the body
    const { sub_service_id, name, description } = req.body;

    // Mongoose automatically casts the id to ObjectID
    const item = await Item.findById(id);
    if (!item) throw new NotFoundError(`Item with ID ${id} not found`);

    // Edit the properties
    item.sub_service_id = sub_service_id;
    item.name = name;
    item.description = description;

    // Save and catch all validation errors
    try {
      await item.save();
    } catch (e) {
      const error = e as Error.ValidationError;
      throw new ClientError(processErrors(error));
    }

    res.send({
      status: ResponseCodes.ITEM_UPDATED.code,
      message: ResponseCodes.ITEM_UPDATED.message,
      data: item.toJSON(),
    });
  };

  static deleteItem = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // Get the ID from the url
    const id = req.params.id;

    // Mongoose automatically casts the id to ObjectID
    const item = await Item.findById(id);
    if (!item) throw new NotFoundError(`Item with ID ${id} not found`);

    await item.delete();

    // After all send response
    res.send({
      status: ResponseCodes.ITEM_DELETED.code,
      message: ResponseCodes.ITEM_DELETED.message,
    });
  };
}

export default ItemController;
