import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";

function App() {


  const itemsPerPage = 10;
  const [data, setData] = useState([]);
  const [lastPage, setLastPage] = useState(0);
  const [readOnly, setReadOnly] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [filteredData, setFilteredData] = useState([...data]);

  const toggleReadOnly = () => {
    setReadOnly((prevReadOnly) => !prevReadOnly);
  };

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

  const pagination = (data) => {
    const start = currentPage * itemsPerPage,
      end = (currentPage + 1) * itemsPerPage;
    const newData = data.slice(start, end);
    setFilteredData(newData);
    const len = data.length;
    setLastPage(len < itemsPerPage ? 0 : Math.ceil(len / itemsPerPage) - 1);
  };

  const handleSearchInputChange = () => {
    const filtered = data.filter((row) => {
      return Object.values(row).some((value) =>
        value.toString().toLowerCase().startsWith(searchInput.toLowerCase())
      );
    });
    pagination(filtered);
  };

  const handleDelete = (arr, deleteSelectedFlag) => {
    if (deleteSelectedFlag === false) {
      const check = selectedRows.includes(arr[0]);
      if (check)
        setSelectedRows((prev) => prev.filter((item) => item !== arr[0]));
    }
    const newData = data.filter((item) => !arr.includes(item.id));

    if (deleteSelectedFlag === true) setSelectedRows([]);
    setData(newData);
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

  const handleInputChange = (id, columnName, newValue) => {
    const updatedData = data.map((row) => {
      if (row.id === id) {
        return { ...row, [columnName]: newValue };
      }
      return row;
    });

    pagination(updatedData);
  };

  useEffect(() => {
    fetchData().then((data) => pagination(data));
  }, []);

  useEffect(() => {
    pagination(data);
  }, [currentPage]);

  return (
    <div className="wrapper">
      <div className="search-bar">
        <input
          className="search-i"
          type={"text"}
          placeholder="Search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button
          className="search-icon"
          onClick={() => handleSearchInputChange()}
        >
          search
        </button>
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
                    onChange={(e) => handleSelect(row.id)}
                  />
                </td>
                <td>
                  <input
                    style={{ width: "5vw" }}
                    type="text"
                    readOnly={readOnly}
                    defaultValue={row.id}
                    onChange={(e) =>
                      handleInputChange(row.id, "id", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    readOnly={readOnly}
                    defaultValue={row.name}
                    onChange={(e) =>
                      handleInputChange(row.id, "name", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    readOnly={readOnly}
                    defaultValue={row.email}
                    onChange={(e) =>
                      handleInputChange(row.id, "email", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    readOnly={readOnly}
                    defaultValue={row.role}
                    onChange={(e) =>
                      handleInputChange(row.id, "role", e.target.value)
                    }
                  />
                </td>
                <td>
                  <button onClick={toggleReadOnly}>
                    {readOnly ? "Edit" : "Save"}
                  </button>
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
