import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchDietitian } from "../store/dietitian/actions";
import { RootState } from "../store";

export const useDietitian = (sid: string) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDietitian());
  }, [sid]);

  return useSelector((state: RootState) => state.dietitian);
};
