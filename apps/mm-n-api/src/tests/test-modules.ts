import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypegooseModule } from 'nestjs-typegoose';


@Module({
	imports: [
		TypegooseModule.forRoot("url",
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
		PassportModule,
	],
	providers: []
})
export class DefaultTestingModule {}
