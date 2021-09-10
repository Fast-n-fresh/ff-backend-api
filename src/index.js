const express = require("express");
const app = new express();
const port = process.env.PORT || 5000;
const mongoose = require("./db/mongoose");
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");
const deliveryBoyRouter = require("./routes/deliveryBoy");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: "1.0.0",
      title: "Fast-n-Fresh  API",
      description: "Fast-n-Fresh API Documentation ",
      contact: {
        name: "Burhanuddin Merchant",
      },
      servers: [`http://localhost:${port}`],
    },
  },
  // ['.routes/*.js']
  apis: ["index.js"],
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));
mongoose();
app.use(express.json());

app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.use("/deliveryBoy", deliveryBoyRouter);
app.listen(port, () => {
  console.log(`Server up on port ${port}`);
});
