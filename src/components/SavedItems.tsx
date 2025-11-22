import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Copy, Palette, Type, Waves } from 'lucide-react';
import { toast } from 'sonner';
import ColorSwatch from './ColorSwatch';
import { ColorData } from '@/lib/colorExtraction';
import { GradientData } from '@/lib/gradientExtraction';

interface SavedItem {
  id: string;
  item_type: 'palette' | 'typography' | 'gradient';
  name: string;
  data: any;
  created_at: string;
}

const SavedItems = () => {
  const { user } = useAuth();
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSavedItems();
    }
  }, [user]);

  const fetchSavedItems = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_items')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedItems((data || []) as SavedItem[]);
    } catch (error) {
      console.error('Error fetching saved items:', error);
      toast.error('Failed to load saved items');
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('saved_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSavedItems(savedItems.filter(item => item.id !== id));
      toast.success('Item deleted');
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  const palettes = savedItems.filter(item => item.item_type === 'palette');
  const typography = savedItems.filter(item => item.item_type === 'typography');
  const gradients = savedItems.filter(item => item.item_type === 'gradient');

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold">Saved Items</h3>

      <Tabs defaultValue="palettes" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="palettes">
            <Palette className="w-4 h-4 mr-2" />
            Palettes ({palettes.length})
          </TabsTrigger>
          <TabsTrigger value="gradients">
            <Waves className="w-4 h-4 mr-2" />
            Gradients ({gradients.length})
          </TabsTrigger>
          <TabsTrigger value="typography">
            <Type className="w-4 h-4 mr-2" />
            Typography ({typography.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="palettes" className="space-y-4 mt-6">
          {palettes.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No saved palettes yet</p>
          ) : (
            <div className="grid gap-4">
              {palettes.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {(item.data.colors as ColorData[]).map((color, idx) => (
                      <ColorSwatch
                        key={idx}
                        hex={color.hex}
                        rgb={color.rgb}
                        name={color.name}
                      />
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="gradients" className="space-y-4 mt-6">
          {gradients.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No saved gradients yet</p>
          ) : (
            <div className="grid gap-4">
              {gradients.map((item) => {
                const gradient = item.data as GradientData;
                return (
                  <Card key={item.id} className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(gradient.css);
                            toast.success('CSS copied!');
                          }}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div
                      className="h-32 rounded-lg"
                      style={{ background: gradient.css }}
                    />
                    <code className="text-xs block mt-2 p-2 bg-muted rounded">
                      {gradient.css}
                    </code>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="typography" className="space-y-4 mt-6">
          {typography.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No saved typography yet</p>
          ) : (
            <div className="grid gap-4">
              {typography.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {item.data.pairings && Object.entries(item.data.pairings).map(([key, font]: [string, any]) => (
                      <div key={key} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                        <span className="text-sm capitalize">{key}:</span>
                        <span className="font-medium">{font.family}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SavedItems;
