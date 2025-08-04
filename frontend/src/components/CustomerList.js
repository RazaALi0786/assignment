import React, { useEffect, useState } from "react";
import axios from "axios";
import CustomerCard from "./CustomerCard";
import SearchBar from "./SearchBar";

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/customers") // adjust if port differs
      .then((res) => {
        setCustomers(res.data.data);
        setFiltered(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching customers");
        setLoading(false);
      });
  }, []);

  const handleSearch = (query) => {
    const q = query.toLowerCase();
    const results = customers.filter(
      (c) =>
        c.first_name.toLowerCase().includes(q) ||
        c.last_name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
    );
    setFiltered(results);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-4">
      <SearchBar onSearch={handleSearch} />
      <div className="row">
        {filtered.map((cust) => (
          <CustomerCard key={cust.id} customer={cust} />
        ))}
      </div>
    </div>
  );
}

export default CustomerList;
