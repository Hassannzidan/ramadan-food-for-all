import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen, Users, Building2, Image } from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({ categories: 0, volunteers: 0, buildings: 0, images: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [cats, vols, builds, imgs] = await Promise.all([
        supabase.from("categories").select("id", { count: "exact", head: true }),
        supabase.from("volunteers").select("id", { count: "exact", head: true }),
        supabase.from("buildings").select("id", { count: "exact", head: true }),
        supabase.from("category_images").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        categories: cats.count ?? 0,
        volunteers: vols.count ?? 0,
        buildings: builds.count ?? 0,
        images: imgs.count ?? 0,
      });
    };
    fetchStats();
  }, []);

  const cards = [
    { title: "Categories", value: stats.categories, icon: FolderOpen, color: "text-blue-600" },
    { title: "Volunteers", value: stats.volunteers, icon: Users, color: "text-green-600" },
    { title: "Buildings", value: stats.buildings, icon: Building2, color: "text-purple-600" },
    { title: "Images", value: stats.images, icon: Image, color: "text-orange-600" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ title, value, icon: Icon, color }) => (
          <Card key={title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
              <Icon className={cn("w-5 h-5", color)} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// inline cn since it's small usage
const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

export default Dashboard;
