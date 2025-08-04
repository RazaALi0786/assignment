import React from "react";

function CustomerCard({ customer }) {
  return (
    <div className="col-md-4 mb-3">
      <div className="card h-100">
        <div className="card-body">
          <h5 className="card-title">
            {customer.first_name} {customer.last_name}
          </h5>
          <p className="card-text">Email: {customer.email}</p>
          <p className="card-text">Orders: {customer.order_count}</p>
        </div>
      </div>
    </div>
  );
}

export default CustomerCard;
