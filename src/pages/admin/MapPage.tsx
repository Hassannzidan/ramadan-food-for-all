import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
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

interface ClickedLocation {
  lat: number;
  lng: number;
}

const SearchControl = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const [query, setQuery] = useState("");
  return (
    <div className="flex gap-2">
      <Input
        placeholder="Search location..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch(query)}
      />
      <Button onClick={() => onSearch(query)} size="icon">
        <Search className="w-4 h-4" />
      </Button>
    </div>
  );
};

const MapClickHandler = ({ onClick }: { onClick: (loc: ClickedLocation) => void }) => {
  useMapEvents({
    click(e) {
      onClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
};

const FlyTo = ({ position }: { position: [number, number] | null }) => {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 17);
  }, [position, map]);
  return null;
};

const MapPage = () => {
  const [clicked, setClicked] = useState<ClickedLocation | null>(null);
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null);
  const [buildingNumber, setBuildingNumber] = useState("");
  const [streetName, setStreetName] = useState("");
  const [locationDetails, setLocationDetails] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reverseLoading, setReverseLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`
      );
      const data = await res.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        setFlyTo([parseFloat(lat), parseFloat(lon)]);
      } else {
        toast({ title: "No results found", variant: "destructive" });
      }
    } catch {
      toast({ title: "Search failed", variant: "destructive" });
    }
  };

  const handleMapClick = async (loc: ClickedLocation) => {
    setClicked(loc);
    setReverseLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${loc.lat}&lon=${loc.lng}&format=json&addressdetails=1`
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
    setDialogOpen(true);
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
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Map & Areas</h1>
      <p className="text-muted-foreground">Search for locations and click on buildings to save them.</p>
      <SearchControl onSearch={handleSearch} />

      <div className="rounded-lg overflow-hidden border" style={{ height: "65vh" }}>
        <MapContainer center={[31.5, 34.47]} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onClick={handleMapClick} />
          <FlyTo position={flyTo} />
          {clicked && (
            <Marker position={[clicked.lat, clicked.lng]}>
              <Popup>
                {streetName && <p><strong>{streetName}</strong></p>}
                {buildingNumber && <p>Building: {buildingNumber}</p>}
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

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
