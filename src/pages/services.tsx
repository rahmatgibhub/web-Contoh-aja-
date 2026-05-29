import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getServices, Service } from "@/lib/fayupedia";
import { getSettings } from "@/lib/storage";
import { formatRupiah } from "@/lib/format";

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const settings = getSettings();

  useEffect(() => {
    async function loadServices() {
      if (!settings.fayupediaApiKey) {
        setError("API Key belum dikonfigurasi.");
        setLoading(false);
        return;
      }
      try {
        const data = await getServices(settings.fayupediaApiKey);
        setServices(data);
      } catch (err: any) {
        setError(err.message || "Gagal memuat layanan");
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, [settings.fayupediaApiKey]);

  const categories = useMemo(() => {
    const cats = new Set(services.map((s) => s.category));
    return Array.from(cats).sort();
  }, [services]);

  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                          s.service.toString().includes(search);
      const matchCategory = category === "all" || s.category === category;
      return matchSearch && matchCategory;
    });
  }, [services, search, category]);

  const calculatePrice = (rate: string) => {
    const baseRate = parseFloat(rate);
    return baseRate + (baseRate * settings.markupPercent) / 100;
  };

  if (!settings.fayupediaApiKey) {
    return (
      <div className="container py-12">
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertTitle>Konfigurasi Diperlukan</AlertTitle>
          <AlertDescription className="mt-2 space-y-4">
            <p>API Key Fayupedia belum diatur. Silakan konfigurasi pengaturan terlebih dahulu.</p>
            <Link href="/pengaturan">
              <Button variant="outline" size="sm">Buka Pengaturan</Button>
            </Link>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4 md:px-6 mx-auto space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Daftar Layanan</h1>
        <p className="text-muted-foreground">Pilih layanan yang Anda butuhkan.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari layanan atau ID..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full md:w-[280px]">
            <SelectValue placeholder="Semua Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && !loading && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="flex flex-col">
              <CardHeader className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-6 w-full" />
              </CardHeader>
              <CardContent className="space-y-2 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service, index) => (
            <motion.div
              key={service.service}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <Badge variant="secondary" className="shrink-0">ID: {service.service}</Badge>
                    <Badge variant="outline" className="text-right truncate">{service.category}</Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight">{service.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div className="flex justify-between items-end border-b pb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Harga / 1000</p>
                      <p className="text-xl font-bold text-primary">{formatRupiah(calculatePrice(service.rate))}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-muted-foreground">Min / Max</p>
                      <p className="font-medium">{service.min} / {service.max}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {service.refill && <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">Refill</Badge>}
                    {service.cancel && <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Cancelable</Badge>}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/order/${service.service}`} className="w-full">
                    <Button className="w-full">Pesan Sekarang</Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
          {filteredServices.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              Tidak ada layanan yang ditemukan.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
