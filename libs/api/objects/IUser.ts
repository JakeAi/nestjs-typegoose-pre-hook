interface IModel {
	_id?: any;
	createdAt?: any
	updatedAt?: any
}

export interface IUser extends IModel {
	email: string;
	password: string;
	firstName: string;
	middleName: string;
	lastName: string;
	phone1: string;
	phone2: string;
	mobile: string;
	website: string;
	dateOfBirth: string;
	card_code: string;
	active: boolean;
	admin: string;
	lastOnline: string;
	company: string;

	claims: string[];
	agreements: string[];
}
