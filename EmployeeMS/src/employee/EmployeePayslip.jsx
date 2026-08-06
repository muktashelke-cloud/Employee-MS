import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const today = new Date();

const currentMonthYear = today.toLocaleString("en-US", {
  month: "long",
  year: "numeric",
});

const shortMonth = today.toLocaleString("en-US", {
  month: "short",
});

const currentYear = today.getFullYear();

const lastDate = new Date(currentYear, today.getMonth() + 1, 0).getDate();

const payslipData = {
  company: {
    name: "Nexora Technologies Pvt. Ltd.",
    address: "Level 5, Cyber One, Magarpatta City, Pune – 411028",
    cin: "U72900MH2018PTC123456",
    email: "hr@nexora.in",
    phone: "+91 20 4890 1234",
  },
  employee: {
    name: "Riya Patil",
    id: "EMP001",
    designation: "Software Engineer",
    department: "Engineering",
    doj: "12 Aug 2021",
    pan: "ABCPR1234Z",
    pfAccount: "MH/MUM/12345/999",
    uan: "100987654321",
    bank: "HDFC Bank",
    accountNo: "XXXX XXXX 4812",
    ifsc: "HDFC0001234",
    location: "Pune",
  },
  payPeriod: {
    month: currentMonthYear,

    from: `01 ${shortMonth} ${currentYear}`,

    to: `${String(lastDate).padStart(2, "0")} ${shortMonth} ${currentYear}`,

    payDate: `${String(lastDate).padStart(2, "0")} ${shortMonth} ${currentYear}`,

    workingDays: 26,

    daysPresent: 25,

    daysAbsent: 1,

    leavesUsed: 1,

    totalLeaves: 2,

    overtimeHours: 6,
  },
  earnings: [
    { label: "Basic Salary", amount: 42500 },
    { label: "House Rent Allowance (HRA)", amount: 17000 },
    { label: "Transport Allowance", amount: 3200 },
    { label: "Medical Allowance", amount: 2500 },
    { label: "Special Allowance", amount: 9800 },
    { label: "Performance Bonus", amount: 10000 },
  ],
  deductions: [
    { label: "Provident Fund (PF 12%)", amount: 5100 },
    { label: "Employee State Insurance (ESI)", amount: 638 },
    { label: "Professional Tax", amount: 200 },
    { label: "TDS (Income Tax)", amount: 4722 },
    { label: "Health Insurance Premium", amount: 1300 },
  ],
  ytd: {
    grossEarned: 510000,
    totalDeducted: 71760,
    tdsDeducted: 28332,
    pfContributed: 30600,
    netPaid: 438240,
    monthsProcessed: 6,
  },
};

const fmt = (n) =>
  "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

const initials = (name) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

export default function EmployeePayslip() {
  const printRef = useRef(null);

  const totalEarnings = payslipData.earnings.reduce((s, e) => s + e.amount, 0);
  const totalDeductions = payslipData.deductions.reduce(
    (s, d) => s + d.amount,
    0,
  );
  const netSalary = totalEarnings - totalDeductions;
  const attendancePct = Math.round(
    (payslipData.payPeriod.daysPresent / payslipData.payPeriod.workingDays) *
      100,
  );

  const { company, employee, payPeriod, earnings, deductions, ytd } =
    payslipData;

  const handlePrint = () => {
    window.print();
  };
 const handleDownloadPDF = async () => {

  try {

    console.log("Start");

    const element = printRef.current;

    console.log(element);

    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    });

    console.log("Canvas created");

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = 210;

    const pdfHeight =
      (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      pdfWidth,
      pdfHeight
    );

    console.log("Saving");

    pdf.save("Payslip.pdf");

  } catch (err) {

    console.log(err);

  }

};

  

  return (
    <div className="w-full bg-slate-100 p-6 font-sans print:bg-white print:p-0">
      {/* Toolbar — hidden in print */}
      <div className="max-w-5xl mx-auto mb-6 flex justify-end gap-4 print:hidden">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-8 py-2.5 rounded-2xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-sm"
        >
          <PrintIcon />
          Print
        </button>

        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-8 py-2.5 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-md"
        >
          <DownloadIcon />
          Download PDF
        </button>
      </div>

      {/* Payslip document */}
      <div
        ref={printRef}
        className="max-w-5xl mx-auto bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-200 print:shadow-none print:rounded-none print:border-0"
      >
        {/* ── Header ── */}
        <div className="bg-indigo-700 px-8 py-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
                <BuildingIcon className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">
                {company.name}
              </h2>
            </div>
            <p className="text-indigo-200 text-xs mt-1">{company.address}</p>
            <p className="text-indigo-300 text-xs mt-0.5">
              CIN: {company.cin} &nbsp;·&nbsp; {company.email} &nbsp;·&nbsp;{" "}
              {company.phone}
            </p>
          </div>
          <div className="text-right shrink-0 ml-6">
            <div className="text-white text-xs font-medium uppercase tracking-widest mb-1 opacity-70">
              Pay Slip
            </div>
            <div className="text-3xl font-bold text-white">
              {payPeriod.month}
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 bg-green-400/20 text-green-200 text-xs px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
              Paid · {payPeriod.payDate}
            </div>
          </div>
        </div>

        {/* ── Employee Info ── */}
        <div className="px-8 py-4 border-b border-slate-100">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-base shrink-0">
              {initials(employee.name)}
            </div>
            <div>
              <div className="text-slate-800 font-semibold text-base">
                {employee.name}
              </div>
              <div className="text-slate-500 text-sm">
                {employee.designation} &nbsp;·&nbsp; {employee.department}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-x-6 gap-y-4">
            {[
              ["Employee ID", employee.id],

              ["Date of Joining", employee.doj],

              ["Department", employee.department],

              ["PAN Number", employee.pan],
            ].map(([label, val]) => (
              <div key={label}>
                <div className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">
                  {label}
                </div>
                <div className="text-sm font-medium text-slate-700">{val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Pay Period Info ── */}
        <div className="px-8 py-4 bg-slate-50 border-b border-slate-100 flex flex-wrap gap-x-10 gap-y-2">
          {[
            ["Pay Period", `${payPeriod.from} – ${payPeriod.to}`],
            ["Pay Date", payPeriod.payDate],
            ["Working Days", payPeriod.workingDays],
            ["Days Present", payPeriod.daysPresent],
            ["Days Absent", payPeriod.daysAbsent],
            [
              "Leaves Used",
              `${payPeriod.leavesUsed} / ${payPeriod.totalLeaves}`,
            ],
          ].map(([label, val]) => (
            <div key={label} className="flex items-center gap-2">
              <span className="text-xs text-slate-400">{label}</span>
              <span className="text-xs font-semibold text-slate-700">
                {val}
              </span>
            </div>
          ))}
        </div>

        {/* ── Earnings & Deductions ── */}
        <div className="px-8 py-6 grid grid-cols-2 gap-6 border-b border-slate-100">
          {/* Earnings */}
          <div>
            <SectionTitle
              icon={<PlusIcon />}
              label="Earnings"
              color="text-indigo-600"
            />
            <table className="w-full text-sm mt-3">
              <thead>
                <tr className="text-xs text-slate-400 uppercase tracking-wide">
                  <th className="text-left pb-2 font-medium">Component</th>
                  <th className="text-right pb-2 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {earnings.map((e) => (
                  <tr key={e.label} className="border-t border-slate-100">
                    <td className="py-2 text-slate-600">{e.label}</td>
                    <td className="py-2 text-right font-medium text-slate-700">
                      {fmt(e.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-3 bg-indigo-50 rounded-xl px-4 py-2.5 flex justify-between">
              <span className="text-sm font-semibold text-indigo-700">
                Total Earnings
              </span>
              <span className="text-sm font-bold text-indigo-700">
                {fmt(totalEarnings)}
              </span>
            </div>
          </div>

          {/* Deductions */}
          <div>
            <SectionTitle
              icon={<MinusIcon />}
              label="Deductions"
              color="text-rose-500"
            />
            <table className="w-full text-sm mt-3">
              <thead>
                <tr className="text-xs text-slate-400 uppercase tracking-wide">
                  <th className="text-left pb-2 font-medium">Component</th>
                  <th className="text-right pb-2 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {deductions.map((d) => (
                  <tr key={d.label} className="border-t border-slate-100">
                    <td className="py-2 text-slate-600">{d.label}</td>
                    <td className="py-2 text-right font-medium text-rose-600">
                      {fmt(d.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-3 bg-rose-50 rounded-xl px-4 py-2.5 flex justify-between">
              <span className="text-sm font-semibold text-rose-600">
                Total Deductions
              </span>
              <span className="text-sm font-bold text-rose-600">
                {fmt(totalDeductions)}
              </span>
            </div>
          </div>
        </div>

        {/* ── Net Salary Footer ── */}
        <div className="px-8 py-5 flex items-center justify-between bg-slate-50">
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-widest mb-0.5">
              Net Salary Credited
            </div>
            <div className="text-3xl font-bold text-slate-800">
              {fmt(netSalary)}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <CheckIcon className="w-3.5 h-3.5 text-green-500" />
              Credited to {employee.bank} {employee.accountNo} on{" "}
              {payPeriod.payDate}
            </div>
          </div>
          <div className="text-right">
            <div className="grid grid-cols-3 gap-4">
              <StatMini
                label="Gross"
                value={fmt(totalEarnings)}
                color="text-indigo-600"
              />
              <StatMini
                label="Deductions"
                value={fmt(totalDeductions)}
                color="text-rose-500"
              />
              <StatMini
                label="Net Pay"
                value={fmt(netSalary)}
                color="text-green-600"
              />
            </div>
          </div>
        </div>

        {/* ── Signature ── */}
        <div className="px-8 py-5 border-t border-slate-100 flex justify-between items-end">
          <div>
            <div className="text-xs text-slate-400">
              This is a computer-generated payslip and does not require a
              physical signature.
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              For queries, contact: {company.email}
            </div>
          </div>
          <div className="text-right">
            <div className="w-24 border-b border-slate-300 mb-1" />
            <div className="text-xs text-slate-500 font-medium">
              Authorized Signatory
            </div>
            <div className="text-xs text-slate-400">{company.name}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ── */
function SectionTitle({ icon, label, color }) {
  return (
    <div
      className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest ${color}`}
    >
      <span className="w-4 h-4">{icon}</span>
      {label}
    </div>
  );
}

function StatMini({ label, value, color }) {
  return (
    <div className="text-right">
      <div className="text-xs text-slate-400">{label}</div>
      <div className={`text-sm font-bold ${color}`}>{value}</div>
    </div>
  );
}

/* ── Inline SVG Icons ── */
const BuildingIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 21h16.5M4.5 3h15l.75 18H3.75L4.5 3zM9 21V9m6 12V9M9 9h6M9 6h6M9 3h6"
    />
  </svg>
);
const PlusIcon = () => (
  <svg
    fill="none"
    viewBox="0 0 16 16"
    stroke="currentColor"
    strokeWidth={2}
    className="w-4 h-4"
  >
    <path strokeLinecap="round" d="M8 3v10M3 8h10" />
  </svg>
);
const MinusIcon = () => (
  <svg
    fill="none"
    viewBox="0 0 16 16"
    stroke="currentColor"
    strokeWidth={2}
    className="w-4 h-4"
  >
    <path strokeLinecap="round" d="M3 8h10" />
  </svg>
);
const CalIcon = () => (
  <svg
    fill="none"
    viewBox="0 0 16 16"
    stroke="currentColor"
    strokeWidth={1.5}
    className="w-4 h-4"
  >
    <rect x="2" y="3" width="12" height="11" rx="1.5" />
    <path strokeLinecap="round" d="M2 7h12M5 1v4M11 1v4" />
  </svg>
);
const ChartIcon = () => (
  <svg
    fill="none"
    viewBox="0 0 16 16"
    stroke="currentColor"
    strokeWidth={1.5}
    className="w-4 h-4"
  >
    <path strokeLinecap="round" d="M2 12l3.5-4 3 2.5L12 5l2 2" />
  </svg>
);
const CheckIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 16 16"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l4 4 6-7" />
  </svg>
);
const PrintIcon = () => (
  <svg
    fill="none"
    viewBox="0 0 16 16"
    stroke="currentColor"
    strokeWidth={1.5}
    className="w-4 h-4"
  >
    <path
      strokeLinecap="round"
      d="M4 6V2h8v4M4 12H3a1 1 0 01-1-1V7a1 1 0 011-1h10a1 1 0 011 1v4a1 1 0 01-1 1h-1m-8 0v3h8v-3H4z"
    />
  </svg>
);
const DownloadIcon = () => (
  <svg
    fill="none"
    viewBox="0 0 16 16"
    stroke="currentColor"
    strokeWidth={1.5}
    className="w-4 h-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 3v7m0 0l-3-3m3 3l3-3M3 13h10"
    />
  </svg>
);
