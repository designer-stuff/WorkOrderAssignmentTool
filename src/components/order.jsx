import React from "react";
import "../styles/order.css";

function Order({ workOrderName, jobName }) {
  return (
    <>
      {workOrderName ? (
        <div className="order">
          <p className="workorder">{workOrderName}</p>
          <p className="job">{jobName}</p>
        </div>
      ) : (
        <div className="order-notavailable"></div>
      )}
    </>
  );
}

export default Order;
