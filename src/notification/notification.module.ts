import { forwardRef, Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { NotificationService } from "./notification.service";
import { MongooseModule } from "@nestjs/mongoose";
import { NotificationSchema } from "./notification.model";
import { UserModule } from "src/user/user.module";

@Module({
    imports: [ScheduleModule.forRoot(), MongooseModule.forFeature([{name: "Notification", schema: NotificationSchema}])],
    providers: [NotificationService],
    exports: [NotificationService]
})
export class NotificationModule {

}