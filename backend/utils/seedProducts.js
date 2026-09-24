import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Category from "../models/categoryModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

dotenv.config();

const products = [
  {
    name: "Cloud Knit Hoodie",
    brand: "Northline",
    description: "A soft everyday hoodie with a relaxed fit and brushed interior.",
    price: 68,
    quantity: 24,
    countInStock: 18,
    category: "Apparel",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85",
    rating: 4.8,
  },
  {
    name: "Mono Ceramic Set",
    brand: "Form House",
    description: "Minimal ceramic cups designed for slow mornings and clean counters.",
    price: 42,
    quantity: 16,
    countInStock: 12,
    category: "Home",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=85",
    rating: 4.6,
  },
  {
    name: "Everyday Leather Tote",
    brand: "Arc Goods",
    description: "A structured carryall with generous space for work, travel, and weekends.",
    price: 124,
    quantity: 11,
    countInStock: 8,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85",
    rating: 4.9,
  },
  {
    name: "Studio Wireless Headphones",
    brand: "Signal Lab",
    description: "Comfortable wireless headphones with rich sound and all-day battery life.",
    price: 149,
    quantity: 20,
    countInStock: 15,
    category: "Tech",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85",
    rating: 4.7,
  },
  {
    name: "Citrus + Cedar Candle",
    brand: "Kindred Wick",
    description: "A bright, warm soy candle with citrus peel, cedar, and amber notes.",
    price: 28,
    quantity: 30,
    countInStock: 26,
    category: "Wellness",
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=85",
    rating: 4.5,
  },
  {
    name: "Field Notes Backpack",
    brand: "Roam Supply",
    description: "A durable daily backpack with a padded laptop sleeve and easy-access pockets.",
    price: 96,
    quantity: 14,
    countInStock: 10,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=900&q=85",
    rating: 4.8,
  },
];

const demoReviews = [
  {
    name: "Aarav Sharma",
    rating: 5,
    comment: "Exactly as described and delivered quickly. I would buy it again.",
  },
  {
    name: "Mia Kapoor",
    rating: 4,
    comment: "Good quality and a clean design. It feels worth the price.",
  },
];

const getDemoReviewer = async () => {
  const email = "demo.reviewer@shopexpress.local";
  const existingUser = await User.findOne({ email });
  if (existingUser) return existingUser;

  const password = await bcrypt.hash("demo-reviewer-only", 10);
  return User.create({
    username: "ShopExpress Reviewer",
    email,
    password,
  });
};

const seedProducts = async () => {
  try {
    await connectDB();

    const reviewer = await getDemoReviewer();

    const productCount = await Product.countDocuments();
    if (productCount > 0) {
      for (const product of products) {
        const reviews = demoReviews.map((review) => ({
          ...review,
          user: reviewer._id,
        }));
        await Product.updateOne(
          { name: product.name },
          {
            $set: {
              image: product.image,
              reviews,
              rating: reviews.reduce((total, review) => total + review.rating, 0) / reviews.length,
              numReviews: reviews.length,
            },
          }
        );
      }
      console.log(`Updated demo reviews for ${productCount} existing products.`);
      return;
    }

    const categoryNames = [...new Set(products.map((product) => product.category))];
    const categories = {};

    for (const name of categoryNames) {
      const category = await Category.findOneAndUpdate(
        { name },
        { name },
        { new: true, upsert: true }
      );
      categories[name] = category._id;
    }

    const reviews = demoReviews.map((review) => ({
      ...review,
      user: reviewer._id,
    }));

    await Product.insertMany(
      products.map(({ category, ...product }) => ({
        ...product,
        category: categories[category],
        reviews,
        numReviews: reviews.length,
        rating: reviews.reduce((total, review) => total + review.rating, 0) / reviews.length,
      }))
    );

    console.log(`Seeded ${products.length} ShopExpress products.`);
  } catch (error) {
    console.error(`Product seed failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seedProducts();
