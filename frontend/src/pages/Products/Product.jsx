import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] transition duration-300 hover:-translate-y-1 hover:border-pink-500/50">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <HeartIcon product={product} />
      </div>

      <div className="p-5">
        <Link to={`/product/${product._id}`}>
          <h2 className="flex items-center justify-between gap-3">
            <span className="text-lg font-semibold text-white">{product.name}</span>
            <span className="shrink-0 text-sm font-semibold text-pink-400">
              ${product.price}
            </span>
          </h2>
        </Link>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/60">
          {product.description}
        </p>
      </div>
    </article>
  );
};

export default Product;
