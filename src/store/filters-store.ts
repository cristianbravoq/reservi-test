import { FilterKeysType, TagType } from "@/components/filter/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BookingsFilterState {
  tags: TagType;
  addTag: (key: FilterKeysType, value: string) => void;
  removeTag: (key: FilterKeysType, value: string) => void;
}

const useBookingsFilterStore = create<BookingsFilterState>()(
  persist(
    (set) => ({
      tags: {},
      addTag: (key, value) => {
        set((state) => ({
          tags: {
            ...state.tags,
            [key]: Array.from(new Set([...(state.tags[key] || []), value])),
          },
        }));
      },
      removeTag: (key, value) => {
        set((state) => {
          const updateTags = state.tags[key]?.filter((v) => v !== value);

          if (!updateTags?.length) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [key]: _, ...newTags } = state.tags;
            return { tags: newTags };
          }
          return { tags: { ...state.tags, [key]: updateTags } };
        });
      },
    }),
    {
      name: "bookings-filter-storage",
    }
  )
);

export default useBookingsFilterStore;
