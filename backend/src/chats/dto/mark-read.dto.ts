import { IsOptional, IsArray, IsMongoId } from 'class-validator';

export class MarkReadDto {
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  messageIds?: string[];
}
