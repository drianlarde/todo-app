import React, {useState} from "react";

export default function TodoForm(props) {
  const [input, setInput] = useState("");
  const [todosState, setTodosState] = useState(
    // Local storage
    JSON.parse(localStorage.getItem("todos")) || []
  );

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
      text: input,
      done: false,
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
    return todosState.map(TodosBox());

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
                  onChange={checkboxHandleChange()}
                />
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

        function checkboxHandleChange() {
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
          };
        }
      };
    }
  }

  return (
    <div className="todo-form-fragment">
      <form className="todo-form" onSubmit={onSubmitForm}>
        <input
          className="todo-input"
          type="text"
          placeholder="Add a todo..."
          value={input}
          name="text"
          onChange={handleChange}
        />
        <button className="todo-add">Add</button>
      </form>
      {todosState.length > 0 ? (
        <TodosBoxes />
      ) : (
        <main className="todo-empty-ctn">
          <h1 className="todo-empty-text">
            Empty! Click on <span className="todo-empty-spanadd">Add</span> to
            add a new task.
          </h1>
        </main>
      )}
    </div>
  );
}
