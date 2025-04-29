import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaUserDoctor } from "react-icons/fa6";
import "./appointment-styles.css";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { getTimeSlots, bookAppointment } from "@redux/thunks/patient";
import { fetchDoctors } from "@src/redux/thunks/admin";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import bookingImg from "@src/assets/booking-success.png";

function Appointment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { adminMessage, doctorMessage } = useSelector((state) => state.auth);
  const { id: patient_id } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [timeSlots, setTimeSlots] = useState(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: Math.min(3, doctors?.length || 1),
    slidesToScroll: 1,
    initialSlide: 0,
    arrows: true,
  };

  useEffect(() => {
    const loadDoctors = async () => {
      setDoctorsLoading(true);
      try {
        const response = await dispatch(fetchDoctors());
        if (response.error) {
          console.error(response.error);
          return;
        }
        setDoctors(response.payload.data);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      } finally {
        setDoctorsLoading(false);
      }
    };
    loadDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      const loadTimeSlots = async () => {
        setSlotsLoading(true);
        try {
          const response = await dispatch(
            getTimeSlots({
              doctor_id: selectedDoctor.doctor_id,
              date: selectedDate.format("YYYY-MM-DD"),
            })
          );
          if (response.error) {
            console.error(response.error);
            return;
          }
          setTimeSlots(response.payload.data);
        } catch (err) {
          console.error(err);
        } finally {
          setSlotsLoading(false);
        }
      };
      loadTimeSlots();
    }
  }, [selectedDoctor, selectedDate]);

  const handleBookAppointment = async () => {
    try {
      setBookingStatus("booking");
      const response = await dispatch(
        bookAppointment({
          patient_id: parseInt(patient_id),
          doctor_id: selectedDoctor.doctor_id,
          date: selectedDate.format("YYYY-MM-DD"),
          time: selectedSlot,
        })
      );
      if (response.error) {
        toast.error(response.payload);
        setBookingStatus(null);
        return;
      }
      setBookingStatus("success");
      setSelectedSlot(null);
      setShowPopup(true);
      setTimeout(() => {
        adminMessage
          ? navigate("/admin/patients")
          : doctorMessage
          ? navigate("/doctor/patients")
          : navigate("/user/patients");
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const generateTimeSlots = (startTime, endTime, scheduleSlot = [],pendingSlot = []) => {
    const bookedSlots = scheduleSlot.concat(pendingSlot);
    const slots = [];
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    const bookedTimes = bookedSlots?.map((slot) => slot.substring(0, 5)) || [];
    for (
      let time = new Date(start);
      time <= end;
      time.setMinutes(time.getMinutes() + 30)
    ) {
      const timeString = time.toTimeString().substring(0, 5);
      slots.push({
        time: timeString,
        available: !bookedTimes.includes(timeString),
      });
    }
    return slots;
  };

  return (
    <div className="appointment-container">
      <h2>Make an Appointment</h2>

      <div className="appointment-slider">
        <h3>Choose a doctor</h3>
        {doctorsLoading ? (
          <p>Loading doctors...</p>
        ) : (
          <Slider {...settings}>
            {doctors &&
              doctors?.map((doctor) => (
                <label
                  htmlFor={`doctor-${doctor.doctor_id}`}
                  key={doctor.doctor_id}
                  className={`slider-card ${
                    selectedDoctor?.doctor_id === doctor.doctor_id
                      ? "selected"
                      : ""
                  }`}
                >
                  <div className="slider-icon">
                    <FaUserDoctor />
                  </div>
                  <div className="slider-content">
                    <p className="slider-name">{doctor.name}</p>
                    <p className="slider-review">{doctor.specialization}</p>
                  </div>
                  <input
                    type="radio"
                    id={`doctor-${doctor.doctor_id}`}
                    name="doctor-selection"
                    className="doctor-radio"
                    checked={selectedDoctor?.id === doctor.doctor_id}
                    onChange={() => setSelectedDoctor(doctor)}
                  />
                </label>
              ))}
          </Slider>
        )}
      </div>

      <div className="data-slot">
        <div className="calendar">
          <h3>Select date</h3>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              views={["year", "month", "day"]}
              onChange={(date) => setSelectedDate(date)}
              minDate={dayjs()}
            />
          </LocalizationProvider>
        </div>

        <div className="slots">
          {!selectedDoctor || !selectedDate ? (
            <div className="slots-empty">
              Please select a doctor and date to see available slots
            </div>
          ) : slotsLoading ? (
            <p>Loading available slots...</p>
          ) : timeSlots ? (
            <div className="time-slots">
              <h3>Available Time Slots</h3>
              <p>
                Doctor Availability: {timeSlots.doctorInTime} -{" "}
                {timeSlots.doctorOutTime}
              </p>
              <div className="slot-buttons">
                {generateTimeSlots(
                  timeSlots.doctorInTime,
                  timeSlots.doctorOutTime,
                  timeSlots.scheduleSlots,
                  timeSlots.pendingSlots
                ).map((slot) => (
                  <button
                    key={slot.time}
                    className={`${slot.available ? "slotButton" : "booked"} ${
                      selectedSlot === slot.time ? "selectedButton" : ""
                    }`}
                    onClick={() => slot.available && setSelectedSlot(slot.time)}
                    disabled={!slot.available}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>

              {selectedSlot && (
                <div className="booking-actions">
                  <p>{`${selectedDate
                    .toString()
                    .substring(0, 16)} - ${selectedSlot}`}</p>
                  <button
                    className="book-button"
                    onClick={handleBookAppointment}
                    disabled={bookingStatus === "booking"}
                  >
                    {bookingStatus === "booking" ? "Booking..." : "Book"}
                  </button>
                  {bookingStatus === "success" && (
                    <p className="success-message">
                      Appointment booked successfully!
                    </p>
                  )}
                  {bookingStatus === "error" && (
                    <p className="error-message">
                      Failed to book appointment. Please try again.
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p>No available slots found</p>
          )}
        </div>
      </div>

      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <img src={bookingImg} alt="Congrats" className="popup-image" />
          </div>
        </div>
      )}
    </div>
  );
}

export default Appointment;
