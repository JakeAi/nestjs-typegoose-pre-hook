import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { SSOModule } from './modules/sso.module';

@Module({
	imports: [
		TypegooseModule.forRoot("put uri here",
			{
				keepAlive: true,
				useNewUrlParser: true,
				useFindAndModify: false,
				autoReconnect: true,
				reconnectInterval: 2000,
				reconnectTries: Number.MAX_VALUE,
				connectTimeoutMS: 30000,
				useCreateIndex: true,
				// @ts-ignore
				useUnifiedTopology: true,
			}),
		SSOModule,
	],
	exports: [],
	controllers: [],
	providers: []
})
export class AppModule {}
