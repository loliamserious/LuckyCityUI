interface PredictionRequest {
  birthday: Date;
  country: string;
}

interface City {
  city: string;
  rate: number;
  reason: string;
  latitude: number;
  longitude: number;
}

interface PredictionResponse {
  four_pillars: string;
  predictions: City[];
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Common fetch options for all requests
const fetchOptions = {
  mode: 'cors' as RequestMode,
  credentials: 'include' as RequestCredentials,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Origin': 'http://localhost:3000',
  },
};

export const predictionService = {
  async getPrediction(request: PredictionRequest): Promise<PredictionResponse> {
    try {
      if (!(request.birthday instanceof Date) || isNaN(request.birthday.getTime())) {
        throw new Error('Invalid birthday format');
      }
      const response = await fetch(`${API_URL}/predictions/`, {
        ...fetchOptions,
        method: 'POST',
        body: JSON.stringify({
          birthday: request.birthday.toISOString().split('T')[0], // Format as YYYY-MM-DD
          country: request.country,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to get prediction');
      }

      return await response.json();
    } catch (error) {
      console.error('Prediction error:', error);
      throw error;
    }
  }
};

export type { City };
export default predictionService;