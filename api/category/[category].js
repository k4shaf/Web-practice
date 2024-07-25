import mongoose from 'mongoose';
import Product from '../../models/product';

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function connectToMongoDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI, clientOptions);
  }
}

export default async function handler(req, res) {
  const { category } = req.query;

  await connectToMongoDB();

  try {
    let products;
    let displayCategory = category === 'all' ? 'products' : category.charAt(0).toUpperCase() + category.slice(1);
    
    if (category === 'all') {
      products = await Product.find({});
    } else {
      products = await Product.find({ category: displayCategory });
    }

    // Render EJS template
    res.render('products', { products, category: displayCategory });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Internal Server Error');
  }
}
