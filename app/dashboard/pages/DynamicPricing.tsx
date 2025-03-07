import React, { useState } from "react";

const DynamicPricing: React.FC = () => {
  const [recommendedPrice, setRecommendedPrice] = useState<number>(0);

  // Simulate dynamic pricing AI model
  const calculateDynamicPrice = () => {
    // Here we would call an API to calculate dynamic pricing using Machine Learning (Regression Model)
    setRecommendedPrice(150); // Mockup price
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dynamic Pricing AI</h1>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Market and Event Analysis</h2>
        <p className="text-sm text-gray-500">
          AI analyzes market conditions and events affecting room prices, optimizing your pricing strategy.
        </p>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700">Suggested Price: ${recommendedPrice}</h3>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
            onClick={calculateDynamicPrice}
          >
            Calculate Suggested Price
          </button>
        </div>
      </div>
    </div>
  );
};

export default DynamicPricing;
