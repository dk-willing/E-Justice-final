const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");

const db = process.env.DATABSE_CONNECTION_STRING.replace(
  "<db_password>",
  process.env.DATABSE_PASSWARD
);

// const db = process.env.DATABASE_CONNECTION_STRING.replace(
//   "<db_password>",
//   process.env.DATABASE_PASSWORD
// );

// MongoDB Connection
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
