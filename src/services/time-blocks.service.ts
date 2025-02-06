import { ITimeBlock } from "../types/time-blocks";

const saveTimeBlocks = (timeBlocks: ITimeBlock[]) => {
  localStorage.setItem("timeBlocks", JSON.stringify(timeBlocks));
};

const getTimeBlocksService = () => {
  const timeBlocks = localStorage.getItem("timeBlocks");
  return timeBlocks ? JSON.parse(timeBlocks) : [];
};

const addTimeBlockService = (timeBlock: ITimeBlock) => {
  const timeBlocks = getTimeBlocksService();
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

const editTimeBlockService = (updatedTimeBlock: ITimeBlock) => {
  const timeBlocks = getTimeBlocksService();
  const newTimeBlocks = timeBlocks.map((tb: ITimeBlock) =>
    tb.id === updatedTimeBlock.id ? updatedTimeBlock : tb
  );
  saveTimeBlocks(newTimeBlocks);
};

const deleteTimeBlockService = (timeBlockId: string) => {
  const timeBlocks = getTimeBlocksService();
  const newTimeBlocks = timeBlocks.filter(
    (tb: ITimeBlock) => tb.id !== timeBlockId
  );
  saveTimeBlocks(newTimeBlocks);
};

export { addTimeBlockService , editTimeBlockService , deleteTimeBlockService, getTimeBlocksService };
