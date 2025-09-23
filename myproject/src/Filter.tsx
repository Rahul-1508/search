import React, { useState } from "react";

interface FilterProps {
  onFilterChange: (filters: { company: string; priceRange: [number, number] }) => void;
}

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [company, setCompany] = useState<string>("");
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(100000);

  const handleFilterChange = () => {
    onFilterChange({ company, priceRange: [minPrice, maxPrice] });
  };

  return (
    <div className="filter-panel border p-3">
      <h4>Filters</h4>
      <div className="mb-3">
        <label htmlFor="company" className="form-label">
          Company
        </label>
        <input
          type="text"
          id="company"
          className="form-control"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Search by company"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="price-range" className="form-label">
          Price Range (RS)
        </label>
        <input
          type="number"
          className="form-control mb-2"
          value={minPrice}
          onChange={(e) => setMinPrice(Number(e.target.value))}
          placeholder="Min Price"
        />
        <input
          type="number"
          className="form-control"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          placeholder="Max Price"
        />
      </div>
      <button onClick={handleFilterChange} className="btn btn-primary w-100">
        Apply Filters
      </button>
    </div>
  );
};

export default Filter;
