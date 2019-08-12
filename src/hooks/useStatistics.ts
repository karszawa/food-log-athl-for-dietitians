import { useDispatch, useSelector } from "react-redux";
import { useState, useCallback, useEffect } from "react";
import dayjs from "dayjs";
import { get } from "lodash-es";
import { RootState } from "../store";
import { fetchBodyRecords } from "../store/athlete/actions";

export const useStatistics = (sid: string, athleteId: string) => {
  const dispatch = useDispatch();
  const [fromDate, setFromDate] = useState(dayjs().subtract(12, "month"));
  const [toDate, setToDate] = useState(dayjs());
  const fetchMore = useCallback(() => {
    setToDate(fromDate);
    setFromDate(fromDate.subtract(1, "month"));
  }, [fromDate, setFromDate, setToDate]);
  const { bodyRecords } = useSelector((state: RootState) => state.athlete);
  const height = Object.values(get(bodyRecords[athleteId], "height", {})).sort(
    (a, b) => dayjs(a.datetime).diff(b.datetime)
  );
  const weight = Object.values(get(bodyRecords[athleteId], "weight", {})).sort(
    (a, b) => dayjs(a.datetime).diff(b.datetime)
  );

  useEffect(() => {
    dispatch(
      fetchBodyRecords({
        athleteId,
        from: fromDate.format("YYYY-MM-DD"),
        to: toDate.format("YYYY-MM-DD"),
      })
    );
  }, [sid]);

  return {
    height,
    weight,
    fetchMore,
  };
};
