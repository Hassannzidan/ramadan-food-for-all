import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Search, Save } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const MapPage = () => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [clicked, setClicked] = useState<{ lat: number; lng: number } | null>(null);
  const [buildingNumber, setBuildingNumber] = useState("");
  const [streetName, setStreetName] = useState("");
  const [locationDetails, setLocationDetails] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reverseLoading, setReverseLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current).setView([31.5, 34.47], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OSM</a>',
    }).addTo(map);

    map.on("click", async (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setClicked({ lat, lng });

      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng]).addTo(map);
      }

      setReverseLoading(true);
      setDialogOpen(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`
        );
        const data = await res.json();
        setBuildingNumber(data.address?.house_number || "");
        setStreetName(data.address?.road || "");
        setLocationDetails(data.display_name || "");
      } catch {
        setBuildingNumber("");
        setStreetName("");
        setLocationDetails("");
      }
      setReverseLoading(false);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`
      );
      const data = await res.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        mapRef.current?.flyTo([parseFloat(lat), parseFloat(lon)], 17);
      } else {
        toast({ title: "No results found", variant: "destructive" });
      }
    } catch {
      toast({ title: "Search failed", variant: "destructive" });
    }
  };

  const handleSaveBuilding = async () => {
    if (!clicked) return;
    const { error } = await supabase.from("buildings").insert({
      building_number: buildingNumber || null,
      street_name: streetName || null,
      latitude: clicked.lat,
      longitude: clicked.lng,
      location_details: locationDetails || null,
    });
    if (error) {
      toast({ title: "Error saving", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Building saved!" });
      setDialogOpen(false);
      setClicked(null);
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Map & Areas</h1>
      <p className="text-muted-foreground">Search for locations and click on the map to save buildings.</p>

      <div className="flex gap-2">
        <Input
          placeholder="Search location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button onClick={handleSearch} size="icon">
          <Search className="w-4 h-4" />
        </Button>
      </div>

      <div ref={mapContainerRef} className="rounded-lg overflow-hidden border" style={{ height: "65vh" }} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Building</DialogTitle>
          </DialogHeader>
          {reverseLoading ? (
            <p className="text-center py-4 text-muted-foreground">Loading location info...</p>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Building Number</Label>
                  <Input value={buildingNumber} onChange={(e) => setBuildingNumber(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Street Name</Label>
                  <Input value={streetName} onChange={(e) => setStreetName(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Location Details</Label>
                <Input value={locationDetails} onChange={(e) => setLocationDetails(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <p>Lat: {clicked?.lat.toFixed(6)}</p>
                <p>Lng: {clicked?.lng.toFixed(6)}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveBuilding} disabled={reverseLoading}>
              <Save className="w-4 h-4 mr-2" /> Save Building
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MapPage;
