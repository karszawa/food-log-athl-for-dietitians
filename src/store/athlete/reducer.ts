import dayjs from "dayjs";
import { createReducer, PayloadAction } from "redux-starter-kit";
import { Message } from "../../lib/firestore-types";
import { NutritionTarget, Record } from "../../lib/foolog-api-client-types";
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
  FETCH_BODY_RECORDS_SUCCEEDED,
  FetchBodyRecordsSucceededPayload,
  FETCH_ATHLETE_RECORD_SUCCEEDED,
  FetchAthleteRecordSucceededPayload,
  RESET_ATHLETE,
} from "./actions";
import { FetchDietitianSuccessPayload } from "../dietitian/actions";

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
    [athleteId: string]: {
      from: string;
      to: string;
    };
  };
  nutritionTargets: {
    [athlteId: string]: {
      [id: string]: NutritionTarget;
    };
  };
  bodyRecords: {
    [athleteId: string]: {
      height: {
        [recordId: string]: { value: number; datetime: string };
      };
      weight: {
        [recordId: string]: { value: number; datetime: string };
      };
    };
  };
  processing: boolean;
}

const initialState: State = {
  messages: {},
  records: {},
  range: {},
  nutritionTargets: {},
  bodyRecords: {},
  processing: true,
};

export default createReducer(initialState, {
  [RESET_ATHLETE]: (state: State) => {
    Object.entries(initialState).forEach(([key, val]) => {
      state[key] = val;
    });
  },
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
  [FETCH_ATHLETE_RECORD_SUCCEEDED]: (
    state: State,
    action: PayloadAction<FetchAthleteRecordSucceededPayload>
  ) => {
    const { athleteId, record } = action.payload;

    if (!state.records[athleteId]) {
      state.records[athleteId] = {};
    }

    state.records[athleteId][record.id] = record;
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
    const { athleteId, from, to } = action.payload;

    state.range[athleteId] = {
      from,
      to,
    };
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

    if (!state.nutritionTargets[athleteId]) {
      state.nutritionTargets[athleteId] = {};
    }

    records
      .sort((a, b) => dayjs(a.date).diff(b.date))
      .forEach(record => {
        record.nutrition_target.forEach(nutritionTarget => {
          state.nutritionTargets[athleteId][
            nutritionTarget.id
          ] = nutritionTarget;
        });
      });
  },
  [FETCH_BODY_RECORDS_SUCCEEDED]: (
    state: State,
    action: PayloadAction<FetchBodyRecordsSucceededPayload>
  ) => {
    const { athleteId, records } = action.payload;

    if (!state.bodyRecords[athleteId]) {
      state.bodyRecords[athleteId] = {
        height: {},
        weight: {},
      };
    }

    records.forEach(record => {
      const { id, datetime, weight_kg, height_cm } = record;

      if (height_cm) {
        state.bodyRecords[athleteId].height[id] = {
          value: Number(height_cm),
          datetime,
        };
      }

      if (weight_kg) {
        state.bodyRecords[athleteId].weight[id] = {
          value: Number(weight_kg),
          datetime,
        };
      }
    });
  },
});
