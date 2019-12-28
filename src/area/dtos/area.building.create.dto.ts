import { IsString, IsIn } from 'class-validator';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class AreaBuildingCreateDto {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  @IsIn(['sport', 'area'])
  type: string;

  @Field(() => String, { nullable: true })
  category: string;
}
