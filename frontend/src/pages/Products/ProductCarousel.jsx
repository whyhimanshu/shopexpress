import { Link } from "react-router-dom";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowRight, FaStar } from "react-icons/fa";

const ProductCarousel = () => {
  const { data: products = [], isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: true,
    infinite: products.length > 3,
    speed: 450,
    slidesToShow: Math.min(products.length, 3),
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3600,
    responsive: [
      { breakpoint: 900, settings: { slidesToShow: Math.min(products.length, 2) } },
      { breakpoint: 640, settings: { slidesToShow: 1, arrows: false } },
    ],
  };

  if (isLoading) return null;
  if (error) return <Message variant="danger">Unable to load featured products.</Message>;
  if (!products.length) return <Message variant="info">New products are arriving soon.</Message>;

  return (
    <div className="catalog-showcase">
      <div className="catalog-heading">
        <div>
          <p className="catalog-eyebrow">ShopExpress picks</p>
          <h2>Fresh finds, ready to ship</h2>
        </div>
        <Link to="/shop" className="catalog-see-all">
          View all <FaArrowRight />
        </Link>
      </div>

      <Slider {...settings} className="catalog-slider">
        {products.map((product) => (
          <article key={product._id} className="promo-product-card">
            <Link to={`/product/${product._id}`} className="promo-product-image">
              <img src={product.image} alt={product.name} />
              <span className="promo-badge">Top rated</span>
            </Link>
            <div className="promo-product-info">
              <div>
                <p className="promo-brand">{product.brand}</p>
                <h3>{product.name}</h3>
                <div className="promo-rating">
                  <FaStar /> {product.rating.toFixed(1)} · {product.numReviews} reviews
                </div>
              </div>
              <div className="promo-purchase">
                <strong>${product.price}</strong>
                <Link to={`/product/${product._id}`} aria-label={`Shop ${product.name}`}>
                  Shop now
                </Link>
              </div>
            </div>
          </article>
        ))}
      </Slider>

      <div className="quick-picks-heading">
        <h2>Popular right now</h2>
        <span>Simple picks for your next order</span>
      </div>
      <div className="quick-picks-row">
        {products.map((product) => (
          <Link key={`quick-${product._id}`} to={`/product/${product._id}`} className="quick-pick-card">
            <img src={product.image} alt="" />
            <span>{product.name}</span>
            <strong>${product.price}</strong>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;
