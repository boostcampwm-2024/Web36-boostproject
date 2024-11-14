import { IsString } from 'class-validator';

export class UpdateShellDto {
  @IsString()
  readonly query: string;
}
