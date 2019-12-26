import { IsNotEmpty, IsString, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class Option {
    @IsNotEmpty()
    @IsString()
    readonly key: string;

    @IsString()
    readonly value: string;
}

// tslint:disable-next-line: max-classes-per-file
class Field {
    @IsNotEmpty()
    @IsString()
    readonly key: string;

    @IsString()
    readonly value: string;

    @IsNotEmpty()
    @IsString()
    readonly type: string;

    @IsNotEmpty()
    @IsBoolean()
    readonly required: boolean;

    @ValidateNested({ each: true })
    @Type(() => Option)
    readonly options: Option[];

}

// tslint:disable-next-line: max-classes-per-file
export class FormCreateDto {
    @IsNotEmpty()
    @IsString()
    readonly label: string;

    @ValidateNested({ each: true })
    @Type(() => Field)
    readonly fields: Field[];
}
