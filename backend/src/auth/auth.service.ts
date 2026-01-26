import { Injectable, BadRequestException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User, UserDocument } from '../users/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CreateAdminDto } from './dto/create-admin.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) { }

  async register(dto: RegisterDto) {

    // Todo: i will remove this in production level

    // if (!dto.email.endsWith('@aastu.edu.et')) {
    //   throw new BadRequestException('Only AASTU university emails allowed');
    // }

    const existingUser = await this.userModel.findOne({ email: dto.email });
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.userModel.create({
      ...dto,
      password: hashedPassword,
    });

    return { message: 'Registration successful', user };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Prevent admins from logging in through regular login
    if (user.role === 'admin') {
      throw new ForbiddenException('Admin users must login through the admin portal');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status === 'suspended') {
      throw new UnauthorizedException('Your account has been suspended. Please contact the administrator.');
    }

    const payload = { sub: user._id, role: user.role };
    const { password, ...userWithoutPassword } = user.toObject();

    return {
      access_token: this.jwtService.sign(payload),
      user: userWithoutPassword,
    };
  }

  async adminLogin(dto: LoginDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) {
      throw new UnauthorizedException('Invalid admin credentials');
    }

    // Only allow admin role users
    if (user.role !== 'admin') {
      throw new ForbiddenException('Access denied. Admin credentials required.');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid admin credentials');
    }

    if (user.status === 'suspended') {
      throw new UnauthorizedException('Your admin account has been suspended.');
    }

    const payload = { sub: user._id, role: user.role };
    const { password, ...userWithoutPassword } = user.toObject();

    return {
      access_token: this.jwtService.sign(payload),
      user: userWithoutPassword,
    };
  }

  async createAdmin(createAdminDto: CreateAdminDto) {
    const existingUser = await this.userModel.findOne({ email: createAdminDto.email });
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);

    const admin = await this.userModel.create({
      full_name: createAdminDto.full_name,
      email: createAdminDto.email,
      password: hashedPassword,
      department: createAdminDto.department || 'Administration',
      role: createAdminDto.role,
      status: 'active',
    });

    const { password, ...adminWithoutPassword } = admin.toObject();
    return {
      message: 'Admin created successfully',
      user: adminWithoutPassword
    };
  }
}
