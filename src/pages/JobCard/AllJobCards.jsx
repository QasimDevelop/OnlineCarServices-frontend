import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/api.js";

const STATUS_TABS = [
  { key: "New", label: "New" },
  { key: "InProgress", label: "In Progress" },
  { key: "Completed", label: "Completed" },
];

const AllJobCardsDashboard = () => {
  const [jobCards, setJobCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("New");
  const [openAction, setOpenAction] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchJobCards = async () => {
      try {
        const res = await api.get(
          "http://localhost:8000/api/jobs/all-job-cards/",
        );
        setJobCards(res.data);
      } catch (err) {
        setJobCards([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobCards();
  }, []);

  if (loading) return <div>Loading...</div>;

  // Filter job cards by status
  const filteredCards = jobCards.filter(
    (card) => card.JobCardStatusName === activeTab,
  );
  const handleEditJobCard = (JobCardID) => {
    // Navigate or open modal for editing
    // Example: navigate(`/edit-job-card/${jobCardId}`);
    setOpenAction(null);
  };

  const handleAssignTask = (JobCardID) => {
    setOpenAction(null);
    navigate(`/assign-task/${JobCardID}`);
  };
  return (
    <div className="max-w-6xl mx-auto mt-10">
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded ${activeTab === tab.key ? "bg-orange-100 text-orange-600 font-bold" : "bg-gray-100 text-gray-600"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Job Card List */}
      {filteredCards.length === 0 ? (
        <div>No job cards found.</div>
      ) : (
        <div className="space-y-6">
          {filteredCards.map((card) => (
            <div
              key={card.JobCardID}
              className="bg-white rounded shadow p-6 flex gap-6 items-center"
            >
              {/* Image Placeholder */}
              <div className="w-32 h-32 bg-gray-100 flex items-center justify-center rounded">
                <span className="text-gray-400">No Image</span>
              </div>
              {/* Job Card Info */}
              <div className="flex-1 relative">
                <div className="flex items-center gap-4">
                  <span className="text-xl font-bold text-blue-900">
                    {card.VehicleID?.PlateNumber || "No Plate"}
                  </span>
                  <span className="bg-orange-200 text-orange-700 px-2 py-1 rounded text-xs font-semibold">
                    Job Card Number : {card.JobCardNumber}
                  </span>
                  <span className="bg-orange-200 text-orange-700 px-2 py-1 rounded text-xs font-semibold">
                    VIN : {card.VehicleID?.VIN || "N/A"}
                  </span>
                  <div className="ml-auto relative">
                    <button
                      className="bg-gray-200 px-4 py-2 rounded font-semibold flex items-center gap-2 hover:bg-gray-300"
                      onClick={() =>
                        setOpenAction(
                          openAction === card.JobCardID ? null : card.JobCardID,
                        )
                      }
                    >
                      Actions <span>▼</span>
                    </button>
                    {openAction === card.JobCardID && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => handleEditJobCard(card.JobCardID)}
                        >
                          Edit Job Card
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => handleAssignTask(card.JobCardID)}
                        >
                          Task Assignment
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => handleTaskStart(card.JobCardID)}
                        >
                          Start JobCard
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-2 text-gray-700">
                  <div>
                    Status:{" "}
                    <span className="font-semibold">
                      {card.JobCardStatusName}
                    </span>
                  </div>
                  {/* Add more fields as needed */}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllJobCardsDashboard;
