import { ObjectType, Field } from 'type-graphql';
import { Type } from 'class-transformer';
import { ValidateNested, IsNotEmpty } from 'class-validator';

class TimeSlot {
    @Field(() => String)
    @IsNotEmpty()
    start: Date;

    @Field(() => String)
    @IsNotEmpty()
    stop: Date;
}

// tslint:disable-next-line:max-classes-per-file
@ObjectType()
export class TaskCreateSport {

    @Field(() => TimeSlot)
    @Type(() => TimeSlot)
    @ValidateNested({ each: true })
    @IsNotEmpty()
    time: TimeSlot[];

    @Field()
    @Type(() => String)
    @ValidateNested({ each: true })
    @IsNotEmpty()
    requestor: string[];

    @Field(() => String)
    @IsNotEmpty()
    area: string;
}
