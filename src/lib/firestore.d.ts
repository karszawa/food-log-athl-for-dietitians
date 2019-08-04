export interface Message {
  id: string;
  type?: string;
  text: string;
  from: string;
  ts: string; // 'Sat Jul 27 2019 01:21:26 GMT+0900 (GMT+09:00)'
  read?: {
    [userId: string]: boolean;
  };
}

export const isMessage = (obj: any): obj is Message => {
  return obj.id && obj.text && obj.from && obj.ts;
};
