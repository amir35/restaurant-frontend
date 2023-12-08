export class Users {
    id: number;
    userId: number;
    ownerName: string;
    username: string;
    mobile: string;
    location: string;
    email: string;
    password: string;
    authdata?: string;

}

export class Token {
    token: string;
}

export class SignUpCredentials {
    username: string;
    password: string;
}

export class OwnerResponse {
    message: string;
    owner: any[]; // Replace 'any[]' with the actual type of the 'owner' property
  }