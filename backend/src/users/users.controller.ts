import { Controller, Get, Param, Patch, Delete, Body, UseGuards, Req, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from '../users/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @Roles('admin') // Only admin can access
  getAllUsers() {
    return this.usersService.findAll();
  }

  @Patch('profile')
  @Roles('admin', 'student')
  updateMyProfile(@Req() req, @Body() updateData: any) {
    return this.usersService.updateProfile(req.user.userId, updateData);
  }

  @Post('profile-image')
  @Roles('admin', 'student')
  @UseInterceptors(FileInterceptor('file'))
  updateMyProfileImage(@Req() req, @UploadedFile() file: Express.Multer.File) {
    return this.usersService.uploadProfileImage(req.user.userId, file);
  }

  @Patch('change-password')
  @Roles('admin', 'student')
  changeMyPassword(@Req() req, @Body() changePasswordDto: any) {
    return this.usersService.changePassword(req.user.userId, changePasswordDto);
  }

  @Get(':id')
  @Roles('admin', 'student')
  getUser(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id/status')
  @Roles('admin')
  updateUserStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateStatusDto) {
    return this.usersService.updateStatus(id, updateStatusDto);
  }

  @Delete(':id')
  @Roles('admin')
  deleteUser(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
