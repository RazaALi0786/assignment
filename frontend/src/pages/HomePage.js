import React from "react";
import CustomerList from "../components/CustomerList";

function HomePage() {
  return (
    <div className="container">
      <h1 className="my-4">Customer Dashboard</h1>
      <CustomerList />
    </div>
  );
}

export default HomePage;
