import React, {useState} from "react";
import useSound from "use-sound";
import mySound from "../assets/sounds/done.mp3";

export default function TodoForm() {
  const [input, setInput] = useState("");
  const [todosState, setTodosState] = useState(
    JSON.parse(localStorage.getItem("todos")) || []
  );
  const [subject, setSubject] = useState(
    JSON.parse(localStorage.getItem("subjects")) || []
  );

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

  const [playSound] = useSound(mySound);

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
                  onClick={() => {
                    const newTodos = allTodos.map((todoState) => {
                      if (todoState.id === todo.id) {
                        todoState.dropDownOpened = !todoState.dropDownOpened;
                      }
                      return todoState;
                    });
                    localStorage.setItem("todos", JSON.stringify(newTodos));
                    setTodosState(newTodos);
                  }}
                  className="todo-subject-btn-main"
                >
                  {subject.find((subjectItem) => {
                    return subjectItem === todo.subject;
                  }) || "Add subject"}
                </button>

                {todo.dropDownOpened && (
                  <div className="todo-subject-content">
                    {/* An input element that will push subjects to subject state */}
                    <input
                      type="text"
                      className="todo-subject-input"
                      placeholder="Add a subject"
                      onKeyDown={(event) => {
                        if (
                          event.key === "Enter" ||
                          event.key === "Tab" ||
                          event.keyCode === 13
                        ) {
                          if (event.target.value === "") {
                            return;
                          }
                          const newSubject = event.target.value;
                          const newSubjects = [...subject, newSubject];
                          localStorage.setItem(
                            "subjects",
                            JSON.stringify(newSubjects)
                          );
                          setSubject(newSubjects);
                        }
                      }}
                      autoFocus
                      autoComplete="off"
                    />
                    <font className="todo-subject-subheader">
                      Select a subject or create one
                    </font>
                    {subject.map((subjectItem, index) => {
                      return (
                        <div className="todo-subject">
                          <button
                            onClick={() => {
                              const newTodos = allTodos.map((todoState) => {
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
                            onClick={() => {
                              const newSubject = subject.filter(
                                (subjectItem, subjectIndex) => {
                                  return subjectIndex !== index;
                                }
                              );

                              localStorage.setItem(
                                "subjects",
                                JSON.stringify(newSubject)
                              );

                              setSubject(newSubject);
                            }}
                            className="todo-subject-delete-btn"
                          >
                            ❌
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <input
                type="text"
                className="todo-edit"
                style={taskEditStyle()}
                defaultValue={taskDefaultValue()}
                placeholder="Enter a task"
                onChange={editHandleChange()}
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
