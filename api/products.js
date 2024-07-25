import mongoose from 'mongoose';
import Product from '../../models/product';

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function connectToMongoDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI, clientOptions);
  }
}

export default async function handler(req, res) {
  await connectToMongoDB();
  const { category } = req.query;

  try {
    let products;
    if (category === 'all') {
      products = await Product.find({});
    } else {
      let displayCategory = category.charAt(0).toUpperCase() + category.slice(1);
      products = await Product.find({ category: displayCategory });
    }
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Internal Server Error');
  }
}
