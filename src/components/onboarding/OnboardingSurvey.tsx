
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

interface OnboardingSurveyProps {
  onComplete: () => void;
}

const OnboardingSurvey = ({ onComplete }: OnboardingSurveyProps) => {
  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [preferredMandi, setPreferredMandi] = useState('');
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [cropSearch, setCropSearch] = useState('');
  
  const [mandis, setMandis] = useState<any[]>([]);
  const [crops, setCrops] = useState<any[]>([]);
  const [filteredCrops, setFilteredCrops] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  // Sample crops for demo mode
  const sampleCrops = [
    { id: '1', name: 'Wheat' },
    { id: '2', name: 'Rice' },
    { id: '3', name: 'Corn' },
    { id: '4', name: 'Tomato' },
    { id: '5', name: 'Potato' },
    { id: '6', name: 'Onion' },
    { id: '7', name: 'Cotton' },
    { id: '8', name: 'Sugarcane' },
  ];

  // Sample mandis for demo mode
  const sampleMandis = [
    { id: '1', name: 'Central Market', district: 'Delhi', state: 'Delhi' },
    { id: '2', name: 'Agricultural Market', district: 'Mumbai', state: 'Maharashtra' },
    { id: '3', name: 'Farmers Market', district: 'Bangalore', state: 'Karnataka' },
  ];

  useEffect(() => {
    // Use sample data for demo mode
    setCrops(sampleCrops);
    setMandis(sampleMandis);
  }, []);

  useEffect(() => {
    if (cropSearch) {
      const filtered = crops.filter(crop => 
        crop.name.toLowerCase().includes(cropSearch.toLowerCase())
      );
      setFilteredCrops(filtered);
    } else {
      setFilteredCrops([]);
    }
  }, [cropSearch, crops]);

  const addCrop = (crop: any) => {
    if (!selectedCrops.find(c => c === crop.id)) {
      setSelectedCrops([...selectedCrops, crop.id]);
    }
    setCropSearch('');
  };

  const removeCrop = (cropId: string) => {
    setSelectedCrops(selectedCrops.filter(id => id !== cropId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if this is a dummy session
      const dummySession = localStorage.getItem('dummy-auth-session');
      if (dummySession) {
        const session = JSON.parse(dummySession);
        
        // Save profile data to localStorage for dummy users
        const profileData = {
          name,
          state,
          district,
          preferred_mandi: preferredMandi,
          crops: selectedCrops,
          completed_at: new Date().toISOString()
        };
        
        localStorage.setItem(`profile-${session.user.id}`, JSON.stringify(profileData));
        
        toast({
          title: "Profile setup complete!",
          description: "Welcome to Mandi Mitra",
        });
        
        onComplete();
        return;
      }

      // Real Supabase implementation for actual users
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');

      // Update profile
      await supabase
        .from('profiles')
        .update({
          state,
          district,
          preferred_mandi: preferredMandi,
        })
        .eq('id', user.id);

      // Add user crops
      const cropInserts = selectedCrops.map(cropId => ({
        user_id: user.id,
        crop_id: cropId,
      }));

      await supabase.from('user_crops').insert(cropInserts);

      toast({
        title: "Profile setup complete!",
        description: "Welcome to Mandi Mitra",
      });

      onComplete();
    } catch (error: any) {
      toast({
        title: "Setup Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStateMandis = () => {
    if (!district) return mandis;
    
    const districtMandis = mandis.filter(m => m.district === district);
    const otherMandis = mandis.filter(m => m.district !== district);
    
    return [...districtMandis, ...otherMandis];
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Tell us about your farming</h2>
        <p className="text-gray-600 mt-2">Help us customize your experience</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name">What's your name?</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div>
          <Label htmlFor="state">Which state do you farm in?</Label>
          <Select value={state} onValueChange={setState} required>
            <SelectTrigger>
              <SelectValue placeholder="Select your state" />
            </SelectTrigger>
            <SelectContent>
              {indianStates.map(stateName => (
                <SelectItem key={stateName} value={stateName}>
                  {stateName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="district">Which district?</Label>
          <Input
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            placeholder="Enter your district"
            required
          />
        </div>

        <div>
          <Label htmlFor="mandi">Which market do you usually sell at?</Label>
          <Select value={preferredMandi} onValueChange={setPreferredMandi} required>
            <SelectTrigger>
              <SelectValue placeholder="Select your preferred market" />
            </SelectTrigger>
            <SelectContent>
              {getStateMandis().map(mandi => (
                <SelectItem key={mandi.id} value={mandi.name}>
                  {mandi.name} ({mandi.district})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="crops">What crops do you grow?</Label>
          <div className="space-y-3">
            <Input
              value={cropSearch}
              onChange={(e) => setCropSearch(e.target.value)}
              placeholder="Search and select crops..."
            />
            
            {filteredCrops.length > 0 && (
              <div className="max-h-32 overflow-y-auto border rounded-md p-2">
                {filteredCrops.map(crop => (
                  <button
                    key={crop.id}
                    type="button"
                    onClick={() => addCrop(crop)}
                    className="block w-full text-left p-2 hover:bg-gray-100 rounded"
                  >
                    {crop.name}
                  </button>
                ))}
              </div>
            )}

            {selectedCrops.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedCrops.map(cropId => {
                  const crop = crops.find(c => c.id === cropId);
                  return crop ? (
                    <Badge key={cropId} variant="secondary" className="flex items-center gap-1">
                      {crop.name}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => removeCrop(cropId)}
                      />
                    </Badge>
                  ) : null;
                })}
              </div>
            )}
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading || selectedCrops.length === 0 || !name}
        >
          {isLoading ? 'Setting up...' : 'Complete Setup'}
        </Button>
      </form>
    </div>
  );
};

export default OnboardingSurvey;
