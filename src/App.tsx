
import { BookingsList } from "./components/bookings/time-table";
import { BookingHeader } from "./components/header/booking-header";
import { Toaster } from "./components/ui/toaster";

function App() {

  return (
    <div className="w-full h-screen overflow-hidden grid grid-rows-[auto_1fr] ">
      <Toaster />
      <BookingHeader />
      <BookingsList />
    </div>
  );
}

export default App;
