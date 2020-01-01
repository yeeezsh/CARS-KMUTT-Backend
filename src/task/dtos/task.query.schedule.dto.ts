import { Field } from 'type-graphql';
import { IsString } from 'class-validator';

export class TaskQueryScheduleDto {
    @Field(() => String)
    @IsString()
    id: string;
}
