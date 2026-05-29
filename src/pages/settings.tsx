import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AlertTriangle, Save, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSettings, saveSettings, SMMIDSettings } from "@/lib/storage";
import { getBalance } from "@/lib/fayupedia";

export default function Settings() {
  const [settings, setSettingsState] = useState<SMMIDSettings>({
    fayupediaApiKey: '',
    midtransClientKey: '',
    midtransServerKey: '',
    midtransEnv: 'sandbox',
    markupPercent: 20
  });

  const [testing, setTesting] = useState(false);

  useEffect(() => {
    setSettingsState(getSettings());
  }, []);

  const handleSave = () => {
    saveSettings(settings);
    toast.success("Pengaturan berhasil disimpan");
  };

  const handleTestFayupedia = async () => {
    if (!settings.fayupediaApiKey) {
      toast.error("Masukkan API Key Fayupedia terlebih dahulu");
      return;
    }

    setTesting(true);
    try {
      const result = await getBalance(settings.fayupediaApiKey);
      toast.success(`Koneksi berhasil! Saldo Anda: ${result.balance} ${result.currency}`);
    } catch (err: any) {
      toast.error(`Koneksi gagal: ${err.message}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="container py-8 px-4 md:px-6 mx-auto max-w-3xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Pengaturan Admin</h1>
        <p className="text-muted-foreground">Konfigurasi koneksi API dan markup harga (Simulasi Client-Side).</p>
      </div>

      <Alert className="bg-yellow-50 text-yellow-900 border-yellow-200">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertTitle className="text-yellow-800">Peringatan Keamanan</AlertTitle>
        <AlertDescription className="text-yellow-700 mt-2 text-sm leading-relaxed">
          Aplikasi ini adalah prototipe client-side murni (tanpa backend). 
          Semua API Key dan Server Key Midtrans akan disimpan di <strong>localStorage browser Anda</strong> dan 
          dikirim langsung dari browser ke API penyedia menggunakan proxy CORS. 
          <br /><br />
          <strong>Jangan gunakan API Key production nyata atau Server Key Midtrans production Anda di aplikasi ini untuk jangka panjang.</strong>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Fayupedia SMM Panel</CardTitle>
          <CardDescription>Konfigurasi koneksi ke penyedia layanan utama.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fayupediaApiKey">API Key</Label>
            <div className="flex gap-2">
              <Input
                id="fayupediaApiKey"
                type="password"
                value={settings.fayupediaApiKey}
                onChange={(e) => setSettingsState({ ...settings, fayupediaApiKey: e.target.value })}
                placeholder="Masukkan API Key Fayupedia"
              />
              <Button variant="secondary" onClick={handleTestFayupedia} disabled={testing}>
                <Activity className="h-4 w-4 mr-2" />
                Test
              </Button>
            </div>
          </div>
          
          <div className="space-y-2 pt-4 border-t">
            <Label htmlFor="markupPercent">Markup Harga / Keuntungan (%)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="markupPercent"
                type="number"
                min="0"
                className="w-32"
                value={settings.markupPercent}
                onChange={(e) => setSettingsState({ ...settings, markupPercent: parseFloat(e.target.value) || 0 })}
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
            <p className="text-xs text-muted-foreground">Harga jual = Harga server + (Harga server × Markup %)</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Midtrans Payment Gateway</CardTitle>
          <CardDescription>Konfigurasi gerbang pembayaran otomatis.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs 
            value={settings.midtransEnv} 
            onValueChange={(val: any) => setSettingsState({ ...settings, midtransEnv: val })}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sandbox">Sandbox (Testing)</TabsTrigger>
              <TabsTrigger value="production">Production (Live)</TabsTrigger>
            </TabsList>
            
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="midtransClientKey">Client Key ({settings.midtransEnv})</Label>
                <Input
                  id="midtransClientKey"
                  value={settings.midtransClientKey}
                  onChange={(e) => setSettingsState({ ...settings, midtransClientKey: e.target.value })}
                  placeholder={`SB-Mid-client-...`}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="midtransServerKey">Server Key ({settings.midtransEnv})</Label>
                <Input
                  id="midtransServerKey"
                  type="password"
                  value={settings.midtransServerKey}
                  onChange={(e) => setSettingsState({ ...settings, midtransServerKey: e.target.value })}
                  placeholder={`SB-Mid-server-...`}
                />
              </div>
            </div>
          </Tabs>
        </CardContent>
        <CardFooter className="bg-muted/50 flex justify-end p-4">
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Simpan Pengaturan
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
