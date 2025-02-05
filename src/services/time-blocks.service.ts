import { ITimeBlock } from "../types/time-blocks";

const saveTimeBlocks = (timeBlocks: ITimeBlock[]) => {
  localStorage.setItem("timeBlocks", JSON.stringify(timeBlocks));
};

const getTimeBlocks = () => {
  const timeBlocks = localStorage.getItem("timeBlocks");
  return timeBlocks ? JSON.parse(timeBlocks) : [];
};

const addTimeBlock = (timeBlock: ITimeBlock) => {
  const timeBlocks = getTimeBlocks();
  if (
    timeBlocks.some(
      (tb: ITimeBlock) =>
        tb.userId === timeBlock.userId &&
        ((timeBlock.startTime >= tb.startTime &&
          timeBlock.startTime < tb.endTime) ||
          (timeBlock.endTime > tb.startTime && timeBlock.endTime <= tb.endTime))
          
    )
  ) {
    alert("Time block overlaps with an existing one");
    return;
  }
  const newTimeBlocks = [...timeBlocks, timeBlock];
  saveTimeBlocks(newTimeBlocks);
};

const editTimeBlock = (updatedTimeBlock: ITimeBlock) => {
  const timeBlocks = getTimeBlocks();
  const newTimeBlocks = timeBlocks.map((tb: ITimeBlock) =>
    tb.id === updatedTimeBlock.id ? updatedTimeBlock : tb
  );
  saveTimeBlocks(newTimeBlocks);
};

const deleteTimeBlock = (timeBlockId: string) => {
  const timeBlocks = getTimeBlocks();
  const newTimeBlocks = timeBlocks.filter(
    (tb: ITimeBlock) => tb.id !== timeBlockId
  );
  saveTimeBlocks(newTimeBlocks);
};

export { addTimeBlock, editTimeBlock, deleteTimeBlock, getTimeBlocks };
