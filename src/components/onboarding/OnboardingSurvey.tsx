import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';
import { loadLocationData, getStates, getDistricts, getSubDistricts } from '@/utils/locationData';

interface OnboardingSurveyProps {
  onComplete: () => void;
}

const OnboardingSurvey = ({ onComplete }: OnboardingSurveyProps) => {
  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [subDistrict, setSubDistrict] = useState('');
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [cropSearch, setCropSearch] = useState('');
  
  const [states, setStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [subDistricts, setSubDistricts] = useState<string[]>([]);
  const [crops, setCrops] = useState<any[]>([]);
  const [filteredCrops, setFilteredCrops] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();

  // Sample crops for demo mode
  const sampleCrops = [
    { id: '1', name: 'Wheat' },
    { id: '2', name: 'Rice' },
    { id: '3', name: 'Maize' },
    { id: '4', name: 'Barley' },
    { id: '5', name: 'Bajra' },
    { id: '6', name: 'Jowar' },
    { id: '7', name: 'Ragi' },
    { id: '8', name: 'Sorghum' },
    { id: '9', name: 'Foxtail millet' },
    { id: '10', name: 'Pearl millet' },
    { id: '11', name: 'Kodo millet' },
    { id: '12', name: 'Little millet' },
    { id: '13', name: 'Barnyard millet' },
    { id: '14', name: 'Finger millet' },
    { id: '15', name: 'Black gram' },
    { id: '16', name: 'Green gram' },
    { id: '17', name: 'Red gram' },
    { id: '18', name: 'Chickpeas' },
    { id: '19', name: 'Horse gram' },
    { id: '20', name: 'Lentils' },
    { id: '21', name: 'Cowpeas' },
    { id: '22', name: 'Soybean' },
    { id: '23', name: 'Peas' },
    { id: '24', name: 'Mustard' },
    { id: '25', name: 'Groundnut' },
    { id: '26', name: 'Sesame' },
    { id: '27', name: 'Sunflower' },
    { id: '28', name: 'Safflower' },
    { id: '29', name: 'Linseed' },
    { id: '30', name: 'Cotton' },
    { id: '31', name: 'Sugarcane' },
    { id: '32', name: 'Jute' },
    { id: '33', name: 'Tobacco' },
    { id: '34', name: 'Tea' },
    { id: '35', name: 'Coffee' },
    { id: '36', name: 'Coconut' },
    { id: '37', name: 'Areca nut' },
    { id: '38', name: 'Cashew' },
    { id: '39', name: 'Cardamom' },
    { id: '40', name: 'Turmeric' },
    { id: '41', name: 'Ginger' },
    { id: '42', name: 'Garlic' },
    { id: '43', name: 'Onion' },
    { id: '44', name: 'Tomato' },
    { id: '45', name: 'Potato' },
    { id: '46', name: 'Brinjal' },
    { id: '47', name: 'Okra' },
    { id: '48', name: 'Cabbage' },
    { id: '49', name: 'Cauliflower' },
    { id: '50', name: 'Carrot' },
    { id: '51', name: 'Radish' },
    { id: '52', name: 'Spinach' },
    { id: '53', name: 'Coriander' },
    { id: '54', name: 'Fenugreek' },
    { id: '55', name: 'Lettuce' },
    { id: '56', name: 'Chilli' },
    { id: '57', name: 'Bell pepper' },
    { id: '58', name: 'Pumpkin' },
    { id: '59', name: 'Bitter gourd' },
    { id: '60', name: 'Bottle gourd' },
    { id: '61', name: 'Ridge gourd' },
    { id: '62', name: 'Ash gourd' },
    { id: '63', name: 'Watermelon' },
    { id: '64', name: 'Musk melon' },
    { id: '65', name: 'Papaya' },
    { id: '66', name: 'Banana' },
    { id: '67', name: 'Mango' },
    { id: '68', name: 'Guava' },
    { id: '69', name: 'Pomegranate' },
    { id: '70', name: 'Orange' },
    { id: '71', name: 'Lemon' },
    { id: '72', name: 'Sweet lime' },
    { id: '73', name: 'Sapota' },
    { id: '74', name: 'Apple' },
    { id: '75', name: 'Pear' },
    { id: '76', name: 'Litchi' },
    { id: '77', name: 'Grapes' },
    { id: '78', name: 'Pineapple' },
    { id: '79', name: 'Jackfruit' },
    { id: '80', name: 'Amla' },
    { id: '81', name: 'Custard apple' },
    { id: '82', name: 'Fig' },
    { id: '83', name: 'Dragon fruit' },
    { id: '84', name: 'Avocado' },
    { id: '85', name: 'Strawberry' },
    { id: '86', name: 'Kiwi' },
    { id: '87', name: 'Passion fruit' },
    { id: '88', name: 'Beetroot' },
    { id: '89', name: 'Turnip' },
    { id: '90', name: 'Zucchini' },
    { id: '91', name: 'Broccoli' },
    { id: '92', name: 'Kale' },
    { id: '93', name: 'Methi' },
    { id: '94', name: 'Mint' },
    { id: '95', name: 'Basil' },
    { id: '96', name: 'Curry leaves' },
    { id: '97', name: 'Drumstick' },
    { id: '98', name: 'Taro root' },
    { id: '99', name: 'Yam' },
    { id: '100', name: 'Sweet potato' },
    { id: '101', name: 'Sugar beet' }
  ];

  useEffect(() => {
    // Load location data
    loadLocationData().then(() => {
      setStates(getStates());
    });
    
    // Use sample data for demo mode
    setCrops(sampleCrops);
  }, []);

  useEffect(() => {
    if (state) {
      setDistricts(getDistricts(state));
      setDistrict(''); // Reset district when state changes
      setSubDistrict(''); // Reset sub-district when state changes
    }
  }, [state]);

  useEffect(() => {
    if (district) {
      setSubDistricts(getSubDistricts(state, district));
      setSubDistrict(''); // Reset sub-district when district changes
    }
  }, [district, state]);

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
          sub_district: subDistrict,
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
          sub_district: subDistrict,
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
              {states.map(stateName => (
                <SelectItem key={stateName} value={stateName}>
                  {stateName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="district">Which district?</Label>
          <Select 
            value={district} 
            onValueChange={setDistrict} 
            required
            disabled={!state}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your district" />
            </SelectTrigger>
            <SelectContent>
              {districts.map(districtName => (
                <SelectItem key={districtName} value={districtName}>
                  {districtName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="subDistrict">Which sub-district/mandi do you usually sell at?</Label>
          <Select 
            value={subDistrict} 
            onValueChange={setSubDistrict} 
            required
            disabled={!district}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your sub-district/mandi" />
            </SelectTrigger>
            <SelectContent>
              {subDistricts.map(subDistrictName => (
                <SelectItem key={subDistrictName} value={subDistrictName}>
                  {subDistrictName}
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
          disabled={isLoading || selectedCrops.length === 0 || !name || !state || !district || !subDistrict}
        >
          {isLoading ? 'Setting up...' : 'Complete Setup'}
        </Button>
      </form>
    </div>
  );
};

export default OnboardingSurvey;
