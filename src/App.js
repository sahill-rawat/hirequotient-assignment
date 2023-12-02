import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { FaSave, FaEdit } from "react-icons/fa";
import Pagination from "react-js-pagination";

function App() {

  const itemsPerPage = 10;
  const [data, setData] = useState([]);
  const [dataToRender, setDataToRender] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [lastPage, setLastPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [editableRows, setEditableRows] = useState([]);
  const [filteredData, setFilteredData] = useState([...data]);

  const toggleRowEditable = (index) => {
    setEditableRows((prevRows) =>
      prevRows.map((value, idx) => (idx === index ? !value : value))
    );
  };

  const fetchData = async () => {
    const url =
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";
    try {
      const res = await axios.get(url);
      setData(res.data);
      setDataToRender(res.data);
      return res.data;
    } catch (error) {
      console.log("Error fetching forecast data:", error);
      throw error;
    }
  };

  const calculateTotalPages = (len) => (len < itemsPerPage ? 0 : Math.ceil(len / itemsPerPage) - 1);
  
  const pagination = (data) => {
    const start = currentPage * itemsPerPage,
    end = (currentPage + 1) * itemsPerPage;
    const newData = data.slice(start, end);
    setFilteredData(newData);
    setLastPage(calculateTotalPages(data.length));
  };

  const handleSearchInputChange = () => {
    const filtered = data.filter((row) => {
      return Object.values(row).some((value) =>
        value.toString().toLowerCase().startsWith(searchInput.toLowerCase())
      );
    });
    setDataToRender(filtered);
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
    setDataToRender(newData);
    pagination(newData);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber - 1);
  };

  const handleSelect = (id) => {
    const check = selectedRows.includes(id);
    if (check) {
      setSelectedRows((prev) => prev.filter((val) => val !== id));
    } else {
      setSelectedRows((prev) => prev.concat([id]));
    }
  };

  const handleSelectAll = (selectAll) => {
    const allIds = filteredData.map((item) => item.id);

    if (selectedRows.length === allIds.length) {
      setSelectedRows([]);
      setSelectAll(false);
      setEditableRows(filteredData.map(() => false));
    } else {
      setSelectedRows(allIds);
      setSelectAll(true);
      setEditableRows(filteredData.map(() => true));
    }
  };

  const handleInputChange = (id, columnName, newValue) => {
    const updatedData = data.map((row) => {
      if (row.id === id) {
        return { ...row, [columnName]: newValue };
      }
      return row;
    });
    setData(updatedData);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchInputChange();
    }
  };

  const handleKeyPressForTable = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      toggleRowEditable(index);
    }
  };

  useEffect(() => {
    fetchData().then((data) => pagination(data));
  }, []);

  useEffect(() => {
    setEditableRows(filteredData.map(() => false));
  }, [filteredData]);

  useEffect(() => {
    pagination(dataToRender);
  }, [currentPage]);

  useEffect(() => {
    console.log(selectedRows);
  }, [selectedRows]);

  const doit = () => {
    if (searchInput) {
      // console.log("triiggg " + filteredData.length);

        console.log("page - " + calculateTotalPages(dataToRender.length));
        return calculateTotalPages(dataToRender.length);
    }
    return lastPage;
  }

  return (
    <div className="wrapper">

      <div className="header">
        <div className="search-bar">
          <input
            className="search-i"
            type={"text"}
            placeholder="Search"
            value={searchInput}
            onKeyDown={handleKeyPress}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button
          className="search-icon"
          onClick={() => handleSearchInputChange()}
        >
          search
        </button>
        </div>
        <button className="top-delete-btn" onClick={() => handleDelete(selectedRows, true)}>
          <AiFillDelete />
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th className="width-1">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </th>
            <th className="width-1">ID</th>
            <th className="width-2">Name</th>
            <th className="width-2">Email</th>
            <th className="width-2">Role</th>
            <th className="width-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredData &&
            filteredData.map((row, index) => (
              <tr id="ht" key={row.id}>
                <td>
                  <input
                    type="checkbox"
                    onChange={(e) => handleSelect(row.id)}
                    checked={selectedRows.includes(row.id)}
                  />
                </td>
                <td>
                  <input
                    className="input-style"
                    type="text"
                    readOnly={!editableRows[index]}
                    defaultValue={row.id}
                    onKeyDown={(e) => handleKeyPressForTable(e, index)}
                    onChange={(e) =>
                      handleInputChange(row.id, "id", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    className="input-style"
                    type="text"
                    readOnly={!editableRows[index]}
                    defaultValue={row.name}
                    onKeyDown={(e) => handleKeyPressForTable(e, index)}
                    onChange={(e) =>
                      handleInputChange(row.id, "name", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    className="input-style"
                    type="text"
                    readOnly={!editableRows[index]}
                    defaultValue={row.email}
                    onKeyDown={(e) => handleKeyPressForTable(e, index)}
                    onChange={(e) =>
                      handleInputChange(row.id, "email", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    className="input-style"
                    type="text"
                    readOnly={!editableRows[index]}
                    defaultValue={row.role}
                    onKeyDown={(e) => handleKeyPressForTable(e, index)}
                    onChange={(e) =>
                      handleInputChange(row.id, "role", e.target.value)
                    }
                  />
                </td>
                <td className="center">
                  <button
                    className="edit-save"
                    onClick={() => toggleRowEditable(index)}
                  >
                    {!editableRows[index] ? <FaEdit /> : <FaSave />}
                  </button>
                  <button
                    className="delete"
                    onClick={() => handleDelete([row.id], false)}
                  >
                    <AiFillDelete />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <div className="paginator">
      <Pagination
          innerClass='flex'
          item-class='nav-btn'
          itemClassFirst='first-page'
          itemClassPrev='prev-page'
          itemClassNext='next-page'
          itemClassLast='last-page'
          activePage={currentPage+1}
          itemsCountPerPage={10}
          totalItemsCount={dataToRender.length}
          pageRangeDisplayed={Math.min(5, doit()+1)}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default App;
