import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

interface Product {
  id: number;
  productname: string; 
  price: number;
}

const Header: React.FC = () => {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/products/")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter((product) =>
    product.productname.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">🔍 Product Search</h2>

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
          {filteredProducts.map((product) => (
            <div key={product.id} className="col-md-4 mb-3">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{product.productname}</h5>
                  <p className="card-text">Price: RS:{product.price}</p>
                  <button className="btn btn-primary">Buy Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted">No products found.</p>
      )}
    </div>
  );
};

export default Header;
