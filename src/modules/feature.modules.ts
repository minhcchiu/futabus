import { BusCompanyModule } from "~modules/1-bus_companies/bus_company.module";
import { BookingModule } from "~modules/10-bookings/booking.module";
import { BannerModule } from "~modules/11-banners/banner.module";
import { VehicleModule } from "~modules/2-vehicles/vehicle.module";
import { SeatModule } from "~modules/3-seats/seat.module";
import { StopLocationModule } from "~modules/4-stop_locations/stop_location.module";
import { RouteModule } from "~modules/5-routes/route.module";
import { RouteStopModule } from "~modules/6-route_stops/route_stop.module";
import { TripModule } from "~modules/7-trips/trip.module";
import { TripStopModule } from "~modules/8-trip_stop/trip_stop.module";
import { TripPriceModule } from "~modules/9-trip_prices/trip_price.module";
import { AuthModule } from "~modules/pre-built/1-auth/auth.module";
import { UserModule } from "~modules/pre-built/1-users/user.module";
import { WardModule } from "~modules/pre-built/10-wards/ward.module";
import { SettingModule } from "~modules/pre-built/11-settings/setting.module";
import { NotificationModule } from "~modules/pre-built/12-notifications/notification.module";
import { GeneratorModule } from "~modules/pre-built/14-generators/generator.module";
import { SepayModule } from "~modules/pre-built/15-sepay/sepay.module";
import { PolicyModule } from "~modules/pre-built/3-policies/policy.module";
import { MenuGroupModule } from "~modules/pre-built/4-menu-groups/menu-group.module";
import { MenuModule } from "~modules/pre-built/4-menus/menu.module";
import { SystemMenuModule } from "~modules/pre-built/4-system-menus/system-menu.module";
import { TokenModule } from "~modules/pre-built/5-tokens/token.module";
import { OtpModule } from "~modules/pre-built/6-otp/otp.module";
import { UploadModule } from "~modules/pre-built/7-uploads/upload.module";
import { UserFileModule } from "~modules/pre-built/7-user-files/user-file.module";
import { ProvinceModule } from "~modules/pre-built/8-provinces/province.module";
import { DistrictModule } from "~modules/pre-built/9-districts/district.module";

export const FeatureModules = [
  // pre-built
  AuthModule,
  UserModule,
  PolicyModule,
  MenuGroupModule,
  MenuModule,
  SystemMenuModule,
  TokenModule,
  OtpModule,
  UploadModule,
  UserFileModule,
  ProvinceModule,
  DistrictModule,
  WardModule,
  SettingModule,
  NotificationModule,
  GeneratorModule,
  SepayModule,

  // features
  BusCompanyModule,
  VehicleModule,
  SeatModule,
  StopLocationModule,
  RouteModule,
  RouteStopModule,
  TripModule,
  TripStopModule,
  TripPriceModule,
  BookingModule,
  BannerModule,
];
