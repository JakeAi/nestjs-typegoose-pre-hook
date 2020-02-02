interface IModel {
	_id?: any;
	createdAt?: any
	updatedAt?: any
}

export interface IUser extends IModel {
	email: string;
	password: string;
}
