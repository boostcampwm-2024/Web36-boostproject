import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateShellDto {
  @IsNumber()
  @IsNotEmpty()
  readonly shellId: number;
}
