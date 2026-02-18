import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/api.js";
const TABS = [
  { key: "regular", label: "Regular Maintenance" },
  { key: "body", label: "Body Repair" },
  { key: "mechanical", label: "Mechanical" },
  { key: "other", label: "Other" },
];

const CONCERN_TYPES = [
  { key: "regular", label: "Regular Maintenance" },
  { key: "body", label: "Body Repair" },
  { key: "mechanical", label: "Mechanical Repair" },
  { key: "other", label: "Others" },
];

const CreateJobCard = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("regular");
  const [regularMaintenance, setRegularMaintenance] = useState(false);
  const [bodyRepair, setBodyRepair] = useState(false);
  const [mechanical, setMechanical] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  // Job Concerns state
  const [concerns, setConcerns] = useState([]);
  const [showConcernModal, setShowConcernModal] = useState(false);
  const [concernText, setConcernText] = useState("");
  const [concernType, setConcernType] = useState("body");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const JobCardRes = await api.post(
        "http://localhost:8000/api/jobs/create-job-card/",
        {
          appointment_id: id,
          regularMaintenance: regularMaintenance,
          bodyRepair: bodyRepair,
          mechanical: mechanical,
          concerns: concerns,
          BranchName: 1,
          JobCardTypeName: "Regular Maintenance",
          JobConcernDescription: "N/A",
          JobCardNumber: "JC-" + Date.now(),
          CreatedOn: new Date().toISOString(),
          StatusID: 6,
        },
      );
      setMessage("Job Card created for appointment #" + id);
      setTimeout(() => {
        navigate("/all-job-cards"); // Change to your job cards list route
      }, 1000);
    } catch (err) {
      setMessage("Error creating Job Card.");
    }
  };
  const handleAddConcern = () => {
    setShowConcernModal(true);
    setConcernText("");
    setConcernType("body");
  };

  const handleSaveConcern = () => {
    if (concernText.trim()) {
      setConcerns([...concerns, { text: concernText, type: concernType }]);
      setShowConcernModal(false);
      setMessage("Job Concern added!");
      setTimeout(() => setMessage(""), 2000);
    }
  };
  const concernCounts = {
    regular: concerns.filter((c) => c.type === "regular").length,
    body: concerns.filter((c) => c.type === "body").length,
    mechanical: concerns.filter((c) => c.type === "mechanical").length,
    other: concerns.filter((c) => c.type === "other").length,
  };
  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Create Job Card</h2>
      <p className="mb-2 text-gray-600">
        For Appointment ID: <span className="font-mono">{id}</span>
      </p>
      {/* Tabs */}
      <div className="flex border-b mb-4">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 -mb-px border-b-2 ${
              activeTab === tab.key
                ? "border-blue-600 text-blue-600 font-semibold"
                : "border-transparent text-gray-500"
            }`}
          >
            {tab.label}
            {/* Show count badge for relevant tabs */}
            {["regular", "body", "mechanical", "other"].includes(tab.key) && (
              <span className="ml-2 inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                {concernCounts[tab.key]}
              </span>
            )}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {activeTab === "regular" && (
          <div className="flex items-center">
            <input
              id="regular-maintenance"
              type="checkbox"
              checked={regularMaintenance}
              onChange={(e) => setRegularMaintenance(e.target.checked)}
              className="mr-2"
            />
            <label
              htmlFor="regular-maintenance"
              className="text-sm font-medium"
            >
              Regular Maintenance
            </label>
          </div>
        )}
        {activeTab === "body" && (
          <div className="flex items-center">
            <input
              id="body-repair"
              type="checkbox"
              checked={bodyRepair}
              onChange={(e) => setBodyRepair(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="body-repair" className="text-sm font-medium">
              Body Repair
            </label>
          </div>
        )}
        {activeTab === "mechanical" && (
          <div className="flex items-center">
            <input
              id="mechanical"
              type="checkbox"
              checked={mechanical}
              onChange={(e) => setMechanical(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="mechanical" className="text-sm font-medium">
              Mechanical
            </label>
          </div>
        )}
        {/* Job Concerns Section */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Job Concerns</h3>
            <button
              type="button"
              onClick={handleAddConcern}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              + Add Repair Order Concern
            </button>
          </div>
          {/* List concerns for the active tab */}
          <ul className="list-disc pl-5 space-y-1">
            {concerns
              .filter((c) => {
                if (activeTab === "body") return c.type === "body";
                if (activeTab === "mechanical") return c.type === "mechanical";
                if (activeTab === "other") return c.type === "other";
                return false;
              })
              .map((c, idx) => (
                <li key={idx}>{c.text}</li>
              ))}
          </ul>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Create Job Card
        </button>
      </form>
      {/* Snackbar/Modal for adding concern */}
      {showConcernModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h4 className="text-lg font-semibold mb-2">Add Job Concern</h4>
            <div className="flex gap-4 mb-4">
              {CONCERN_TYPES.map((type) => (
                <label key={type.key} className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="concernType"
                    value={type.key}
                    checked={concernType === type.key}
                    onChange={() => setConcernType(type.key)}
                  />
                  {type.label}
                </label>
              ))}
            </div>
            <div className="flex gap-4 mb-4">
              <textarea
                value={concernText}
                onChange={(e) => setConcernText(e.target.value)}
                className="w-full border px-3 py-2 rounded mb-4"
                placeholder="Describe the concern..."
                maxLength={1000}
                rows={8}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowConcernModal(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveConcern}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Save Job Concern
              </button>
            </div>
          </div>
        </div>
      )}
      {message && (
        <div className="fixed bottom-4 left-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {message}
        </div>
      )}
    </div>
  );
};
export default CreateJobCard;
