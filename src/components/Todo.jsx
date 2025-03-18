import { useState, useRef, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";

import "../Todo.css";
export const Todo = () => {
  let taskName = useRef("");
  let [tasks, setTasks] = useState([]);

  useEffect(() => {
    chrome.storage.local.get(["tasks"], (result) => {
      if (result.tasks) {
        setTasks(result.tasks);
      }
    });
  }, []);

  useEffect(() => {
    chrome.storage.local.set({ tasks }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error saving tasks:", chrome.runtime.lastError);
      }
    });
  }, [tasks]);

  const addTask = () => {
    if (taskName.current.value.trim().length != 0) {
      let taskObject = { taskName: taskName.current.value, status: false };
      setTasks([...tasks, taskObject]);

      taskName.current.value = "";
    }
  };

  const removeTask = (index) => {
    setTasks((prev) => {
      prev = prev.filter((data, dataIndex) => {
        if (dataIndex != index) {
          return data;
        }
      });
      return prev;
    });
  };

  const completedTask = (index) => {
    setTasks((prev) => {
      return prev.map((data, dataIndex) => {
        if (dataIndex === index) {
          return { ...data, status: true };
        }
        return data;
      });
    });
  };
  return (
    <div className="todoContainer">
      <div className="todoHeader">
        <input
          type="text"
          ref={taskName}
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              addTask();
            }
          }}
        />
        <button
          onClick={() => {
            addTask();
          }}
        >
          <FaPlus></FaPlus>
        </button>
      </div>

      <div className="todoList">
        {tasks.length != 0 ? (
          tasks.map((data, index) => {
            return (
              <div className="todoBox" key={index}>
                <p className={data.status ? "completedTask" : null}>
                  {data.taskName}
                </p>
                {data.status ? (
                  <p style={{ color: "rgb(0, 110, 28)" }}>Finished</p>
                ) : null}
                <div className="ctrlBtns">
                  <button
                    className="removeTask"
                    onClick={() => {
                      removeTask(index);
                    }}
                  >
                    <FaXmark></FaXmark>
                  </button>
                  {data.status == false ? (
                    <button
                      className="completedTask"
                      onClick={() => {
                        completedTask(index);
                      }}
                    >
                      <FaCheck></FaCheck>
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })
        ) : (
          <p className="msg">No tasks added</p>
        )}
      </div>
    </div>
  );
};
