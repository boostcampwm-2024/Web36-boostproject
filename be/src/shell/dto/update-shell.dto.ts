import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateShellDto {
  @IsNotEmpty()
  @IsString()
  readonly query: string;
}
