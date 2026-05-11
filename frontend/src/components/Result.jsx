import React from "react";

function Result({ data }) {
  const product = data?.product ?? { name: "No specific product needed", price: 0 };

  const getStatusClass = (disease) => {
    if (disease === "Healthy") return "success";
    if (disease === "Rust") return "warning";
    return "danger";
  };

  return (
    <div className="card">
      <div className="result-header">
        <h3>Diagnosis Result</h3>
        <span className={`result-badge ${getStatusClass(data.disease)}`}>
          {data.disease}
        </span>
      </div>

      <div className="confidence-box">
        <div className="confidence-label">Confidence Score</div>
        <div className="confidence-value">
          {data.confidence}%
        </div>
      </div>

      <div className="treatment-box">
        <h4>Recommended Treatment</h4>
        <div className="treatment-row">
          <span>{product.name}</span>
          <span className="price-tag">₹{product.price}</span>
        </div>
      </div>
    </div>
  );
}

export default Result;
