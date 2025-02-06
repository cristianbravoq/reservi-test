export interface ITimeBlock {
  id: string;
  date: Date | undefined;
  startTime: Date;
  endTime: Date;
  userId: string;
}
