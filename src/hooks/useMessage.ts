import { useDispatch } from "react-redux";
import { useCallback, useEffect } from "react";
import {
  publishMessage,
  subscribeAthleteMessage,
} from "../store/athlete/actions";

export const useMessage = (sid: string, athleteId: string) => {
  const dispatch = useDispatch();
  const sendMessage = useCallback(
    (text: string) => {
      dispatch(publishMessage({ athleteId, text }));
    },
    [sid]
  );
  useEffect(() => {
    dispatch(subscribeAthleteMessage({ athleteId }));
  }, [sid]);

  return {
    sendMessage,
  };
};
