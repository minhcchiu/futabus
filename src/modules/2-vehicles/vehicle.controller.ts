import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ObjectId } from "mongodb";
import { ParseObjectIdPipe } from "src/utils/parse-object-id.pipe";
import { stringIdToObjectId } from "src/utils/stringId_to_objectId";
import { GetAqp } from "~decorators/get-aqp.decorator";
import { Public } from "~decorators/public.decorator";
import { PaginationDto } from "~dto/pagination.dto";
import { CreateVehicleDto } from "./dto/create-vehicle.dto";
import { UpdateVehicleDto } from "./dto/update-vehicle.dto";
import { VehicleService } from "./vehicle.service";

@Controller("vehicles")
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  //  ----- Method: GET -----
  @Public()
  @Get("/paginate")
  @HttpCode(HttpStatus.OK)
  async paginate(@GetAqp() { filter, ...options }: PaginationDto) {
    const pagination = await this.vehicleService.paginate(filter, options);

    await this.vehicleService.assignSeats(pagination.data);

    return pagination;
  }

  @Public()
  @Get("/:id")
  @HttpCode(HttpStatus.OK)
  async findById(
    @Param("id", ParseObjectIdPipe) id: ObjectId,
    @GetAqp() { projection, populate }: PaginationDto,
  ) {
    const found = await this.vehicleService.findById(id, { projection, populate });

    await this.vehicleService.assignSeats([found]);

    return found;
  }

  @Public()
  @Get("/")
  @HttpCode(HttpStatus.OK)
  async findMany(@GetAqp() { filter, ...options }: PaginationDto) {
    const res = await this.vehicleService.findMany(filter, options);

    await this.vehicleService.assignSeats(res);

    return res;
  }

  //  ----- Method: POST -----
  @Public()
  @Post("/")
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateVehicleDto) {
    return this.vehicleService.create(body);
  }

  //  ----- Method: PATCH -----
  @Public()
  @Patch("/:id")
  @HttpCode(HttpStatus.OK)
  async update(@Param("id", ParseObjectIdPipe) id: ObjectId, @Body() body: UpdateVehicleDto) {
    return this.vehicleService.updateById(id, body);
  }

  //  ----- Method: DELETE -----
  @Public()
  @Delete("/:ids/bulk")
  @HttpCode(HttpStatus.OK)
  async deleteManyByIds(@Param("ids") ids: string) {
    return this.vehicleService.deleteMany({
      _id: { $in: ids.split(",").map(id => stringIdToObjectId(id)) },
    });
  }
}
