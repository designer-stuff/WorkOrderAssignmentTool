import React, { useEffect, useState } from "react";
import Order from "./order";
import "../styles/jobList.css";

function JobList({ unassignedJobs, assignJob, selectedDate }) {
  const [cleanJobsData, setCleanJobsData] = useState([]);

  useEffect(() => {
    const jobsData = [...unassignedJobs];
    jobsData.forEach((job) => {
      job.workorders = job.workorders.filter(
        (order) => order.name !== "" && order.date === selectedDate
      );
    });

    setCleanJobsData(jobsData);
  }, [unassignedJobs, selectedDate]);

  return (
    <div className="list-container">
      <div className="overlay"></div>
      <h2>Available Jobs</h2>
      <hr />
      <div className="order-container">
        {cleanJobsData.map((job) => (
          <React.Fragment key={job.id}>
            {job.workorders.map((order) => (
              <div
                key={order.id}
                className="job-order"
                onClick={() => assignJob(job.jobname, order.name)}
              >
                <Order jobName={job.jobname} workOrderName={order.name} />
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default JobList;
