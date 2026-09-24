import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";
import RecommendationRail from "../components/RecommendationRail";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  return (
    <>
      {!keyword ? <Header /> : null}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data.message || isError.error}
        </Message>
      ) : (
        <>
          <div className="mx-auto mt-16 flex max-w-6xl items-end justify-between px-6 lg:mt-20">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-pink-400">
                Curated for you
              </p>
              <h1 className="text-3xl font-bold text-white sm:text-4xl">
                Special Products
              </h1>
            </div>

            <Link
              to="/shop"
              className="rounded-full bg-pink-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-pink-500"
            >
              View shop
            </Link>
          </div>

          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 pb-12 pt-8 sm:grid-cols-2 xl:grid-cols-3">
            {data.products.length > 0 ? (
              data.products.map((product) => (
                <Product key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
                <h2 className="text-xl font-semibold text-white">
                  The collection is being refreshed
                </h2>
                <p className="mt-2 text-white/60">
                  Check the shop shortly for new arrivals.
                </p>
              </div>
            )}
          </div>
          <RecommendationRail />
        </>
      )}
    </>
  );
};

export default Home;
