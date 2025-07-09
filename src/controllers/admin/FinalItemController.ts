// import { NextFunction, Request, Response } from "express";
// // import { IFinalProduct, FinalProduct } from "../../models/final-product";
// import { IFinalItem, FinalItem } from "../../models/final-item";
// import { ClientError } from "../../exceptions/clientError";
// import { Error } from "mongoose";
// import { processErrors } from "../../utils/errorProcessing";
// import { ResponseCodes } from "../../utils/constants";

// class FinalItemController {
//   static newFinalItem = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) => {
//     // Get parameters from the body
//     const { building_id, service_id, sub_service_id, item_id, item_data } =
//       req.body;
//     let finalItem;
//     try {
//       finalItem = await FinalItem.build({
//         building_id,
//         service_id,
//         sub_service_id,
//         item_id,
//         item_data,
//       } as IFinalItem).save();
//     } catch (e: any) {
//       console.error(e);
//       const error = e as Error.ValidationError;
//       throw new ClientError(processErrors(error));
//     }

//     // If all ok, send response
//     res.send({
//       status: ResponseCodes.FINAL_PRODUCT_CREATED.code,
//       message: ResponseCodes.FINAL_PRODUCT_CREATED.message,
//     });
//   };
// }

// export default FinalItemController;

import { NextFunction, Request, Response } from "express";
import { IFinalItem, FinalItem } from "../../models/final-item";
import { ClientError } from "../../exceptions/clientError";
import { Error } from "mongoose";
import { processErrors } from "../../utils/errorProcessing";
import { ResponseCodes } from "../../utils/constants";
import { NotFoundError } from "../../exceptions/notFoundError";

class FinalItemController {
  // 🟢 Create new Final Item
  static newFinalItem = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { building_id, service_id, sub_service_id, item_id, item_data } =
      req.body;

    let finalItem;
    try {
      finalItem = await FinalItem.build({
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

    res.send({
      status: ResponseCodes.FINAL_ITEM_CREATED.code,
      message: ResponseCodes.FINAL_ITEM_CREATED.message,
    });
  };

  // 🟡 Get existing Final Item by building_id + item_id
  static getFinalItemByFilter = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { building_id, item_id } = req.body;

    try {
      const existingItem = await FinalItem.findOne({
        building_id,
        item_id,
      }).lean();

      res.send({
        status: ResponseCodes.FINAL_ITEM_DETAILS.code,
        message: ResponseCodes.FINAL_ITEM_DETAILS.message,
        data: existingItem || null,
      });
    } catch (e: any) {
      console.error(e);
      const error = e as Error.ValidationError;
      throw new ClientError(processErrors(error));
    }
  };

  // 🔵 Update an existing Final Item
  static updateFinalItem = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id;

    try {
      const updated = await FinalItem.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      if (!updated) {
        throw new NotFoundError("Final item not found");
      }

      res.send({
        status: ResponseCodes.FINAL_ITEM_UPDATED.code,
        message: ResponseCodes.FINAL_ITEM_UPDATED.message,
        data: updated,
      });
    } catch (e: any) {
      console.error(e);
      const error = e as Error.ValidationError;
      throw new ClientError(processErrors(error));
    }
  };
}

export default FinalItemController;
