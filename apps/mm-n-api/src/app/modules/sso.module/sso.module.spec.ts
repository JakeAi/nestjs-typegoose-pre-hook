import { IUser } from '@mm-mono/api/objects/IUser';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { DefaultTestingModule } from '../../../tests/test-modules';
import { SSOModule } from './index';
import { SsoService } from './sso.service';

describe('SSO Module', () => {
	let ssoModule: TestingModule;
	let httpApp: INestApplication;
	let service: SsoService;
	let user: IUser;

	beforeAll(async () => {
		ssoModule = await Test.createTestingModule({
			imports: [
				DefaultTestingModule,
				SSOModule,

			],
			providers: []
		}).compile();


		httpApp = ssoModule.createNestApplication();
		httpApp.setGlobalPrefix('v1');
		httpApp.enableCors();
		await httpApp.init();
		service = ssoModule.get<SsoService>(SsoService);
	});




	describe('SSO Controller', () => {
		describe('Login.Fail', () => {
			it('should fail with 401 Unauthorized', (done) => {
				return request(httpApp.getHttpServer())
					.post('/v1/sso/login')
					.send({email: 'jakeihasz@minnich-mfg.com', password: 'jake'})
					.set('Accept', 'application/json')
					.expect('Content-Type', /json/)
					.expect(401)
					.end((err, res) => {
						console.log(res.body);
						if (err) { return done(err); }
						return done();
					});
			});
		});

		describe('Login.Success', () => {
			it('should respond with jwtAccessToken', () => {
				return request(httpApp.getHttpServer())
					.post('/v1/sso/login')
					.send({email: 'jakeihasz@minnich-mfg.com', password: 'jake.ihasz'})
					.set('Accept', 'application/json')
					.expect('Content-Type', /json/)
					.expect((res) => 'jwtAccessToken' in res.body)
					.expect(200);
			});
		});
	});

});
