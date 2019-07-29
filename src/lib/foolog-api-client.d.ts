type Id24 = string; // "To9ax-hXa_6Eetasheeje9a"
type Id64 = string; // "quaiwai4kuJai4ahGhee-0leex4ieTaa0Hee5eeCaesh_ithahBuufaraegai8ru"
type Numeric = string;
type DateString = string; // "2023-03-12"
type Timestamptz = string; // "2017-12-23T04:12:05Z”

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
  updated_at: DateString;
  id: string;
  login_id: string;
  nickname: string;
  locales: string;
  data: any;
  profile: Profile;
}

export interface Profile {
  updated_at: DateString;
  family_name: string;
  first_name: string;
  gender: string;
  birthday: DateString;
  start_time: string;
  nutrition_level: number;
  activity_level: number;
  data: any;
}

export interface File {
  url: string;
  expiry: string;
}

export interface Nutrient {
  id: Id24;
  name: string;
  tagname?: string;
  value: Numeric;
  unit: string;
  decimal_degit: number;
  accuracy: string;
  lower_bound?: Numeric;
  upper_bound?: Numeric;
  closed_lower_bound?: boolean;
  closed_upper_bound?: boolean;
  data: any;
  deleted: boolean;
}

export interface Record {
  updated_at: Timestamptz;
  id: string;
  datetime: Timestamptz;
  date: DateString;
  duration_sec?: number;
  meal_type?: "breakfast" | "lunch" | "supper" | "snack";
  photo_ids: Id24[];
  nutrients: Nutrient[];
}

export interface ResponseData {
  error: {
    error_code: string;
  };
}

export interface PostSessionResponseData extends ResponseData {
  token: string;
  token_secret: string;
  expiry_time: Datetimepz;
  refresh_token: string;
  refresh_token_secret: string;
  refresh_token_expiry_time: Datetimepz;
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

export interface GetRecordsFoodsResponse extends ResponseData {
  result: "OK";
  updated_at: Datetimepz;
  count: number;
  records: Record[];
}
