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
import { CreateTripStopDto } from "./dto/create-trip_stop.dto";
import { UpdateTripStopDto } from "./dto/update-trip_stop.dto";
import { TripStopService } from "./trip_stop.service";

@Controller("trip_stops")
export class TripStopController {
  constructor(private readonly tripStopService: TripStopService) {}

  //  ----- Method: GET -----
  @Public()
  @Get("/paginate")
  @HttpCode(HttpStatus.OK)
  async paginate(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.tripStopService.paginate(filter, options);
  }

  @Public()
  @Get("/:id")
  @HttpCode(HttpStatus.OK)
  async findById(
    @Param("id", ParseObjectIdPipe) id: ObjectId,
    @GetAqp() { projection, populate }: PaginationDto,
  ) {
    return this.tripStopService.findById(id, { projection, populate });
  }

  @Public()
  @Get("/")
  @HttpCode(HttpStatus.OK)
  async findMany(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.tripStopService.findMany(filter, options);
  }

  //  ----- Method: POST -----
  @Public()
  @Post("/")
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateTripStopDto) {
    return this.tripStopService.create(body);
  }

  //  ----- Method: PATCH -----
  @Public()
  @Patch("/:id")
  @HttpCode(HttpStatus.OK)
  async update(@Param("id", ParseObjectIdPipe) id: ObjectId, @Body() body: UpdateTripStopDto) {
    return this.tripStopService.updateById(id, body);
  }

  //  ----- Method: DELETE -----
  @Public()
  @Delete("/:ids/bulk")
  @HttpCode(HttpStatus.OK)
  async deleteManyByIds(@Param("ids") ids: string) {
    return this.tripStopService.deleteMany({
      _id: { $in: ids.split(",").map(id => stringIdToObjectId(id)) },
    });
  }
}
