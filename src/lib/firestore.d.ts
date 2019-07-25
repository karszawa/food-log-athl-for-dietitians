export interface Message {
  type?: string;
  text: string;
  from: string;
  ts: firebase.firestore.Timestamp;
}
