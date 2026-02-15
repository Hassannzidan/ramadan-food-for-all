import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, UserPlus, Users, Building2 } from "lucide-react";

interface Building {
  id: string;
  building_number: string | null;
  street_name: string | null;
  latitude: number;
  longitude: number;
  location_details: string | null;
  custom_data: Record<string, any>;
}

interface Volunteer {
  id: string;
  name: string;
  working_area: string | null;
}

interface Assignment {
  id: string;
  building_id: string;
  volunteer_id: string;
  apartment_number: string | null;
  donor_number: string | null;
  notes: string | null;
  volunteers?: Volunteer;
}

const BuildingsPage = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [assignForm, setAssignForm] = useState({ volunteer_id: "", apartment_number: "", donor_number: "", notes: "" });
  const [editForm, setEditForm] = useState({ building_number: "", street_name: "", location_details: "" });
  const { toast } = useToast();

  const fetchBuildings = async () => {
    const { data } = await supabase.from("buildings").select("*").order("created_at", { ascending: false });
    if (data) setBuildings(data as Building[]);
  };

  const fetchVolunteers = async () => {
    const { data } = await supabase.from("volunteers").select("id, name, working_area");
    if (data) setVolunteers(data);
  };

  const fetchAssignments = async (buildingId: string) => {
    const { data } = await supabase
      .from("building_assignments")
      .select("*, volunteers(id, name, working_area)")
      .eq("building_id", buildingId);
    if (data) setAssignments(data as any);
  };

  useEffect(() => {
    fetchBuildings();
    fetchVolunteers();
  }, []);

  const selectBuilding = (b: Building) => {
    setSelectedBuilding(b);
    fetchAssignments(b.id);
  };

  const handleDeleteBuilding = async (id: string) => {
    await supabase.from("buildings").delete().eq("id", id);
    toast({ title: "Building deleted" });
    setSelectedBuilding(null);
    fetchBuildings();
  };

  const handleEditBuilding = async () => {
    if (!selectedBuilding) return;
    await supabase.from("buildings").update({
      building_number: editForm.building_number || null,
      street_name: editForm.street_name || null,
      location_details: editForm.location_details || null,
    }).eq("id", selectedBuilding.id);
    toast({ title: "Building updated" });
    setEditDialogOpen(false);
    fetchBuildings();
  };

  const openEdit = (b: Building) => {
    setEditForm({
      building_number: b.building_number || "",
      street_name: b.street_name || "",
      location_details: b.location_details || "",
    });
    setEditDialogOpen(true);
  };

  const handleAssign = async () => {
    if (!selectedBuilding || !assignForm.volunteer_id) return;
    await supabase.from("building_assignments").insert({
      building_id: selectedBuilding.id,
      volunteer_id: assignForm.volunteer_id,
      apartment_number: assignForm.apartment_number || null,
      donor_number: assignForm.donor_number || null,
      notes: assignForm.notes || null,
    });
    toast({ title: "Volunteer assigned" });
    setAssignDialogOpen(false);
    setAssignForm({ volunteer_id: "", apartment_number: "", donor_number: "", notes: "" });
    fetchAssignments(selectedBuilding.id);
  };

  const handleRemoveAssignment = async (id: string) => {
    if (!selectedBuilding) return;
    await supabase.from("building_assignments").delete().eq("id", id);
    toast({ title: "Assignment removed" });
    fetchAssignments(selectedBuilding.id);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Buildings & Assignments</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Buildings list */}
        <div className="lg:col-span-1 space-y-2">
          <h2 className="text-lg font-semibold text-muted-foreground">Saved Buildings</h2>
          {buildings.length === 0 && (
            <p className="text-sm text-muted-foreground py-4">No buildings saved. Use the Map page to add buildings.</p>
          )}
          {buildings.map((b) => (
            <Card
              key={b.id}
              className={`cursor-pointer transition-colors ${selectedBuilding?.id === b.id ? "ring-2 ring-primary" : ""}`}
              onClick={() => selectBuilding(b)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{b.street_name || "Unknown Street"}</span>
                  {b.building_number && <span className="text-sm text-muted-foreground">#{b.building_number}</span>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Building detail */}
        <div className="lg:col-span-2">
          {selectedBuilding ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  {selectedBuilding.street_name || "Unknown"} {selectedBuilding.building_number && `#${selectedBuilding.building_number}`}
                </CardTitle>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => openEdit(selectedBuilding)}>
                    <Pencil className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteBuilding(selectedBuilding.id)}>
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <p>{selectedBuilding.location_details}</p>
                  <p className="mt-1">Lat: {selectedBuilding.latitude.toFixed(6)}, Lng: {selectedBuilding.longitude.toFixed(6)}</p>
                </div>

                {/* Assignments */}
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Users className="w-4 h-4" /> Assigned Volunteers
                  </h3>
                  <Button size="sm" onClick={() => setAssignDialogOpen(true)}>
                    <UserPlus className="w-4 h-4 mr-1" /> Assign
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Volunteer</TableHead>
                      <TableHead>Apartment</TableHead>
                      <TableHead>Donor #</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead className="w-16"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignments.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell className="font-medium">{(a as any).volunteers?.name ?? "—"}</TableCell>
                        <TableCell>{a.apartment_number ?? "—"}</TableCell>
                        <TableCell>{a.donor_number ?? "—"}</TableCell>
                        <TableCell>{a.notes ?? "—"}</TableCell>
                        <TableCell>
                          <Button size="icon" variant="ghost" onClick={() => handleRemoveAssignment(a.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {assignments.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-4">
                          No volunteers assigned yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              Select a building to view details and manage assignments.
            </div>
          )}
        </div>
      </div>

      {/* Assign Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Volunteer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Volunteer</Label>
              <Select value={assignForm.volunteer_id} onValueChange={(v) => setAssignForm({ ...assignForm, volunteer_id: v })}>
                <SelectTrigger><SelectValue placeholder="Select volunteer" /></SelectTrigger>
                <SelectContent>
                  {volunteers.map((v) => (
                    <SelectItem key={v.id} value={v.id}>{v.name} {v.working_area ? `(${v.working_area})` : ""}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Apartment #</Label>
                <Input value={assignForm.apartment_number} onChange={(e) => setAssignForm({ ...assignForm, apartment_number: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Donor #</Label>
                <Input value={assignForm.donor_number} onChange={(e) => setAssignForm({ ...assignForm, donor_number: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Input value={assignForm.notes} onChange={(e) => setAssignForm({ ...assignForm, notes: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAssign}>Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Building Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Building</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Building Number</Label>
              <Input value={editForm.building_number} onChange={(e) => setEditForm({ ...editForm, building_number: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Street Name</Label>
              <Input value={editForm.street_name} onChange={(e) => setEditForm({ ...editForm, street_name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Location Details</Label>
              <Input value={editForm.location_details} onChange={(e) => setEditForm({ ...editForm, location_details: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditBuilding}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BuildingsPage;
