export type Auth = {
  username: string;
  password: string;
  token: string;
  token_secret: string;
  expiry_time: Date;
  refresh_token: string;
  refresh_token_secret: string;
  refresh_token_expiry_time: Date;
};

export interface User {
  updated_at: string;
  id: string;
  login_id: string;
  nickname: string;
  locales: string;
  data: any;
  profile: Profile;
}

export interface Profile {
  updated_at: string;
  family_name: string;
  first_name: string;
  gender: string;
  birthday: string;
  start_time: string;
  nutrition_level: number;
  activity_level: number;
  data: any;
}

export interface File {
  url: string;
  expiry: string;
}

export interface ResponseData {
  error: {
    error_code: string;
  };
}

export interface PostSessionResponseData extends ResponseData {
  token: string;
  token_secret: string;
  expiry_time: string;
  refresh_token: string;
  refresh_token_secret: string;
  refresh_token_expiry_time: string;
}

export interface GetDietitiansData extends ResponseData {
  id: string;
  login_id: string;
  nickname: string;
  locales: string;
  data: any;
  users: User[];
  file: File;
}
