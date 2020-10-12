import { IsNumber } from 'class-validator';

class QuotaResponseApiDTO {
  @IsNumber()
  n: number;
}

export default QuotaResponseApiDTO;
