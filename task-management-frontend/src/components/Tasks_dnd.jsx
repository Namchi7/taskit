import styles from "./css/tasks.module.css";
import Create_Task from "./Create_Task";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useEffect, useState } from "react";

import allTasks from "../assets/json/allTasks.json";
import taskLabels from "../assets/json/taskLabels.json";

function Tasks() {
  const [tasks, setTasks] = useState(allTasks);
  const [labels] = useState(taskLabels);
  // const labels = taskLabels;

  // console.log(tasks, labels);

  const onDragEnd = (result) => {
    console.log(result);
    if (!result.destination) return;
    if (result.destination.droppableId === result.source.droppableId) return;

    let dst = labels[result.destination.droppableId - 1].task_ids;
    let src = labels[result.source.droppableId - 1].task_ids;
    const x = src.indexOf(parseInt(result.draggableId));

    dst.splice(result.destination.index, 0, parseInt(result.draggableId));
    src.splice(x, 1);

    console.log(dst, src, x);
  };

  const deleteNote = (id) => {
    // tasks.map((task) => {
    //   let idIndex;
    //   if (task._id === id) {
    //     idIndex = tasks.indexOf(task);
    //     tasks.splice(idIndex, 1);
    //   }
    // });
    setTasks((prevTasks) => {
      return prevTasks.filter((task) => task._id !== id);
    });

    labels.map((label) => {
      let idIndex;
      if (label.task_ids.includes(id)) {
        idIndex = label.task_ids.indexOf(id);
        label.task_ids.splice(idIndex, 1);
      }
    });
    // console.log(tasks, labels);
  };

  const closeModal = (e) => {
    if (!e.key) e.preventDefault();
    console.log("Closing...");
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

  const openCreateTaskModal = (e) => {
    e.preventDefault();
    const createTaskModal = document.querySelector("[data-create-task-modal]");
    createTaskModal.style.display = "flex";
  };

  useEffect(() => {
    // fetch("http://localhost:3500/all-tasks?uname=user4")
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setTasks(data.tasks);
    //     setLabels(data.labels);
    //   });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal(e);
    });

    return () => {
      window.removeEventListener("keydown", (e) => {
        if (e.key === "Escape") closeModal(e);
      });
    };
  }, [tasks]);

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={styles.container}>
          {labels.map((label) => (
            <div className={styles.tasksContainer} key={label.id}>
              <div className={styles.tasksHeading}>{label.title}</div>

              <Droppable droppableId={label.id.toString()}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={styles.tasks}
                  >
                    {tasks.map(
                      (task) =>
                        label.task_ids.includes(task._id) && (
                          <Draggable
                            key={task._id}
                            draggableId={task._id.toString()}
                            index={label.task_ids.indexOf(task._id)}
                            // index={i}
                          >
                            {(provided) => (
                              <div
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                                className={styles.task}
                                key={task._id}
                              >
                                <div className={styles.taskTop}>
                                  <div className={styles.taskHeader}>
                                    <div className={styles.taskHeaderLeft}>
                                      <div className={styles.taskStatus}></div>
                                      <div className={styles.taskTitle}>
                                        {task.title}
                                      </div>
                                    </div>
                                    <div className={styles.taskCreationDate}>
                                      {task.created_on}
                                    </div>
                                  </div>

                                  <div className={styles.taskBody}>
                                    {task.description}
                                  </div>
                                </div>

                                <div className={styles.taskFooter}>
                                  <div className={styles.taskCompletionDate}>
                                    {task.completed_on !== null &&
                                      task.completed_on}
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
                                      onClick={() => deleteNote(task._id)}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        )
                    )}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}

          {/* <>
        <div className={styles.tasksContainer}>
          <div className={styles.tasksHeading}>To Do</div>

          <div className={styles.tasks}>
            <div className={styles.task}>
              <div className={styles.taskTop}>
                <div className={styles.taskHeader}>
                  <div className={styles.taskHeaderLeft}>
                    <div className={styles.taskStatus}></div>
                    <div className={styles.taskTitle}>Title For The Task</div>
                  </div>
                  <div className={styles.taskCreationDate}>1 Jan 2024</div>
                </div>

                <div className={styles.taskBody}>
                  <div className={styles.taskPoint}>
                    - Task description line 1.
                  </div>
                  <div className={styles.taskPoint}>
                    - Task description line 2.
                  </div>
                  <div className={styles.taskPoint}>
                    - Task description line 2.
                  </div>
                </div>
              </div>

              <div className={styles.taskFooter}>
                <div className={styles.taskCompletionDate}>30 Jan 2024</div>

                <div className={styles.taskStatusDropdown}>
                  <div className={styles.taskCurrentStatus}>Pending</div>

                  <div className={styles.downArrDiv}>v</div>
                </div>
              </div>
            </div>

            <div className={styles.task}>
              <div className={styles.taskTop}>
                <div className={styles.taskHeader}>
                  <div className={styles.taskHeaderLeft}>
                    <div className={styles.taskStatus}></div>
                    <div className={styles.taskTitle}>Title For The Task</div>
                  </div>
                  <div className={styles.taskCreationDate}>1 Jan 2024</div>
                </div>

                <div className={styles.taskBody}>
                  <div className={styles.taskPoint}>
                    - Task description line 1.
                  </div>
                  <div className={styles.taskPoint}>
                    - Task description line 2.
                  </div>
                  <div className={styles.taskPoint}>
                    - Task description line 2.
                  </div>
                </div>
              </div>

              <div className={styles.taskFooter}>
                <div className={styles.taskCompletionDate}>30 Jan 2024</div>

                <div className={styles.taskStatusDropdown}>
                  <div className={styles.taskCurrentStatus}>Pending</div>

                  <div className={styles.downArrDiv}>v</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.tasksContainer}>
          <div className={styles.tasksHeading}>Ongoing</div>

          <div className={styles.tasks}>
            <div className={styles.task}>
              <div className={styles.taskTop}>
                <div className={styles.taskHeader}>
                  <div className={styles.taskHeaderLeft}>
                    <div className={styles.taskStatus}></div>
                    <div className={styles.taskTitle}>Title For The Task</div>
                  </div>
                  <div className={styles.taskCreationDate}>1 Jan 2024</div>
                </div>

                <div className={styles.taskBody}>
                  <div className={styles.taskPoint}>
                    - Task description line 1.
                  </div>
                  <div className={styles.taskPoint}>
                    - Task description line 2.
                  </div>
                  <div className={styles.taskPoint}>
                    - Task description line 2.
                  </div>
                </div>
              </div>

              <div className={styles.taskFooter}>
                <div className={styles.taskCompletionDate}>30 Jan 2024</div>

                <div className={styles.taskStatusDropdown}>
                  <div className={styles.taskCurrentStatus}>Pending</div>

                  <div className={styles.downArrDiv}>v</div>
                </div>
              </div>
            </div>

            <div className={styles.task}>
              <div className={styles.taskTop}>
                <div className={styles.taskHeader}>
                  <div className={styles.taskHeaderLeft}>
                    <div className={styles.taskStatus}></div>
                    <div className={styles.taskTitle}>Title For The Task</div>
                  </div>
                  <div className={styles.taskCreationDate}>1 Jan 2024</div>
                </div>

                <div className={styles.taskBody}>
                  <div className={styles.taskPoint}>
                    - Task description line 1.
                  </div>
                  <div className={styles.taskPoint}>
                    - Task description line 2.
                  </div>
                  <div className={styles.taskPoint}>
                    - Task description line 2.
                  </div>
                </div>
              </div>

              <div className={styles.taskFooter}>
                <div className={styles.taskCompletionDate}>30 Jan 2024</div>

                <div className={styles.taskStatusDropdown}>
                  <div className={styles.taskCurrentStatus}>Pending</div>

                  <div className={styles.downArrDiv}>v</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.tasksContainer}>
          <div className={styles.tasksHeading}>Done</div>

          <div className={styles.tasks}>
            <div className={styles.task}>
              <div className={styles.taskTop}>
                <div className={styles.taskHeader}>
                  <div className={styles.taskHeaderLeft}>
                    <div className={styles.taskStatus}></div>
                    <div className={styles.taskTitle}>Title For The Task</div>
                  </div>
                  <div className={styles.taskCreationDate}>1 Jan 2024</div>
                </div>

                <div className={styles.taskBody}>
                  <div className={styles.taskPoint}>
                    - Task description line 1.
                  </div>
                  <div className={styles.taskPoint}>
                    - Task description line 2.
                  </div>
                  <div className={styles.taskPoint}>
                    - Task description line 2.
                  </div>
                </div>
              </div>

              <div className={styles.taskFooter}>
                <div className={styles.taskCompletionDate}>30 Jan 2024</div>

                <div className={styles.taskStatusDropdown}>
                  <div className={styles.taskCurrentStatus}>Pending</div>

                  <div className={styles.downArrDiv}>v</div>
                </div>
              </div>
            </div>

            <div className={styles.task}>
              <div className={styles.taskTop}>
                <div className={styles.taskHeader}>
                  <div className={styles.taskHeaderLeft}>
                    <div className={styles.taskStatus}></div>
                    <div className={styles.taskTitle}>Title For The Task</div>
                  </div>
                  <div className={styles.taskCreationDate}>1 Jan 2024</div>
                </div>

                <div className={styles.taskBody}>
                  <div className={styles.taskPoint}>
                    - Task description line 1.
                  </div>
                  <div className={styles.taskPoint}>
                    - Task description line 2.
                  </div>
                  <div className={styles.taskPoint}>
                    - Task description line 2.
                  </div>
                </div>
              </div>

              <div className={styles.taskFooter}>
                <div className={styles.taskCompletionDate}>30 Jan 2024</div>

                <div className={styles.taskStatusDropdown}>
                  <div className={styles.taskCurrentStatus}>Pending</div>

                  <div className={styles.downArrDiv}>v</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </> */}
        </div>
      </DragDropContext>

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
            <input
              type="radio"
              id="editPriority1"
              name="priority"
              value="low"
              data-edit-priority-input
            />
            <label htmlFor="priority1">Low</label>

            <input
              type="radio"
              id="editPriority2"
              name="priority"
              value="medium"
              data-edit-priority-input
            />
            <label htmlFor="priority2">Medium</label>

            <input
              type="radio"
              id="editPriority3"
              name="priority"
              value="high"
              data-edit-priority-input
            />
            <label htmlFor="editPriority3">High</label>
          </div>
        </fieldset>
        <fieldset className={styles.fieldset}>
          <legend>Status:</legend>
          <div className={styles.fieldOptions}>
            <input
              type="radio"
              id="editStatus1"
              name="status"
              value="1"
              data-edit-status-input
            />
            <label htmlFor="status1">To Do</label>

            <input
              type="radio"
              id="editStatus3"
              name="status"
              value="2"
              data-edit-status-input
            />
            <label htmlFor="status2">Ongoing</label>

            <input
              type="radio"
              id="editStatus3"
              name="status"
              value="3"
              data-edit-status-input
            />
            <label htmlFor="editStatus3">Done</label>
          </div>
        </fieldset>
        <div className={styles.formBtns}>
          <button className={styles.formBtn} onClick={(e) => closeModal(e)}>
            Cancel
          </button>
          <input type="submit" value="Edit Task" className={styles.formBtn} />
        </div>
      </form>
      {/* </div> */}

      <div
        className={styles.darkBG}
        data-dark-bg
        onClick={(e) => closeModal(e)}
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

      <div
        className={styles.openCreateTask}
        onClick={(e) => openCreateTaskModal(e)}
      >
        Create Task
      </div>
    </>
  );
}

export default Tasks;
