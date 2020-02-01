import { User, } from '@mm-mono/api/models/user.model';
import { IUser } from '@mm-mono/api/objects/IUser';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';

@Injectable()
export class SsoService {
	constructor(
		@InjectModel(User) private readonly userModel: ModelType<User>,
	) {
	}

	async register(data): Promise<boolean> {

		const emailRegex = new RegExp('^' + data.email + '$', 'i');
		const findUser = await this.userModel.findOne().or([{email: {$regex: emailRegex}}]);

		if (findUser !== null) { throw new HttpException('User not found', HttpStatus.NOT_FOUND); }
		if (data.password !== data.passwordConfirm) { throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST); }


		console.log('before new');
		const newUser = new this.userModel(data);
		console.log(newUser);
		console.log('new');
		console.log('before validate');
		await newUser.validate();
		console.log('validate');
		console.log('before save');
		await newUser.save();
		console.log('save');
		return true;
	}

	async login(loginPost): Promise<IUser> {
		const userDetails = {
			email: (loginPost.email || '').toLowerCase(),
			password: loginPost.password || ''
		};

		const emailRegex = new RegExp('^' + userDetails.email + '$', 'i');
		const user: DocumentType<User> = await this.userModel.findOne().or([{email: {$regex: emailRegex}}]);

		if (user === null) { throw new UnauthorizedException(); }
		const passwordCompareResult = await user.comparePassword(userDetails.password);
		if (!passwordCompareResult) { throw new UnauthorizedException(); }

		const json: IUser = user.toJSON();
		delete json.password;
		return json;
	}

}
