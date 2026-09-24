import asyncHandler from "../middlewares/asyncHandler.js";
import BrowsingEvent from "../models/browsingEventModel.js";
import Product from "../models/productModel.js";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = process.env.GROQ_MODEL || "qwen/qwen3.8-27b";

const compactProduct = (product) => ({
  id: product._id,
  name: product.name,
  brand: product.brand,
  price: product.price,
  category: product.category?.name || product.category,
  description: product.description,
  rating: product.rating,
  inStock: product.countInStock > 0,
});

const trackBrowsingEvent = asyncHandler(async (req, res) => {
  const { sessionId, productId, type = "view" } = req.body;

  if (!sessionId || !productId) {
    res.status(400);
    throw new Error("sessionId and productId are required");
  }

  const productExists = await Product.exists({ _id: productId });
  if (!productExists) {
    res.status(404);
    throw new Error("Product not found");
  }

  await BrowsingEvent.create({ sessionId, product: productId, type });
  res.status(204).end();
});

const getRecommendations = asyncHandler(async (req, res) => {
  const { sessionId } = req.query;
  const recentEvents = sessionId
    ? await BrowsingEvent.find({ sessionId })
        .sort({ createdAt: -1 })
        .limit(12)
        .populate({ path: "product", populate: { path: "category" } })
    : [];

  const viewedIds = recentEvents.map((event) => event.product?._id).filter(Boolean);
  const categoryIds = recentEvents
    .map((event) => event.product?.category?._id || event.product?.category)
    .filter(Boolean);

  const recommendations = await Product.find({
    ...(viewedIds.length ? { _id: { $nin: viewedIds } } : {}),
    ...(categoryIds.length ? { category: { $in: categoryIds } } : {}),
    countInStock: { $gt: 0 },
  })
    .populate("category")
    .sort({ rating: -1 })
    .limit(4);

  const fallback = recommendations.length
    ? recommendations
    : await Product.find({ _id: { $nin: viewedIds }, countInStock: { $gt: 0 } })
        .populate("category")
        .sort({ rating: -1 })
        .limit(4);

  res.json({
    source: recentEvents.length ? "behavior" : "popular",
    products: fallback,
  });
});

const chatWithShopAssistant = asyncHandler(async (req, res) => {
  const { message, sessionId } = req.body;
  const apiKey = process.env.GROQ_API_KEY;

  if (!message?.trim()) {
    res.status(400);
    throw new Error("A message is required");
  }

  if (!apiKey) {
    return res.json({
      reply: "The ShopExpress assistant is not configured yet. Add GROQ_API_KEY to the backend .env file to enable AI shopping help.",
      configured: false,
    });
  }

  const recentEvents = sessionId
    ? await BrowsingEvent.find({ sessionId })
        .sort({ createdAt: -1 })
        .limit(6)
        .populate({ path: "product", populate: { path: "category" } })
    : [];
  const products = await Product.find({ countInStock: { $gt: 0 } })
    .populate("category")
    .sort({ rating: -1 })
    .limit(12);

  const catalog = products.map(compactProduct);
  const recentInterest = recentEvents
    .map((event) => event.product && compactProduct(event.product))
    .filter(Boolean);

  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0.3,
      max_tokens: 350,
      messages: [
        {
          role: "system",
          content:
            "You are ShopExpress Assistant. Help shoppers choose products from the supplied catalog. Be concise, friendly, and honest. Never invent products, prices, stock, discounts, or policies. Mention product names exactly when recommending them.",
        },
        {
          role: "user",
          content: JSON.stringify({
            request: message.trim().slice(0, 800),
            recentInterest,
            catalog,
          }),
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Groq request failed:", errorText);
    res.status(502);
    throw new Error("The shopping assistant is temporarily unavailable");
  }

  const data = await response.json();
  res.json({
    reply: data.choices?.[0]?.message?.content || "I could not find a helpful answer right now.",
    configured: true,
  });
});

export { trackBrowsingEvent, getRecommendations, chatWithShopAssistant };
