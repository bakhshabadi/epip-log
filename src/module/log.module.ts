import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { LogEntity, LogSchema } from '../models/log.model';
import { LogService } from '../services/log.service';

export interface LogOption {
    connection: string;
    user: string;
    pass: string;
    dbName: string;
}

@Module({})
export class LogModule {
    static register(options: LogOption): DynamicModule {
        return {
            module: LogModule,
            imports: [
                MongooseModule.forRootAsync({
                    imports: [ConfigModule],
                    inject: [ConfigService],

                    useFactory: (srv: ConfigService): MongooseModuleOptions => {
                        const retVal = {
                            uri: srv.get(options.connection),
                            user: srv.get(options.user),
                            pass: srv.get(options.pass),
                            dbName: srv.get(options.dbName),
                        }
                        return retVal;
                    },
                }),
                MongooseModule.forFeature([{ name: LogEntity.name, schema: LogSchema }])
            ],
            providers: [
                LogService,
            ],
            exports: [
                LogService,
            ]
        };
    }
}