import { Body, Controller, Post } from '@nestjs/common';
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

}

