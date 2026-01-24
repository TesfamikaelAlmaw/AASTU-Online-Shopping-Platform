import {
	Controller,
	Get,
	Post,
	Patch,
	Delete,
	Body,
	Param,
	UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('categories')
export class CategoriesController {
	constructor(private readonly categoriesService: CategoriesService) { }

	@Roles('admin')
	@UseGuards(AuthGuard('jwt'), RolesGuard)
	@Post()
	create(@Body() body) {
		return this.categoriesService.create(body);
	}

	@Get()
	findAll() {
		return this.categoriesService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.categoriesService.findOne(id);
	}

	@Roles('admin')
	@UseGuards(AuthGuard('jwt'), RolesGuard)
	@Patch(':id')
	update(@Param('id') id: string, @Body() body) {
		return this.categoriesService.update(id, body);
	}

	@Roles('admin')
	@UseGuards(AuthGuard('jwt'), RolesGuard)
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.categoriesService.remove(id);
	}
}
