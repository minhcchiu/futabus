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
import { UpdateSeatDto } from "~modules/3-seats/dto/update-seat.dto";
import { CreateSeatDto } from "./dto/create-seat.dto";
import { SeatService } from "./seat.service";

@Controller("seats")
export class SeatController {
  constructor(private readonly seatService: SeatService) {}

  //  ----- Method: GET -----
  @Public()
  @Get("/paginate")
  @HttpCode(HttpStatus.OK)
  async paginate(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.seatService.paginate(filter, options);
  }

  @Public()
  @Get("/:id")
  @HttpCode(HttpStatus.OK)
  async findById(
    @Param("id", ParseObjectIdPipe) id: ObjectId,
    @GetAqp() { projection, populate }: PaginationDto,
  ) {
    return this.seatService.findById(id, { projection, populate });
  }

  @Public()
  @Get("/")
  @HttpCode(HttpStatus.OK)
  async findMany(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.seatService.findMany(filter, options);
  }

  //  ----- Method: POST -----
  @Public()
  @Post("/bulk")
  @HttpCode(HttpStatus.CREATED)
  async createMany(@Body() body: CreateSeatDto[]) {
    return this.seatService.createMany(body);
  }

  //  ----- Method: PATCH -----
  @Public()
  @Patch("/bulk")
  @HttpCode(HttpStatus.OK)
  async updateMany(@Body() body: UpdateSeatDto[]) {
    if (!body || body.length === 0) {
      return {
        updatedCount: 0,
        createdCount: 0,
      };
    }

    // 1️⃣ Update seats có _id
    const bulkOps = body
      .filter(item => item._id)
      .map(item => ({
        updateOne: {
          filter: { _id: item._id },
          update: { $set: item },
        },
      }));

    if (bulkOps.length > 0) {
      await this.seatService.bulkWrite(bulkOps);
    }

    // 2️⃣ Create seats mới (không có _id)
    const newItems = body.filter(item => !item._id);

    if (newItems.length > 0) {
      await this.seatService.createMany(newItems);
    }

    return {
      updatedCount: bulkOps.length,
      createdCount: newItems.length,
    };
  }

  @Public()
  @Patch("/:id")
  @HttpCode(HttpStatus.OK)
  async update(@Param("id", ParseObjectIdPipe) id: ObjectId, @Body() body: UpdateSeatDto) {
    return this.seatService.updateById(id, body);
  }

  //  ----- Method: DELETE -----
  @Public()
  @Delete("/:ids/bulk")
  @HttpCode(HttpStatus.OK)
  async deleteManyByIds(@Param("ids") ids: string) {
    return this.seatService.deleteMany({
      _id: { $in: ids.split(",").map(id => stringIdToObjectId(id)) },
    });
  }
}
