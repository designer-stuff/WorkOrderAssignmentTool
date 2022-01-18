import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import short from "short-uuid";
import "../styles/workboard.css";
import { formatData } from "../utilities/formatData";
import Order from "./order";
import JobList from "./jobList";

const URL = "http://localhost:4000";

function WorkBoard() {
  const [employees, setEmployees] = useState([]);
  const [employee, setEmployee] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [assignedJobs, setAssignedJobs] = useState([]);
  const [unassignedJobs, setUnassignedJobs] = useState([]);
  const [showList, setShowList] = useState(false);
  const [newAssignedJobs, setNewAssignedJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [jobDetails, setJobDetails] = useState({
    jobname: "",
    ordername: "",
  });

  const week = useMemo(() => {
    return [
      "20-Apr-20",
      "21-Apr-20",
      "22-Apr-20",
      "23-Apr-20",
      "24-Apr-20",
      "25-Apr-20",
    ];
  }, []);

  useEffect(() => {
    const cleanData = (employees, assignedJobs) => {
      const newJobData = [];
      assignedJobs.forEach((job) => {
        employees.forEach((employee) => {
          const newJob = {};
          const workorders = job.workorders.filter(
            (order) => order.employee === employee.name
          );

          const newWorkorders = [];
          week.forEach((day) => {
            const newWorkorder = {};
            const order = workorders.filter((order) => order.date === day);
            if (order.length) {
              newWorkorder.id = short.generate();
              newWorkorder.name = order[0].name;
              newWorkorder.date = order[0].date;
              newWorkorder.employee = order[0].employee;
            } else {
              newWorkorder.id = short.generate();
              newWorkorder.name = "";
              newWorkorder.date = day;
              newWorkorder.employee = "";
            }
            newWorkorders.push(newWorkorder);
          });

          if (workorders.length) {
            newJob.id = short.generate();
            newJob.jobname = job.jobname;
            newJob.employee = employee.name;
            newJob.workorders = newWorkorders;
            newJobData.push(newJob);
          }
        });
      });
      return newJobData;
    };

    const fetchEmployees = async () => {
      const { data: employeesList } = await axios(`${URL}/employees`);
      const { data: jobsList } = await axios(`${URL}/job`);
      const assignedJobsData = formatData(jobsList, "assigned");
      const unassignedJobsData = formatData(jobsList, "unassigned");
      const cleanJobData = cleanData(employeesList, assignedJobsData);
      setEmployees(employeesList);
      setAllJobs(jobsList);
      setAssignedJobs(cleanJobData);
      setUnassignedJobs(unassignedJobsData);
    };

    fetchEmployees();
  }, [week]);

  const handleCell = (event) => {
    const currentTarget = event.target;
    if (!currentTarget.innerHTML) setShowList(true);
    setEmployee(employees[currentTarget.parentNode.id].name);
    const selectDate = week.filter(
      (day) => day.substring(0, 2) === currentTarget.id
    );
    setSelectedDate(selectDate[0]);
  };

  const handleAssignJob = (jobName, orderName) => {
    const assignedJobClone = [...assignedJobs];
    const job = assignedJobClone.filter((job) => job.jobname === jobName);
    const workorder = job[0].workorders.filter(
      (order) => order.date === selectedDate
    );
    workorder[0].name = orderName;
    workorder[0].employee = employee;

    const workorderIndex = job[0].workorders.indexOf(workorder[0]);
    job[0].workorders[workorderIndex] = workorder[0];

    const jobIndex = assignedJobClone.indexOf(job[0]);
    assignedJobClone[jobIndex] = job[0];

    // add to newAssignedJobs
    const newAssignedJobsClone = [...newAssignedJobs];

    const newlyAssignedJob = {
      jobname: jobName,
      workorders: [
        {
          name: orderName,
          date: selectedDate,
          employee,
        },
      ],
    };
    newAssignedJobsClone.push(newlyAssignedJob);
    setNewAssignedJobs(newAssignedJobsClone);

    // Remove the job from available list
    let unassignedJobsClone = [...unassignedJobs];
    const jobToRemove = unassignedJobs.filter((job) => job.jobname === jobName);
    const workorderToRemove = jobToRemove[0].workorders.filter(
      (order) => order.name === orderName
    );
    const workorderToRemoveIndex = jobToRemove[0].workorders.indexOf(
      workorderToRemove[0]
    );
    jobToRemove[0].workorders.splice(workorderToRemoveIndex, 1);
    setUnassignedJobs(unassignedJobsClone);
    setAssignedJobs(assignedJobClone);
    setJobDetails({ jobname: jobName, ordername: orderName });
    setShowList(false);
  };

  const handleSave = async () => {
    const allJobsClone = [...allJobs];
    newAssignedJobs.forEach((job) => {
      const findJob = allJobsClone.filter((j) => j.jobname === job.jobname);

      if (findJob.length) {
        const orderIndex = findJob[0].workorders.findIndex(
          (order) => order.name === jobDetails.ordername
        );
        findJob[0].workorders[orderIndex].employee = employee;
      }
    });

    try {
      await axios.post(`${URL}/job`, allJobsClone);
    } catch (err) {
      console.log("Error: ", err.message);
    }
  };

  return (
    <div className="workboard">
      <div className="header">
        <h1>WorkOrder Assignment tool</h1>
        <button className="btn" onClick={handleSave}>
          Save
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <td className="table-header"></td>
            {week.map((day, index) => (
              <React.Fragment key={index}>
                <td className="table-header">{day}</td>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {assignedJobs.map((job, index) => (
            <tr key={job.id} id={index}>
              <td className="emp-name">{job.employee}</td>
              {job.workorders.map((order) => (
                <React.Fragment key={order.id}>
                  {order.name ? (
                    <td id={`${order.date.substr(0, 2)}`} onClick={handleCell}>
                      <Order workOrderName={order.name} jobName={job.jobname} />
                    </td>
                  ) : (
                    <td
                      id={`${order.date.substr(0, 2)}`}
                      onClick={handleCell}
                    ></td>
                  )}
                </React.Fragment>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {showList && (
        <JobList
          unassignedJobs={unassignedJobs}
          assignJob={handleAssignJob}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
}

export default WorkBoard;
