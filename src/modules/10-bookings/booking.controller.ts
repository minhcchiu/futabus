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
import { BookingStatus } from "~modules/10-bookings/enums/booking-status.enum";
import { SepayTransferNotify } from "../pre-built/15-sepay/dto/create-sepay.dto";
import { BookingService } from "./booking.service";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateBookingDto } from "./dto/update-booking.dto";

@Controller("bookings")
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  //  ----- Method: GET -----
  @Public()
  @Get("/seats/booked")
  @HttpCode(HttpStatus.OK)
  async getSeatsBooked(@GetAqp() { filter }: PaginationDto) {
    const tripId = filter.tripId;
    const expireAtFilter = filter.expireAtFilter;

    return this.bookingService.distinct("seatIds", {
      $or: [
        {
          tripId,
          expireAt: expireAtFilter,
          status: BookingStatus.PENDING,
        },
        {
          tripId,
          status: {
            $in: [BookingStatus.CONFIRMED, BookingStatus.NO_SHOW, BookingStatus.COMPLETED],
          },
        },
      ],
    });
  }

  @Public()
  @Get("/paginate")
  @HttpCode(HttpStatus.OK)
  async paginate(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.bookingService.paginate(filter, options);
  }

  @Public()
  @Get("/:id")
  @HttpCode(HttpStatus.OK)
  async findById(
    @Param("id", ParseObjectIdPipe) id: ObjectId,
    @GetAqp() { projection, populate }: PaginationDto,
  ) {
    return this.bookingService.findById(id, { projection, populate });
  }

  @Public()
  @Get("/")
  @HttpCode(HttpStatus.OK)
  async findMany(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.bookingService.findMany(filter, options);
  }

  //  ----- Method: POST -----
  @Public()
  @Post("/sepay/checkout")
  @HttpCode(HttpStatus.OK)
  async checkoutBySepay(@Body() body: SepayTransferNotify) {
    return this.bookingService.checkoutBySepay(body);
  }

  @Public()
  @Post("/")
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateBookingDto) {
    return this.bookingService.create(body);
  }

  //  ----- Method: PATCH -----
  @Public()
  @Patch("/:id/hold")
  @HttpCode(HttpStatus.OK)
  async holdSlot(@Param("id", ParseObjectIdPipe) id: ObjectId, @Body() body: UpdateBookingDto) {
    return this.bookingService.holdSlot(id, body);
  }

  @Public()
  @Patch("/:id/status")
  @HttpCode(HttpStatus.OK)
  async confirmPayment(
    @Param("id", ParseObjectIdPipe) id: ObjectId,
    @Body() body: UpdateBookingDto,
  ) {
    return this.bookingService.updateBookingStatus(id, body);
  }

  @Public()
  @Patch("/:id")
  @HttpCode(HttpStatus.OK)
  async update(@Param("id", ParseObjectIdPipe) id: ObjectId, @Body() body: UpdateBookingDto) {
    return this.bookingService.updateById(id, body);
  }

  //  ----- Method: DELETE -----
  @Public()
  @Delete("/:ids/bulk")
  @HttpCode(HttpStatus.OK)
  async deleteManyByIds(@Param("ids") ids: string) {
    return this.bookingService.deleteMany({
      _id: { $in: ids.split(",").map(id => stringIdToObjectId(id)) },
    });
  }
}
