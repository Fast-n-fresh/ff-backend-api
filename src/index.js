const express = require("express");
const app = new express();
const port = process.env.PORT || 5000;
const mongoose = require("./db/mongoose");
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");
mongoose();
app.use(express.json());
app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.listen(port, () => {
  console.log(`Server up on port ${port}`);
});
