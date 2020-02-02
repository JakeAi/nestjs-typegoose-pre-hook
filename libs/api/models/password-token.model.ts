import { index,  prop, Ref } from '@typegoose/typegoose';
import { IPasswordToken } from '../objects/IPasswordToken';
import { User } from './user.model';


@index({createdAt: 1}, {expireAfterSeconds: 60 * 60 * 2})
export class PasswordToken implements IPasswordToken {
	@prop({ref: User}) public user: Ref<User>;
}

