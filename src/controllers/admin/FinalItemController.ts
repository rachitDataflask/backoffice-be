import { NextFunction, Request, Response } from "express";
// import { IFinalProduct, FinalProduct } from "../../models/final-product";
import { IFinalItem, FinalItem } from "../../models/final-item";
import { ClientError } from "../../exceptions/clientError";
import { Error } from "mongoose";
import { processErrors } from "../../utils/errorProcessing";
import { ResponseCodes } from "../../utils/constants";

class FinalItemController {
  static newFinalItem = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // Get parameters from the body
    const {
      location_id,
      building_id,
      service_id,
      sub_service_id,
      item_id,
      item_data,
    } = req.body;
    let finalItem;
    try {
      finalItem = await FinalItem.build({
        location_id,
        building_id,
        service_id,
        sub_service_id,
        item_id,
        item_data,
      } as IFinalItem).save();
    } catch (e: any) {
      console.error(e);
      const error = e as Error.ValidationError;
      throw new ClientError(processErrors(error));
    }

    // If all ok, send response
    res.send({
      status: ResponseCodes.FINAL_PRODUCT_CREATED.code,
      message: ResponseCodes.FINAL_PRODUCT_CREATED.message,
    });
  };
}

export default FinalItemController;
