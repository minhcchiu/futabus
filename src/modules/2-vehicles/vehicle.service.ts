import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { SeatDocument } from "~modules/3-seats/schemas/seat.schema";
import { SeatService } from "~modules/3-seats/seat.service";
import { arrayToMap } from "~utils/common.util";
import { Vehicle, VehicleDocument } from "./schemas/vehicle.schema";

@Injectable()
export class VehicleService extends BaseService<VehicleDocument> {
  constructor(
    @InjectModel(Vehicle.name) model: Model<VehicleDocument>,
    private readonly seatService: SeatService,
  ) {
    super(model);
  }

  async assignSeats(vehicles: VehicleDocument[]) {
    const seats: SeatDocument[] = await this.seatService.findMany({
      vehicleId: { $in: vehicles.map(v => v._id) },
    });
    const seatMap = arrayToMap(seats, seat => seat.vehicleId.toString());

    vehicles.forEach(vehicle => {
      const seats = seatMap.get(vehicle._id.toString()) || [];
      Object.assign(vehicle, { seats, totalSeats: seats.filter(s => s.isActive).length });
    });
    return vehicles;
  }
}
