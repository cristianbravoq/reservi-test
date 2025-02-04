import { TimeBlockForm } from "./components/time-blocks/time-block-form";
import { CreateUserForm } from "./components/user/create-user-form";

import { Card } from "./components/ui";
import TimeTable from "./components/time-blocks/time-table";
import React from "react";

function App() {
  const [selectedDate] = React.useState(new Date());

  return (
    <div className="flex">
      <Card className="h-min p-2">
        <CreateUserForm />
      </Card>
      <Card className="h-min p-2">
        <TimeBlockForm />
      </Card>
      <div>
        <TimeTable date={selectedDate} users={users} timeBlocks={timeBlocks} />
      </div>
    </div>
  );
}

export default App;

const users = [
  { id: "1", name: "John Doe", address: "123 Main St", phoneNumber: "123-456-7890", email: "john@example.com" },
  { id: "2", name: "Jane Smith", address: "456 Elm St", phoneNumber: "987-654-3210", email: "jane@example.com" },
  // Agrega más usuarios según sea necesario
]

const timeBlocks = [
  {
    id: "1",
    startTime: "2025-02-04T08:00:00",
    endTime: "2025-02-04T09:00:00",
    userId: "1",
  },
  {
    id: "2",
    startTime: "2025-02-04T23:00:00",
    endTime: "2025-02-04T00:00:00",
    userId: "2",
  },
  // Agrega más bloques de tiempo según sea necesario
]