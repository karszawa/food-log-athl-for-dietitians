import { createAction } from "redux-starter-kit";
import { Message } from "../../lib/firestore.d";

export const SUBSCRIBE_ATHLETE_MESSAGE = "SUBSCRIBE_ATHLETE_MESSAGE";

export interface SubscribeAthleteMessagePayload {
  athleteId: string;
}

export const subscribeAthleteMessagePayload = createAction<
  SubscribeAthleteMessagePayload
>(SUBSCRIBE_ATHLETE_MESSAGE);

export const ADD_ATHLETE_MESSAGE = "ADD_ATHLETE_MESSAGE";

export interface AddAthleteMessagePayload {
  id: string;
  message: Message;
}

export const addAthleteMessage = createAction<AddAthleteMessagePayload>(
  ADD_ATHLETE_MESSAGE
);

export const DELETE_ATHLETE_MESSAGE = "DELETE_ATHLETE_MESSAGE";

export interface DeleteAthleteMessagePayload {
  id: string;
}

export const deleteAthleteMessage = createAction<DeleteAthleteMessagePayload>(
  DELETE_ATHLETE_MESSAGE
);
