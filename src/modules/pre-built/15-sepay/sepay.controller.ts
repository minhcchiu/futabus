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
import { GetAqp } from "~decorators/get-aqp.decorator";
import { Public } from "~decorators/public.decorator";
import { PaginationDto } from "~dto/pagination.dto";
import { CreateSepayDto } from "~modules/pre-built/15-sepay/dto/create-sepay.dto";
import { GenerateQrCodeDto } from "~modules/pre-built/15-sepay/dto/generate-qr-code.dto";
import { UpdateSepayDto } from "~modules/pre-built/15-sepay/dto/update-sepay.dto";
import { SepayService } from "~modules/pre-built/15-sepay/sepay.service";
import { ParseObjectIdPipe } from "~utils/parse-object-id.pipe";
import { stringIdToObjectId } from "~utils/stringId_to_objectId";

@Controller("sepay")
export class SepayController {
  constructor(private readonly sepayService: SepayService) {}

  //  ----- Method: GET -----
  @Public()
  @Get("/paginate")
  @HttpCode(HttpStatus.OK)
  async paginate(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.sepayService.paginate(filter, options);
  }

  @Public()
  @Get("")
  @HttpCode(HttpStatus.OK)
  async findMany(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.sepayService.findMany(filter, options);
  }

  @Public()
  @Get("/:id")
  @HttpCode(HttpStatus.OK)
  async findById(
    @Param("id", ParseObjectIdPipe) id: ObjectId,
    @GetAqp() { projection, populate }: PaginationDto,
  ) {
    return this.sepayService.findById(id, { projection, populate });
  }

  //  ----- Method: POST -----
  @Public()
  @Post("/qrcode")
  @HttpCode(HttpStatus.OK)
  async generateQRCode(@Body() body: GenerateQrCodeDto) {
    return this.sepayService.generateQRCode(body);
  }

  @Public()
  @Post("/")
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateSepayDto) {
    return this.sepayService.create(body);
  }

  //  ----- Method: PATCH -----
  @Public()
  @Patch("/:id")
  @HttpCode(HttpStatus.OK)
  async update(@Param("id", ParseObjectIdPipe) id: ObjectId, @Body() body: UpdateSepayDto) {
    return this.sepayService.updateById(id, body);
  }

  //  ----- Method: DELETE -----
  @Public()
  @Delete("/:ids/bulk")
  @HttpCode(HttpStatus.OK)
  async deleteManyByIds(@Param("ids") ids: string) {
    return this.sepayService.deleteMany({
      _id: { $in: ids.split(",").map(id => stringIdToObjectId(id)) },
    });
  }
}
