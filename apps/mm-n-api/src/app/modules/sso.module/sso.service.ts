import { User, } from '@mm-mono/api/models/user.model';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
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


		const newUser = new this.userModel(data);
		await newUser.validate();
		await newUser.save();
		return true;
	}

}
