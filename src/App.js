import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([...data]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [lastPage, setLastPage] = useState(0);
  const itemsPerPage = 10;

  const fetchData = async () => {
    const url =
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";
    try {
      const res = await axios.get(url);
      setData(res.data);
      setFilteredData(res.data);
      return res.data;
    } catch (error) {
      console.log("Error fetching forecast data:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchData().then((data) => pagination(data));
  }, []);

  useEffect(() => {
    pagination(data);
  }, [currentPage]);

  const pagination = (data) => {
    setData(data);
    const start = currentPage * itemsPerPage,
      end = (currentPage + 1) * itemsPerPage;
    const newData = data.slice(start, end);
    setFilteredData(newData);
    const len = data.length;
    setLastPage(len < itemsPerPage ? 0 : Math.ceil(len / itemsPerPage) - 1);
  };

  const handleDelete = (arr, deleteSelectedFlag) => {
    if (deleteSelectedFlag === false) {
      const check = selectedRows.includes(arr[0]);
      if (check)
        setSelectedRows((prev) => prev.filter((item) => item !== arr[0]));
    }
    const newData = data.filter((item) => !arr.includes(item.id));

    if (deleteSelectedFlag === true) setSelectedRows([]);
    pagination(newData);
  };

  const handleSelect = (id) => {
    const check = selectedRows.includes(id);
    if (check) {
      setSelectedRows((prev) => prev.filter((val) => val !== id));
    } else {
      setSelectedRows((prev) => prev.concat([id]));
    }
  };

  useEffect(() => {
    console.log(selectedRows);
  }, [selectedRows]);

  return (
    <div className="wrapper">
      <div className="search-bar">
        <input className="search-i" type={"text"} placeholder="Search"></input>
        <button className="search-icon">search</button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData &&
            filteredData.map((row) => (
              <tr key={row.id}>
                <td>
                  <input
                    type="checkbox"
                    onChange={() => handleSelect(row.id)}
                  />
                </td>
                <td>{row.id}</td>
                <td>{row.name}</td>
                <td>{row.email}</td>
                <td>{row.role}</td>
                <td>
                  <button>Edit</button>
                  <button onClick={() => handleDelete([row.id], false)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <div className="paginator">
        <button className="first-page" onClick={() => setCurrentPage(0)}>
          First
        </button>
        <button
          className="previous-page"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
        >
          Previous
        </button>
        <button
          className="next-page"
          onClick={() => {
            console.log(lastPage);
            setCurrentPage((prev) => Math.min(prev + 1, lastPage));
          }}
        >
          Next
        </button>
        <button className="last-page" onClick={() => setCurrentPage(lastPage)}>
          Last
        </button>
        <button onClick={() => handleDelete(selectedRows, true)}>
          Delete Selected
        </button>
      </div>
    </div>
  );
}

export default App;
