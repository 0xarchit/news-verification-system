import React from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface ResultsProps {
  results: {
    trustScore: number;
    analysis: string;
    sourceandrelated: string;
    potentialBiases: string[];
    recommendation: string;
  };
}

export default function Results({ results }: ResultsProps) {
  const { trustScore, analysis, sourceandrelated, potentialBiases, recommendation } = results;

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

  // Extract URLs and additional text from sourceandrelated
  const extractSourcesAndText = (text: string) => {
    const sentences = text.split('. ');
    const sourceSentence = sentences[0].startsWith('Verified against sources:')
      ? sentences.shift()
      : null;
    
    const sources = sourceSentence
      ? sourceSentence.replace('Verified against sources: ', '').split(', ')
      : [];
    
    const additionalText = sentences.join('. ') || '';
    return { sources, additionalText };
  };

  const { sources, additionalText } = extractSourcesAndText(sourceandrelated);

  // Shorten URL for display (show domain only)
  const shortenUrl = (url: string) => {
    try {
      const { hostname } = new URL(url);
      return hostname.replace('www.', ''); // e.g., "example.com"
    } catch {
      return url; // Fallback to raw URL if parsing fails
    }
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

      <div>
        <h3 className="font-semibold mb-2">Sources & Related Information</h3>
        {sources.length > 0 ? (
          <div className="space-y-2">
            <p className="text-gray-700 font-medium">Verified against:</p>
            <ul className="list-disc list-inside space-y-1">
              {sources.map((source, index) => (
                <li key={index} className="text-gray-700">
                  <a
                    href={source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {shortenUrl(source)}
                  </a>
                </li>
              ))}
            </ul>
            {additionalText && (
              <p className="text-gray-700 mt-2">{additionalText}</p>
            )}
          </div>
        ) : (
          <p className="text-gray-700">{sourceandrelated}</p>
        )}
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