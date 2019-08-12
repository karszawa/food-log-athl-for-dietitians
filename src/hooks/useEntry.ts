import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback } from "react";
import { Message, isMessage } from "../lib/firestore.d";
import { Record, isRecord } from "../lib/foolog-api-client.d";
import { fetchLatestRecords } from "../store/athlete/actions";
import { RootState } from "../store";

const getDateTime = (obj: Message | Record) => {
  if (isMessage(obj)) {
    return dayjs(obj.ts);
  }

  if (isRecord(obj)) {
    return dayjs(obj.datetime);
  }

  return null;
};

export type Entry = Message | Record;

export const useEntries = (sid: string, athleteId: string) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchLatestRecords({ athleteId, count: 14 /* 2w */ }));
  }, [sid, dispatch, athleteId]);

  const fetchMore = useCallback(() => {
    dispatch(fetchLatestRecords({ athleteId, count: 14 /* 2w */ }));
  }, [dispatch, athleteId]);
  const records = Object.values(
    useSelector((state: RootState) => state.athlete.records[athleteId] || [])
  );
  const messages = Object.values(
    useSelector((state: RootState) => state.athlete.messages[athleteId] || [])
  ).filter(m => !m.type);

  // MEMO: 日毎の食事記録をソートされた配列としてまとめる
  const entries = Object.entries<Entry[]>(
    ([] as Entry[])
      .concat(messages)
      .concat(records)
      .reduce((groups, entry) => {
        const currTsFmt = getDateTime(entry).format("YYYY/MM/DD");

        if (!groups[currTsFmt]) {
          groups[currTsFmt] = [];
        }

        groups[currTsFmt] = groups[currTsFmt].concat(entry);

        return groups;
      }, {})
  )
    .sort((a, b) => dayjs(a[0]).diff(dayjs(b[0])))
    .map<[string, Entry[]]>(([date, entries]) => [
      date,
      entries.sort((a, b) => getDateTime(a).diff(getDateTime(b))),
    ]);

  const { processing } = useSelector((state: RootState) => state.athlete);

  return {
    fetchMore,
    entries,
    refreshing: processing,
  };
};
