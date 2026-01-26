import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum } from 'class-validator';

export class CreateAdminDto {
	@IsNotEmpty()
	@IsString()
	full_name: string;

	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@MinLength(6)
	password: string;

	@IsString()
	department?: string;

	@IsNotEmpty()
	@IsEnum(['admin', 'student'])
	role: 'admin' | 'student';
}
