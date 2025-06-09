import { NextFunction, Request, Response } from "express";
import { Error } from "mongoose";
import { ClientError } from "../../exceptions/clientError";
import { NotFoundError } from "../../exceptions/notFoundError";
import { Room, IRoom } from "../../models/room";
import { processErrors } from "../../utils/errorProcessing";
import { ResponseCodes } from "../../utils/constants";

class RoomController {
  static listAll = async (req: Request, res: Response, next: NextFunction) => {
    const { level_id } = req.query;
    let rooms = [];

    // if (level_id) {
    //   rooms = await Room.find({ level_id });
    // } else {
    //   rooms = await Room.find();
    // }

    // res.send({
    //   status: ResponseCodes.ROOM_LIST.code,
    //   message: ResponseCodes.ROOM_LIST.message,
    //   data: rooms,
    // });

    try {
      if (level_id) {
        rooms = await Room.find({ level_id }).populate({
          path: "level_id",
          populate: {
            path: "sub_building_id",
            populate: {
              path: "building_id",
              select: "type",
            },
          },
        });
      } else {
        rooms = await Room.find().populate({
          path: "level_id",
          populate: {
            path: "sub_building_id",
            populate: {
              path: "building_id",
              select: "type",
            },
          },
        });
      }

      res.send({
        status: ResponseCodes.PRODUCT_LIST.code,
        message: ResponseCodes.PRODUCT_LIST.message,
        data: rooms,
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
    const room = await Room.findById(id);
    if (!room) throw new NotFoundError(`Room with ID ${id} not found`);

    res.send({
      status: ResponseCodes.ROOM_DETAILS.code,
      message: ResponseCodes.ROOM_DETAILS.message,
      data: room?.toJSON(),
    });
  };

  static newRoom = async (req: Request, res: Response, next: NextFunction) => {
    // Get parameters from the body
    const { level_id, name, description } = req.body;
    let room;

    try {
      room = Room.build({ level_id, name, description } as IRoom);

      // Save the room
      await room.save();
    } catch (e: any) {
      console.error(e);
      const error = e as Error.ValidationError;
      throw new ClientError(processErrors(error));
    }

    // If all ok, send response
    res.send({
      status: ResponseCodes.ROOM_CREATED.code,
      message: ResponseCodes.ROOM_CREATED.message,
      data: room.toJSON(),
    });
  };

  static editRoom = async (req: Request, res: Response, next: NextFunction) => {
    // Get the ID from the url
    const id = req.params.id;

    // Get values from the body
    const { level_id, name, description } = req.body;

    // Mongoose automatically casts the id to ObjectID
    const room = await Room.findById(id);
    if (!room) throw new NotFoundError(`Room with ID ${id} not found`);

    // Edit the properties
    room.level_id = level_id;
    room.name = name;
    room.description = description;

    // Save and catch all validation errors
    try {
      await room.save();
    } catch (e) {
      const error = e as Error.ValidationError;
      throw new ClientError(processErrors(error));
    }

    res.send({
      status: ResponseCodes.ROOM_UPDATED.code,
      message: ResponseCodes.ROOM_UPDATED.message,
      data: room.toJSON(),
    });
  };

  static deleteRoom = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // Get the ID from the url
    const id = req.params.id;

    // Mongoose automatically casts the id to ObjectID
    const room = await Room.findById(id);
    if (!room) throw new NotFoundError(`Room with ID ${id} not found`);

    await room.delete();

    // After all send response
    res.send({
      status: ResponseCodes.ROOM_DELETED.code,
      message: ResponseCodes.ROOM_DELETED.message,
    });
  };
}

export default RoomController;
