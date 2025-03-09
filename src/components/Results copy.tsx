import React from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface ResultsProps {
  results: {
    trustScore: number;
    analysis: string;
    potentialBiases: string[];
    recommendation: string;
  };
}

export default function Results({ results }: ResultsProps) {
  const { trustScore, analysis, potentialBiases, recommendation } = results;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-8 h-8 text-green-600" />;
    if (score >= 50) return <AlertTriangle className="w-8 h-8 text-yellow-600" />;
    return <XCircle className="w-8 h-8 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {getScoreIcon(trustScore)}
        <div>
          <h2 className="text-xl font-semibold">Trust Score</h2>
          <p className={`text-3xl font-bold ${getScoreColor(trustScore)}`}>
            {trustScore}%
          </p>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Analysis</h3>
        <p className="text-gray-700">{analysis}</p>
      </div>

      {potentialBiases.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Potential Biases</h3>
          <ul className="list-disc list-inside space-y-1">
            {potentialBiases.map((bias, index) => (
              <li key={index} className="text-gray-700">
                {bias}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Recommendation</h3>
        <p className="text-gray-700">{recommendation}</p>
      </div>
    </div>
  );
}