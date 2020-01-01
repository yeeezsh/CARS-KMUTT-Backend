import { Field } from 'type-graphql';
import { IsString } from 'class-validator';

export class TaskScheduleDto {
    @Field(() => String)
    @IsString()
    id: string;
}
