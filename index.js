// const port = 4000;
// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const jwt = require("jsonwebtoken");
// const multer = require("multer");
// const path = require("path");
// const cors =  require("cors");
// const { log } = require("console");

// app.use(express.json());
// app.use(cors());

// //Database Connection with MongoDB
// mongoose.connect("mongodb://127.0.0.1:27017/e-commerce");

// //API Creation

// app.get("/",(req,res) => {
//     res.send("Express app is running")
// })

// //Image Storage Engine
// const storage = multer.diskStorage({
//     destination: './upload/images',
//     filename: (req,file,cb) => {
//         return cb (null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
//     }
// })

// const upload = multer({storage:storage})

// //Creating Upload Endpoint for image
// app.use('/images', express.static(path.join(__dirname, 'upload', 'images')));


// app.post("/upload",upload.single('product'),(req,res) => {
//     res.json({
//         success:1,
//         image_url:`http://localhost:${port}/images/${req.file.filename}`
//     })
// })

// //Schem for creating Products

// const Product = mongoose.model("Product",{
//     id:{
//         type: Number,
//         required:true,
//     },
//     name:{
//         type:String,
//         required:true,
//     },
//     image:{
//         type:String,
//         required:true,
//     },
//     category:{
//         type:String,
//         required:true,
//     },
//     new_price:{
//         type:Number,
//         required:true,
//     },
//     old_price:{
//         type:Number,
//         required:true,
//     },
//     date:{
//         type:Date,
//         default:Date.now,
//     },
//     available:{
//         type:Boolean,
//         default:true,
//     }
// })

// app.post('/addproduct', async(req,res) =>{
//     let products = await Product.find({});
//     let id;
//     if (products.length > 0)
//     {
//         let last_product_array = products.slice(-1);
//         let last_product = last_product_array[0];
//         id = last_product.id + 1;
//     }
//     else {
//         id = 1;
//     }
//     const product = new Product({
//         id:id,
//         name:req.body.name,
//         image:req.body.image,
//         category:req.body.category,
//         new_price:req.body.new_price,
//         old_price:req.body.old_price,
//     });

//     console.log(product);
//     await product.save();
//     console.log("Saved");
//     res.json({
//         success:true,
//         name:req.body.name,
//     })
// })

// //Creating APi for deleteing products

// app.post('/removeproduct', async (req,res) => {
//     await Product.findOneAndDelete({id:req.body.id});
//     console.log("Removed");
//     res.json({
//         success:true,
//         name:req.body.name,
//     })
// })

// //Creating API for getting all products

// app.get('/allproducts', async(req,res) => {
//     let products = await Product.find({});
//     console.log("All Products Fetched");
//     res.send(products);
// })

// //Schema creating for User Model

// const Users = mongoose.model('Users',{
//     name:{
//         type:String,
//     },
//     email:{
//         type:String,
//         unique:true,
//     },
//     password:{
//         type:String,
//     },
//     cartData:{
//         type:Object,
//     },
//     date:{
//         type:Date,
//         default:Date.now,
//     }
// })

// //Creating Endpoiunt for registering the User

// app.post('/signup',async(req,res) => {
//     let check = await Users.findOne({email:req.body.email});
//     if(check) {
//         return res.status(400).json({success:false,errors:"Existing User Found with same email address"})
//     }
//     let cart = {};
//     for (let i=0; i<300; i++) {
//         cart[i]=0;
//     }
//     const user = new Users({
//         name:req.body.username,
//         email:req.body.email,
//         password:req.body.password,
//         cartData: cart,
//     })

//     await user.save();

//     const data = {
//         user:{
//             id:user.id
//         }
//     }

//     const token = jwt.sign(data,'secret_ecom');
//     res.json({success:true,token})
// })

// //Creating endpoint for user Login

// app.post('/login',async(req, res) => {
//     let user = await Users.findOne({email:req.body.email});
//     if(user) {
//         const passCompare = req.body.password === user.password;
//         if (passCompare) {
//             const data = {
//                 user:{
//                     id:user.id
//                 }
//             }
//             const token = jwt.sign(data,'secret_ecom');
//             res.json({success:true,token});
//         }
//         else{
//             res.json({success:false,errors:"Wrong Password"});
//         }
//     }
//     else{
//         res.json({success:false,errors:"Wrong Email Address"})
//     }
// })

// //Creating endpoint for new collection data

// app.get('/newcollections',async(req,res)=>{
//     let products = await Product.find({});
//     let newcollection = products.slice(1).slice(-8);
//     console.log("New Collection Fetched");
//     res.send(newcollection);
// })

// //Cresting endpoint for popular in women section

// app.get('/popularinwomen',async(req,res)=>{
//     let products = await Product.find({category:"women"});
//     let popular_in_women = products.slice(0,4);
//     console.log("popular in women Fetched");
//     res.send(popular_in_women);
// })

// //Creatinf Middleware to fetch user

// const fetchUser = async(req,res,next) =>{
//     const token = req.header('auth-token');
//     if(!token){
//         res.status(401).send({errors:"Please authenticate using vlaid token"})
//     }
//     else{
//         try{
//             const data = jwt.verify(token,'secret_ecom');
//             req.user = data.user;
//             next();
//         }
//         catch(error){
//             res.status(401).send({errors:"Please authenticate using vlaid token"})
//         }
//     }
// }
// //Creating endpoint for adding products in cartdata

// app.post('/addtocart',fetchUser, async (req, res) => {
//     console.log("added",req.body.itemId);
//     let userData = await Users.findOne({_id:req.user.id});
//     userData.cartData[req.body.itemId] += 1;
//     await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
//     res.send("Added")
// });

// //Creating endpoint to remove products from cartdata

// app.post('/removefromcart', fetchUser, async (req, res) => {
//     console.log("removed",req.body.itemId);
//     let userData = await Users.findOne({_id:req.user.id});
//     if(userData.cartData[req.body.itemId]>0)
//     userData.cartData[req.body.itemId] -= 1;
//     await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
//     res.send("Removed")
// })

// // Creating endpoint to get cartdata

// app.post('/getcart',fetchUser, async(req, res) => {
//     console.log('Get Cart');
//     let userData = await Users.findOne({_id:req.user.id});
//     res.json(userData.cartData);
// })

// app.listen(port,(error)=>{
//     if (!error) {
//         console.log("Server Running on Port" +port);
//     }
//     else {
//         console.log("Error:" +error);
//     }
// });

require("dotenv").config(); // Load environment variables from .env
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Environment Variables
const port = process.env.PORT || 4000;
const dbURL = process.env.DB_URL;
const jwtSecret = process.env.JWT_SECRET;

// Database Connection
mongoose.connect(dbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("Database Connection Error:", error));

// Image Storage Engine
const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

// Serve Static Files
app.use('/images', express.static(path.join(__dirname, 'upload', 'images')));

// Basic Route
app.get("/", (req, res) => {
  res.send("Express app is running");
});

// Product Schema and Model
const Product = mongoose.model("Product", {
  id: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  new_price: { type: Number, required: true },
  old_price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
});

// Add Product Endpoint
app.post('/addproduct', async (req, res) => {
  try {
    const products = await Product.find({});
    const id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

    const product = new Product({
      id,
      name: req.body.name,
      image: req.body.image,
      category: req.body.category,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
    });

    await product.save();
    res.json({ success: true, name: req.body.name });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Remove Product Endpoint
app.post('/removeproduct', async (req, res) => {
  try {
    await Product.findOneAndDelete({ id: req.body.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get All Products Endpoint
app.get('/allproducts', async (req, res) => {
  try {
    const products = await Product.find({});
    res.send(products);
  } catch (error) {
    res.status(500).send("Error fetching products");
  }
});

// User Schema and Model
const User = mongoose.model('User', {
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  cartData: { type: Object },
  date: { type: Date, default: Date.now },
});

// Register User Endpoint
app.post('/signup', async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: "User already exists" });
    }

    const cart = Array(300).fill(0).reduce((acc, _, idx) => ({ ...acc, [idx]: 0 }), {});
    const user = new User({
      name: req.body.username,
      email: req.body.email,
      password: req.body.password,
      cartData: cart,
    });

    await user.save();

    const token = jwt.sign({ user: { id: user.id } }, jwtSecret);
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Login User Endpoint
app.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || user.password !== req.body.password) {
      return res.status(400).json({ success: false, error: "Invalid credentials" });
    }

    const token = jwt.sign({ user: { id: user.id } }, jwtSecret);
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Middleware to Fetch User
const fetchUser = (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) {
    return res.status(401).send({ error: "Please authenticate using a valid token" });
  }

  try {
    const data = jwt.verify(token, jwtSecret);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Invalid token" });
  }
};

// Add to Cart Endpoint
app.post('/addtocart', fetchUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.cartData[req.body.itemId] = (user.cartData[req.body.itemId] || 0) + 1;
    await user.save();
    res.send("Added");
  } catch (error) {
    res.status(500).send("Error adding to cart");
  }
});

// Get Cart Data Endpoint
app.post('/getcart', fetchUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.cartData);
  } catch (error) {
    res.status(500).send("Error fetching cart data");
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
