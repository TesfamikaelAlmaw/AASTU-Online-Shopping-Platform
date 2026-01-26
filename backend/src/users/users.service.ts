import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateStatusDto } from './dto/update-status.dto';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private cloudinaryService: CloudinaryService,
  ) { }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateStatus(id: string, updateStatusDto: UpdateStatusDto): Promise<User> {
    const { status } = updateStatusDto;
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    ).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('User not found');
  }

  async updateProfile(id: string, data: Partial<User>): Promise<User> {
    // Only allow updating specific fields for safety
    const allowedUpdates: any = {
      full_name: data.full_name,
      department: data.department
    };

    if (data.profile_image) {
      allowedUpdates.profile_image = data.profile_image;
    }

    const user = await this.userModel.findByIdAndUpdate(
      id,
      { $set: allowedUpdates },
      { new: true }
    ).exec();

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async uploadProfileImage(userId: string, file: Express.Multer.File): Promise<User> {
    const result = await this.cloudinaryService.uploadFile(file);
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { profile_image: result.secure_url },
      { new: true },
    ).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async changePassword(userId: string, changePasswordDto: any): Promise<void> {
    const { currentPassword, newPassword } = changePasswordDto;
    const user = await this.userModel.findById(userId).select('+password');
    if (!user) throw new NotFoundException('User not found');

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new BadRequestException('Current password incorrect');

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
  }
}
