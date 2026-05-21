import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";   // ✅ use api

const Category = () => {
  const [category, setCategory] = useState([]);

  useEffect(() => {
    api.get("/auth/category")   // ✅ changed
      .then((result) => {
        console.log("FULL RESPONSE:", result.data);

        if (result.data.status === true) {
          setCategory(result.data.result);
        } else {
          alert(result.data.message || "No data found");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Server error");
      });
  }, []);

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Category List</h3>
      </div>

      <Link to="/dashboard/add_category" className="btn btn-success">
        Add Category
      </Link>

      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
            </tr>
          </thead>

          <tbody>
            {category.map((c, index) => (
              <tr key={index}>
                <td>{c.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Category;