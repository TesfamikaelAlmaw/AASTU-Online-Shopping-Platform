import { IsIn } from 'class-validator';

export class UpdateStatusDto {
  @IsIn(['active', 'suspended'], { message: 'Status must be active or suspended' })
  status: 'active' | 'suspended';
}
