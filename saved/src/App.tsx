import React from 'react';
import { PowerOff, Battery, Leaf, Clock } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center space-y-8">
          {/* Icon and Main Message */}
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-slate-700/50 p-6 rounded-full">
              <PowerOff className="w-16 h-16 text-emerald-400" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">
              Service Currently Offline
            </h1>
            <p className="text-xl text-slate-300">
              We've temporarily turned off this service to conserve resources
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-slate-800/50 p-6 rounded-xl backdrop-blur-sm">
              <Battery className="w-8 h-8 text-emerald-400 mb-3" />
              <h3 className="font-semibold text-lg mb-2">Energy Efficient</h3>
              <p className="text-slate-300 text-sm">
                Optimizing resource usage during low-demand periods
              </p>
            </div>
            
            <div className="bg-slate-800/50 p-6 rounded-xl backdrop-blur-sm">
              <Leaf className="w-8 h-8 text-emerald-400 mb-3" />
              <h3 className="font-semibold text-lg mb-2">Eco-Friendly</h3>
              <p className="text-slate-300 text-sm">
                Reducing our environmental impact through smart resource management
              </p>
            </div>
            
            <div className="bg-slate-800/50 p-6 rounded-xl backdrop-blur-sm">
              <Clock className="w-8 h-8 text-emerald-400 mb-3" />
              <h3 className="font-semibold text-lg mb-2">Temporary Status</h3>
              <p className="text-slate-300 text-sm">
                Service will resume when resource demand normalizes
              </p>
            </div>
          </div>

          {/* Footer Message */}
          <div className="mt-12 text-slate-400 text-sm">
            <p>Thank you for your understanding as we optimize our resource usage.</p>
            <p>For urgent matters, please contact our support team.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;