import { PasswordToken } from '@mm-mono/api/models/password-token.model';
import { User, } from '@mm-mono/api/models/user.model';
import { IUser } from '@mm-mono/api/objects/IUser';
import { HttpStatus, INestApplication, Injectable } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel, TypegooseModule } from 'nestjs-typegoose';
import * as request from 'supertest';
import { DefaultTestingModule } from '../../../tests/test-modules';
import { SsoController } from './sso.controller';
import { SsoService } from './sso.service';

@Injectable()
export class CleanupService {
	constructor(
		@InjectModel(User) private readonly userModel: ModelType<User>,
	) {
	}

	public async removeUser(user: IUser) {
		return this.userModel.deleteOne({email: user.email});
	}

}

const registerUserPayload: IUser = {
	email: 'testuser@test.com',
	password: 'Test',
	// @ts-ignore
	passwordConfirm: 'Test',
};

describe('SSO Module', () => {
	let ssoModule: TestingModule;
	let httpApp: INestApplication;
	// let service: SsoService;
	let cleanupService: CleanupService;

	beforeAll(async () => {
		ssoModule = await Test.createTestingModule({

			imports: [
				DefaultTestingModule,
				TypegooseModule.forFeature([User,PasswordToken]), // breaks test, calls twice
				// TypegooseModule.forFeature([User]), // doesnt break test
			],
			controllers: [
				SsoController
			],
			providers: [
				SsoService,
				CleanupService
			]
		}).compile();


		httpApp = ssoModule.createNestApplication();
		httpApp.setGlobalPrefix('v1');
		httpApp.enableCors();
		await httpApp.init();
		cleanupService = ssoModule.get<CleanupService>(CleanupService);
	});


	describe('SSO Controller', () => {
		describe('Registration', () => {
			describe('Register User', () => {


				it('should succeed with HTTP 201 Created', () => {
					return request(httpApp.getHttpServer())
						.post('/v1/sso/register')
						.send(registerUserPayload)
						.set('Accept', 'application/json')
						.expect(HttpStatus.CREATED);
				});

				describe('Login After Registration', () => {

					afterAll(async () => {
						await cleanupService.removeUser(registerUserPayload);
					});

					describe('Login Success', () => {
						it('should respond 200 with jwtAccessToken', (done) => {
							return request(httpApp.getHttpServer())
								.post('/v1/sso/login')
								.send({email: registerUserPayload.email, password: registerUserPayload.password})
								.expect('Content-Type', /json/)
								.expect((res) => 'jwtAccessToken' in res.body)
								.expect(200)
								.end((err, res) => {
									console.log(res.body)
									if (err) return done(err);
									return done();
								});
						});
					});
				});
			});
		});
	});
});
