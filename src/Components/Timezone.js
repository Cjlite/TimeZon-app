import React, { useEffect, useState } from "react";
import "../Components/TimeZone.css";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";

const TimeZone = () => {
  const [currentStartDate, setCurrentStartDate] = useState(new Date());
  const [selectedTimezone, setSelectedTimezone] = useState("Asia/Kolkata");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("8:00 AM");
  const [timeOptionsByDay, setTimeOptionsByDay] = useState([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);

  useEffect(() => {
    loadData(currentStartDate);

    const intervalId = setInterval(() => {
      const updatedTime = new Date();
      setCurrentTime(updatedTime);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [currentStartDate, selectedTimezone]);

  useEffect(() => {
    updateAllTimes();
  }, [currentStartDate, selectedTimezone, selectedTime]);

  const loadData = (startDate) => {
    console.log("Loading data for the week starting from:", startDate);
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    const initialTimeOptionsByDay = days.map(() =>
      Array.from({ length: 16 }, (_, index) => ({
        hour: 8 + index,
        formattedHour: ((8 + index) % 12 || 12).toString().padStart(2, "0"),
        period: 8 + index < 12 ? "AM" : "PM",
        isChecked: false,
      }))
    );

    setTimeOptionsByDay(initialTimeOptionsByDay);
  };

  const handlePrevious = () => {
    const prevWeekStartDate = new Date(currentStartDate);
    prevWeekStartDate.setDate(prevWeekStartDate.getDate() - 7);
    setCurrentStartDate(prevWeekStartDate);
  };

  const handleNext = () => {
    const nextWeekStartDate = new Date(currentStartDate);
    nextWeekStartDate.setDate(nextWeekStartDate.getDate() + 7);
    setCurrentStartDate(nextWeekStartDate);
  };

  const handleTimezoneChange = (e) => {
    const newTimezone = e.target.value;
    setSelectedTimezone(newTimezone);
  };

  const handleTimeChange = (dayIndex, hourIndex) => {
    const updatedTimeOptionsByDay = [...timeOptionsByDay];
    updatedTimeOptionsByDay[dayIndex][hourIndex].isChecked =
      !updatedTimeOptionsByDay[dayIndex][hourIndex].isChecked;
    setTimeOptionsByDay(updatedTimeOptionsByDay);

    const selectedDate = new Date(currentStartDate);
    selectedDate.setDate(selectedDate.getDate() + dayIndex);

    const selectedTimeSlot = updatedTimeOptionsByDay[dayIndex][hourIndex];
    const selectedTime = `${selectedTimeSlot.formattedHour}:00 ${selectedTimeSlot.period}`;

    setSelectedTimeSlots((prevSelectedTimeSlots) => {
      const slotId = `${selectedDate.getTime()}-${selectedTimeSlot.hour}`;
      const slotExistsIndex = prevSelectedTimeSlots.findIndex(
        (slot) => slot.id === slotId
      );

      if (selectedTimeSlot.isChecked && slotExistsIndex === -1) {
        const newTimeSlot = {
          id: slotId,
          name: "Your Name",
          date: selectedDate.toLocaleDateString("default", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
          }),
          time: selectedTime,
        };
        return [...prevSelectedTimeSlots, newTimeSlot];
      } else if (!selectedTimeSlot.isChecked && slotExistsIndex !== -1) {
        const updatedSelectedTimeSlots = [...prevSelectedTimeSlots];
        updatedSelectedTimeSlots.splice(slotExistsIndex, 1);
        console.log(updatedSelectedTimeSlots);
        return updatedSelectedTimeSlots;
      } else {
        return prevSelectedTimeSlots;
      }
    });

    console.log(selectedTimeSlots);
  };

  const updateAllTimes = () => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const startTime = 8;
    const endTime = 23;

    const timeOptionsByDay = days.map(() => {
      return Array.from({ length: endTime - startTime + 1 }, (_, index) => {
        const hour = startTime + index;
        const date = new Date();
        date.setHours(hour);

        const formattedTime = date.toLocaleString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
          timeZone: selectedTimezone,
        });

        return {
          hour,
          formattedHour: formattedTime,
          isChecked: false,
        };
      });
    });

    setTimeOptionsByDay(timeOptionsByDay);
  };

  const renderDaysWithTime = () => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    return (
      <div className="">
        {days.map((day, dayIndex) => {
          const currentDate = new Date(
            currentStartDate.getFullYear(),
            currentStartDate.getMonth(),
            currentStartDate.getDate() + dayIndex
          );
          const formattedDate = currentDate.toLocaleDateString("default", {
            day: "numeric",
            month: "numeric",
            //   year: "numeric",
          });
          return (
            <div key={day} className="selectedDateTimeContainer">
              <div className="DateTimeContainer">
                <div>{day}</div>
                <div>{formattedDate}</div>
              </div>
              <div className="">{renderTimeOptions(dayIndex)}</div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderTimeOptions = (dayIndex) => {
    const timezoneOptions = { timeZone: selectedTimezone };

    return (
      <div className="">
        {timeOptionsByDay[dayIndex]?.map(
          ({ hour, formattedHour, period, isChecked }, index) => {
            const date = new Date(currentStartDate);
            date.setDate(date.getDate() + dayIndex);

            date.setHours(hour);

            const formattedTime = date.toLocaleString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
              ...timezoneOptions,
            });

            return (
              // <div className="checkboxContainer">
              <label key={hour} className="checkbox">
                <input
                  type="checkbox"
                  name={`time-${dayIndex}`}
                  value={formattedTime}
                  checked={isChecked}
                  onChange={() => handleTimeChange(dayIndex, index)}
                />
                {formattedTime}
              </label>
              // </div>
            );
          }
        )}
      </div>
    );
  };

  return (
    <div className="container">
      <div className="headerContainer">
        <div className="topLeft" onClick={handlePrevious}>
          <BiSolidLeftArrow className="icon" />
          <span className="arrowText">Previous Week</span>
        </div>
        <div className="defauldDate">{`${currentStartDate.toLocaleDateString(
          "default",
          {
            month: "long",
            day: "numeric",
            year: "numeric",
          }
        )}`}</div>
        <div className="topRight" onClick={handleNext}>
          <span className="arrowText">Next Week</span>
          <BiSolidRightArrow className="icon" />
        </div>
      </div>

      <div className="timeStampContainer">
        <div className="timeStampContainer1">
          <div className="timeStamp">
            <label>Timezone:</label>
            <select
              id="timezoneSelect"
              value={selectedTimezone}
              onChange={handleTimezoneChange}
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time (ET)</option>
            </select>
          </div>
        </div>
        <div className="working-hours">{renderDaysWithTime()}</div>
      </div>

      <div className="tableContainer">
        {selectedTimeSlots.length > 0 &&
          selectedTimeSlots.map((res) => (
            <table key={res?.id} className="table">
              <tbody>
                <tr className="tableRow">
                  <td>ID:</td>
                  <td>{res?.id}</td>
                </tr>
                <tr className="tableRow">
                  <td>Name:</td>
                  <td>{res?.name}</td>
                </tr>
                <tr className="tableRow">
                  <td>Date:</td>
                  <td>{res?.date}</td>
                </tr>
                <tr className="tableRow">
                  <td>Time:</td>
                  <td>
                    {((res?.time.split(" ")[0] || "").split(" ") || [])
                      .filter((time) => time)
                      .map((time, index) => (
                        <span key={index}>{time}</span>
                      ))}
                    <span>{res?.time?.split(" ")[1]}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          ))}
      </div>
    </div>
  );
};

export default TimeZone;
