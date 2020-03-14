import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [students, setStudents] = useState([]);
  const [schools, setSchools] = useState([]);
  const [name, setName] = useState([]);
  const [schoolName, setSchoolName] = useState([]);
  const [enrollee, setEnrollee] = useState({
    studentId: "",
    enrollmentStatus: true,
    schoolId: ""
  });
  //console.log(enrollee);
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
  const unEnroll = studentToUnenroll => {
    axios
      .delete(`/api/students/${studentToUnenroll.student_id}`)
      .then(() =>
        setStudents(
          students.filter(
            student => student.student_id !== studentToUnenroll.student_id
          )
        )
      );
  };

  const deleteSchool = schoolToDelete => {
    axios
      .delete(`/api/schools/${schoolToDelete.school_id}`)
      .then(() =>
        setSchools(
          schools.filter(
            school => school.school_id !== schoolToDelete.school_id
          )
        )
      );
  };
  const handleChange = (event, school, enrollee) => {
    console.log("called handle change with : ", event, school, enrollee);
    // find out if we can get the option's value  (student's id)from the event target
    setEnrollee({
      studentId: enrollee.student_id,
      enrollmentStatus: true,
      schoolId: school.school_id
    });
  };
  // const enrollStudent = ev => {
  //   ev.preventDefault();
  //   axios.post("/api/students", { enrollee }).then(response =>
  //     setStudents([
  //       ...students,
  //       {
  //         studentId: response.data.student_id,
  //         enrollmentStatus: true,
  //         schoolId: response.data.school_id
  //       }
  //     ]).then(() => setEnrollee())
  //   );
  // };

  return (
    <div>
      <h1>Acme Schools</h1>
      Total Schools {schools.length}
      <br />
      Total Students {students.length}
      <div className="flex-container">
        <div>
          <form onSubmit={createStudent}>
            <h3>Create A Student</h3>
            <div>
              <input
                className="boxes"
                value={name}
                onChange={ev => setName(ev.target.value)}
              />

              <select className="select">
                {schools.map(school => {
                  return <option>{school.school_name}</option>;
                })}
              </select>

              <button className="btn" onClick={createStudent}>
                Add Student
              </button>
            </div>
          </form>
        </div>

        <div>
          <form onSubmit={createSchool}>
            <h3>Create A School</h3>
            <div>
              <input
                className="boxes"
                value={schoolName}
                onChange={ev => setSchoolName(ev.target.value)}
              />
              <button className="btn" onClick={createSchool}>
                Add School
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* SECOND SECTION */}
      <div>
        <div className="flex-container3">
          <div id="one" className="center">
            <h3>Unenrolled Students</h3>
            <ul>
              {students.map(student => {
                if (student.enrollment_status === null) {
                  return (
                    <li
                      className="no-dot"
                      key={student.student_id}
                      // onChange={ev => setEnrollee(ev.target.value)}
                    >
                      {student.student_name}
                    </li>
                  );
                }
              })}
            </ul>
          </div>
        </div>

        <div className="flex-container2">
          <div id="two">
            <ul>
              {schools.map(school => {
                return (
                  <li className="no-dot box" key={schools.school_id}>
                    <h3>
                      {school.school_name}
                      <button
                        className="destroyButton"
                        onClick={() => deleteSchool(school)}
                      >
                        {" "}
                        x{" "}
                      </button>
                    </h3>
                    {/* ENROLLED STUDENTS */}
                    <div>
                      {students.map(student => {
                        if (student.school_id === school.school_id) {
                          return (
                            <div>
                              {student.student_name}{" "}
                              <button
                                className="destroyButton"
                                onClick={() => unEnroll(student)}
                              >
                                {" "}
                                Unenroll{" "}
                              </button>
                            </div>
                          );
                        }
                      })}
                    </div>

                    {/* ENROLLED STUDENTS ENDS */}

                    {/* UNENROLLED STUDENTS */}
                    <form onSubmit={handleChange}>
                      <div>
                        <select
                          data-id={school.school_id}
                          className="select2"
                          value={enrollee}
                          onChange={ev => setEnrollee(ev.target.value)}

                          // onChange={ev => handleChange(ev, school, student)}
                        >
                          <option value="none">Select A Student</option>;
                          {students.map(student => {
                            if (student.enrollment_status === null) {
                              return (
                                <option
                                  key={student.student_id}
                                  value={student.student_id}

                                  // onChange={ev =>
                                  //   handleChange(ev, school, student_id)
                                  // }
                                >
                                  {student.student_name}
                                </option>
                              );
                            }
                          })}
                        </select>
                      </div>
                    </form>
                    {/* UNENROLLED STUDENTS ENDS */}
                    <button onClick={handleChange}>Enroll</button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
// on change of the select,
// captrue the student id from the selectged option,
//reference that in the update call
export default App;

{
  /* <ul>
          {students.map(student => {
            return (
              <li key={student.student_id}>
                {student.student_name}
                {student.enrollment_status}
                <button
                  className="destroyButton"
                  onClick={() => unEnroll(student)}
                >
                  {" "}
                  x{" "}
                </button>
              </li>
            );
          })}
        </ul> */
}
