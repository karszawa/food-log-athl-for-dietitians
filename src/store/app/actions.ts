import { createAction } from "redux-starter-kit";

export const SHOW_PROGRESS = "SHOW_PROGRESS";

export interface ShowProgressPayload {
  message?: string;
}

export const showProgress = createAction<ShowProgressPayload>(SHOW_PROGRESS);

export const HIDE_PROGRESS = "HIDE_PROGRESS";

export interface HideProgressPayload {}

export const hideProgress = createAction<HideProgressPayload>(HIDE_PROGRESS);
