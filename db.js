const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/acme_school_db"
);

client.connect();
const sync = async () => {
  const SQL = `
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

  DROP TABLE IF EXISTS students;
  DROP TABLE IF EXISTS schools;

  CREATE TABLE schools(
    school_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_name VARCHAR(50) NOT NULL);

    CREATE TABLE students(
      student_id UUID PRIMARY KEY default uuid_generate_v4(),
      student_name VARCHAR(50),
      enrollment_status BOOLEAN,
      school_id UUID REFERENCES schools(school_id));

      INSERT INTO schools (school_name) VALUES ('Wake Forest');
      INSERT INTO schools (school_name) VALUES ('Duke University');
      INSERT INTO schools (school_name) VALUES ('Appalachian State');
      INSERT INTO schools (school_name) VALUES ('UNC-Chapel Hill');
      INSERT INTO schools (school_name) VALUES ('UNC-Greensboro');


      INSERT INTO students (student_id, student_name, enrollment_status, school_id)
      VALUES
      (uuid_generate_v4(), 'larry', null, null),
      (uuid_generate_v4(), 'curly', null, null),
      (uuid_generate_v4(), 'lucy', true, (SELECT school_id FROM schools where schools.school_name = 'UNC-Chapel Hill')),
      (uuid_generate_v4(), 'moe', true, (SELECT school_id FROM schools where schools.school_name = 'Wake Forest'))
  `;

  await client.query(SQL);
};

const readStudents = async () => {
  return (await client.query("SELECT * FROM students")).rows;
};
const readSchools = async () => {
  return (await client.query("SELECT * FROM schools")).rows;
};
const createStudent = async ({ name }) => {
  return (
    await client.query(
      "INSERT INTO students(student_name) VALUES ($1) returning *",
      [name]
    )
  ).rows[0];
};
const createSchool = async ({ schoolName }) => {
  return (
    await client.query(
      "INSERT INTO schools(school_name) VALUES ($1) returning *",
      [schoolName]
    )
  ).rows[0];
};
const deleteStudent = async id => {
  const SQL = "DELETE FROM students WHERE student_id = $1";
  await client.query(SQL, [id]);
};
const deleteSchool = async id => {
  const SQL = "DELETE FROM schools WHERE school_id = $1";
  await client.query(SQL, [id]);
};
const enrollStudent = async ({ studentId, enrollmentStatus, schoolId }) => {
  return (
    await client.query(
      "INSERT INTO students WHERE student_id === studentId (enrollment_status, school_id) VALUES ($1, $2) returning *",
      [studentId, enrollmentStatus, schoolId]
    )
  ).rows[0];
};

// const updateSchool = async ({ school }) => {
//   const SQL =
//     'UPDATE schools SET schoolName = ($1) WHERE id = ($2) returning *';
//   return (await client.query(SQL, [school.name, school.id])).rows[0];
// };

// const updateStudent = async ({ student }) => {
//   const SQL = `UPDATE students SET studentName = ($1), studentSchool = ($2) WHERE id = ($3) returning *`;
//   return (
//     await client.query(SQL, [
//       student.studentName,
//       student.studentSchool,
//       student.id,
//     ])
//   ).rows[0];
// };

module.exports = {
  sync,
  readStudents,
  readSchools,
  createStudent,
  createSchool,
  deleteStudent,
  deleteSchool,
  enrollStudent
};
