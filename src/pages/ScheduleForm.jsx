import React, { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Typography, Alert
} from "@mui/material";
import axios from "axios";

const ScheduleForm = ({ open, onClose, station, service, token }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        "http://localhost:8000/api/appointments/",
        {
          service_station: station.id,
          service_type: service.id,
          appointment_date: date,
          appointment_time: time,
          notes,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
    } catch (err) {
      alert("Failed to schedule appointment.");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Schedule Appointment</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          {station.name} — {service.name}
        </Typography>
        {success ? (
          <Alert severity="success">Appointment scheduled successfully!</Alert>
        ) : (
          <form onSubmit={handleSubmit} id="schedule-form">
            <TextField
              label="Date"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              label="Time"
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              label="Notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              fullWidth
              margin="normal"
              multiline
              rows={2}
            />
          </form>
        )}
      </DialogContent>
      <DialogActions>
        {success ? (
          <Button onClick={onClose} color="primary" variant="contained">
            Close
          </Button>
        ) : (
          <>
            <Button onClick={onClose} color="secondary">
              Cancel
            </Button>
            <Button
              type="submit"
              form="schedule-form"
              color="primary"
              variant="contained"
              disabled={loading}
            >
              {loading ? "Scheduling..." : "Confirm"}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ScheduleForm;
