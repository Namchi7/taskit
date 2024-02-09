import { useDispatch } from "react-redux";

import styles from "./css/create_task.module.css";
import { fetchAllUserTasks } from "./redux/reducers/allUserTasks";
import { showPopUp } from "./PopUpMessage";

function Create_Task() {
  const dispatch = useDispatch();
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  const closeModal = () => {
    const createTaskModal = document.querySelector("[data-create-task-modal]");
    createTaskModal.style.display = "none";
  };

  const createTask = async () => {
    const title = document.querySelector("[data-create-title]").value;
    const description = document.querySelector(
      "[data-create-description]"
    ).value;
    const priorityRads = document.querySelectorAll("[data-create-priority]");
    const statusRads = document.querySelectorAll("[data-create-status]");

    let priority, status;
    priorityRads.forEach((rad) => {
      if (rad.checked === true) priority = rad.value;
    });
    statusRads.forEach((rad) => {
      if (rad.checked === true) status = rad.value;
    });

    const queryParams = `&title=${title}&description=${description}&priority=${priority}&status=${status}`;

    const res = await fetch(`${serverUrl}/create-task?${queryParams}`, {
      method: "POST",
      credentials: "include",
    });
    const result = await res.json();
    let message = "Error while create the task!";

    if (result.success) {
      dispatch(fetchAllUserTasks());
      closeModal();
      message = "Task created.";
    }
    showPopUp({ success: result.success, message: message });

    // console.log(result.success);
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.closeBG}
        onClick={(e) => {
          e.preventDefault();
          closeModal();
        }}
      ></div>

      <form className={styles.createTaskDiv}>
        <h3>Create Task</h3>
        <fieldset className={styles.fieldset}>
          <legend htmlFor="title" className={styles.fieldLabel}>
            Title:
          </legend>
          <input
            type="text"
            name="title"
            className={styles.fieldInput}
            data-create-title
          />
        </fieldset>
        <fieldset className={styles.fieldset}>
          <legend htmlFor="description" className={styles.fieldLabel}>
            Description:
          </legend>
          <textarea
            name="description"
            className={styles.fieldInput}
            data-create-description
          />
        </fieldset>
        <fieldset className={styles.fieldset}>
          <legend>Priority:</legend>
          <div className={styles.fieldOptions}>
            <div className={styles.radioGroup}>
              <input
                type="radio"
                id="priority1"
                name="priority"
                value="low"
                style={{ borderColor: "#4F95DB" }}
                data-create-priority
              />
              <label htmlFor="priority1">Low</label>
            </div>

            <div className={styles.radioGroup}>
              <input
                type="radio"
                id="priority2"
                name="priority"
                value="medium"
                style={{ borderColor: "#FFC800" }}
                data-create-priority
              />
              <label htmlFor="priority2">Medium</label>
            </div>

            <div className={styles.radioGroup}>
              <input
                type="radio"
                id="priority3"
                name="priority"
                value="high"
                style={{ borderColor: "#FF4500" }}
                data-create-priority
              />
              <label htmlFor="priority3">High</label>
            </div>
          </div>
        </fieldset>
        <fieldset className={styles.fieldset}>
          <legend>Status:</legend>
          <div className={styles.fieldOptions}>
            <div className={styles.radioGroup}>
              <input
                type="radio"
                id="status1"
                name="status"
                value="1"
                data-create-status
              />
              <label htmlFor="status1">To Do</label>
            </div>

            <div className={styles.radioGroup}>
              <input
                type="radio"
                id="status3"
                name="status"
                value="2"
                data-create-status
              />
              <label htmlFor="status2">Ongoing</label>
            </div>

            <div className={styles.radioGroup}>
              <input
                type="radio"
                id="status3"
                name="status"
                value="3"
                data-create-status
              />
              <label htmlFor="status3">Done</label>
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
            value="Create Task"
            className={styles.formBtn}
            onClick={(e) => {
              e.preventDefault();
              createTask();
            }}
          />
        </div>
      </form>
    </div>
  );
}

export default Create_Task;
