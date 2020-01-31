import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  register(
    @Body(ValidationPipe) authRegisterDto: AuthRegisterDto
  ): Promise<void> {
    return this.authService.register(authRegisterDto);
  }

  @Post('/login')
  login(@Body() authLoginDto: AuthLoginDto): Promise<{ accessToken: string }> {
    return this.authService.login(authLoginDto);
  }

  // @Post('/test')
  // @UseGuards(AuthGuard())
  // test(@GetUser() user: User) {
  //   console.log(user);
  // }
}
