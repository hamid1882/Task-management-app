import React, {useState, useEffect} from 'react';
import Head from 'next/head';
import { getFullDateTime } from '../Utils/DateTimeUtils';
import Link from 'next/link';

export default function Home() {
  let savedData = [];

  const handleLocalStorage = () => {
    if (typeof window !== "undefined") {
      savedData = JSON.parse(localStorage.getItem("all_tasks"));
    }
  } 

  const [taskData, setTaskData] = useState(savedData);
  const [isPopup, setIsPopup] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [render, setRender] = useState(false)
  const [renderId, setRenderId] = useState(0);
  const [isExpand, setIsExpand] = useState(false);
  const [selectedId, setSelectedId] = useState(0);
  const [isEditPopup, setIsEditPopup] = useState(false);

  const handleUpdateTask = () => {
    const UpdatedTask = {
      id: selectedId,
      name: newTask.toLowerCase(),
      status: {
        started: false,
        completed: false,
      },
      completed_in: 0,
      created_at: Date.now(),
      todo: [
        {
          id: 1,
          name: "Not-yet",
          isCompleted: false 
        },
        {
          id: 2,
          name: "absolutely done",
          isCompleted: true
        }
      ]
    };

    let selectedTask = taskData.find(val => val.id === selectedId);
    selectedTask = UpdatedTask 
    localStorage.setItem("all_tasks", JSON.stringify(taskData));
    setIsEditPopup(false);

  }

  const handleEditTask = (id, name) => {
    setIsEditPopup(true);
    setSelectedId(id);
    setNewTask(taskData.find(val => val.id === id).name)
  }

  const handleCollapse = (id) => {
    setIsExpand(!isExpand);
    setSelectedId(id);
  }

  const handlePopup = (name) => {
    localStorage.setItem("all_tasks", JSON.stringify([]));
    if(name === "open") {
      setIsPopup(true)
    } else {
      setIsPopup(false)
    }
  }

  const handleNewTask = () => {
    const newTaskEntry = {
      id: taskData && taskData.length > 0 ? taskData[0].id + 1 : 1,
      name: newTask.toLowerCase(),
      status: {
        started: false,
        completed: false,
      },
      completed_in: 0,
      created_at: Date.now(),
      todo: [
        {
          id: 1,
          name: "Not-yet",
          isCompleted: false
        },
        {
          id: 2,
          name: "absolutely done",
          isCompleted: true
        }
      ]
    };


    if (newTask.length > 2) {
      taskData ? taskData.unshift(newTaskEntry) : setTaskData(newTaskEntry);
      setNewTask("");
      setIsPopup(false);
      localStorage.setItem("all_tasks", JSON.stringify(taskData));
    } else {
      alert("Please Give a Title to your task, min: 3 letter")
    }
  }

  const handleCheckbox = (e, id) => {
    const filterData = taskData.find(val => val.id === id);
    if(filterData.status.started === true) {
      filterData.status.completed = e.target.checked ? true : false;
      setRender(e.target.checked);
      setRenderId(id);
      setTaskData(taskData);
      getCurrentFinishedTime(id);
      localStorage.setItem("all_tasks", JSON.stringify(taskData));
    } 
  }

  const handleTaskStarted = (id) => {
    const filterData = taskData.find(val => val.id === id);
    filterData.status.started = true;
    getCurrentStartedTime(id);
    setRenderId(id);
    setTaskData(taskData);
    localStorage.setItem("all_tasks", JSON.stringify(taskData));
  }

  const getCurrentStartedTime = (id) => {
    const filterData = taskData.find(val => val.id === id);
    if(filterData.status.started === true) {
      const StartedDate = Date.now();
      filterData.completed_in = StartedDate
    }
  }

  const getCurrentFinishedTime = (id) => {
    const filterData = taskData.find(val => val.id === id);
    if (filterData.status.completed === true) {
      const FinishedDate = Date.now();
      filterData.completed_in = FinishedDate
    }
  }

  useEffect(() => {
    const savedData = localStorage.getItem('all_tasks');
    setTaskData(JSON.parse(savedData));
    handleLocalStorage();
  }, []);

  return (
    <div>
      <Head>
        <title>Task Manager - Home</title>
      </Head>
      {
        isPopup ?
        <div className="add-task-popup">
        <div className="task-popup-container">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/High-contrast-dialog-close.svg/640px-High-contrast-dialog-close.svg.png" 
            alt="Close popup"
            className='close-icon'
            onClick={() => handlePopup("close")}
          />
          <div className="add-task-bar">
            <input 
              className='input' 
              type="text" 
              placeholder="Task Title"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
                <button className="btn btn-start" onClick={handleNewTask}>Add new Task</button>
                </div>
              </div>
            </div>
            : null
            }
            {
              isEditPopup ?
              <div className="add-task-popup">
              <div className="task-popup-container">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/High-contrast-dialog-close.svg/640px-High-contrast-dialog-close.svg.png" 
                  alt="Close popup"
                  className='close-icon'
                  onClick={() => setIsEditPopup(false)}
                />
                <div className="add-task-bar">
                  <h2>Edit {taskData.find(val => val.id === selectedId).name.toUpperCase()} task</h2>
                  <input 
                    className='input' 
                    type="text" 
                    placeholder="Task Title"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                  />
                  {/* <div>
                       <h5>Add todo's</h5> 
                       <input type="text" />
                       <button>Add</button>
                       {
                         taskData.todo && taskData.todo.map(val => (
                           <div>
                             <h2>{val.name}</h2>
                           </div>  
                         ))  
                       }
                     </div> */
                     }
                    <button className="btn btn-start" onClick={handleUpdateTask}>Update Task</button>
                 </div>
                </div>
              </div>
              :
              null
              }
      <div className="home">
        <div className="task-container">
          <h3>Current Tasks</h3>
          <div className="task-list-bar">
          { 
            taskData && taskData.length > 0
              ? taskData.map((data, idx) => (
                <div className="task-list">
                  {
                  isExpand && selectedId === data.id
                  ? <p 
                    className="options-expander" 
                    onClick={() => handleCollapse(data.id)}>⏬</p>
                  : <p 
                    className="options-expander" 
                    onClick={() => handleCollapse(data.id)}>⏫</p>
                  }
                  {
                    isExpand && selectedId === data.id
                    ? <div className="collapse-options">
                        <p onClick={() => handleEditTask(data.id, "open")}>✏</p>
                        <p>⏳</p>
                      </div>
                    : null
                  }
                  <div key={data.id} className="task-flex">
                    <input 
                      type="checkbox" 
                      className="checkbox"
                      checked={setIsChecked["checked"]}
                      disabled={data.status.started === false ? true : false}
                      onChange={(e) => handleCheckbox(e, data.id)}
                    />
                    <div className="tast-bar">
                      <h3 className="task-title">{data.name.toUpperCase()}</h3>
                      <Link href={`./task-manager/${data.name.toLowerCase().replace(/ /g,"-")}`}>
                        <a>Todo: Remaining:{data.todo.length}, Completed:{data.todo && data.todo.filter(val => val.isCompleted === true).length}</a> 
                      </Link>
                      <p className="created_at">Created at: {getFullDateTime(data.created_at, true, true)}</p>
                    </div>
                  </div>
                  <div className="task-flex">
                    { 
                      data.status.completed 
                      ? null 
                      :<>
                        <button 
                           className="btn btn-start" 
                           disabled={data.status.started === true ? true : false}
                           onClick={() => handleTaskStarted(data.id)}>{data.status.started ? "Started" : "Start"}
                         </button>
                         {data.status.started ? <p className="created_at">{getFullDateTime(data.completed_in)}</p> : null}
                         </>
                    }
                    {data.status.completed 
                    ?
                    <>
                      <button className="btn btn-completed">Completed</button>
                      <p className="created_at">{getFullDateTime(data.completed_in, true, true)}</p>
                    </>
                    : null}
                    {data.status.started && data.status.completed === false ? <button className="btn btn-freeze">Freeze </button> : null}
                  </div>
                </div>
            ))
            : <h3>Add task to get Started</h3>
          }
          </div>
          <button className="new-task-btn" onClick={() => handlePopup("open")}>
            New Task
          </button>
        </div>
      </div>
      <style jsx>{
        `
        .home{
          background-color: #000;
          height: 100vh;
          margin: 0;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .options-expander {
          position: absolute;
          top: -1.2em;
          right: 2em;  
        }

        .collapse-options {
          position: absolute;
          top: -1.5em;
          right: 3.3em;
          display: flex;
          align-items: center;
          gap: 0.8em;
          background-color: #fff;
          height: 2em;
          padding: 0em 3em;
          border-top-left-radius: 0.4em; 
          border-top-right-radius: 0.4em; 
        }

        .task-container {
          background-color: #cca;
          height: 80%;
          width: 70%;
          padding: 1em 3em;
        }

        .task-list-bar {
          overflow-y: scroll;
          height: 80%;
          padding: 1em 1em;
        }

        .task-list {
          height: 5em;
          background-color: #fff;
          margin: 2em 0em;
          border-radius: 1em;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1em 2em;
          cursor: pointer;
          position: relative;
        }

        .task-flex {
          display: flex;
          align-items: center;
          gap: 1em;
          font-family: monospace;
        }

        .task-title {
          margin-bottom: 0.3em;
          margin-top: -0.2em;
          letter-spacing: 0.1em;
        }

        .created_at {
          margin-top: 0.2em;
          color: green;
          font-size: 10px;
          font-weight: bold;
          letter-spacing: 0.2em;
          position: absolute;
          bottom:0em;
        }

        .checkbox {
          padding: 1em;
          width: 2em;
          height: 2em;
          cursor: pointer;
        }

        .checkbox:hover {
          border: 1px solid #ccf
        }

        .btn {
          padding: 0.7em 1.5em;
          border-radius: 0.5em;
          border: none;
          cursor: pointer;
        }

        .btn-start {
          background-color: lightgreen;
        }

        .btn-completed {
          background-color: #ccc;
        }

        .btn-freeze {
          background-color: yellow;
        }

        .new-task-btn {
          height: 5em;
          width: 6em;
          padding: 0.3em;
          border-radius: 2em;
          position: absolute;
          bottom: 10em;
          right: 55em;
          border: 2px solid #ccf;
          box-shadow: 1px 2px 1px 2px 5px #ccf;
          cursor: pointer;
        }

        .add-task-popup {
          height: 100%;
          width: 100%;
          background: rgba(0, 0, 0, 0.5);
          position: absolute;
          margin: 0 auto;
          z-index: 2;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .task-popup-container {
          width: 55%;
          height: 75%;
          background-color: #fff;
          display: grid;
          place-items: center;
        }

        .close-icon {
          width: 3em;
          height: 3em;
          position: absolute;
          top: 7em;
          right: 22em;
          cursor: pointer;
        }

        .add-task-bar {
          border: 1px solid black;
          height: 50%;
          width: 50%;
          display: grid;
          justify-content: center;
          align-items: center;
        }

        .input {
          width: 100%;
          border: 1px solid #ccc;
          padding: 0.5em;
          font-style: Roboto;
          border-radius: 0.4em;
        }
  
        .input:focus {
          outline: none;
          border: 2px solid #ccf;
        }
        `
      }</style>
      </div>
  )
}
