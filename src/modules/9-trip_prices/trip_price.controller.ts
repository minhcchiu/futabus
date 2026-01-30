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
import { CreateTripPriceDto } from "./dto/create-trip_price.dto";
import { UpdateTripPriceDto } from "./dto/update-trip_price.dto";
import { TripPriceService } from "./trip_price.service";

@Controller("trip_prices")
export class TripPriceController {
  constructor(private readonly tripPriceService: TripPriceService) {}

  //  ----- Method: GET -----
  @Public()
  @Get("/paginate")
  @HttpCode(HttpStatus.OK)
  async paginate(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.tripPriceService.paginate(filter, options);
  }

  @Public()
  @Get("/:id")
  @HttpCode(HttpStatus.OK)
  async findById(
    @Param("id", ParseObjectIdPipe) id: ObjectId,
    @GetAqp() { projection, populate }: PaginationDto,
  ) {
    return this.tripPriceService.findById(id, { projection, populate });
  }

  @Public()
  @Get("/")
  @HttpCode(HttpStatus.OK)
  async findMany(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.tripPriceService.findMany(filter, options);
  }

  //  ----- Method: POST -----
  @Public()
  @Post("/bulk")
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateTripPriceDto[]) {
    return this.tripPriceService.createMany(body);
  }

  //  ----- Method: PATCH -----
  @Public()
  @Patch("/bulk")
  @HttpCode(HttpStatus.OK)
  async updateManyByIds(@Body() body: UpdateTripPriceDto[]) {
    const bulkOpts = body
      .filter(item => item._id)
      .map(item => ({
        updateOne: {
          filter: { _id: item._id },
          update: { $set: item },
        },
      }));

    await this.tripPriceService.bulkWrite(bulkOpts);

    const newItems = body.filter(item => !item._id);

    if (newItems.length > 0) {
      await this.tripPriceService.createMany(newItems);
    }

    return {
      updatedCount: bulkOpts.length,
      createdCount: newItems.length,
    };
  }

  @Public()
  @Patch("/:id")
  @HttpCode(HttpStatus.OK)
  async update(@Param("id", ParseObjectIdPipe) id: ObjectId, @Body() body: UpdateTripPriceDto) {
    return this.tripPriceService.updateById(id, body);
  }

  //  ----- Method: DELETE -----
  @Public()
  @Delete("/:ids/bulk")
  @HttpCode(HttpStatus.OK)
  async deleteManyByIds(@Param("ids") ids: string) {
    return this.tripPriceService.deleteMany({
      _id: { $in: ids.split(",").map(id => stringIdToObjectId(id)) },
    });
  }
}
