/* eslint-disable no-undef */
import axios from "axios";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext, useAuth } from "../context/AuthContext";
import api from "../utils/api.js";

const fetchNearbyStations = async (lat, lng, radius, token) => {
  const res = await axios.get(
    "http://localhost:8000/api/accounts/service-stations/nearby/",
    {
      params: { lat, lng, radius },
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return res.data;
};

// eslint-disable-next-line no-unused-vars
const fetchServiceTypes = async (token) => {
  const res = await axios.get(
    "http://localhost:8000/api/accounts/service-types/",
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.data;
};

const Appointments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [appointments, setAppointments] = useState([]);
  const [serviceStations, setServiceStations] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [form, setForm] = useState({
    service_station: "",
    service_type: "",
    appointment_date: "",
    appointment_time: "",
    notes: "",
    vehicle_number: "",
    vin: "",
  });
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("info");
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const { token } = useContext(AuthContext);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [appointmentSlots, setAppointmentSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vin, setVin] = useState("");
  // Check if we came from ServiceStations with a pre-selected station
  const preSelectedStation = location.state?.selectedStation;
  const fromServiceStations = location.state?.fromServiceStations;

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchAppointments(),
        fetchServiceStations(),
        fetchServiceTypes(),
      ]);

      // If we have a pre-selected station from ServiceStations, set it up
      if (preSelectedStation && fromServiceStations) {
        setSelectedStation(preSelectedStation.id);
        setForm((prev) => ({
          ...prev,
          service_station: preSelectedStation.id,
        }));
        // Clear the location state to prevent re-applying on refresh
        navigate(location.pathname, { replace: true });
      }
      setIsLoading(false);
    };

    initializeData();
  }, [preSelectedStation, fromServiceStations, navigate, location.pathname]);
  const handleDateChange = async (e) => {
    const selectedDate = e.target.value;
    if (editingAppointment) {
      setForm({ ...form, appointment_date: selectedDate });
    } else {
      setDate(selectedDate);
    }
    // Fetch slots only if a station and service type are selected
    const stationId = editingAppointment
      ? form.service_station
      : selectedStation;
    const serviceTypeId = editingAppointment
      ? form.service_type
      : selectedService;
    if (stationId && serviceTypeId && selectedDate) {
      try {
        const response = await api.get(`/api/accounts/appointment-slots/`, {
          params: {
            appointment_date: selectedDate,
          },
        });
        setAppointmentSlots(response.data);
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setAppointmentSlots([]);
      }
    } else {
      setAppointmentSlots([]);
    }
  };
  const fetchAppointments = async () => {
    try {
      const response = await api.get("/api/accounts/appointments/");
      setAppointments(response.data);
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setMessage("Failed to fetch appointments");
      setSeverity("error");
    }
  };
  const handleEdit = async (appointment) => {
    setEditingAppointment(appointment);
    setForm({
      service_station: appointment.service_station,
      service_type: appointment.service_type,
      appointment_date: appointment.appointment_date,
      appointment_time: appointment.appointment_time,
      notes: appointment.notes || "",
      vehicle_number: appointment.plate_number || "",
      vin: appointment.vin || "",
      AppointSlotID: appointment.AppointSlotID || null,
    });
    setSelectedStation(appointment.service_station);
    setSelectedService(appointment.service_type);
    setDate(appointment.appointment_date);
    setTime(appointment.appointment_time);
    setNotes(appointment.notes || "");
    setSelectedSlot({
      AppointmentSlotsID: appointment.AppointSlotID,
      AppointmentTime: appointment.appointment_time,
    });
    setVehicleNumber(appointment.plate_number);
    setVin(appointment.vin);
    setOpenDialog(true);
    try {
      const response = await api.get(`/api/accounts/appointment-slots/`, {
        params: {
          appointment_date: appointment.appointment_date,
        },
      });
      setAppointmentSlots(response.data);
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setAppointmentSlots([]);
    }
  };
  const handleDelete = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?"))
      return;
    setLoading(true);
    try {
      await api.delete(`/api/accounts/appointments/${appointmentId}/`);
      setSnackbarMessage("Appointment cancelled successfully!");
      setSnackbarOpen(true);
      await fetchAppointments(); // Refresh the list
    } catch (err) {
      setSnackbarMessage("Failed to cancel appointment.");
      setSnackbarOpen(true);
    }
    setLoading(false);
  };
  const fetchServiceStations = async () => {
    try {
      const response = await api.get("/api/accounts/service-stations/");
      setServiceStations(response.data);
    } catch (error) {
      console.error("Failed to fetch service stations:", error);
    }
  };

  const fetchServiceTypes = async () => {
    try {
      const response = await api.get("/api/accounts/service-types/");
      setServiceTypes(response.data);
    } catch (error) {
      console.error("Failed to fetch service types:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setSeverity("info");
    try {
      if (editingAppointment) {
        await axios.put(
          `http://localhost:8000/api/accounts/appointments/${editingAppointment.id}/`,
          {
            ...form,
            appointment_time: selectedSlot
              ? selectedSlot.AppointmentTime
              : form.appointment_time,
            AppointSlotID: selectedSlot ? selectedSlot.id : form.AppointSlotID,
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setSnackbarMessage("Appointment updated successfully!");
      } else {
        await axios.post(
          "http://localhost:8000/api/accounts/appointments/",
          {
            service_station: selectedStation,
            service_type: selectedService,
            appointment_date: date,
            appointment_time: selectedSlot
              ? selectedSlot.AppointmentTime
              : time,
            notes,
            AppointSlotID: selectedSlot ? selectedSlot.id : null,
            plate_number: vehicleNumber,
            vin: vin,
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setSnackbarMessage("Appointment scheduled successfully!");
      }
      setSnackbarOpen(true);
      setOpenDialog(false);
      setEditingAppointment(null);
      setForm({
        service_station: "",
        service_type: "",
        appointment_date: "",
        appointment_time: "",
        notes: "",
        vehicle_number: "",
        vin: "",
        selectedSlot: null,
      });
      setSelectedStation("");
      setSelectedService("");
      setDate("");
      setTime("");
      setNotes("");
      setAppointmentSlots([]);
      setSelectedSlot(null);
      setVehicleNumber("");
      setVin("");
      await fetchAppointments();
    } catch (err) {
      const apiError =
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.error ||
        "Failed to schedule/update appointment. Please check your input.";
      setSnackbarMessage(apiError);
      setSnackbarOpen(true);
    }
    setLoading(false);
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "pending":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "in_progress":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "completed":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "cancelled":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return null;
    }
  };
  const formatDateTime = (date, time) => {
    if (!date) return "Not scheduled";
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString();
    const formattedTime = time || "TBD";
    return `${formattedDate} at ${formattedTime}`;
  };

  const handleSearch = async () => {
    setLoading(true);
    // Replace with user's actual location
    const lat = 33.6844;
    const lng = 73.0479;
    const radius = 10;
    try {
      const data = await fetchNearbyStations(lat, lng, radius, token);
      // Filter for stations offering "Oil changing"
      const filtered = data.filter((station) =>
        station.services_offered.some(
          (service) => service.name.toLowerCase() === "oil changing",
        ),
      );
      setStations(filtered);
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert("Failed to fetch stations.");
    }
    setLoading(false);
  };

  const handleSchedule = (station) => {
    const oilService = station.services_offered.find(
      (s) => s.name.toLowerCase() === "oil changing",
    );
    setSelectedStation(station.id);
    setSelectedService(oilService ? oilService.id : "");
    setDate("");
    setTime("");
    setNotes("");
    setEditingAppointment(null);
    setOpenDialog(true);
    setVehicleNumber("");
    setVin("");
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedStation(null);
    setSelectedService(null);
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Only allow today or future dates
  const minDate = dayjs().format("YYYY-MM-DD");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse"></div>
            </div>
            <div className="flex justify-center items-center h-48">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Appointments</h1>
              <p className="text-lg text-gray-600 mt-2">
                Manage your car service appointments and bookings
              </p>
            </div>

            <button
              onClick={() => {
                setEditingAppointment(null);
                resetForm();
                setOpenDialog(true);
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Book Appointment
            </button>
          </div>

          {message && (
            <div
              className={`p-4 rounded-lg mb-6 ${
                severity === "success"
                  ? "bg-green-100 border border-green-400 text-green-700"
                  : "bg-red-100 border border-red-400 text-red-700"
              }`}
            >
              {message}
            </div>
          )}
        </div>

        <div className="mb-6">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {loading ? "Searching..." : "Find Nearby Stations"}
          </button>

          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="space-y-2">
              {stations.map((station) => (
                <div
                  key={station.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {station.name}
                    </h4>
                    <p className="text-sm text-gray-600">{station.address}</p>
                  </div>
                  <button
                    onClick={() => handleSchedule(station)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Schedule
                  </button>
                </div>
              ))}
            </div>
            {stations.length === 0 && !loading && (
              <div className="p-4 text-center text-gray-600">
                No stations found within 10 km offering Oil changing.
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments &&
            appointments.length > 0 &&
            appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {appointment.service_station_name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          navigate(`/CreateJobCard/${appointment.id}`)
                        }
                        className="p-2 rounded-full bg-green-100 hover:bg-green-200 text-green-700 transition-colors"
                        title="Create Job Card"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      {getStatusIcon(appointment.status)}
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusIcon(
                          appointment.status,
                        )}`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {appointment.service_type_name}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {formatDateTime(
                        appointment.appointment_date,
                        appointment.appointment_time,
                      )}
                    </div>

                    {appointment.user_name && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg
                          className="w-4 h-4 text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {appointment.user_name}
                      </div>
                    )}

                    {appointment.notes && (
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <svg
                          className="w-4 h-4 text-blue-600 mt-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {appointment.notes}
                      </div>
                    )}
                  </div>

                  <hr className="my-4 border-gray-200" />

                  <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                    <span>ID: #{appointment.id}</span>
                    <span>
                      Created:{" "}
                      {new Date(
                        appointment.created_at || Date.now(),
                      ).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(appointment)}
                      className="flex-1 px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                    >
                      Edit
                    </button>
                    {appointment.status === "pending" && (
                      <button
                        onClick={() => handleDelete(appointment.id)}
                        className="flex-1 px-3 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    )}
                    {appointment.service_station_latitude &&
                      appointment.service_station_longitude && (
                        <button
                          onClick={() => {
                            const url = `https://www.google.com/maps/dir/?api=1&destination=${appointment.service_station_latitude},${appointment.service_station_longitude}`;
                            window.open(url, "_blank");
                          }}
                          className="px-3 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors text-sm"
                          title="Get Directions"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      )}
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Floating Action Button for quick booking */}
        <button
          className="fixed bottom-4 right-4 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50 flex items-center justify-center"
          onClick={() => setOpenDialog(true)}
          aria-label="book appointment"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Add/Edit Dialog */}
        {openDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingAppointment ? "Edit Appointment" : "Book Appointment"}
                </h2>
                <button
                  onClick={handleDialogClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Station
                  </label>
                  <select
                    name="service_station"
                    value={
                      editingAppointment
                        ? form.service_station
                        : selectedStation
                    }
                    onChange={
                      editingAppointment
                        ? (e) =>
                            setForm({
                              ...form,
                              service_station: e.target.value,
                            })
                        : (e) => setSelectedStation(e.target.value)
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a service station</option>
                    {serviceStations.map((station) => (
                      <option key={station.id} value={station.id}>
                        {station.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Type
                  </label>
                  <select
                    name="service_type"
                    value={
                      editingAppointment ? form.service_type : selectedService
                    }
                    onChange={
                      editingAppointment
                        ? (e) =>
                            setForm({ ...form, service_type: e.target.value })
                        : (e) => setSelectedService(e.target.value)
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  >
                    <option value="">Select a service</option>
                    {serviceTypes.length > 0 ? (
                      serviceTypes.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name}
                        </option>
                      ))
                    ) : (
                      <option value="">No services available</option>
                    )}
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vehicle Number
                    </label>
                    <input
                      type="text"
                      name="vehicle_number"
                      value={
                        editingAppointment ? form.vehicle_number : vehicleNumber
                      }
                      onChange={
                        editingAppointment
                          ? (e) =>
                              setForm({
                                ...form,
                                vehicle_number: e.target.value,
                              })
                          : (e) => setVehicleNumber(e.target.value)
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter vehicle number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vehicle Identification Number (VIN)
                    </label>
                    <input
                      type="text"
                      name="vin"
                      value={editingAppointment ? form.vin : vin}
                      onChange={
                        editingAppointment
                          ? (e) => setForm({ ...form, vin: e.target.value })
                          : (e) => setVin(e.target.value)
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter VIN"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      name="appointment_date"
                      value={editingAppointment ? form.appointment_date : date}
                      onChange={handleDateChange}
                      required
                      min={minDate}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                {appointmentSlots.length > 0 && (
                  <div className="my-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Available Time Slots
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {appointmentSlots.map((slot) => (
                        <button
                          type="button"
                          key={slot.id}
                          onClick={() => setSelectedSlot(slot)}
                          className={`px-4 py-2 rounded-lg border ${
                            selectedSlot &&
                            selectedSlot.AppointmentSlotsID ===
                              slot.AppointmentSlotsID
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {slot.AppointmentTime}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={editingAppointment ? form.notes : notes}
                    onChange={
                      editingAppointment
                        ? (e) => setForm({ ...form, notes: e.target.value })
                        : (e) => setNotes(e.target.value)
                    }
                    rows={3}
                    placeholder="Any special requirements or notes..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleDialogClose}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {loading && (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    )}
                    {loading
                      ? "Processing..."
                      : editingAppointment
                        ? "Update"
                        : "Book"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Snackbar for feedback */}
        {snackbarOpen && (
          <div className="fixed bottom-4 left-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              {snackbarMessage}
            </div>
            <button
              onClick={handleSnackbarClose}
              className="ml-4 text-white hover:text-gray-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;
