import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LogDocument, LogEntity } from '../models/log.model';

@Injectable()
export class LogService {
    constructor(
        @InjectModel(LogEntity.name) private model: Model<LogDocument>
    ) { }

    async create(body: LogEntity): Promise<LogEntity> {
        const createdCat = new this.model(body);
        // return createdCat.save();
        return ;
    }

    async findLog(query:any): Promise<LogEntity[]> {
        return this.model.find(query).exec();
    }
}