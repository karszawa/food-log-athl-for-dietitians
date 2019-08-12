import { useRef, useState, useCallback } from "react";
import dayjs from "dayjs";

// TODO: refactor to use type argument
interface Scrollable {
  scrollToEnd: (params?: { animated?: boolean }) => void;
}

export const useScrollToEnd = <T extends Scrollable>({
  animated,
}: {
  animated?: boolean;
}) => {
  const listRef = useRef<T>();
  const [mountedAt] = useState(dayjs());
  const scrollToEnd = useCallback(() => {
    if (listRef.current && dayjs().diff(mountedAt, "second") < 2) {
      listRef.current.scrollToEnd({ animated });
    }
  }, [listRef]);

  return {
    scrollToEnd,
    ref: listRef,
  };
};
