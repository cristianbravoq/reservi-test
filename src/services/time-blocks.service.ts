import useTimeBlockStore from "@/store/time-block-store";
import { ITimeBlock } from "../types/time-blocks";

const addTimeBlockService = (timeBlock: ITimeBlock) => {
  const addTimeBlock = useTimeBlockStore.getState().addTimeBlock;
  addTimeBlock(timeBlock);
};

const editTimeBlockService = (updatedTimeBlock: ITimeBlock) => {
  const editTimeBlock = useTimeBlockStore.getState().editTimeBlock;
  editTimeBlock(updatedTimeBlock);
};

const deleteTimeBlockService = (timeBlockId: string) => {
  const deleteTimeBlock = useTimeBlockStore.getState().deleteTimeBlock;
  deleteTimeBlock(timeBlockId);
};

const getTimeBlocksService = () => {
  const getTimeBlocks = useTimeBlockStore.getState().getTimeBlocks;
  return getTimeBlocks();
};

export { addTimeBlockService, editTimeBlockService, deleteTimeBlockService, getTimeBlocksService };