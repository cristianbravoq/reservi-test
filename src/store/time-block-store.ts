import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ITimeBlock } from "../types/time-blocks";
import { toast } from "@/hooks/use-toast";

interface TimeBlockState {
  timeBlocks: ITimeBlock[];
  addTimeBlock: (timeBlock: ITimeBlock) => void;
  editTimeBlock: (updatedTimeBlock: ITimeBlock) => void;
  deleteTimeBlock: (timeBlockId: string) => void;
  deleteAllTimeBlocksByUser: (userId: string) => void;
  getTimeBlocks: () => ITimeBlock[];
}

const useTimeBlockStore = create<TimeBlockState>()(
  persist(
    (set, get) => ({
      timeBlocks: [],
      addTimeBlock: (timeBlock: ITimeBlock) => {
        const timeBlocks = get().timeBlocks;
        if (
          timeBlocks.some(
            (tb) =>
              tb.userId === timeBlock.userId &&
              ((timeBlock.startTime >= tb.startTime &&
                timeBlock.startTime < tb.endTime) ||
                (timeBlock.endTime > tb.startTime &&
                  timeBlock.endTime <= tb.endTime))
          )
        ) {
          toast({
            title: "Error",
            description: "El bloque de tiempo se superpone con otro",
          });
          throw new Error("El bloque de tiempo se superpone con otro");
        }
        set((state) => ({
          timeBlocks: [...state.timeBlocks, timeBlock],
        }));
      },
      editTimeBlock: (updatedTimeBlock: ITimeBlock) => {
        set((state) => ({
          timeBlocks: state.timeBlocks.map((tb) =>
            tb.id === updatedTimeBlock.id ? updatedTimeBlock : tb
          ),
        }));
      },
      deleteTimeBlock: (timeBlockId: string) => {
        set((state) => ({
          timeBlocks: state.timeBlocks.filter((tb) => tb.id !== timeBlockId),
        }));
      },
      deleteAllTimeBlocksByUser: (userId: string) => {
        set((state) => ({
          timeBlocks: state.timeBlocks.filter((tb) => tb.userId !== userId),
        }));
      },
      getTimeBlocks: () => get().timeBlocks,
    }),
    {
      name: "time-blocks-storage", // Nombre de la clave en localStorage
    }
  )
);

export default useTimeBlockStore;
