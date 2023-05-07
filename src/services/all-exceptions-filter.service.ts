import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { getDetailsCall } from '../constants';
import { LogEntity } from '../models/log.model';
import { LogService } from './log.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(
        private readonly httpAdapterHost: HttpAdapterHost,
        private readonly jwt: JwtService,
        private readonly log: LogService,
    ) { }

    private getUserFromToken(token: string) {
        if (token) {
            token = token.split(" ")[1]; //separate bearer
            return this.jwt.decode(token);
        }
        return "not found token";
    }

    async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
        // In certain situations `httpAdapter` might not be available in the
        // constructor method, thus we should resolve it here.
        const { httpAdapter } = this.httpAdapterHost;

        const ctx = host.switchToHttp();

        const httpStatus =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const responseBody = {
            timestamp: new Date(),
            codeDetail: getDetailsCall(exception),
            request: {
                url: httpAdapter.getRequestUrl(ctx.getRequest()),
                method: httpAdapter.getRequestMethod(ctx.getRequest()),
                body: ctx.getRequest().body,
                query: ctx.getRequest().query,
                headers: ctx.getRequest().headers,
                user: this.getUserFromToken(ctx.getRequest().headers["authorization"])
            },
            response: {
                status: httpStatus,
                message: (exception as any).message
            },
        } as LogEntity;

        // try {
        //     const data = await this.log.create(responseBody)
        //     responseBody.response.code = (data as any)._id;
        // } catch (e: any) {
        //     console.error(e)
        // }

        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
}