import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export type LogDocument = HydratedDocument<LogEntity>;


export class CodeDetailEntity {
    // @Prop()
    className: string;

    // @Prop()
    fileName: string;

    // @Prop()
    methodName: string;

    // @Prop()
    lineNumber: string;
}


export class RequestEntity {
    // @Prop()
    url: string;

    // @Prop()
    method: string;

    // @Prop()
    body: any;

    // @Prop()
    query: string;

    // @Prop()
    headers: any;

    // @Prop()
    user: any;
}

export class ResponseEntity {
    code: string;
    // @Prop()
    status: number;

    // @Prop()
    message: string;
}

@Schema()
export class LogEntity {
    @Prop()
    timestamp: Date;

    @Prop()
    codeDetail: CodeDetailEntity;

    @Prop()
    request: RequestEntity;

    @Prop()
    response: ResponseEntity;
}

export const LogSchema = SchemaFactory.createForClass(LogEntity);