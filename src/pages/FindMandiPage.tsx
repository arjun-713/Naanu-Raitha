
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Navigation } from 'lucide-react';

const FindMandiPage = () => {
  const [mandis, setMandis] = useState<any[]>([]);
  const [selectedMandi, setSelectedMandi] = useState<any>(null);
  const [states] = useState([
    'Karnataka', 'Maharashtra', 'Tamil Nadu', 'Delhi'
  ]);

  useEffect(() => {
    fetchMandis();
  }, []);

  const fetchMandis = async () => {
    const { data } = await supabase.from('mandis_master').select('*').order('name');
    if (data) setMandis(data);
  };

  const handleMandiSelect = (mandiId: string) => {
    const mandi = mandis.find(m => m.id === mandiId);
    setSelectedMandi(mandi);
  };

  const openInMaps = () => {
    if (selectedMandi?.latitude && selectedMandi?.longitude) {
      window.open(`https://www.google.com/maps?q=${selectedMandi.latitude},${selectedMandi.longitude}`, '_blank');
    } else {
      window.open(`https://www.google.com/maps/search/${encodeURIComponent(selectedMandi?.name + ' ' + selectedMandi?.address)}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Find Mandi</h1>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Mandi
            </label>
            <Select onValueChange={handleMandiSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a mandi" />
              </SelectTrigger>
              <SelectContent>
                {states.map(state => (
                  <div key={state}>
                    <div className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100">
                      {state}
                    </div>
                    {mandis
                      .filter(mandi => mandi.state === state)
                      .map(mandi => (
                        <SelectItem key={mandi.id} value={mandi.id}>
                          {mandi.name} ({mandi.district})
                        </SelectItem>
                      ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedMandi && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  {selectedMandi.name}
                </h3>
                <div className="space-y-2 text-gray-600">
                  <p><strong>District:</strong> {selectedMandi.district}</p>
                  <p><strong>State:</strong> {selectedMandi.state}</p>
                  {selectedMandi.address && (
                    <p><strong>Address:</strong> {selectedMandi.address}</p>
                  )}
                </div>
                
                <Button onClick={openInMaps} className="mt-4">
                  <Navigation className="w-4 h-4 mr-2" />
                  Open in Google Maps
                </Button>
              </div>

              <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-2" />
                  <p>Map integration will be available soon</p>
                  <p className="text-sm">Click "Open in Google Maps" to view location</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindMandiPage;
