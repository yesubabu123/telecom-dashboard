import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import "./App.css";

const API_BASE = process.env.REACT_APP_API_URL;
function App() {
  const [simInventory, setSimInventory] = useState([]);
  const [phoneSearch, setPhoneSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [providerFilter, setProviderFilter] = useState("");
  const [summary, setSummary] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchSims = async () => {
    setLoading(true);
    setError("");

    try {
      const [simResponse, summaryResponse] = await Promise.all([
        axios.get(API_BASE),
        axios.get(`${API_BASE}/summary`),
      ]);

      setSimInventory(Array.isArray(simResponse.data) ? simResponse.data : []);
      setSummary(summaryResponse.data || {});
    } catch (err) {
      console.error(err);
      setSimInventory([]);
      setSummary({});
      setError("Backend connection failed. Start the server and refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSims();
  }, []);

  const providerOptions = useMemo(() => {
    return Array.from(
      new Set(simInventory.map((sim) => sim.provider || "Nexa"))
    ).sort();
  }, [simInventory]);

  const searchSim = async () => {
    if (!phoneSearch.trim()) {
      setError("Enter a phone number to search.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.get(`${API_BASE}/${phoneSearch.trim()}`);
      setSimInventory([res.data]);
      setSelectedDate("");
      setProviderFilter("");
    } catch {
      setError("No matching SIM record was found.");
      setSimInventory([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (phoneNumber, status) => {
    const newStatus = status === "active" ? "inactive" : "active";

    try {
      await axios.put(`${API_BASE}/update/${phoneNumber}`, {
        status: newStatus,
      });
      fetchSims();
    } catch (err) {
      console.error(err);
      setError("Unable to update the SIM status right now.");
    }
  };

  const getIssue = (sim) => {
    if (sim.alertLevel === "critical") return "Critical";
    if (sim.networkSpeed < 10) return "Low Speed";
    if (sim.latency > 100) return "High Latency";
    if (sim.signalStrength < 30) return "Low Signal";
    return "Stable";
  };

  const filteredSims = simInventory.filter((sim) => {
    const dateMatches = selectedDate
      ? new Date(sim.createdAt).toISOString().split("T")[0] === selectedDate
      : true;
    const providerMatches = providerFilter
      ? (sim.provider || "Nexa") === providerFilter
      : true;
    return dateMatches && providerMatches;
  });

  const totalSims = simInventory.length;
  const activeSims = simInventory.filter((sim) => sim.status === "active").length;
  const issueCount = filteredSims.filter((sim) => getIssue(sim) !== "Stable").length;
  const averageThroughput = filteredSims.length
    ? filteredSims.reduce((sum, sim) => sum + (sim.throughput || 0), 0) / filteredSims.length
    : 0;
  const healthScore = Math.max(
    0,
    Math.min(100, Math.round(90 - issueCount * 12 + averageThroughput / 2))
  );

  const chartData = {
    labels: filteredSims.map((sim) => sim.phoneNumber),
    datasets: [
      {
        label: "Throughput (Mbps)",
        data: filteredSims.map((sim) => sim.throughput || 0),
        backgroundColor: "rgba(56, 189, 248, 0.75)",
        borderColor: "#38bdf8",
        borderWidth: 2,
        borderRadius: 10,
      },
    ],
  };

  return (
    <div className="app-shell">
      <header className="hero-card">
        <div>
          <p className="eyebrow">SignalFlow Operations</p>
          <h1>Telecom Pulse Dashboard</h1>
          <p className="subtitle">
            Monitor SIM inventory, provider performance, and network health from one operations center.
          </p>
        </div>

        <div className="time-pill">
          <div>📅 {currentTime.toLocaleDateString()}</div>
          <div className="time-pill__time">⏰ {currentTime.toLocaleTimeString()}</div>
        </div>
      </header>

      <section className="stats-grid stats-grid--wide">
        <div className="stat-card accent-blue">
          <span>Total SIMs</span>
          <strong>{totalSims}</strong>
        </div>
        <div className="stat-card accent-green">
          <span>Active SIMs</span>
          <strong>{activeSims}</strong>
        </div>
        <div className="stat-card accent-amber">
          <span>Open alerts</span>
          <strong>{issueCount}</strong>
        </div>
        <div className="stat-card accent-indigo">
          <span>Health score</span>
          <strong>{healthScore}%</strong>
        </div>
      </section>

      <section className="controls-card">
        <div className="controls-row">
          <input
            className="input-field"
            placeholder="Search by phone number"
            value={phoneSearch}
            onChange={(e) => setPhoneSearch(e.target.value)}
          />
          <button className="primary-btn" onClick={searchSim}>
            Search
          </button>
          <button className="secondary-btn" onClick={fetchSims}>
            Refresh
          </button>
        </div>

        <div className="controls-row filter-row">
          <div>
            <label className="date-label" htmlFor="dateFilter">
              Filter by date
            </label>
            <input
              id="dateFilter"
              className="input-field input-field--date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <div>
            <label className="date-label" htmlFor="providerFilter">
              Provider
            </label>
            <select
              id="providerFilter"
              className="input-field"
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value)}
            >
              <option value="">All providers</option>
              {providerOptions.map((provider) => (
                <option key={provider} value={provider}>
                  {provider}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {error && <div className="status-banner">{error}</div>}

      {loading ? (
        <div className="loading-card">Loading operational data...</div>
      ) : (
        <>
          <section className="chart-card">
            <div className="card-title">Provider throughput overview</div>
            <div className="chart-wrapper">
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { labels: { color: "#e2e8f0" } },
                  },
                  scales: {
                    x: { ticks: { color: "#cbd5e1" }, grid: { color: "rgba(255,255,255,0.08)" } },
                    y: { ticks: { color: "#cbd5e1" }, grid: { color: "rgba(255,255,255,0.08)" } },
                  },
                }}
              />
            </div>
          </section>

          <section className="table-card">
            {filteredSims.length === 0 ? (
              <div className="empty-state">No SIM records match the filter.</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Phone</th>
                    <th>Provider</th>
                    <th>Region</th>
                    <th>Status</th>
                    <th>Speed</th>
                    <th>Throughput</th>
                    <th>Latency</th>
                    <th>Signal</th>
                    <th>Alert</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSims.map((sim, index) => {
                    const issue = getIssue(sim);
                    return (
                      <tr key={`${sim.phoneNumber}-${index}`}>
                        <td>{sim.phoneNumber}</td>
                        <td>{sim.provider || "Nexa"}</td>
                        <td>{sim.region || "Central"}</td>
                        <td>
                          <span
                            className={`status-badge ${sim.status === "active" ? "status-active" : "status-inactive"}`}
                          >
                            {sim.status}
                          </span>
                        </td>
                        <td>{sim.networkSpeed} Mbps</td>
                        <td>{sim.throughput || 0} Mbps</td>
                        <td>{sim.latency} ms</td>
                        <td>{sim.signalStrength}%</td>
                        <td>
                          <span
                            className={`issue-badge ${issue === "Stable" ? "issue-good" : "issue-alert"}`}
                          >
                            {issue}
                          </span>
                        </td>
                        <td>
                          <button
                            className={`action-btn ${sim.status === "active" ? "action-block" : "action-unblock"}`}
                            onClick={() => toggleStatus(sim.phoneNumber, sim.status)}
                          >
                            {sim.status === "active" ? "Block" : "Unblock"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default App;