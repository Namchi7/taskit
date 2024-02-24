import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import styles from "./css/tasks.module.css";
import Create_Task from "./Create_Task";
import { fetchAllUserTasks } from "./redux/reducers/allUserTasks.js";

// import allTasks from "../assets/json/allTasks.json";
// import taskLabels from "../assets/json/taskLabels.json";
import dropdownIcon from "../assets/images/dropdown.png";
import priorityLow from "../assets/images/priority-low.png";
import priorityMedium from "../assets/images/priority-medium.png";
import priorityHigh from "../assets/images/priority-high.png";
import { showPopUp } from "./PopUpMessage.jsx";
import Loader from "./Loader";

function Tasks() {
  const dispatch = useDispatch();
  const allTaskObject = useSelector((state) => state.allTasks.data);
  const taskLoading = useSelector((state) => state.allTasks.isLoading);
  const taskError = useSelector((state) => state.allTasks.isError);

  let tasks, labels;

  if (!taskLoading && !taskError) {
    tasks = allTaskObject?.tasks;
    labels = allTaskObject?.labels;
    // console.log(tasks, labels);
  }

  const serverUrl = process.env.REACT_APP_SERVER_URL;

  const fetchUserData = useCallback(() => {
    dispatch(fetchAllUserTasks());
  }, []);

  // const labels = taskLabels;
  // const tasks = allTasks;

  // console.log(tasks, labels);

  const closeModal = () => {
    // console.log("Closing...");
    const em = document.querySelector("[data-edit-modal]");
    const dbg = document.querySelector("[data-dark-bg]");

    em.style.display = "none";
    dbg.style.display = "none";
  };

  const openModal = (id) => {
    const em = document.querySelector("[data-edit-modal]");
    const dbg = document.querySelector("[data-dark-bg]");

    em.style.display = "flex";
    dbg.style.display = "block";

    const title = document.querySelector("[data-edit-modal-title]");
    const description = document.querySelector("[data-edit-modal-description]");
    const priorityRadios = document.querySelectorAll(
      "[data-edit-priority-input]"
    );
    const statusRadios = document.querySelectorAll("[data-edit-status-input]");
    const editSubmitBtn = document.querySelector("[data-edit-submit-btn]");
    editSubmitBtn.dataset.editSubmitBtn = id;

    tasks.map((task) => {
      if (task._id === id) {
        console.log(task);
        title.value = task.title;
        description.value = task.description;
        priorityRadios.forEach((pr) => {
          if (pr.value === task.priority.toLocaleLowerCase()) pr.checked = true;
        });
        statusRadios.forEach((sr) => {
          if (sr.value === task.status.toString()) sr.checked = true;
        });
      }
    });
  };

  const resolveDate = (dateString) => {
    const d = new Date(dateString);

    const date = d.getDate();
    const monthShort = d.toLocaleString("default", { month: "short" });
    const fullYear = d.getFullYear();
    const shortYear = fullYear.toString().split("").splice(2).join("");

    const resultDate = `${date} ${monthShort} ${shortYear}`;
    return resultDate;
  };

  const changeTaskStatus = async (id, status) => {
    const newStatus = parseInt(status) + 1;

    const res = await fetch(
      `${serverUrl}/edit-task-status?taskId=${id}&status=${newStatus}`,
      {
        method: "PATCH",
        credentials: "include",
      }
    );

    const result = await res.json();
    let message = "Error while changing task status!";

    if (result.success) {
      fetchUserData();
      message = "Task status changed.";
    }

    showPopUp({ success: result.success, message: message });
  };

  const deleteTask = async (id) => {
    const res = await fetch(`${serverUrl}/delete-task?taskId=${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const result = await res.json();
    let message = "Error while deleting the task!";

    if (result.success) {
      fetchUserData();
      message = "Task deleted.";
    }

    showPopUp({ success: result.success, message: message });
  };

  const editTask = async () => {
    const editSubmitBtn = document.querySelector("[data-edit-submit-btn]");
    const id = editSubmitBtn.dataset.editSubmitBtn;

    const title = document.querySelector("[data-edit-modal-title]").value;
    const description = document.querySelector(
      "[data-edit-modal-description]"
    ).value;
    let priority, status;
    const priorityRadios = document.querySelectorAll(
      "[data-edit-priority-input]"
    );
    priorityRadios.forEach((rad) => {
      if (rad.checked === true) priority = rad.value;
    });
    const statusRadios = document.querySelectorAll("[data-edit-status-input]");
    statusRadios.forEach((rad) => {
      if (rad.checked === true) status = rad.value;
    });

    const queryParams = `taskId=${id}&title=${title}&description=${description}&priority=${priority}&status=${status}`;

    const res = await fetch(`${serverUrl}/edit-task?${queryParams}`, {
      method: "PATCH",
      credentials: "include",
    });
    const result = await res.json();
    let message = "Error while deleting the task!";

    if (result.success) {
      closeModal();
      fetchUserData();
      message = "Task edited.";
    }

    showPopUp({ success: result.success, message: message });
  };

  // const openCreateTaskModal = () => {
  //   const createTaskModal = document.querySelector("[data-create-task-modal]");
  //   createTaskModal.style.display = "flex";
  // };
  const todoRef = useRef();
  const ongoingRef = useRef();
  const doneRef = useRef();

  const closeTaskContainer = (dropdown) => {
    const tasksDiv = dropdown.parentElement.parentElement.children[1];

    tasksDiv.style.display = "none";
    dropdown.style.rotate = "180deg";
  };

  const handleDropdown = (id) => {
    const dropdown =
      id == 1
        ? todoRef.current
        : id == 2
        ? ongoingRef.current
        : doneRef.current;

    const closeDropdowns =
      id == 1
        ? [ongoingRef.current, doneRef.current]
        : id == 2
        ? [todoRef.current, doneRef.current]
        : [todoRef.current, ongoingRef.current];

    const tasksDiv = dropdown.parentElement.parentElement.children[1];
    // console.log(tasksDiv.style.display);
    if (tasksDiv.style.display == "flex") {
      tasksDiv.style.display = "none";
      dropdown.style.rotate = "180deg";
    } else if (tasksDiv.style.display == "none") {
      tasksDiv.style.display = "flex";
      dropdown.style.rotate = "0deg";
      closeTaskContainer(closeDropdowns[0]);
      closeTaskContainer(closeDropdowns[1]);
    }
  };

  useEffect(() => {
    fetchUserData();

    // const dropdowns = document.querySelectorAll("[data-dropdown]");
    // dropdowns.forEach((dropdown) => {
    //   console.log(dropdown);
    //   dropdown.addEventListener("click", (e) => {
    //     e.preventDefault();
    //     const tasksDiv = dropdown.parentElement.parentElement.children[1];
    //     if (tasksDiv.style.display == "flex") {
    //       tasksDiv.style.display = "none";
    //       dropdown.style.rotate = "180deg";
    //     } else if (tasksDiv.style.display == "none") {
    //       tasksDiv.style.display = "flex";
    //       dropdown.style.rotate = "0deg";
    //     }
    //   });
    // });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });

    return () => {
      window.removeEventListener("keydown", (e) => {
        if (e.key === "Escape") closeModal();
      });
    };
  }, []);

  return (
    <>
      {taskLoading && <Loader />}
      <div className={styles.container}>
        {labels &&
          labels.map((label) => (
            <div className={styles.tasksContainer} key={label.id}>
              <div className={styles.taskHeaderDiv}>
                <div className={styles.tasksHeading}>{label.title}</div>
                <div
                  className={styles.dropdownDiv}
                  onClick={(e) => {
                    e.preventDefault();
                    handleDropdown(label.id);
                  }}
                  ref={
                    label.id == 1
                      ? todoRef
                      : label.id == 2
                      ? ongoingRef
                      : doneRef
                  }
                  data-dropdown
                >
                  <img
                    src={dropdownIcon}
                    alt="Dropdown"
                    className={styles.dropdownIcon}
                  />
                </div>
              </div>

              <div className={styles.tasks} style={{ display: "flex" }}>
                {label.task_ids.length === 0 && (
                  <p className={styles.noTasks}>Not tasks present.</p>
                )}
                {tasks.map(
                  (task, i) =>
                    label.task_ids.includes(task._id) && (
                      <div className={styles.task} key={i}>
                        <div className={styles.taskTop}>
                          <div className={styles.taskHeader}>
                            <div className={styles.taskHeaderLeft}>
                              <div className={styles.taskPriority}>
                                <img
                                  src={
                                    task.priority.toLocaleLowerCase() === "low"
                                      ? priorityLow
                                      : task.priority.toLocaleLowerCase() ===
                                        "medium"
                                      ? priorityMedium
                                      : priorityHigh
                                  }
                                  className={styles.taskPriorityIcon}
                                />
                              </div>
                              <div className={styles.taskTitle}>
                                {task.title}
                              </div>
                            </div>
                            <div className={styles.taskCreationDate}>
                              {resolveDate(task.created_on)}
                            </div>
                          </div>

                          <div className={styles.taskBody}>
                            {task.description}
                          </div>
                        </div>

                        <div className={styles.taskFooter}>
                          <div className={styles.taskCompletionDate}>
                            {task?.completed_on !== null &&
                              task?.completed_on &&
                              task.status == 3 &&
                              resolveDate(task.completed_on)}
                          </div>

                          <div className={styles.taskBtns}>
                            <button
                              className={styles.taskBtn}
                              onClick={() => openModal(task._id)}
                            >
                              Edit
                            </button>
                            <button
                              className={`${styles.taskBtn} ${styles.taskDelBtn}`}
                              onClick={(e) => {
                                e.preventDefault();
                                deleteTask(task._id);
                              }}
                            >
                              Delete
                            </button>
                            {task.status != 3 ? (
                              <button
                                className={`${styles.taskBtn} ${styles.taskDoneBtn}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  changeTaskStatus(task._id, task.status);
                                }}
                              >
                                {task.status === 1 ? "Start" : "Done"}
                              </button>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>
                    )
                )}
              </div>
            </div>
          ))}

          <div className={styles.placeholderDiv}></div>
      </div>

      {/* <div className={styles.editModal} data-edit-modal> */}
      <form className={styles.editModal} data-edit-modal>
        <h3>Edit Task</h3>
        <fieldset className={styles.fieldset}>
          <legend htmlFor="title" className={styles.fieldLabel}>
            Title:
          </legend>
          <input
            type="text"
            name="title"
            className={styles.fieldInput}
            data-edit-modal-title
          />
        </fieldset>
        <fieldset className={styles.fieldset}>
          <legend htmlFor="description" className={styles.fieldLabel}>
            Description:
          </legend>
          <textarea
            name="description"
            className={styles.fieldInput}
            data-edit-modal-description
          />
        </fieldset>
        <fieldset className={styles.fieldset}>
          <legend>Priority:</legend>
          <div className={styles.fieldOptions}>
            <div className={styles.radioGroup}>
              <input
                type="radio"
                id="editPriority1"
                name="priority"
                value="low"
                style={{ borderColor: "#4F95DB" }}
                data-edit-priority-input
              />
              <label htmlFor="priority1">Low</label>
            </div>

            <div className={styles.radioGroup}>
              <input
                type="radio"
                id="editPriority2"
                name="priority"
                value="medium"
                style={{ borderColor: "#FFC800" }}
                data-edit-priority-input
              />
              <label htmlFor="priority2">Medium</label>
            </div>

            <div className={styles.radioGroup}>
              <input
                type="radio"
                id="editPriority3"
                name="priority"
                value="high"
                style={{ borderColor: "#FF4500" }}
                data-edit-priority-input
              />
              <label htmlFor="editPriority3">High</label>
            </div>
          </div>
        </fieldset>
        <fieldset className={styles.fieldset}>
          <legend>Status:</legend>
          <div className={styles.fieldOptions}>
            <div className={styles.radioGroup}>
              <input
                type="radio"
                id="editStatus1"
                name="status"
                value="1"
                data-edit-status-input
              />
              <label htmlFor="status1">To Do</label>
            </div>

            <div className={styles.radioGroup}>
              <input
                type="radio"
                id="editStatus3"
                name="status"
                value="2"
                data-edit-status-input
              />
              <label htmlFor="status2">Ongoing</label>
            </div>

            <div className={styles.radioGroup}>
              <input
                type="radio"
                id="editStatus3"
                name="status"
                value="3"
                data-edit-status-input
              />
              <label htmlFor="editStatus3">Done</label>
            </div>
          </div>
        </fieldset>
        <div className={styles.formBtns}>
          <button
            className={styles.formBtn}
            onClick={(e) => {
              e.preventDefault();
              closeModal();
            }}
          >
            Cancel
          </button>
          <input
            type="submit"
            value="Edit Task"
            className={styles.formBtn}
            onClick={(e) => {
              e.preventDefault();
              editTask();
            }}
            data-edit-submit-btn=""
          />
        </div>
      </form>
      {/* </div> */}

      <div
        className={styles.darkBG}
        data-dark-bg
        onClick={(e) => {
          e.preventDefault();
          closeModal();
        }}
      >
        {/* Click outside the window or press Esc key to close edit. */}
      </div>

      <div
        style={{ display: "none" }}
        className={styles.createTask}
        data-create-task-modal
      >
        <Create_Task />
      </div>

      {/* <div
        className={styles.openCreateTask}
        onClick={(e) => {
          e.preventDefault();
          openCreateTaskModal();
        }}
      >
        Create Task
      </div> */}
    </>
  );
}

export default Tasks;
