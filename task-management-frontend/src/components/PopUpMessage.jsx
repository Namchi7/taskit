import styles from "./css/pop_up_message.module.css";

import popUpSuccessIcon from "../assets/images/pop-up-success.png";
import popUpErrorIcon from "../assets/images/pop-up-error.png";

export const showPopUp = (messageData) => {
  const success = messageData.success;
  const message = messageData.message;

  const popUpDiv = document.querySelector("[data-pop-up]");
  const popUpIcon = document.querySelector("[data-pop-up-icon]");
  const popUpMessage = document.querySelector("[data-pop-up-message]");
  const popUpTimeBar = document.querySelector("[data-pop-up-time-bar]");

  popUpDiv.style.display = "flex";
  popUpIcon.setAttribute("src", success ? popUpSuccessIcon : popUpErrorIcon);
  popUpMessage.innerHTML = message;
  popUpTimeBar.style.backgroundColor = success ? "#4f95db" : "#ff4500";

  setTimeout(() => {
    popUpDiv.style.display = "none";
  }, 3000);
};

function PopUpMessage() {
  return (
    <div style={{ display: "none" }} className={styles.container} data-pop-up>
      <div className={styles.msgContent}>
        <div className={styles.indicatorDiv}>
          <img
            src=""
            alt="Msg: "
            className={styles.indicatorIcon}
            data-pop-up-icon
          />
        </div>
        <p className={styles.message} data-pop-up-message></p>
      </div>

      <div className={styles.timeBar} data-pop-up-time-bar></div>
    </div>
  );
}

export default PopUpMessage;
