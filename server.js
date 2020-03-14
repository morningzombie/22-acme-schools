const express = require("express");
const app = express();
const path = require("path");
const db = require("./db");
app.use(express.json());
app.use(express.static(__dirname + "/assets"));
app.use("/dist", express.static(path.join(__dirname, "dist")));

app.get("/", (req, res, next) =>
  res.sendFile(path.join(__dirname, "index.html"))
);

app.get("/api/students", (req, res, next) => {
  db.readStudents()
    .then(students => {
      res.send(students);
    })
    .catch(next);
});
app.get("/api/schools", (req, res, next) => {
  db.readSchools()
    .then(schools => {
      res.send(schools);
    })
    .catch(next);
});

app.post("/api/students", (req, res, next) => {
  db.createStudent(req.body)
    .then(student => {
      res.send(student);
    })
    .catch(next);
});
app.post("/api/schools", (req, res, next) => {
  db.createSchool(req.body)
    .then(school => {
      res.send(school);
    })
    .catch(next);
});

app.delete("/api/students/:student_id", (req, res, next) => {
  db.deleteStudent(req.params.id)
    .then(() => res.sendStatus(204))
    .catch(next);
});
app.delete("/api/schools/:school_id", (req, res, next) => {
  db.deleteSchool(req.params.id)
    .then(() => res.sendStatus(204))
    .catch(next);
});
app.put("/api/students/:student_id", (req, res, next) => {
  db.enrollStudent(req.body)
    .then(student => {
      res.send(student);
    })
    .catch(next);
});
const port = process.env.PORT || 3080;

db.sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
  })
  .catch(err => {
    console.log(err);
  });
