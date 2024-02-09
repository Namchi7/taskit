import { Tasks } from "./model.js";

const getResultData = (tasks) => {
  const labels = [
    {
      id: 1,
      title: "To Do",
      task_ids: [],
    },
    {
      id: 2,
      title: "Ongoing",
      task_ids: [],
    },
    {
      id: 3,
      title: "Done",
      task_ids: [],
    },
  ];

  tasks.forEach((task) => {
    if (task.status === 1) {
      labels[0].task_ids.push(task._id);
    }
    if (task.status === 2) {
      labels[1].task_ids.push(task._id);
    }
    if (task.status === 3) {
      labels[2].task_ids.push(task._id);
    }
  });

  const resultData = {
    labels: labels,
    tasks: tasks,
    total_tasks: tasks.length,
  };

  return resultData;
};

export const createTask = async (task) => {
  try {
    const newTask = new Tasks({
      // id: task.id,
      title: task.title,
      description: task.description,
      created_on: task.created_on,
      priority: task.priority,
      status: parseInt(task.status),
      uname: task.uname,
    });

    const verdict = await newTask.save();
    // console.log(verdict);
    if (verdict._id) return { success: true };

    return { success: false };
  } catch (err) {
    console.log(err);
  }
};

export const editTask = async (task) => {
  try {
    let completed_on = null;
    if (task.status == 3) {
      completed_on = new Date();
    }

    const result = await Tasks.updateOne(
      { _id: task._id },
      {
        $set: {
          title: task.title,
          description: task.description,
          priority: task.priority,
          status: parseInt(task.status),
          completed_on: completed_on,
        },
      }
    );

    if (result.modifiedCount > 0) {
      console.log("Task updated successfully");
      return { success: true };
    } else {
      console.log("No matching task found for update");
      return { success: false };
    }
  } catch (err) {
    console.log(err);
  }
};

export const changeTaskStatus = async (task) => {
  try {
    let completed_on = null;
    if (task.status == 3) {
      completed_on = new Date();
    }
    const result = await Tasks.updateOne(
      { _id: task._id },
      {
        $set: {
          status: parseInt(task.status),
          completed_on: completed_on,
        },
      }
    );

    if (result.modifiedCount > 0) {
      console.log("Task updated successfully");
      return { success: true };
    } else {
      console.log("No matching task found for update");
      return { success: false };
    }
  } catch (err) {
    console.log(err);
  }
};

export const deleteTask = async (taskId) => {
  try {
    const result = await Tasks.deleteOne({ _id: taskId });

    if (result.deletedCount > 0) {
      console.log("Task deleted successfully");
      return { success: true };
    } else {
      console.log("No matching task found for deletion");
      return { success: false };
    }
  } catch (err) {
    console.log(err);
  }
};

// export const searchTask = async (keyword) => {
//   try {

//   } catch (err) {
//     console.log(err);
//   }
// }

export const getAllTasks = async (uname) => {
  try {
    const allTasks = await Tasks.find({ uname: uname });
    const result = getResultData(allTasks);

    return result;
  } catch (err) {
    console.log(err);
    return [];
  }
};
