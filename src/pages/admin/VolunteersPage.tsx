import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Volunteer {
  id: string;
  name: string;
  age: number | null;
  phone: string | null;
  working_area: string | null;
  notes: string | null;
}

const emptyForm = { name: "", age: "", phone: "", working_area: "", notes: "" };

const VolunteersPage = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Volunteer | null>(null);
  const [form, setForm] = useState(emptyForm);
  const { toast } = useToast();

  const fetch = async () => {
    const { data } = await supabase.from("volunteers").select("*").order("created_at", { ascending: false });
    if (data) setVolunteers(data);
  };

  useEffect(() => { fetch(); }, []);

  const handleSave = async () => {
    if (!form.name.trim()) return;
    const payload = {
      name: form.name,
      age: form.age ? parseInt(form.age) : null,
      phone: form.phone || null,
      working_area: form.working_area || null,
      notes: form.notes || null,
    };

    if (editing) {
      await supabase.from("volunteers").update(payload).eq("id", editing.id);
      toast({ title: "Volunteer updated" });
    } else {
      await supabase.from("volunteers").insert(payload);
      toast({ title: "Volunteer added" });
    }
    setDialogOpen(false);
    setEditing(null);
    setForm(emptyForm);
    fetch();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("volunteers").delete().eq("id", id);
    toast({ title: "Volunteer deleted" });
    fetch();
  };

  const openEdit = (v: Volunteer) => {
    setEditing(v);
    setForm({
      name: v.name,
      age: v.age?.toString() || "",
      phone: v.phone || "",
      working_area: v.working_area || "",
      notes: v.notes || "",
    });
    setDialogOpen(true);
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Volunteers</h1>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" /> Add Volunteer
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Working Area</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {volunteers.map((v) => (
              <TableRow key={v.id}>
                <TableCell className="font-medium">{v.name}</TableCell>
                <TableCell>{v.age ?? "—"}</TableCell>
                <TableCell>{v.phone ?? "—"}</TableCell>
                <TableCell>{v.working_area ?? "—"}</TableCell>
                <TableCell className="max-w-[200px] truncate">{v.notes ?? "—"}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(v)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(v.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {volunteers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No volunteers yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Volunteer" : "Add Volunteer"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Age</Label>
                <Input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Working Area</Label>
              <Input value={form.working_area} onChange={(e) => setForm({ ...form, working_area: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VolunteersPage;
