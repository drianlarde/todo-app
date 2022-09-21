import React, {useState, useRef} from "react";
import useSound from "use-sound";
import mySound from "../assets/sounds/done.mp3";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

export default function TodoForm() {
  const [input, setInput] = useState("");
  const [todosState, setTodosState] = useState(
    JSON.parse(localStorage.getItem("todos")) || []
  );
  const [subject, setSubject] = useState(
    JSON.parse(localStorage.getItem("subjects")) || []
  );
  const [playSound] = useSound(mySound);
  const inputRef = useRef(null);
  React.useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key === "/") {
        inputRef.current.focus();
        e.preventDefault();
      }
    });
  });

  React.useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todosState));
  }, [todosState]);

  React.useEffect(() => {
    localStorage.setItem("subjects", JSON.stringify(subject));
  }, [subject]);

  React.useEffect(() => {
    // Make todosState.dropDownOpened = false for all todos
    const newTodosState = todosState.map((todo) => {
      return {
        ...todo,
        dropDownOpened: false,
      };
    });
    setTodosState(newTodosState);
  }, []);

  // If escape is pressed close all dropdowns
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        const newTodosState = todosState.map((todo) => {
          return {
            ...todo,
            dropDownOpened: false,
          };
        });
        setTodosState(newTodosState);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [todosState]);

  // Functions
  function handleChange(event) {
    setInput(event.target.value);
  }

  function onSubmitForm(event) {
    event.preventDefault();

    if (input === "") {
      return;
    }

    // Put in localStorage
    const todo = {
      id: Math.floor(Math.random() * 10000),
      subject: "",
      text: input,
      done: false,
      dropDownOpened: false,
    };

    const todos = JSON.parse(localStorage.getItem("todos")) || []; // If there is nothing in localStorage, set it to an empty array

    todos.push(todo); // Add the new todo to the array

    localStorage.setItem("todos", JSON.stringify(todos)); // Set the new array to localStorage

    setInput(""); // Clear the input state
    setTodosState(todos); // Set the todos state
  }

  function deleteTask(todo) {
    return () => {
      const todos = JSON.parse(localStorage.getItem("todos")) || [];
      const newTodos = todos.filter((todoState) => todoState.id !== todo.id);
      localStorage.setItem("todos", JSON.stringify(newTodos));
      setTodosState(newTodos);
    };
  }

  // Components
  function TodosBoxes() {
    React.useEffect(() => {
      function handler(event) {
        if (
          event.target.className !== "todo-subject-input" &&
          event.target.className !== "todo-subject-subheader" &&
          event.target.className !== "todo-subject-content" &&
          event.target.className !== "todo-subject-btn" &&
          event.target.className !== "todo-subject" &&
          event.target.className !== "todo-subject-btn-main" &&
          event.target.className !== "todo-edit"
        ) {
          // Get localStorage
          const todos = JSON.parse(localStorage.getItem("todos")) || [];
          const newTodos = todos.map((todo) => {
            return {
              ...todo,
              dropDownOpened: false,
            };
          });
          localStorage.setItem("todos", JSON.stringify(newTodos));
          setTodosState(newTodos);
        }
      }
      document.addEventListener("click", handler);
      return () => {
        document.removeEventListener("click", handler);
      };
    });
    const container = useRef(null);

    const todos = todosState.filter((todo) => todo.done === false);
    const doneTodos = todosState.filter((todo) => todo.done === true);
    const allTodos = [...todos, ...doneTodos];

    return allTodos.map(TodosBox());

    function TodosBox() {
      return (todo) => {
        return (
          <div key={todo.id} className="todo-box" style={taskBoxStyle()}>
            <div className="todo-box-start">
              <div className="todo-checkbox-ctn">
                <input
                  type="checkbox"
                  className="todo-checkbox"
                  checked={todo.done}
                  onChange={checkboxHandleChange(event)}
                />
              </div>

              <div className="todo-subject-ctn">
                <button
                  className="todo-subject-btn-main"
                  style={taskEditStyle()}
                  onClick={() => {
                    const todos =
                      JSON.parse(localStorage.getItem("todos")) || [];
                    const newTodos = todos.map((todoState) => {
                      if (todoState.id === todo.id) {
                        todoState.dropDownOpened = !todoState.dropDownOpened;
                      } else {
                        todoState.dropDownOpened = false;
                      }
                      return todoState;
                    });

                    localStorage.setItem("todos", JSON.stringify(newTodos));
                    setTodosState(newTodos);
                  }}
                >
                  {subject.find((subjectItem) => {
                    return subjectItem === todo.subject;
                  }) || "Add subject"}
                </button>
                {todo.dropDownOpened ? (
                  <div className="todo-subject-content" ref={container}>
                    <form
                      onSubmit={(event) => {
                        event.preventDefault();
                        // if (event.key === "Enter") {
                        if (event.target.value === "") {
                          return;
                        } else if (
                          subject.find((subjectItem) => {
                            return subjectItem === event.target.value;
                          })
                        ) {
                          return;
                        }
                        const todos =
                          JSON.parse(localStorage.getItem("todos")) || [];
                        const newTodos = todos.map((todoState) => {
                          if (todoState.id === todo.id) {
                            todoState.subject = event.target.value;
                          }
                          return todoState;
                        });
                        localStorage.setItem("todos", JSON.stringify(newTodos));
                        setTodosState(newTodos);
                        const newSubject = event.target.value;
                        const newSubjects = [...subject, newSubject];
                        localStorage.setItem(
                          "subjects",
                          JSON.stringify(newSubjects)
                        );
                        setSubject(newSubjects);
                      }}
                      className="todo-subject-input-form"
                    >
                      <input
                        className="todo-subject-input"
                        type="text"
                        placeholder="Add a subject"
                        name="subjectText"
                        // onKeyDown={}
                        autoFocus
                        autoComplete="off"
                      />
                    </form>
                    <font className="todo-subject-subheader">
                      Select a subject or create one
                    </font>
                    {subject.map((subjectItem, index) => {
                      return (
                        <div className="todo-subject" key={index}>
                          <button
                            onClick={() => {
                              const todos =
                                JSON.parse(localStorage.getItem("todos")) || [];
                              const newTodos = todos.map((todoState) => {
                                if (todoState.id === todo.id) {
                                  todoState.subject = subjectItem;
                                  todoState.dropDownOpened = false;
                                }
                                return todoState;
                              });
                              localStorage.setItem(
                                "todos",
                                JSON.stringify(newTodos)
                              );
                              setTodosState(newTodos);
                            }}
                            className="todo-subject-btn"
                            value="test"
                            key={Math.floor(Math.random() * 10000)}
                          >
                            {subjectItem}
                          </button>

                          {/* Delete button for deleting subject */}
                          <button
                            className="todo-subject-delete-btn"
                            onClick={() => {
                              const newSubjects = subject.filter(
                                (subjectItemState) => {
                                  return subjectItemState !== subjectItem;
                                }
                              );

                              localStorage.setItem(
                                "todos",
                                JSON.stringify(
                                  todosState.map((todoState) => {
                                    if (todoState.subject === subjectItem) {
                                      todoState.subject = "";
                                    }
                                    return todoState;
                                  })
                                )
                              );
                              localStorage.setItem(
                                "subjects",
                                JSON.stringify(newSubjects)
                              );
                              setSubject(newSubjects);
                            }}
                          >
                            <RemoveCircleIcon
                              fontSize="small"
                              htmlColor="#ccc"
                            />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>

              <input
                type="text"
                className="todo-edit"
                style={taskEditStyle()}
                defaultValue={taskDefaultValue()}
                placeholder="Enter a task"
                onChange={editHandleChange()}
                autoCorrect="off"
              />
            </div>
            <div className="todo-box-end">
              <button className="todo-delete" onClick={deleteTask(todo)}>
                Delete
              </button>
            </div>
          </div>
        );

        function taskDefaultValue() {
          return JSON.parse(localStorage.getItem("todos")).find(
            (todoState) => todoState.id === todo.id
          ).text;
        }

        function taskBoxStyle() {
          return {
            backgroundColor: todo.done ? "rgba(0, 0, 0, 0.05)" : "transparent",
            transition: "background-color 0.2s ease",
          };
        }

        function taskEditStyle() {
          return {
            textDecoration: todo.done ? "line-through" : "none",
            opacity: todo.done ? 0.3 : 1,
            pointerEvents: todo.done ? "none" : "auto",
            // Not tabbable
          };
        }

        function editHandleChange() {
          return (event) => {
            const todos = JSON.parse(localStorage.getItem("todos")) || [];
            const newTodos = todos.map((todoState) => {
              if (todoState.id === todo.id) {
                todoState.text = event.target.value;
              }
              return todoState;
            });
            localStorage.setItem("todos", JSON.stringify(newTodos));
          };
        }

        function checkboxHandleChange(e) {
          return () => {
            const todos = JSON.parse(localStorage.getItem("todos")) || [];
            const newTodos = todos.map((todoState) => {
              if (todoState.id === todo.id) {
                todoState.done = !todoState.done;
              }
              return todoState;
            });
            localStorage.setItem("todos", JSON.stringify(newTodos));
            setTodosState(newTodos);

            if (!todo.done) {
              playSound();
            }
          };
        }
      };
    }
  }

  return (
    <>
      <div className="todo-form-fragment">
        <form className="todo-form" onSubmit={onSubmitForm}>
          <input
            ref={inputRef}
            className="todo-input"
            type="text"
            placeholder="Add a todo..."
            value={input}
            name="text"
            onChange={handleChange}
            autoFocus
            autoComplete="off"
          />
          <button className="todo-add">Add</button>
        </form>
      </div>
      <div className="todo-main">
        {todosState.length > 0 ? (
          <TodosBoxes todoState={todosState} />
        ) : (
          <main className="todo-empty-ctn">
            <h1 className="todo-empty-text">
              Empty! Click on <span className="todo-empty-spanadd">Add</span> to
              add a new task.
            </h1>
          </main>
        )}
      </div>
    </>
  );
}
