require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/product')
const path = require('path');
const app = express();
const port = 8080;

// middlewares
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await mongoose.disconnect();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.listen(port, () => {
  console.log(`server is listening to port ${port}!`)
});

// Route for the album page
app.get('/categories', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'album.html'));
});

app.get('/categories/:category', async (req, res) => {
  let category = req.params.category;
  try {
    let products;
    if (category === 'all') {
      products = await Product.find({});
      category = 'products';
    } else {
      category = category.charAt(0).toUpperCase() + category.slice(1);
      products = await Product.find({ category });
    }
    res.render('products', { products, category });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Login lekin abhi dashboard ni hai sadly
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.post('/dashboard/new', async (req, res) => {
  let newProduct = new Product(req.body.product);
  await newProduct.save();
  // TDL: error handling
})

// 404
app.use((req, res) => {
  res.send('Page not found');
  // res.sendFile(path.join(__dirname, 'views', 'error.html'));
})