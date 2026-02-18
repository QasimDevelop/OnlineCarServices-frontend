import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api.js";

const StationServices = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [station, setStation] = useState(null);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStation = async () => {
      try {
        const response = await api.get(`/api/accounts/service-stations/${id}/`);
        setStation(response.data);
      } catch (err) {
        setError("Failed to fetch station details");
        console.log(err);
      }
    };
    const fetchServiceTypes = async () => {
      try {
        const response = await api.get(`/api/accounts/station-services/${id}/`);
        setServiceTypes(response.data);
      } catch (err) {
        setError("Failed to fetch service types");
        console.log(err);
      }
    };
    Promise.all([fetchStation(), fetchServiceTypes()]).finally(() =>
      setLoading(false)
    );
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!station)
    return <div className="p-8 text-center">Station not found.</div>;

  // Find service details for this station

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {station.name} Services
        </h1>
        <p className="text-gray-600 mb-6">{station.address}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {serviceTypes.length > 0 ? (
            serviceTypes.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-lg shadow p-6 flex flex-col justify-between"
              >
                <h2 className="text-xl font-semibold text-blue-800 mb-2">
                  {service.name}
                </h2>
                <p className="text-gray-700 mb-2">{service.description}</p>
                <div className="mb-2">
                  <span className="font-medium text-gray-600">Price: </span>
                  <span className="text-green-700 font-bold">
                    {service.price ? `₹${service.price}` : "N/A"}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="font-medium text-gray-600">Duration: </span>
                  <span>
                    {service.duration_minutes
                      ? `${service.duration_minutes} min`
                      : "N/A"}
                  </span>
                </div>
                <div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      service.is_available
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {service.is_available ? "Available" : "Not Available"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 col-span-2">
              No services listed for this station.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StationServices;
