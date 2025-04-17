// imports here for express and pg
import express from "express";
import path from "path";
import pg from "pg";

//import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

const client = new pg.Client(
  process.env.DATABASE_URL ||
    "postgres://mustafa:password@localhost/acme_notes_db"
);

//app.use(cors);
app.listen(PORT, () => {
  console.log(`Listening on Port: ${PORT}`);
});

// create your init function
const init = async () => {
  try {
    await client.connect();
    const SQL = `DROP TABLE IF EXISTS employees;
CREATE TABLE employees(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255),
    is_admin BOOLEAN DEFAULT FALSE

);
INSERT INTO employees(name) VALUES('arman sonic');
    INSERT INTO employees(name) VALUES('sana fozen');
   INSERT INTO employees(name, is_admin) VALUES('elina shek', true);
`;
    await client.query(SQL);
    console.log("********************data seeded");
  } catch (error) {
    console.error(error);
  }
};

// static routes here (you only need these for deployment)

// app routes here
app.get("/api/employees", async (req, res) => {
  //res.send("Does this work");
  try {
    const SQL = `SELECT * from employees`;
    const response = await client.query(SQL);
    res.status(200).send(response.rows);
  } catch (error) {
    res.status(400).send("Oh Oh, something broke");
  }
});

// init function invocation
init();
