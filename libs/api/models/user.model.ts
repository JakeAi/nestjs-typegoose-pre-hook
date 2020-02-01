import { DocumentType, modelOptions, pre, prop } from '@typegoose/typegoose';
import { compare, genSalt, hash } from 'bcryptjs';
import { IUser } from '../objects/IUser';


@pre<User>('save', async function(this: DocumentType<User>, next) {
	try {
		if (this.isModified('password') || this.isNew) {
			const salt = await genSalt(10);
			const hashedPassword = await hash(this.password, salt);
			this.password = hashedPassword;
		}
		return next();
	} catch (error) {
		return next();
	}
})

export class User implements IUser {
	@prop({required: true, unique: true}) public email: string;
	@prop({required: true}) public password: string;
	@prop({required: true}) public firstName: string;
	@prop() public middleName: string;
	@prop({required: true}) public lastName: string;
	@prop() public phone1: string;
	@prop() public phone2: string;
	@prop() public mobile: string;
	@prop() public website: string;
	@prop() public dateOfBirth: string;
	@prop() public card_code: string;
	@prop() public active: boolean;
	@prop() public admin: string;
	@prop() public lastOnline: string;
	@prop({default: null}) public company: string;

	@prop({default: []}) public claims: string[];
	@prop({default: []}) public agreements: string[];

	public addClaim(claim: string) {
		if (!this.claims.includes(claim)) {
			this.claims.push(claim);
		}
	}

	public addAgreement(agreement: string) {
		if (!this.agreements.includes(agreement)) {
			this.agreements.push(agreement);
		}
	}

	public comparePassword(password: string): Promise<Boolean | Error> {
		return new Promise((resolve, reject) => {
			compare(password, this.password)
				.then(match => resolve(match))
				.catch(error => reject(error));
		});
	}

}

// export const UserModel = getModelForClass(User);
