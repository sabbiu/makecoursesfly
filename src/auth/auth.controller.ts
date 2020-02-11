import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { Token } from './interfaces/token.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  register(
    @Body(ValidationPipe) authRegisterDto: AuthRegisterDto
  ): Promise<Token> {
    return this.authService.register(authRegisterDto);
  }

  @Post('/login')
  login(@Body() authLoginDto: AuthLoginDto): Promise<Token> {
    return this.authService.login(authLoginDto);
  }

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {}

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  googleLoginCallback(@Req() req: { user: Token }) {
    const accessToken: string = req.user.accessToken;
    if (accessToken) {
      return `
        <html>
          <script>
            window.localStorage.setItem('accessToken', '${accessToken}');
            window.location.href = '/';
          </script>
        </html>`;
    } else {
      return 'There was a problem signing in...';
    }
  }
}
