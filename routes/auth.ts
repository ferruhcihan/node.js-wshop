const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//! REGISTER
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const newUser = new User({
    username,
    email,
    password: CryptoJS.AES.encrypt(
      password,
      process.env.PASS_SEC_KEY
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

//! LOGIN
router.post("/login", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.findOne({ username });
    !user && res.status(401).json("Wrong credentials!");

    const dbPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC_KEY
    ).toString(CryptoJS.enc.Utf8);

    if (dbPassword !== password) {
      res.status(401).json("Wrong credentials!");
    } else {
      const { password, ...rest } = user._doc;
      const accessToken = jwt.sign(
        {
          id: user._id,
          isAdmin: user.isAdmin,
        },
        process.env.JWT_SEC_KEY,
        { expiresIn: "3d" }
      );

      res.status(200).json({ ...rest, accessToken });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
