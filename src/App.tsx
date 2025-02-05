import { useState } from "react";

import TimeTable from "./components/time-blocks/time-table";
import BookingHeader from "./components/header/booking-header";

function App() {
  const [selectedDate] = useState(new Date());

  return (
    <div className="w-full">
      <BookingHeader date={selectedDate} />
      <TimeTable date={selectedDate} users={users} timeBlocks={timeBlocks} />
    </div>
  );
}

export default App;

const users = [
  {
    id: "1",
    name: "John Doe",
    address: "123 Main St",
    phoneNumber: "123-456-7890",
    email: "john@example.com",
  },
  {
    id: "2",
    name: "Jane Smith",
    address: "456 Elm St",
    phoneNumber: "987-654-3210",
    email: "jane@example.com",
  },
  // Agrega más usuarios según sea necesario
];

const timeBlocks = [
  {
    id: "1",
    date: undefined,
    startTime: "2025-02-05T08:00:00",
    endTime: "2025-02-05T09:00:00",
    userId: "1",
  },
  {
    id: "2",
    date: undefined,
    startTime: "2025-02-05T23:00:00",
    endTime: "2025-02-05T00:00:00",
    userId: "2",
  },
  // Agrega más bloques de tiempo según sea necesario
];
