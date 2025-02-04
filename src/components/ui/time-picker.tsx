import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type TimePickerProps = {
  onSelect: (time: string) => void
  className?: string
  classNames?: {
    container?: string
    button?: string
    time?: string
  }
}

const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`)

function TimePicker({
  onSelect,
  className,
  classNames,
}: TimePickerProps) {
  const [currentHour, setCurrentHour] = React.useState<number>(new Date().getHours())

  const handlePrevious = () => {
    setCurrentHour((prev) => (prev === 0 ? 23 : prev - 1))
  }

  const handleNext = () => {
    setCurrentHour((prev) => (prev === 23 ? 0 : prev + 1))
  }

  React.useEffect(() => {
    onSelect(hours[currentHour])
  }, [currentHour, onSelect])

  return (
    <div className={cn("flex items-center space-x-2", className, classNames?.container)}>
      <button
        type="button"
        onClick={handlePrevious}
        className={cn(buttonVariants({ variant: "outline" }), "h-7 w-7 p-0", classNames?.button)}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <div className={cn("text-center text-sm", classNames?.time)}>
        {hours[currentHour]}
      </div>
      <button
        type="button"
        onClick={handleNext}
        className={cn(buttonVariants({ variant: "outline" }), "h-7 w-7 p-0", classNames?.button)}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}

TimePicker.displayName = "TimePicker"

export { TimePicker }