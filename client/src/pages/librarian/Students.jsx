import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Students = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const response = await axios.get('http://localhost:5000/api/students');
      setStudents(response.data);
    };
    fetchStudents();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-3xl font-semibold mb-6">Student List</h2>
      <ul>
        {students.map((student) => (
          <li key={student._id}>
            {student.name} ({student.email})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Students;
