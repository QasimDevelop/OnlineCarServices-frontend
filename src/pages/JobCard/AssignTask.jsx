import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/api.js";

const AssignTask = () => {
  const { JobCardID } = useParams();
  const navigate = useNavigate();
  const [jobCard, setJobCard] = useState(null);
  const [jobConcerns, setJobConcerns] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [selectedTech, setSelectedTech] = useState({});
  const [loading, setLoading] = useState(true);
  const [assignedConcerns, setAssignedConcerns] = useState({});

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const res = await api.get(
          `/api/jobs/jobcard/${JobCardID}/assign-data/`,
        );
        setJobCard(res.data.job_card);
        setJobConcerns(res.data.job_concerns);
        setTechnicians(res.data.technicians);
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [JobCardID]);
  const handleSaveTechnician = () => {
    // Optionally, you can validate or process assigned technicians here
    alert("Technicians saved successfully");
    // Navigate to all job cards page
    navigate("/all-job-cards");
  };
  const handleAssign = async (concernId, jobCardId) => {
    try {
      const techId = selectedTech[concernId]?.technician;
      if (!techId) {
        alert("Please select a technician");
        return;
      }

      await api.post("/api/jobs/assignTechnician/", {
        JobConcernID: concernId,
        EmployeeID: techId,
        JobCardID: jobCardId,
      });

      // Mark this concern as assigned
      setAssignedConcerns({
        ...assignedConcerns,
        [concernId]: true,
      });

      alert("Technician Assigned Successfully ");
    } catch (error) {
      console.error("Assignment failed:", error);
      alert("Failed to assign technician");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Assign Technicians</h2>
      {jobCard && (
        <div className="mb-6 bg-gray-50 rounded p-4 border border-gray-200">
          <div className="mb-2 text-lg font-semibold text-blue-900">
            Job Card Number:{" "}
            <span className="font-bold">{jobCard.JobCardNumber}</span>
          </div>
          <div className="mb-1 text-gray-700">
            Plate Number:{" "}
            <span className="font-semibold">
              {jobCard.VehicleID?.PlateNumber || "N/A"}
            </span>
          </div>
          <div className="mb-1 text-gray-700">
            VIN:{" "}
            <span className="font-semibold">
              {jobCard.VehicleID?.VIN || "N/A"}
            </span>
          </div>
        </div>
      )}
      {jobConcerns.map((concern) => (
        <div key={concern.JobConcernID} className="mb-8">
          <div className="mb-2 font-semibold text-right">
            {concern.JobConcernDescription}
          </div>
          {concern.parts && (
            <div className="mb-2 flex justify-end items-center">
              <span className="text-orange-500 font-semibold mr-2">Parts:</span>
              <span className="text-black">{concern.parts}</span>
            </div>
          )}
          <div className="mb-1 text-orange-500 font-semibold text-sm">
            Technician
          </div>
          <div className="flex items-center">
            <select
              value={selectedTech[concern.JobConcernID]?.technician || ""}
              onChange={(e) =>
                setSelectedTech({
                  ...selectedTech,
                  [concern.JobConcernID]: {
                    concern: concern.JobConcernID,
                    technician: e.target.value,
                  },
                })
              }
              className="border border-black rounded px-2 py-2 min-w-[300px] text-lg"
              style={{ fontWeight: "bold" }}
              disabled={assignedConcerns[concern.JobConcernID]} // <-- disable if assigned
            >
              <option value="">Select Technician</option>
              {technicians.map((tech) => (
                <option key={tech.EmployeeID} value={tech.EmployeeID}>
                  {tech.Name}{" "}
                  {tech.task_counts
                    ? `(${tech.task_counts.inspection} Inspection + ${tech.task_counts.in_progress} InProgress)`
                    : ""}
                </option>
              ))}
            </select>
          </div>
          <button
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded font-semibold"
            onClick={() =>
              handleAssign(concern.JobConcernID, jobCard.JobCardID)
            }
            disabled={!selectedTech[concern.JobConcernID]?.technician}
          >
            Assign
          </button>
        </div>
      ))}
      <div className="flex justify-center mt-8">
        <button
          className="px-8 py-2 border border-orange-500 text-orange-500 rounded font-semibold text-lg bg-white hover:bg-orange-50"
          onClick={handleSaveTechnician}
        >
          Save Technician
        </button>
      </div>
    </div>
  );
};

export default AssignTask;
