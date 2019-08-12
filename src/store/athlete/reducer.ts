import dayjs from "dayjs";
import { createReducer, PayloadAction } from "redux-starter-kit";
import { Message } from "../../lib/firestore.d";
import { NutritionTarget, Record } from "../../lib/foolog-api-client.d";
import {
  AddAthleteMessagePayload,
  AddAthleteRecordsPayload,
  ADD_ATHLETE_MESSAGE,
  ADD_ATHLETE_RECORDS,
  DeleteAthleteMessagePayload,
  DELETE_ATHLETE_MESSAGE,
  FetchNutritionAmountSucceededPayload,
  FETCH_LATEST_RECORDS,
  FETCH_LATEST_RECORDS_SUCCEEDED,
  FETCH_NUTRITION_AMOUNT_SUCCEEDED,
  UpdateRangePayload,
  UPDATE_RANGE,
} from "./actions";

export interface State {
  messages: {
    [athleteId: string]: {
      [messageId: string]: Message;
    };
  };
  records: {
    [athleteId: string]: {
      [recordId: string]: Record;
    };
  };
  range: {
    from: string;
    to: string;
  };
  nutritionTargets: {
    [athlteId: string]: {
      [id: string]: NutritionTarget;
    };
  };
  processing: boolean;
}

const initialState: State = {
  messages: {},
  records: {},
  range: {
    from: dayjs().toISOString(),
    to: dayjs().toISOString(),
  },
  nutritionTargets: {},
  processing: true,
};

export default createReducer(initialState, {
  [ADD_ATHLETE_MESSAGE]: (
    state: State,
    action: PayloadAction<AddAthleteMessagePayload>
  ) => {
    const { id, message, athleteId } = action.payload;

    if (!state.messages[athleteId]) {
      state.messages[athleteId] = {};
    }

    state.messages[athleteId][id] = message;
  },
  [DELETE_ATHLETE_MESSAGE]: (
    state: State,
    action: PayloadAction<DeleteAthleteMessagePayload>
  ) => {
    const { id, athleteId } = action.payload;

    if (state.messages[athleteId]) {
      delete state.messages[athleteId][id];
    }
  },
  [ADD_ATHLETE_RECORDS]: (
    state: State,
    action: PayloadAction<AddAthleteRecordsPayload>
  ) => {
    const { records, athleteId } = action.payload;

    if (!state.records[athleteId]) {
      state.records[athleteId] = {};
    }

    records.forEach(record => {
      state.records[athleteId][record.id] = record;
    });
  },
  [UPDATE_RANGE]: (state: State, action: PayloadAction<UpdateRangePayload>) => {
    state.range = action.payload;
  },
  [FETCH_LATEST_RECORDS]: (state: State) => {
    state.processing = true;
  },
  [FETCH_LATEST_RECORDS_SUCCEEDED]: (state: State) => {
    state.processing = false;
  },
  [FETCH_NUTRITION_AMOUNT_SUCCEEDED]: (
    state: State,
    action: PayloadAction<FetchNutritionAmountSucceededPayload>
  ) => {
    const { records, athleteId } = action.payload;

    records
      .sort((a, b) => dayjs(a.date).diff(b.date))
      .forEach(record => {
        record.nutrition_target.forEach(nutritionTarget => {
          if (!state.nutritionTargets[athleteId]) {
            state.nutritionTargets[athleteId] = {};
          }

          state.nutritionTargets[athleteId][
            nutritionTarget.id
          ] = nutritionTarget;
        });
      });
  },
});
