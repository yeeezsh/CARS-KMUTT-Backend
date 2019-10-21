import { IsString } from 'class-validator';
import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class UserInfoArgs {
    @Field(type => String)
    @IsString()
    id: string;
}
