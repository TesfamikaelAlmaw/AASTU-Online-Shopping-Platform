import {
	Controller,
	Get,
	Post,
	Patch,
	Delete,
	Body,
	Param,
	UseGuards,
	Req,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('reports')
export class ReportsController {
	constructor(private readonly reportsService: ReportsService) { }

	@UseGuards(AuthGuard('jwt'))
	@Post()
	create(@Req() req, @Body() body) {
		return this.reportsService.create(req.user.userId, body);
	}

	@Roles('admin')
	@UseGuards(AuthGuard('jwt'), RolesGuard)
	@Get()
	findAll() {
		return this.reportsService.findAll();
	}

	@Roles('admin')
	@UseGuards(AuthGuard('jwt'), RolesGuard)
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.reportsService.findOne(id);
	}

	@Roles('admin')
	@UseGuards(AuthGuard('jwt'), RolesGuard)
	@Patch(':id')
	update(@Param('id') id: string, @Body() body) {
		return this.reportsService.update(id, body);
	}

	@Roles('admin')
	@UseGuards(AuthGuard('jwt'), RolesGuard)
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.reportsService.remove(id);
	}
}
