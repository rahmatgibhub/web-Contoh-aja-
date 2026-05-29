import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getOrderStatus } from "@/lib/fayupedia";
import { getSettings } from "@/lib/storage";

export default function Track() {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const settings = getSettings();

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    
    if (!settings.fayupediaApiKey) {
      setError("Sistem belum dikonfigurasi dengan benar.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await getOrderStatus(settings.fayupediaApiKey, orderId);
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err: any) {
      setError(err.message || "Gagal melacak pesanan. Pastikan Order ID Fayupedia benar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-12 px-4 md:px-6 mx-auto max-w-2xl min-h-[calc(100vh-4rem-100px)] flex flex-col justify-center">
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Lacak Pesanan</h1>
        <p className="text-muted-foreground">
          Masukkan ID Pesanan (Fayupedia Order ID) untuk melihat status real-time pesanan Anda.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleTrack} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orderId">Order ID</Label>
              <div className="flex gap-2">
                <Input
                  id="orderId"
                  placeholder="Contoh: 123456"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  required
                />
                <Button type="submit" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  <span className="ml-2 hidden sm:inline">Lacak</span>
                </Button>
              </div>
            </div>
          </form>

          {error && (
            <Alert variant="destructive" className="mt-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <div className="mt-8 space-y-6">
              <h3 className="text-lg font-semibold border-b pb-2">Hasil Pelacakan</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-bold text-lg uppercase capitalize">
                    {result.status || "-"}
                  </p>
                </div>
                <div className="space-y-1 bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Jumlah Awal (Start Count)</p>
                  <p className="font-bold text-lg">
                    {result.start_count || "0"}
                  </p>
                </div>
                <div className="space-y-1 bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Sisa (Remains)</p>
                  <p className="font-bold text-lg">
                    {result.remains || "0"}
                  </p>
                </div>
                <div className="space-y-1 bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Biaya (Server)</p>
                  <p className="font-bold text-lg">
                    {result.charge ? `${result.charge} ${result.currency || ''}` : "-"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
