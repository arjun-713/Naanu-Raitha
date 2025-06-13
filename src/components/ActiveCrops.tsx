
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Sprout, TrendingUp, Calendar, Plus, DollarSign } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const ActiveCrops = () => {
  const [activeCrops, setActiveCrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState<any>(null);
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseNotes, setExpenseNotes] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchActiveCrops();
  }, []);

  const fetchActiveCrops = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('active_crops')
        .select(`
          *,
          crops_master (
            name,
            hindi_name
          ),
          crop_expenses (
            amount
          )
        `)
        .eq('user_id', user.id)
        .neq('status', 'sold');

      if (data) {
        const cropsWithInvestment = data.map(crop => ({
          ...crop,
          totalInvestment: crop.crop_expenses?.reduce((sum: number, expense: any) => sum + Number(expense.amount), 0) || 0
        }));
        setActiveCrops(cropsWithInvestment);
      }
    } catch (error) {
      console.error('Error fetching active crops:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCropStatus = async (cropId: string, newStatus: string) => {
    try {
      await supabase
        .from('active_crops')
        .update({ status: newStatus })
        .eq('id', cropId);

      toast({
        title: "Status updated",
        description: "Crop status has been updated successfully.",
      });

      fetchActiveCrops();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const addExpense = async () => {
    if (!selectedCrop || !expenseAmount) return;

    try {
      await supabase
        .from('crop_expenses')
        .insert({
          active_crop_id: selectedCrop.id,
          amount: parseFloat(expenseAmount),
          notes: expenseNotes
        });

      toast({
        title: "Expense added",
        description: "Expense has been recorded successfully.",
      });

      setExpenseAmount('');
      setExpenseNotes('');
      setSelectedCrop(null);
      fetchActiveCrops();
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'growing': return 'bg-yellow-100 text-yellow-800';
      case 'ready_to_harvest': return 'bg-green-100 text-green-800';
      case 'harvested': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'growing': return 'Growing';
      case 'ready_to_harvest': return 'Ready to Harvest';
      case 'harvested': return 'Harvested';
      case 'sold': return 'Sold';
      default: return status;
    }
  };

  if (loading) {
    return <div className="animate-pulse space-y-3">
      {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>)}
    </div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Active Crops</h2>
        <button className="text-sm text-green-600 font-medium hover:text-green-700 transition-colors">
          View All
        </button>
      </div>
      
      <div className="space-y-3">
        {activeCrops.map((crop) => (
          <div key={crop.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Sprout className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{crop.crops_master.name}</h3>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(crop.status)}`}>
                    {getStatusLabel(crop.status)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Select value={crop.status} onValueChange={(value) => updateCropStatus(crop.id, value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="growing">Growing</SelectItem>
                    <SelectItem value="ready_to_harvest">Ready to Harvest</SelectItem>
                    <SelectItem value="harvested">Harvested</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm mb-3">
              <div>
                <p className="text-gray-500">Area</p>
                <p className="font-medium">{crop.acres} acres</p>
              </div>
              <div>
                <p className="text-gray-500">Invested</p>
                <p className="font-medium">₹{crop.totalInvestment.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Planted</p>
                <p className="font-medium flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(crop.planting_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedCrop(crop)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Expense
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Expense for {crop.crops_master.name}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="amount">Amount (₹)</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={expenseAmount}
                        onChange={(e) => setExpenseAmount(e.target.value)}
                        placeholder="Enter amount"
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Input
                        id="notes"
                        value={expenseNotes}
                        onChange={(e) => setExpenseNotes(e.target.value)}
                        placeholder="What did you spend on?"
                      />
                    </div>
                    <Button onClick={addExpense} className="w-full">
                      Add Expense
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {crop.status === 'ready_to_harvest' && (
                <Button variant="outline" size="sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Predict Price
                </Button>
              )}
            </div>
          </div>
        ))}
        
        {activeCrops.length === 0 && (
          <div className="text-gray-500 text-center py-8">
            No active crops. Add your first crop to get started!
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveCrops;
