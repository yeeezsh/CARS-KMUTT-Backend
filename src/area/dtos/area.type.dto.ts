
import { IsNotEmpty, IsString, IsIn, IsDate, IsNumber } from 'class-validator';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class AreaTypeDto {
    @Field()
    @IsNotEmpty()
    // tslint:disable-next-line: variable-name
    readonly _id: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    readonly label: string;

    @Field()
    @IsNotEmpty()
    @IsDate()
    readonly createAt: Date;

    @Field()
    @IsNotEmpty()
    @IsDate()
    readonly updateAt: Date;
}
