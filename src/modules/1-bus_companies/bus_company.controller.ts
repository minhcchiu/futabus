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
import { BusCompanyService } from "./bus_company.service";
import { CreateBusCompanyDto } from "./dto/create-bus_company.dto";
import { UpdateBusCompanyDto } from "./dto/update-bus_company.dto";

@Controller("bus_companies")
export class BusCompanyController {
  constructor(private readonly busCompanyService: BusCompanyService) {}

  //  ----- Method: GET -----
  @Public()
  @Get("/paginate")
  @HttpCode(HttpStatus.OK)
  async paginate(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.busCompanyService.paginate(filter, options);
  }

  @Public()
  @Get("/:id")
  @HttpCode(HttpStatus.OK)
  async findById(
    @Param("id", ParseObjectIdPipe) id: ObjectId,
    @GetAqp() { projection, populate }: PaginationDto,
  ) {
    return this.busCompanyService.findById(id, { projection, populate });
  }

  @Public()
  @Get("/")
  @HttpCode(HttpStatus.OK)
  async findMany(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.busCompanyService.findMany(filter, options);
  }

  //  ----- Method: POST -----
  @Public()
  @Post("/")
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateBusCompanyDto) {
    return this.busCompanyService.create(body);
  }

  //  ----- Method: PATCH -----
  @Public()
  @Patch("/:id")
  @HttpCode(HttpStatus.OK)
  async update(@Param("id", ParseObjectIdPipe) id: ObjectId, @Body() body: UpdateBusCompanyDto) {
    return this.busCompanyService.updateById(id, body);
  }

  //  ----- Method: DELETE -----
  @Public()
  @Delete("/:ids/bulk")
  @HttpCode(HttpStatus.OK)
  async deleteManyByIds(@Param("ids") ids: string) {
    return this.busCompanyService.deleteMany({
      _id: { $in: ids.split(",").map(id => stringIdToObjectId(id)) },
    });
  }
}
