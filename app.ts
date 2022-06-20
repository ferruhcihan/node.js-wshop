export {};
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const productRouter = require("./routes/product");
const orderRouter = require("./routes/order");
const cartRouter = require("./routes/cart");

dotenv.config();

main()
  .then(() => console.log("DB Connection is Successful!"))
  .catch((err) => console.log("DB Connection Error: ", err));

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
}

app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/cart", cartRouter);

app.listen(process.env.PORT || 4000, process.env.HOST, () => {
  console.log("Backend server is running!");
});
