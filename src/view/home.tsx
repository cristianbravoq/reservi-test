import { BookingsList } from "@/components/bookings/booking-list";
import { TagsFilters } from "@/components/filter/tags-filters";
import { UserFilter } from "@/components/filter/users-filter";

const Home: React.FC = () => {
  return (
    <div className="space-y-4 w-full px-2 overflow-auto">
      <div className="hidden max-sm:block">
        <TagsFilters />
      </div>

      <div className="flex flex-wrap justify-between items-center bg-white rounded-sm p-1 my-1">
        <span className="px-2 text-sm">Buscar por usuario</span>
        <UserFilter />
      </div>
      <BookingsList />
    </div>
  );
};

export default Home;