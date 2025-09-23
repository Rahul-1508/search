import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Filter from "./Filter";

interface Product {
  id: number;
  productname: string;
  price: number;
  company: string;
}

const Header: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Separate user-entered filters and actually applied filters
  const [filters, setFilters] = useState({ company: "", priceRange: [0, 100000] });
  const [appliedFilters, setAppliedFilters] = useState({ company: "", priceRange: [0, 100000] });

  // Fetch products on initial load
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

  useEffect(() => {
    const filtered = products.filter((product) => {
      const company = product.company || "";
      const inPriceRange =
        product.price >= appliedFilters.priceRange[0] &&
        product.price <= appliedFilters.priceRange[1];
      const matchesCompany = company
        .toLowerCase()
        .includes(appliedFilters.company.toLowerCase());

      return inPriceRange && matchesCompany;
    });

    setFilteredProducts(filtered);
  }, [appliedFilters, products]);


  const handleApplyFilters = (filters: { company: string; priceRange: [number, number] }) => {
    setAppliedFilters(filters);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center " style={{color:"white"}}> Product Search 🔍</h2>

      <div className="row">
       
        <div className="col-md-3">
          <Filter onFilterChange={handleApplyFilters} />
        </div>

        <div className="col-md-9">
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search for a product..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {/* Product List */}
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
                        <p className="card-text">Price: RS:{product.price}</p>
                        <p className="card-text">Company: {product.company}</p>
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
      </div>
    </div>
  );
};

export default Header;
