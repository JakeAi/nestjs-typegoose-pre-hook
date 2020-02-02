import { DocumentType, modelOptions, pre, prop } from '@typegoose/typegoose';
import { compare, genSalt, hash } from 'bcryptjs';
import { IUser } from '../objects/IUser';


@pre<User>('save', async function(this: DocumentType<User>, next) {
	try {
		if (this.isModified('password') || this.isNew) {
			const salt = await genSalt(10);
			const hashedPassword = await hash(this.password, salt);
			this.password = hashedPassword;
			console.log(this.password, hashedPassword);
		}
		return next();
	} catch (error) {
		return next();
	}
})

export class User implements IUser {
	@prop({required: true, unique: true}) public email: string;
	@prop({required: true}) public password: string;

	public comparePassword(password: string): Promise<Boolean | Error> {
		return new Promise((resolve, reject) => {
			compare(password, this.password)
				.then(match => resolve(match))
				.catch(error => reject(error));
		});
	}

}

