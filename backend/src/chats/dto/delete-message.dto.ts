import { IsIn } from 'class-validator';

export class DeleteMessageDto {
  @IsIn(['me', 'everyone'])
  scope: 'me' | 'everyone';
}
