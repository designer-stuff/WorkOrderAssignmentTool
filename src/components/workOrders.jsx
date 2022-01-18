import React, { useState, useEffect } from "react";
import axios from "axios";
import Order from "./order";
import { formatData } from "../utilities/formatData";
import "../styles/workOrder.css";

const URL = "http://localhost:4000";

function WorkOrders() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${URL}/job`);
        const newData = formatData(data, "unassigned");
        setJobs(newData);
      } catch (err) {
        console.log("Error: ", err.message);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="workorder-container">
      <table className="workorder-table">
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              {job.workorders.map((order) => (
                <td key={order.id}>
                  <Order workOrderName={order.name} jobName={job.jobname} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default WorkOrders;
