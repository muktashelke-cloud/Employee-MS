import api from "../utils/api";

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  CalendarDays,
  CalendarRange,
  FileText,
  CircleCheckBig,
  Clock3,
  CircleX,
} from "lucide-react";
const ApplyModal = ({ isOpen, onClose, onSubmit }) => {
  const today = new Date();

  const [selectedType, setSelectedType] = useState("Casual Leave");

  const [form, setForm] = useState({
    from: today.toISOString().split("T")[0],

    to: today.toISOString().split("T")[0],

    reason: "",

    files: [],
  });

  const leaveTypes = [
    "Casual Leave",
    "Sick Leave",
    "Annual Leave",
    "Maternity Leave",
    "Unpaid Leave",
  ];
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length > 5) {
      alert("Maximum 5 files allowed");

      return;
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    const validFiles = [];

    for (let file of selectedFiles) {
      if (!allowedTypes.includes(file.type)) {
        alert(`${file.name} format not supported`);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} exceeds 5MB`);
        continue;
      }

      validFiles.push(file);
    }

    setForm({
      ...form,
      files: validFiles,
    });
  };

  const handleSubmit = () => {
    console.log(form.files);
    if (!selectedType) {
      return alert("Please select leave type");
    }

    if (!form.from) {
      return alert("Please select From Date");
    }

    if (!form.to) {
      return alert("Please select To Date");
    }

    if (new Date(form.to) < new Date(form.from)) {
      return alert("To Date cannot be before From Date");
    }

    if (!form.reason.trim()) {
      return alert("Please enter reason");
    }

    if (
      (selectedType === "Sick Leave" || selectedType === "Maternity Leave") &&
      form.files.length === 0
    ) {
      return alert("Supporting document is required");
    }

    onSubmit({
      type: selectedType,

      from: form.from,

      to: form.to,

      reason: form.reason,

      files: form.files,
    });

    setForm({
      from: today.toISOString().split("T")[0],

      to: today.toISOString().split("T")[0],

      reason: "",

      files: [],
    });

    setSelectedType("Casual Leave");
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm overflow-hidden p-3"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-lg mx-auto shadow-2xl animate-[slideUp_0.25s_ease] my-2 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <CalendarRange
                size={20}
                className="text-indigo-600"
                strokeWidth={2}
              />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                Apply Leave Request
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Fill in the details to submit your leave
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all text-sm"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-3 space-y-3">
          {/* Leave Type Pills */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Leave Type
            </label>
            <div className="flex flex-wrap gap-2">
              {leaveTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    selectedType === type
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : "border-slate-200 text-slate-500 bg-slate-50 hover:border-indigo-300 hover:text-indigo-500"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Date Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                From Date
              </label>
              <DatePicker
                selected={form.from ? new Date(form.from) : null}
                onChange={(date) =>
                  setForm({
                    ...form,
                    from: date.toISOString().split("T")[0],
                  })
                }
                minDate={new Date()}
                dateFormat="dd-MM-yyyy"
                placeholderText="Select date"
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                To Date
              </label>
              <DatePicker
                selected={form.to ? new Date(form.to) : null}
                onChange={(date) =>
                  setForm({
                    ...form,
                    to: date.toISOString().split("T")[0],
                  })
                }
                minDate={new Date(form.from)}
                dateFormat="dd-MM-yyyy"
                placeholderText="Select date"
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5"
              />
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Reason for Leave
            </label>
            <textarea
              value={form.reason}
              onChange={(e) =>
                setForm({
                  ...form,
                  reason: e.target.value,
                })
              }
              placeholder="Briefly describe the reason for your leave request"
              rows={3}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 bg-slate-50 focus:outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all resize-none placeholder-slate-300"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Supporting Document{" "}
              {selectedType === "Sick Leave" ||
              selectedType === "Maternity Leave" ? (
                <span className="text-red-500 font-normal normal-case">
                  (required)
                </span>
              ) : (
                <span className="text-slate-300 font-normal normal-case">
                  (optional)
                </span>
              )}
            </label>
            <label className="flex flex-col items-center justify-center gap-1 border-2 border-dashed border-indigo-200 rounded-xl py-3 bg-indigo-50/40 cursor-pointer hover:bg-indigo-50 hover:border-indigo-400 transition-all group">
              <span className="text-2xl">☁️</span>

              <p className="text-xs text-slate-500">
                <span className="text-indigo-600 font-semibold group-hover:underline">
                  Click to upload
                </span>{" "}
                or drag & drop
              </p>

              <p className="text-xs text-slate-400">PDF, JPG, PNG up to 5MB</p>

              {form.files.length > 0 && (
                <div className="mt-2 text-xs text-indigo-600">
                  {form.files.map((file, index) => (
                    <div key={index}>📎 {file.name}</div>
                  ))}
                </div>
              )}

              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-500 hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-[2] py-2.5 rounded-xl bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>✈</span> Submit Request
          </button>
        </div>
      </div>

      <style>{`@keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
    </div>
  );
};

const Leave = () => {
  const [leaves, setLeaves] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const isDashboardApply = params.get("apply") === "true";

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (params.get("apply") === "true") {
      setShowModal(true);
    }
  }, [location]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);

  /* ================= FILTER ================= */

  const filteredLeaves = leaves.filter((leave) => {
    const searchText = search.toLowerCase();

    return (
      leave.reason.toLowerCase().includes(searchText) ||
      leave.status.toLowerCase().includes(searchText) ||
      new Date(leave.from_date)
        .toLocaleDateString("en-IN")
        .includes(searchText) ||
      new Date(leave.to_date).toLocaleDateString("en-IN").includes(searchText)
    );
  });

  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;

  const currentLeaves = filteredLeaves.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredLeaves.length / entriesPerPage);

  /* ================= FETCH LEAVES ================= */

  const fetchLeaves = async () => {
    try {
      const res = await api.get("/attendance/all-leaves");

      if (res.data.status) {
        setLeaves(res.data.result);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  /* ================= DATE FORMAT ================= */

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* ================= UI ================= */

  return (
    <div
      className="page-container w-full"
      style={{
        padding: 0,
        margin: 0,
        width: "100%",
      }}
    >
      <div
        className="employee-page-card w-full"
        style={{
          width: "100%",
          maxWidth: "100%",
          padding: 0,
          margin: 0,
          background: "transparent",
          boxShadow: "none",
          border: "none",
        }}
      >
        <div className="leave-container w-[97%] mx-auto px-0 mt-1 text-sm">
          <ApplyModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onSubmit={async (data) => {
              const formData = new FormData();

              formData.append("leave_type", data.type);

              formData.append("from_date", data.from);

              formData.append("to_date", data.to);

              formData.append("reason", data.reason);

              if (data.files?.length) {
                data.files.forEach((file) => {
                  formData.append("documents", file);
                });
              }
              try {
                const res = await api.post("/attendance/apply-leave", formData);

                if (res.data.status) {
                  alert("Leave Applied Successfully");

                  fetchLeaves();

                  setShowModal(false);
                } else {
                  alert("Leave Apply Failed");
                }
              } catch (err) {
                console.log(err);
              }
            }}
          />
          <div className="grid grid-cols-4 gap-2 mt-2 mb-2 w-full">
            {/* Total */}
            <div
              className="
bg-white
rounded-2xl
p-3
h-[105px]
border border-slate-200
overflow-hidden
shadow-md
hover:shadow-xl
transition-all duration-300
relative
"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Total Requests
                  </p>

                  <h2 className="text-[36px] font-bold text-slate-900 mt-0">
                    {leaves.length}
                  </h2>
                </div>

                <FileText
                  size={30}
                  strokeWidth={1.6}
                  className="text-slate-500 mt-1 flex-shrink-0"
                />
              </div>
              <p className="text-[12px] text-slate-400 -mt-1">submitted</p>
              <div className="absolute bottom-0 left-0 w-full h-[4px] bg-slate-500 rounded-t-2xl"></div>
            </div>

            {/* Approved */}
            <div
              className="
bg-white
rounded-2xl
p-3
overflow-hidden
h-[105px]
border border-slate-200
shadow-md
hover:shadow-xl
transition-all duration-300
relative
"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-medium text-slate-500">Approved</p>

                  <h2 className="text-[36px] font-bold text-slate-900 mt-2">
                    {
                      leaves.filter(
                        (l) => l.status.toLowerCase() === "approved",
                      ).length
                    }
                  </h2>
                </div>

                <CircleCheckBig
                  size={30}
                  strokeWidth={1.8}
                  className="text-green-500"
                />
              </div>
              <p className="text-[12px] text-slate-400 -mt-1">completed</p>

              <div className="absolute bottom-0 left-0 w-full h-[4px] bg-green-500 rounded-t-2xl"></div>
            </div>
            {/* Pending */}
            <div
              className="
bg-white
rounded-2xl
p-3
h-[105px]
overflow-hidden
border border-slate-200
shadow-md
hover:shadow-xl
transition-all duration-300
relative
"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-medium text-slate-500">Pending</p>

                  <h2 className="text-[36px] font-bold text-slate-900 mt-1">
                    {
                      leaves.filter((l) => l.status.toLowerCase() === "pending")
                        .length
                    }
                  </h2>
                </div>

                <Clock3
                  size={30}
                  strokeWidth={1.8}
                  className="text-amber-500"
                />
              </div>
              <p className="text-[12px] text-slate-400 -mt-1">awaiting</p>
              <div className="absolute bottom-0 left-0 w-full h-[4px] bg-amber-500 rounded-t-2xl"></div>
            </div>

            {/* Rejected */}
            <div
              className="
bg-white
rounded-2xl
p-3
h-[105px]
overflow-hidden
border border-slate-200
shadow-md
hover:shadow-xl
transition-all duration-300
relative
"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-medium text-slate-500">Rejected</p>

                  <h2 className="text-[36px] font-bold text-slate-900 mt-1">
                    {
                      leaves.filter(
                        (l) => l.status.toLowerCase() === "rejected",
                      ).length
                    }
                  </h2>
                </div>

                <CircleX size={30} strokeWidth={1.8} className="text-red-500" />
              </div>
              <p className="text-[12px] text-slate-400 -mt-1">declined</p>
              <div className="absolute bottom-0 left-0 w-full h-[4px] bg-red-500 rounded-t-2xl"></div>
            </div>
          </div>

          {/* ===== TABLE ===== */}
          <div className="leave-table-section"></div>
          {/* ===== TABLE CARD ===== */}
          <div className="mt-2 bg-white rounded-xl border border-slate-100 shadow-[0_12px_40px_rgba(15,23,42,0.08)] overflow-hidden">
            {/* Filters Row */}

            <div className="px-4 py-3 flex items-center justify-between gap-2 border-b border-slate-100">
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2.5 flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50"
              >
                + Apply Leave Request
              </button>

              <div className="flex items-center gap-2">
                <select
                  value={entriesPerPage}
                  onChange={(e) => {
                    setEntriesPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2.5 border border-slate-200 rounded-xl outline-none"
                >
                  <option value={5}>5 </option>
                  <option value={10}>10 </option>
                  <option value={15}>15 </option>
                  <option value={20}>20 </option>
                </select>

                <input
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-[240px] px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
              
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    className="text-white"
                    style={{
                      background:
                        "linear-gradient(90deg,#243b67 0%,#31466e 50%,#415b8c 100%)",
                    }}
                  >
                    <th className="text-white px-5 py-3 text-left font-semibold">
                      From Date
                    </th>
                    <th className="text-white px-6 py-3 text-left font-semibold">
                      Leave Type
                    </th>
                    <th className="text-white px-6 py-3 text-left font-semibold">
                      To Date
                    </th>

                    <th className="text-white px-6 py-3 text-left font-semibold">
                      Reason
                    </th>

                    <th className="text-white px-6 py-3 text-left font-semibold">
                      Document
                    </th>

                    <th className="text-white px-6 py-3 xt-left font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {currentLeaves.map((leave) => {
                    const status = leave.status.toLowerCase();

                    return (
                      <tr
                        key={leave.id}
                        className="border-b border-slate-100 hover:bg-slate-50 transition"
                      >
                        {/* From Date */}

                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <CalendarDays
                              size={18}
                              strokeWidth={1.8}
                              className="text-slate-500"
                            />

                            <div>
                              <p className="font-medium text-slate-800">
                                {formatDate(leave.from_date)}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Leave Type */}

                        <td className="px-6 py-3">{leave.leave_type}</td>

                        {/* To Date */}

                        <td className="px-6 py-3 font-medium text-slate-700">
                          {formatDate(leave.to_date)}
                        </td>

                        {/* Reason */}

                        <td className="px-6 py-3 text-slate-700">
                          {leave.reason}
                        </td>

                        {/* Document */}

                        <td className="px-6 py-3">
                          {leave.document ? (
                            <div className="flex flex-col gap-1">
                              {leave.document
                                .split(",")

                                .map((doc, index) => (
                                  <button
                                    key={index}
                                    onClick={() =>
                                      setPreviewFile(
                                        `http://localhost:5000/${doc}`,
                                      )
                                    }
                                    className="text-blue-600 text-xs font-medium hover:underline text-left"
                                  >
                                    📎 File {index + 1}
                                  </button>
                                ))}
                            </div>
                          ) : (
                            <span className="text-slate-400">No File</span>
                          )}
                        </td>

                        {/* Status */}

                        <td className="px-6 py-3">
                          <span
                            className={`px-3 py-0.5 rounded-full text-[11px] font-semibold

${
  status === "approved"
    ? "bg-green-50 text-green-600"
    : status === "pending"
      ? "bg-amber-50 text-amber-600"
      : "bg-red-50 text-red-600"
}`}
                          >
                            {leave.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            

            <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
              <p className="text-sm text-slate-500">
                Showing {filteredLeaves.length === 0 ? 0 : indexOfFirst + 1} to{" "}
                {Math.min(indexOfLast, filteredLeaves.length)} of{" "}
                {filteredLeaves.length} entries
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => p - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>

                <span className="px-3 py-1 text-sm font-medium">
                  {currentPage} / {totalPages || 1}
                </span>

                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              
            </div>
            {previewFile && (
  <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center">
    <div className="bg-white rounded-2xl w-[700px] h-[500px] relative p-6 shadow-2xl">

      <button
        onClick={() => setPreviewFile(null)}
        className="absolute top-3 right-4 text-2xl font-bold z-10"
      >
        ✕
      </button>

      {previewFile.endsWith(".pdf") ? (

        <iframe
          src={previewFile}
          title="pdf"
          className="w-full h-full"
        />

      ) : (

        <img
          src={previewFile}
          alt="preview"
          className="w-full h-full object-contain"
        />

      )}

    </div>
  </div>
)}
          </div>
        </div>
        
      </div>
      
    </div>
  );
};

export default Leave;
