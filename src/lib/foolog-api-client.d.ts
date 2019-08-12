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
  memos?: Memo[];
  photos?: Photo[];
  food_items?: FoodItem[];
}

export const isRecord = (obj: any): obj is Record => {
  return obj.updated_at && obj.id && obj.date;
};

export interface Memo {
  id: Id24;
  photo_id: Id24;
  comment: string;
}

export interface Photo {
  id: Id24;
  transition_dst_id: Id24;
  updated_at: Timestamptz;
  file?: {
    url: string;
    expiry: Timestamptz;
  };
}

export interface FoodItem {
  id: Id24;
  food_id: Id24;
  name: string;
  maker_name: string;
  maker_code: string;
  category_name: string;
  source_name: string;
  souce_id: string;
  user_customized: boolean;
  qty: Numeric;
  base_qty: Numeric;
  unit_id: Id24;
  unit: string;
  in_grams: Numeric;
  photo_id: Id24;
  location: {
    x: Numeric;
    y: Numeric;
    w: Numeric;
    h: Numeric;
  };
  data: any;
}

export interface ResponseData {
  error: {
    error_code: string;
  };
}

export interface PostSessionResponse extends ResponseData {
  token: string;
  token_secret: string;
  expiry_time: Datetimepz;
  refresh_token: string;
  refresh_token_secret: string;
  refresh_token_expiry_time: Datetimepz;
}

export interface GetDietitiansResponse extends ResponseData {
  id: Id24;
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

export interface GetRecordsDailyResponse extends ResponseData {
  result: "OK";
  updated_at: Timestamptz;
  count: number;
  records: {
    type:
      | "food"
      | "day"
      | "aux"
      | "body"
      | "exercise"
      | "step"
      | "blood_pressure"
      | "blood_glucose"
      | "sleep"
      | "evacuation";
    domain: string;
    records: Record[];
  }[];
}

export interface GetRecordsPhotosIdSignResponse extends ResponseData {
  result: "OK";
  url: string;
  expiry: Timestamptz;
}

export interface NutritionTarget {
  id: Id24;
  lower_bound: Numeric;
  upper_bound: Numeric;
  closed_lower_bound: boolean;
  closed_upper_bound: boolean;
}

export interface GetUserNutritionAmountResponse extends ResponseData {
  result: string;
  updated_at: Timestamptz;
  count: number;
  latest_date: DateString;
  records: {
    id: Id24;
    date: DateString;
    updated_at: Timestamptz;
    nutrition_target: NutritionTarget[];
  }[];
}

export interface GetRecordsBodyResponse extends ResponseData {
  result: "OK";
  updated_at?: Timestamptz;
  count: number;
  records: {
    id: Id24;
    datetime: Timestamptz;
    date: DateString;
    height_cm: Numeric;
    weight_kg: Numeric;
    data: any;
    deleted: boolean;
    updated_at: Timestamptz;
  }[];
}
