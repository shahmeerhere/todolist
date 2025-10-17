"use client"
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { BiMessageSquareEdit } from "react-icons/bi";
import { RiDeleteBin7Line } from "react-icons/ri";
import { IoAdd } from "react-icons/io5";
import { FaTasks, FaHome, FaUserCircle, FaSun, FaMoon, FaBars } from "react-icons/fa";

function App() {
  const [showFinished, setShowFinished] = useState(true);
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const str = localStorage.getItem("todos");
    if (str) setTodos(JSON.parse(str));
  }, []);

  const saveToLS = (updatedTodos) => {
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  const handleEdit = (e, id) => {
    const t = todos.find((i) => i.id === id);
    setTodo(t.todo);
    const newTodos = todos.filter((item) => item.id !== id);
    setTodos(newTodos);
    saveToLS(newTodos);
  };

  const handleDelete = (e, id) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    const newTodos = todos.filter((item) => item.id !== id);
    setTodos(newTodos);
    saveToLS(newTodos);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (todo.trim() === "" || todo.length < 3) return;
    const newTodos = [...todos, { id: uuidv4(), todo, isCompleted: false }];
    setTodos(newTodos);
    setTodo("");
    saveToLS(newTodos);
  };

  const handleChange = (e) => setTodo(e.target.value);

  const handleCheckbox = (e) => {
    const id = e.target.name;
    const index = todos.findIndex((item) => item.id === id);
    const newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    setTodos(newTodos);
    saveToLS(newTodos);
  };

  const completedTasks = todos.filter((t) => t.isCompleted).length;

  return (
    <div className={`${darkMode ? "bg-slate-900 text-slate-100" : "bg-slate-100 text-slate-900"} min-h-screen flex flex-col md:flex-row`}>
      
      {/* Sidebar for md+ */}
      <aside className={`${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-300"} md:w-64 p-6 flex flex-col justify-between border-r shadow-lg fixed md:static top-0 left-0 h-full md:h-auto z-50 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div>
          <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-orange-500">iTask</h1>
          <ul className="flex flex-col gap-6 text-lg font-medium">
            <li className="flex items-center gap-2 hover:text-violet-500 cursor-pointer"><FaHome /> Home</li>
            <li className="flex items-center gap-2 hover:text-violet-500 cursor-pointer"><FaTasks /> Tasks</li>
            <li className="flex items-center gap-2 hover:text-violet-500 cursor-pointer"><FaUserCircle /> Profile</li>
          </ul>
        </div>

        {/* Theme Toggle */}
        <div className="flex items-center justify-between mt-8 p-2 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors duration-300" onClick={() => setDarkMode(!darkMode)}>
          <span>Theme</span>
          {darkMode ? <FaSun /> : <FaMoon />}
        </div>

        {/* Stats */}
        <div className="mt-6 p-4 rounded-lg bg-violet-600 text-white shadow-md">
          <p className="font-semibold text-lg">Tasks Overview</p>
          <p>Completed: {completedTasks}</p>
          <p>Pending: {todos.length - completedTasks}</p>
        </div>
      </aside>

      {/* Mobile top nav */}
      <div className="md:hidden flex justify-between items-center p-4 bg-slate-800 border-b border-slate-700">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-orange-500">iTask</h1>
        <div className="flex items-center gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-xl"><FaBars /></button>
          <button onClick={() => setDarkMode(!darkMode)} className="text-xl">{darkMode ? <FaSun /> : <FaMoon />}</button>
        </div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setSidebarOpen(false)}></div>}

      {/* Main Content */}
      <main className="flex-1 p-6 md:ml-64 mt-0 md:mt-0">
        {/* Add Todo */}
        <section className="mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-violet-400">Add a New Task</h2>
          <form onSubmit={handleAdd} className="flex gap-3 flex-col sm:flex-row">
            <input 
              onChange={handleChange} 
              value={todo} 
              type="text"
              placeholder="What needs to be done?"
              className={`${darkMode ? "bg-slate-700 border-slate-600" : "bg-white border-slate-300"} flex-1 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-300`}
            />
            <button 
              type="submit"
              disabled={todo.length < 3} 
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:bg-violet-800 disabled:cursor-not-allowed text-white font-semibold transition-colors duration-300"
            >
              <IoAdd size={22} />
              <span className="hidden md:inline">Add</span>
            </button>
          </form>
        </section>

        {/* Controls */}
        <section className="flex justify-between items-center mb-4 border-t border-slate-700 pt-4">
          <h2 className="text-xl md:text-2xl font-bold">Your Tasks</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">Show Finished</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" onChange={() => setShowFinished(!showFinished)} checked={showFinished} className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-violet-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
            </label>
          </div>
        </section>

        {/* Todos List */}
        <section className="todos flex flex-col gap-3">
          {todos.length === 0 && <div className="font-light text-slate-400 m-5 text-center">No Tasks Yet! Add one above.</div>}
          {todos.map(item => (showFinished || !item.isCompleted) && (
            <div key={item.id} className={`${darkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-white hover:bg-slate-100"} flex items-center justify-between p-3 md:p-4 rounded-xl shadow-md transition-colors duration-300 group`}>
              <div className="flex items-center gap-4 flex-1">
                <input 
                  name={item.id} 
                  type="checkbox" 
                  checked={item.isCompleted} 
                  onChange={handleCheckbox}
                  className="w-5 h-5 accent-violet-500 cursor-pointer"
                />
                <p className={`flex-1 text-lg md:text-base ${item.isCompleted ? "line-through text-slate-400" : ""}`}>
                  {item.todo}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={(e) => handleEdit(e, item.id)} className="relative p-2 rounded-md hover:bg-slate-500 transition-colors duration-300">
                  <BiMessageSquareEdit size={20} />
                </button>
                <button onClick={(e) => handleDelete(e, item.id)} className="relative p-2 rounded-md text-slate-300 hover:bg-slate-500 hover:text-red-400 transition-colors duration-300">
                  <RiDeleteBin7Line size={20} />
                </button>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default App;
