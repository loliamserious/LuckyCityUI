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
      // if (!(request.birthday instanceof Date) || isNaN(request.birthday.getTime())) {
      //   throw new Error('Invalid birthday format');
      // }
      // const response = await fetch(`${API_URL}/predictions/`, {
      //   ...fetchOptions,
      //   method: 'POST',
      //   body: JSON.stringify({
      //     birthday: request.birthday.toISOString().split('T')[0], // Format as YYYY-MM-DD
      //     country: request.country,
      //   }),
      // });

      // if (!response.ok) {
      //   const error = await response.json();
      //   throw new Error(error.detail || 'Failed to get prediction');
      // }

      // return await response.json();
      return {
        'four_pillars': '甲申年 辛未月 丙辰日 戊子时',
        'predictions': [
            {
                "city": "San Francisco",
                "rate": 92,
                "reason": "Water element from the bay enhances your Wood Day Master's growth potential. The metal energy supports your career development and financial success.",
                "latitude": 37.7749,
                "longitude": -122.4194
            },
            {
                "city": "Santa Barbara",
                "rate": 88,
                "reason": "Coastal water energy strengthens your Wood element foundation. The earth energy supports stability and personal growth opportunities.",
                "latitude": 34.4208,
                "longitude": -119.6982
            },
            {
                "city": "San Diego",
                "rate": 85,
                "reason": "Ocean water element nourishes your Wood Day Master for enhanced vitality. Fire energy in the climate supports your creative expression and social connections.",
                "latitude": 32.7157,
                "longitude": -117.1611
            },
            {
                "city": "Sacramento",
                "rate": 82,
                "reason": "River water element provides necessary nourishment for your Wood Day Master. Earth energy from valley location offers stability and career foundation.",
                "latitude": 38.5816,
                "longitude": -121.4944
            },
            {
                "city": "Los Angeles",
                "rate": 80,
                "reason": "Coastal water energy supports your Wood element's growth requirements. Creative fire energy enhances your social and professional networking opportunities.",
                "latitude": 34.0522,
                "longitude": -118.2437
            }
        ]};
    } catch (error) {
      console.error('Prediction error:', error);
      throw error;
    }
  }
};

export type { City };
export default predictionService;