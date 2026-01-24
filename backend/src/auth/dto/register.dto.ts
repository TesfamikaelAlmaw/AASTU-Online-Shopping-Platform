import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'Full name is required' })
  full_name: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @IsNotEmpty({ message: 'Department is required' })
  department: string;
  @IsOptional()
  role: 'student' | 'admin';
  
}
