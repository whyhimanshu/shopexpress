import { Link } from "react-router-dom";
import { FaArrowRight, FaStar } from "react-icons/fa";
import { useGetRecommendationsQuery } from "../redux/api/aiApiSlice";
import { getAiSessionId } from "../Utils/aiSession";

const RecommendationRail = () => {
  const { data, isLoading } = useGetRecommendationsQuery(getAiSessionId());

  if (isLoading || !data?.products?.length) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 pb-14">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-pink-400">
            <FaStar /> Smart picks
          </p>
          <h2 className="text-2xl font-bold text-white">Picked for your next find</h2>
          <p className="mt-1 text-sm text-white/50">
            {data.source === "behavior"
              ? "Based on what you have been browsing"
              : "Popular with ShopExpress customers"}
          </p>
        </div>
        <Link to="/shop" className="text-sm font-semibold text-pink-400 hover:text-pink-300">
          See all <FaArrowRight className="ml-1 inline" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {data.products.map((product) => (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]"
          >
            <img
              src={product.image}
              alt={product.name}
              className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="p-3">
              <p className="truncate text-sm font-semibold text-white">{product.name}</p>
              <p className="mt-1 text-sm text-pink-400">${product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RecommendationRail;
