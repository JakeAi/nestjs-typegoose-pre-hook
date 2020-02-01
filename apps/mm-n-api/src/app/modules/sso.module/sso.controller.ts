import { IUser } from '@mm-mono/api/objects/IUser';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { SsoService } from './sso.service';

@Controller('sso')
export class SsoController {
	constructor(
		private readonly ssoService: SsoService,
	) { }


	@Post('register')
	async register(@Body() registrationDto): Promise<boolean> {
		return await this.ssoService.register(registrationDto);
	}

	@Post('login')
	@HttpCode(200)
	async login(@Body() loginDto): Promise<IUser> {
		return await this.ssoService.login(loginDto);

	}

}

