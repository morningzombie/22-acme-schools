import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [students, setStudents] = useState([]);
  const [schools, setSchools] = useState([]);
  const [name, setName] = useState([]);
  const [schoolName, setSchoolName] = useState([]);
  const [enrollee, setEnrollee] = useState([]);

  useEffect(() => {
    axios.get("/api/students").then(response => setStudents(response.data));
  }, []);

  useEffect(() => {
    axios.get("/api/schools").then(response => setSchools(response.data));
  }, []);

  const createStudent = ev => {
    ev.preventDefault();
    axios
      .post("/api/students", { name })
      .then(response => setStudents([response.data, ...students]))
      .then(() => setName(""));
  };
  const createSchool = ev => {
    ev.preventDefault();
    axios
      .post("/api/schools", { schoolName })
      .then(response => setSchools([response.data, ...schools]))
      .then(() => setSchoolName(""));
  };
  const enrollStudent = ev => {
    ev.preventDefault();
    axios
      .post("/api/schools", { enrollee })
      .then(response => setSchools([response.data, ...schools]))
      .then(() => setEnrollee(""));
  };
  return (
    <div>
      <div>Acme Schools</div>
      <div>
        <h2>Students</h2>
        <form onSubmit={createStudent}>
          <h3>Add A Student</h3>
          <div>
            <input value={name} onChange={ev => setName(ev.target.value)} />
            <button onClick={createStudent}>Add Student</button>
          </div>
        </form>

        <ul>
          {students.map(student => {
            return (
              <li key={student.id}>
                {student.name}
                {student.status}
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <h2>Schools</h2>
        <form onSubmit={createSchool}>
          <h3>Add A School</h3>
          <div>
            <input
              value={schoolName}
              onChange={ev => setSchoolName(ev.target.value)}
            />
            <button onClick={createSchool}>Add School</button>
          </div>
        </form>
        <ul>
          {schools.map(school => {
            return (
              <li key={school.id}>
                {school.name}
                <br />
                {students.map(student => {
                  if (student.id === school.students_id) {
                    return student.name;
                  }
                })}
              </li>
            );
          })}
        </ul>
      </div>
      {/* <div>
        <h2>Unenrolled Students</h2>
        <ul>
          {students.map(student => {
            if (student.status === null) {
              return <li key={student.id}>{student.name}</li>;
            }
          })}
        </ul>
      </div> */}

      <ul>
        {schools.map(school => {
          return (
            <li className="enrollBox" key={school.id}>
              {school.name}
              <br />
              <form onSubmit={enrollStudent}>
                <h3>Enroll A Student</h3>

                <select>
                  {students.map(student => {
                    if (student.status === null) {
                      return (
                        <option
                          key={student.id}
                          value={enrollee}
                          onChange={ev => setEnrollee(ev.target.value)}
                        >
                          {student.name}
                        </option>
                      );
                    }
                  })}
                </select>
                <button onClick={enrollStudent}>Enroll Student</button>
                {/* <div>
                  <input
                    value={enrollee}
                    onChange={ev => setEnrollee(ev.target.value)}
                  />
                  <button onClick={enrollStudent}>Enroll Student</button>
                </div> */}
              </form>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default App;
