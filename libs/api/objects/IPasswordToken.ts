import { IModel } from './IModel';
import { IUser } from './IUser';

export interface IPasswordToken extends IModel {
	user: IUser | any
}
