import { IsArray, IsMongoId, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class AttachmentDto {
  @IsString()
  url: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  size?: number;

  @IsOptional()
  width?: number;

  @IsOptional()
  height?: number;

  @IsOptional()
  duration?: number;
}

export class SendMessageDto {
  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsMongoId()
  replyTo?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];
}
