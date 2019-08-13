import { createAction } from "redux-starter-kit";
import { GetDietitiansResponse } from "../../lib/foolog-api-client-types";

export const FETCH_DIETITIAN = "FETCH_DIETITIAN";

export interface FetchDietitianPayload {}

export const fetchDietitian = createAction<FetchDietitianPayload>(
  FETCH_DIETITIAN
);

export const FETCH_DIETITIAN_SUCCESS = "FETCH_DIETITIAN_SUCCESS";

export type FetchDietitianSuccessPayload = GetDietitiansResponse;

export const fetchDietitianSuccess = createAction<FetchDietitianSuccessPayload>(
  FETCH_DIETITIAN_SUCCESS
);
