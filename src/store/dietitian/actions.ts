import { createAction } from "redux-starter-kit";
import { GetDietitiansData } from "../../lib/foolog-api-client.d";

export const FETCH_DIETITIAN = "FETCH_DIETITIAN";

export interface FetchDietitianPayload {}

export const fetchDietitian = createAction<FetchDietitianPayload>(
  FETCH_DIETITIAN
);

export const FETCH_DIETITIAN_SUCCESS = "FETCH_DIETITIAN_SUCCESS";

export type FetchDietitianSuccessPayload = GetDietitiansData;

export const fetchDietitianSuccess = createAction<FetchDietitianSuccessPayload>(
  FETCH_DIETITIAN_SUCCESS
);
