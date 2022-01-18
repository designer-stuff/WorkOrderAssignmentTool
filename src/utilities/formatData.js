import short from "short-uuid";

export const formatData = (jobData, typeOfJob) => {
  const jobsDataArray = [];

  jobData.forEach((job) => {
    let jobData = {};
    jobData.id = short.generate();
    jobData.jobname = job.jobname;

    let newWorkOrders = [];

    const weekDays = [
      "20-Apr-20",
      "21-Apr-20",
      "22-Apr-20",
      "23-Apr-20",
      "24-Apr-20",
      "25-Apr-20",
    ];

    weekDays.forEach((day) => {
      let newWorkOrder = {};
      let currentWorkorder = 0;

      while (currentWorkorder < job.workorders.length) {
        const workOrder = job.workorders[currentWorkorder];
        workOrder.date = new Date(workOrder.date).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "2-digit",
        });
        workOrder.date = workOrder.date.split(" ").join("-").toString();

        if (
          workOrder.date === day &&
          !workOrder.employee &&
          typeOfJob === "unassigned"
        ) {
          newWorkOrder.id = short.generate();
          newWorkOrder.name = workOrder.name;
          newWorkOrder.date = workOrder.date;
          break;
        }

        if (
          workOrder.date === day &&
          workOrder.employee &&
          typeOfJob === "assigned"
        ) {
          newWorkOrder.id = short.generate();
          newWorkOrder.name = workOrder.name;
          newWorkOrder.date = workOrder.date;
          newWorkOrder.employee = workOrder.employee;
          break;
        }
        currentWorkorder++;
      }

      if (!newWorkOrder.name) {
        newWorkOrder.id = short.generate();
        newWorkOrder.name = "";
        newWorkOrder.date = "";
        newWorkOrder.employee = "";
      }

      newWorkOrders.push(newWorkOrder);
    });

    jobData.workorders = newWorkOrders;
    jobsDataArray.push(jobData);
  });

  return jobsDataArray;
};
