
import { IsNotEmpty, IsString, IsIn, IsDate } from 'class-validator';
import { ObjectType, Field } from 'type-graphql';

class TimeSlot {
    @Field()
    @IsDate()
    readonly start: Date;

    @Field()
    @IsDate()
    readonly stop: Date;
}

// tslint:disable-next-line: max-classes-per-file
@ObjectType()
export class TaskDto {
    @Field()
    @IsNotEmpty()
    // tslint:disable-next-line: variable-name
    readonly _id: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    readonly time: TimeSlot;

    @Field()
    @IsNotEmpty()
    @IsString()
    readonly requestor: string;

    @Field()
    @IsNotEmpty()
    @IsIn(['wait', 'approve', 'reject', 'accept'])
    readonly state: [string];

    @Field()
    readonly staff: string;

    // @Field()
    // readonly area: string; //required area module
    // @Field()
    // readonly form: string; //required form module

    @Field()
    @IsNotEmpty()
    @IsDate()
    readonly createAt: Date;

    @Field()
    @IsNotEmpty()
    @IsDate()
    readonly updateAt: Date;
}
