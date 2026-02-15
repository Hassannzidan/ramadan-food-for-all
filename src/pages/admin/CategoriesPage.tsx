import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Upload, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

interface CategoryImage {
  id: string;
  category_id: string;
  image_url: string;
  file_path: string;
}

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<Record<string, CategoryImage[]>>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*").order("created_at", { ascending: false });
    if (data) setCategories(data);
  };

  const fetchImages = async (categoryId: string) => {
    const { data } = await supabase.from("category_images").select("*").eq("category_id", categoryId);
    if (data) setImages((prev) => ({ ...prev, [categoryId]: data }));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    categories.forEach((c) => fetchImages(c.id));
  }, [categories]);

  const handleSave = async () => {
    if (!name.trim()) return;
    if (editing) {
      await supabase.from("categories").update({ name, description }).eq("id", editing.id);
      toast({ title: "Category updated" });
    } else {
      await supabase.from("categories").insert({ name, description });
      toast({ title: "Category created" });
    }
    setDialogOpen(false);
    setEditing(null);
    setName("");
    setDescription("");
    fetchCategories();
  };

  const handleDelete = async (id: string) => {
    // Delete images from storage first
    const catImages = images[id] || [];
    for (const img of catImages) {
      await supabase.storage.from("category-images").remove([img.file_path]);
    }
    await supabase.from("categories").delete().eq("id", id);
    toast({ title: "Category deleted" });
    fetchCategories();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, categoryId: string) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const filePath = `${categoryId}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from("category-images").upload(filePath, file);
      if (error) {
        toast({ title: "Upload failed", description: error.message, variant: "destructive" });
        continue;
      }
      const { data: urlData } = supabase.storage.from("category-images").getPublicUrl(filePath);
      await supabase.from("category_images").insert({
        category_id: categoryId,
        image_url: urlData.publicUrl,
        file_path: filePath,
      });
    }

    setUploading(false);
    toast({ title: "Images uploaded" });
    fetchImages(categoryId);
  };

  const handleDeleteImage = async (image: CategoryImage) => {
    await supabase.storage.from("category-images").remove([image.file_path]);
    await supabase.from("category_images").delete().eq("id", image.id);
    toast({ title: "Image deleted" });
    fetchImages(image.category_id);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setName(cat.name);
    setDescription(cat.description || "");
    setDialogOpen(true);
  };

  const openCreate = () => {
    setEditing(null);
    setName("");
    setDescription("");
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" /> New Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <Card key={cat.id} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">{cat.name}</CardTitle>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" onClick={() => openEdit(cat)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => handleDelete(cat.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {cat.description && <p className="text-sm text-muted-foreground">{cat.description}</p>}

              {/* Image gallery */}
              <div className="grid grid-cols-3 gap-2">
                {(images[cat.id] || []).map((img) => (
                  <div key={img.id} className="relative group aspect-square">
                    <img src={img.image_url} alt="" className="w-full h-full object-cover rounded-md" />
                    <button
                      onClick={() => handleDeleteImage(img)}
                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Upload */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer text-sm text-primary hover:underline">
                  <Upload className="w-4 h-4" />
                  {uploading ? "Uploading..." : "Upload Images"}
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleUpload(e, cat.id)}
                    disabled={uploading}
                  />
                </label>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <p className="text-center text-muted-foreground py-12">No categories yet. Create one to get started.</p>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Category" : "New Category"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoriesPage;
