import { User } from '@mm-mono/api/models/user.model';
import { Module, } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypegooseModule } from 'nestjs-typegoose';
import { SsoController } from './sso.controller';
import { SsoService } from './sso.service';

@Module({
	imports: [
		PassportModule,
		JwtModule.register({
			secret: 'seeeecret',
			signOptions: {expiresIn: '7 days'},
		}),
		TypegooseModule.forFeature([User]),
	],
	controllers: [
		SsoController
	],
	providers: [
		SsoService,
	],
})
export class SSOModule {}
