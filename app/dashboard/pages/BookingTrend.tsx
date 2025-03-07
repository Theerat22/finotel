import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ForecastData {
  ds: string;
  yhat: number;
  yhat_lower: number;
  yhat_upper: number;
}

export default function Home() {
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data: ForecastData[] = await response.json();
    setForecastData(data);
  };

  const chartData = {
    labels: forecastData.map(item => item.ds),
    datasets: [
      {
        label: 'Predicted Bookings',
        data: forecastData.map(item => item.yhat),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dynamic Booking Forecast</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <input type="file" onChange={handleFileChange} className="mb-4" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Predict
        </button>
      </form>
      {forecastData.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ds" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="yhat" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}