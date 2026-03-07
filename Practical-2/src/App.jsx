import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const Api_Url = ["http://localhost:3001", "http://localhost:3000"];

const initialForm = {
  name: "",
  email: "",
  phone: "",
  image: ""
};

function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function validateForm(values) {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = "Name is required";
  } else if (values.name.trim().length < 3) {
    errors.name = "Name must be at least 3 characters";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Enter a valid email";
  }

  if (!values.phone.trim()) {
    errors.phone = "Phone is required";
  } else if (!/^\d+$/.test(values.phone.trim())) {
    errors.phone = "Only numbers are allowed";
  }

  if (!values.image.trim()) {
    errors.image = "Image URL is required";
  } else if (!isValidUrl(values.image.trim())) {
    errors.image = "Enter a valid online image URL";
  }

  return errors;
}

export default function App() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [apiBaseUrl, setApiBaseUrl] = useState(Api_Url[0]);

  const RunServer = async (action) => {
    const candidates = [
      apiBaseUrl,
      ...Api_Url.filter((base) => base !== apiBaseUrl)
    ];
    let lastError;

    for (const base of candidates) {
      try {
        const result = await action(base);
        if (base !== apiBaseUrl) {
          setApiBaseUrl(base);
        }
        setRequestError("");
        return result;
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError;
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await RunServer((base) =>
        axios.get(`${base}/users`)
      );
      setRecords(response.data);
    } catch (error) {
      console.error("Failed to load users:", error);
      setRequestError(
        "Cannot connect to JSON server. Start backend with: npm run server"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const activeRecords = useMemo(
    () => records.filter((item) => item.status !== false),
    [records]
  );

  const filteredRecords = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return activeRecords;
    return activeRecords.filter((item) =>
      [item.name, item.email, item.phone]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [activeRecords, search]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  const paginatedRecords = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, page, pageSize]);

  const handleInput = (event) => {
    const { name, value } = event.target;
    if (name === "phone") {
      const onlyDigits = value.replace(/\D/g, "");
      setForm((prev) => ({ ...prev, [name]: onlyDigits }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setErrors({});
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      image: form.image.trim(),
      status: true
    };

    try {
      if (editingId) {
        await RunServer((base) =>
          axios.put(`${base}/users/${editingId}`, {
            ...payload,
            id: editingId
          })
        );
      } else {
        await RunServer((base) =>
          axios.post(`${base}/users`, payload)
        );
      }
      await fetchUsers();
      resetForm();
    } catch (error) {
      console.error("Failed to save user:", error);
      setRequestError(
        "Save failed. Ensure JSON server is running on port 3001 or 3000."
      );
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name ?? "",
      email: item.email ?? "",
      phone: item.phone ?? "",
      image: item.image ?? ""
    });
    setErrors({});
  };

  const softDelete = async (id) => {
    try {
      await RunServer((base) =>
        axios.patch(`${base}/users/${id}`, { status: false })
      );
      await fetchUsers();
    } catch (error) {
      console.error("Failed to soft delete user:", error);
      setRequestError(
        "Delete failed. Ensure JSON server is running on port 3001 or 3000."
      );
    }
  };

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handlePageSize = (value) => {
    setPageSize(Number(value));
    setPage(1);
  };

  return (
    <div className="container">
      <h1>React CRUD (Axios + JSON Server)</h1>
      {requestError ? <p className="error-banner">{requestError}</p> : null}

      <form className="form" onSubmit={handleSubmit}>
        <div className="grid">
          <label>
            Name
            <input
              name="name"
              value={form.name}
              onChange={handleInput}
              placeholder="Enter name"
            />
            {errors.name ? <span className="error">{errors.name}</span> : null}
          </label>

          <label>
            Email
            <input
              name="email"
              value={form.email}
              onChange={handleInput}
              placeholder="Enter email"
            />
            {errors.email ? <span className="error">{errors.email}</span> : null}
          </label>

          <label>
            Phone
            <input
              name="phone"
              value={form.phone}
              onChange={handleInput}
              placeholder="Enter phone"
            />
            {errors.phone ? <span className="error">{errors.phone}</span> : null}
          </label>

          <label>
            Image URL
            <input
              name="image"
              value={form.image}
              onChange={handleInput}
              placeholder="https://example.com/image.jpg"
            />
            {errors.image ? <span className="error">{errors.image}</span> : null}
          </label>
        </div>

        <div className="actions">
          <button type="submit">{editingId ? "Update" : "Create"}</button>
          {editingId ? (
            <button type="button" className="secondary" onClick={resetForm}>
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      <div className="toolbar">
        <input
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by name, email, phone"
        />

        <select value={pageSize} onChange={(e) => handlePageSize(e.target.value)}>
          <option value={5}>Show 5</option>
          <option value={10}>Show 10</option>
          <option value={15}>Show 15</option>
        </select>
      </div>

      {loading ? <p>Loading...</p> : null}

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Image</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRecords.length === 0 ? (
            <tr>
              <td colSpan="6" className="empty">
                No records found
              </td>
            </tr>
          ) : (
            paginatedRecords.map((item, index) => (
              <tr key={item.id}>
                <td>{(page - 1) * pageSize + index + 1}</td>
                <td>
                  <img src={item.image} alt={item.name} />
                </td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.phone}</td>
                <td className="actions-cell">
                  <button type="button" onClick={() => startEdit(item)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="danger"
                    onClick={() => softDelete(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="pagination">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
