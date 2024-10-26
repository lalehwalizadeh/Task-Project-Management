import React, { createContext, useState } from 'react';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <TaskContext.Provider value={{ tasks, setTasks, searchTerm, setSearchTerm }}>
            {children}
        </TaskContext.Provider>
    );
};