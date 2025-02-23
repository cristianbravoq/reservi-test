
import { TimeTable } from "./components/time-blocks/time-table";
import { BookingHeader } from "./components/header/booking-header";
import { Toaster } from "./components/ui/toaster";

function App() {

  return (
    <div className="w-full">
      <Toaster />
      <BookingHeader />
      <TimeTable />
    </div>
  );
}

export default App;
