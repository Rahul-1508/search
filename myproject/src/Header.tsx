import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Filter from "./Filter";
import "./style.css";

interface Product {
  id: number;
  productname: string;
  price: number;
  company: string;
  category: string;
}

const Header: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [appliedFilters, setAppliedFilters] = useState({
    company: "",
    priceRange: [0, 200000] as [number, number],
    category: "select", // lowercase for consistency
  });

  const [cart, setCart] = useState<Product[]>([]);

  // Fetch products
  useEffect(() => {
    fetch("http://127.0.0.1:8000/products/")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Apply filters
  useEffect(() => {
    const filtered = products.filter((product) => {
      const company = product.company || "";

      const inPriceRange =
        product.price >= appliedFilters.priceRange[0] &&
        product.price <= appliedFilters.priceRange[1];

      const matchesCompany = company
        .toLowerCase()
        .includes(appliedFilters.company.toLowerCase());

      const matchesCategory =
        appliedFilters.category.toLowerCase() === "select" ||
        product.category === appliedFilters.category;

      return inPriceRange && matchesCompany && matchesCategory;
    });

    setFilteredProducts(filtered);
  }, [appliedFilters, products]);

  // Handlers
  const handleApplyFilters = (filters: {
    company: string;
    priceRange: [number, number];
    category: string;
  }) => {
    setAppliedFilters(filters);
  };

  const handleAddToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const handleRemoveFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center" style={{ color: "white" }}>
        <u>Product Search</u> 🔍
      </h2>

      <div className="row">
        {/* Left side: Filters + Cart */}
        <div className="col-md-3">
          <Filter onFilterChange={handleApplyFilters} />

          <div className="cart_container cart-panel border p-3 mt-4 bg-light">
            <h4>🛒 Cart</h4>
            {cart.length === 0 ? (
              <p className="text-muted">No items added yet</p>
            ) : (
              <ul className="list-group mb-3">
                {cart.map((item, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <span>{item.productname}</span> <br />
                      <small className="text-muted">₹{item.price}</small>
                    </div>
                    <button
                      className="cross_btn btn btn-sm btn-danger"
                      onClick={() => handleRemoveFromCart(index)}
                    >
                      ❌
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <h5>Total: ₹{totalPrice}</h5>
            <button className="btn btn-success w-100" disabled={cart.length === 0}>
              Checkout
            </button>
          </div>
        </div>

        {/* Right side: Products */}
        <div className="col-md-9">
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search for a product..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {loading ? (
            <p className="text-center text-muted">Loading products...</p>
          ) : filteredProducts.length > 0 ? (
            <div className="row">
              {filteredProducts
                .filter((product) =>
                  product.productname.toLowerCase().includes(query.toLowerCase())
                )
                .map((product) => (
                  <div key={product.id} className="col-md-4 mb-3">
                    <div className="card shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title">{product.productname}</h5>
                        <p className="card-text">Price: ₹{product.price}</p>
                        <p className="card-text">Company: {product.company}</p>
                        <p className="card-text">Category: {product.category}</p>
                        <button
                          className="btn btn-primary w-100"
                          onClick={() => handleAddToCart(product)}
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-center text-muted">No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
