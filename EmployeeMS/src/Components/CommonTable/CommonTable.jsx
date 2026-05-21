import { useState } from "react";
import "./CommonTable.css";

const CommonTable = ({
  leftContent,
  columns = [],
  data = [],
  tableClass = "",
  renderRow,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const [entriesPerPage, setEntriesPerPage] = useState(5);

  const indexOfLast = currentPage * entriesPerPage;

  const indexOfFirst = indexOfLast - entriesPerPage;

  const currentData = data.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.max(1, Math.ceil(data.length / entriesPerPage));

  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="common-table-card">
      {/* TOPBAR */}

      <div className="table-topbar">
        {/* LEFT TITLE BOX */}

        <div className="table-left-content">{leftContent}</div>
        {/* RIGHT ENTRIES */}

        <div className="table-right-content">
          <div className="entries-box">
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="common-table-wrapper">
        <div className="common-table-wrapper">
          <table className={`common-table ${tableClass}`}>
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th key={index}>
                    {typeof col === "string" ? col : col.header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {currentData.length > 0 ? (
                renderRow ? (
                  currentData.map((item, index) => renderRow(item, index))
                ) : (
                  currentData.map((item, index) => (
                    <tr key={index}>
                      {columns.map((col, i) => (
                        <td key={i}>
                          {col.render ? col.render(item) : item[col.accessor]}
                        </td>
                      ))}
                    </tr>
                  ))
                )
              ) : (
                <tr>
                  <td colSpan={columns.length} className="no-data">
                    No Data Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}

      <div className="pagination-wrapper">
        <div className="pagination">
          {pageNumbers.map((num) => (
            <button
              key={num}
              className={currentPage === num ? "active" : ""}
              onClick={() => setCurrentPage(num)}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommonTable;
