
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const AddCropPage = () => {
  const [crops, setCrops] = useState<any[]>([]);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [acres, setAcres] = useState('');
  const [plantingDate, setPlantingDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    const { data } = await supabase.from('crops_master').select('*');
    if (data) setCrops(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');

      await supabase.from('active_crops').insert({
        user_id: user.id,
        crop_id: selectedCrop,
        acres: parseFloat(acres),
        planting_date: plantingDate,
        status: 'growing'
      });

      toast({
        title: "Crop added successfully!",
        description: "Your crop has been added to active crops.",
      });

      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error adding crop",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Crop</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="crop">Which crop are you growing?</Label>
              <Select value={selectedCrop} onValueChange={setSelectedCrop} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a crop" />
                </SelectTrigger>
                <SelectContent>
                  {crops.map(crop => (
                    <SelectItem key={crop.id} value={crop.id}>
                      {crop.name} {crop.hindi_name && `(${crop.hindi_name})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="acres">How many acres?</Label>
              <Input
                id="acres"
                type="number"
                step="0.1"
                value={acres}
                onChange={(e) => setAcres(e.target.value)}
                placeholder="Enter area in acres"
                required
              />
            </div>

            <div>
              <Label htmlFor="planting-date">Date of planting/sowing</Label>
              <Input
                id="planting-date"
                type="date"
                value={plantingDate}
                onChange={(e) => setPlantingDate(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Crop'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCropPage;
