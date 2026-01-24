import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateItemDto {
	@IsString()
	@IsNotEmpty()
	title: string;

	@IsString()
	@IsNotEmpty()
	description: string;

	@IsString()
	@IsNotEmpty()
	category: string;

	@IsNumber()
	@Min(0)
	price: number;

	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	images?: string[];

	@IsEnum(['new', 'used'])
	@IsOptional()
	condition?: 'new' | 'used';
}
