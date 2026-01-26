import {
	Controller,
	Post,
	Delete,
	Param,
	Body,
	UseGuards,
	Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReactionsService } from './reactions.service';

@Controller('reactions')
export class ReactionsController {
	constructor(private readonly reactionsService: ReactionsService) { }

	@UseGuards(AuthGuard('jwt'))
	@Post('item/:id/like')
	async toggleLike(@Req() req, @Param('id') id: string) {
		return this.reactionsService.toggleLike(id, req.user.userId);
	}

	@UseGuards(AuthGuard('jwt'))
	@Post('item/:id/comment')
	async addComment(
		@Req() req,
		@Param('id') id: string,
		@Body('text') text: string,
	) {
		return this.reactionsService.addComment(id, req.user.userId, text);
	}

	@UseGuards(AuthGuard('jwt'))
	@Delete('item/:id/comment/:commentId')
	async deleteComment(
		@Req() req,
		@Param('id') id: string,
		@Param('commentId') commentId: string,
	) {
		return this.reactionsService.deleteComment(id, commentId, req.user.userId);
	}
}
