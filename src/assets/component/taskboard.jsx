import { useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"; 
import { FaTrash, FaEdit, FaSignOutAlt } from "react-icons/fa";
import { auth, onAuthStateChanged, signInWithGoogle, signOutUser } from "../../fierbase.config";
import TaskBanner from "./taskcard";

const TaskBoard = () => {
    const [tasks, setTasks] = useState([]);
    const [user, setUser] = useState(null);
    const [newTask, setNewTask] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newCategory, setNewCategory] = useState("To-Do");
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user) {
            fetchTasks();
        }
    }, [user]);

    const fetchTasks = async () => {
        if (!user) return;
        try {
            const res = await axios.get("https://tesk2-rouge.vercel.app/tasks", {
                params: { uid: user.uid },
            });
            setTasks(res.data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const addTask = async () => {
        if (!newTask.trim() || !user) return;
        if (newTask.length > 50) {
            alert("Title must be less than 50 characters.");
            return;
        }
        if (newDescription.length > 200) {
            alert("Description must be less than 200 characters.");
            return;
        }

        try {
            const newTaskData = {
                title: newTask,
                description: newDescription,
                category: newCategory,
                timestamp: new Date(),
                uid: user.uid,
            };

            const res = await axios.post("https://tesk2-rouge.vercel.app/tasks", newTaskData);
            setTasks((prev) => [...prev, res.data.task]); 
            resetForm();
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    const deleteTask = async (id) => {
        try {
            await axios.delete(`https://tesk2-rouge.vercel.app/tasks/${id}`);
            setTasks((prev) => prev.filter((task) => task._id !== id));
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const editTask = async () => {
        if (!editingTask || !newTask.trim()) return;
        if (newTask.length > 50) {
            alert("Title must be less than 50 characters.");
            return;
        }
        if (newDescription.length > 200) {
            alert("Description must be less than 200 characters.");
            return;
        }

        const updatedTaskData = {
            title: newTask,
            description: newDescription,
            category: newCategory,
        };

        setTasks((prev) =>
            prev.map((task) =>
                task._id === editingTask._id ? { ...task, ...updatedTaskData } : task
            )
        );

        try {
            await axios.put(
                `https://tesk2-rouge.vercel.app/tasks/${editingTask._id}`,
                updatedTaskData
            );
            resetForm();
        } catch (error) {
            console.error("Error editing task:", error);
        }
    };

    const onDragEnd = async (result) => {
        if (!result.destination) return;

        const { source, destination } = result;

        const updatedTasks = [...tasks];
        const [movedTask] = updatedTasks.splice(source.index, 1);
        if (source.droppableId !== destination.droppableId) {
            movedTask.category = destination.droppableId;
        }
        updatedTasks.splice(destination.index, 0, movedTask);
        setTasks(updatedTasks);

        try {
            await axios.put(`https://tesk2-rouge.vercel.app/tasks/${movedTask._id}`, {
                category: movedTask.category,
                timestamp: new Date(),
            });
        } catch (error) {
            console.error("Error updating task order:", error);
            fetchTasks(); 
        }
    };

    const resetForm = () => {
        setNewTask("");
        setNewDescription("");
        setNewCategory("To-Do");
        setEditingTask(null);
    };
    

    return (
        <div className="p-6 max-w-5xl mx-auto">
            {!user ? (
                <div>
                    <TaskBanner></TaskBanner>
                </div>
            ) : (
                <>
                    {/* User Profile Section */}
                    <div className="flex justify-between items-center bg-gray-200 p-4 rounded-lg shadow mb-6">
                        <div className="flex items-center gap-4">
                            <img
                                src={user.photoURL}
                                alt="User"
                                className="w-12 h-12 rounded-full border border-gray-300"
                            />
                            <div>
                                <h2 className="text-lg text-black font-bold">{user.displayName}</h2>
                                <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                        </div>
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded shadow flex items-center gap-2"
                            onClick={() => {
                                signOutUser();
                                setUser(null); 
                            }}
                        >
                            <FaSignOutAlt /> Sign Out
                        </button>
                    </div>

                    <div className="flex gap-2 mb-6 text-black">
                        <input
                            className="border p-2 w-full rounded"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            placeholder="Enter task title (max 50 characters)"
                            maxLength="50"
                        />
                        <input
                            className="border p-2 w-full rounded"
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            placeholder="Enter task description (max 200 characters)"
                            maxLength="200"
                        />
                        <select
                            className="border p-2 w-full rounded text-black"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                        >
                            <option value="To-Do">To-Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                        </select>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded shadow"
                            onClick={editingTask ? editTask : addTask}
                        >
                            {editingTask ? "Save Changes" : "+ Add Task"}
                        </button>
                    </div>

                    <DragDropContext onDragEnd={onDragEnd}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {["To-Do", "In Progress", "Done"].map((category) => (
                                <Droppable key={category} droppableId={category}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className={`p-4 min-h-[250px] rounded-md shadow-md ${category === "To-Do"
                                                ? "bg-red-100"
                                                : category === "In Progress"
                                                    ? "bg-yellow-100"
                                                    : "bg-green-100"
                                                }`}
                                        >
                                            <h2 className="text-xl font-bold mb-3 text-black">{category}</h2>

                                            {tasks
                                                .filter((task) => task.category === category)
                                                .map((task, index) => (
                                                    <Draggable key={task._id} draggableId={task._id} index={index}>
                                                        {(provided) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className="bg-white p-3 flex justify-between items-center rounded shadow-md mb-2"
                                                            >
                                                                <div className="text-black">
                                                                    <strong>Title: {task.title}</strong>
                                                                    <p> Dis: {task.description}</p>
                                                                    <p>Time: {task.timestamp}</p>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <button
                                                                        onClick={() => {
                                                                            setEditingTask(task);
                                                                            setNewTask(task.title);
                                                                            setNewDescription(task.description);
                                                                            setNewCategory(task.category);
                                                                        }}
                                                                        className="text-blue-500"
                                                                    >
                                                                        <FaEdit />
                                                                    </button>
                                                                    <button onClick={() => deleteTask(task._id)} className="text-red-500">
                                                                        <FaTrash />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            ))}
                        </div>
                    </DragDropContext>
                </>
            )}
        </div>
    );
};

export default TaskBoard;
