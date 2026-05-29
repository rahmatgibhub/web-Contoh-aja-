import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getServices, addOrder, Service } from "@/lib/fayupedia";
import { loadSnapScript, createTransaction, payWithSnap } from "@/lib/midtrans";
import { getSettings, saveOrder, OrderRecord } from "@/lib/storage";
import { formatRupiah } from "@/lib/format";

export default function Order() {
  const { serviceId } = useParams();
  const [, setLocation] = useLocation();
  const settings = getSettings();
  
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [link, setLink] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerWhatsapp, setCustomerWhatsapp] = useState("");
  
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    async function load() {
      if (!settings.fayupediaApiKey) {
        setError("API Key Fayupedia belum dikonfigurasi.");
        setLoading(false);
        return;
      }
      try {
        const services = await getServices(settings.fayupediaApiKey);
        const found = services.find(s => s.service === serviceId);
        if (found) {
          setService(found);
          setQuantity(parseInt(found.min));
        } else {
          setError("Layanan tidak ditemukan.");
        }
      } catch (err: any) {
        setError(err.message || "Gagal memuat layanan");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [serviceId, settings.fayupediaApiKey]);

  const calculatePrice = () => {
    if (!service || !quantity) return 0;
    const baseRate = parseFloat(service.rate);
    const rateWithMarkup = baseRate + (baseRate * settings.markupPercent) / 100;
    return (rateWithMarkup / 1000) * (quantity as number);
  };

  const price = calculatePrice();

  const handlePayment = async () => {
    if (!service || !quantity || quantity < parseInt(service.min) || quantity > parseInt(service.max)) {
      toast.error("Kuantitas tidak valid");
      return;
    }
    if (!link || !customerName || !customerEmail || !customerWhatsapp) {
      toast.error("Mohon lengkapi semua data");
      return;
    }

    setIsProcessing(true);
    try {
      await loadSnapScript(settings.midtransClientKey, settings.midtransEnv);
      
      const orderId = `SMMID-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const payload = {
        transaction_details: {
          order_id: orderId,
          gross_amount: Math.round(price)
        },
        customer_details: {
          first_name: customerName,
          email: customerEmail,
          phone: customerWhatsapp
        },
        item_details: [{
          id: service.service,
          price: Math.round(price / quantity),
          quantity: quantity,
          name: service.name.substring(0, 50)
        }]
      };

      const { token } = await createTransaction(settings.midtransServerKey, settings.midtransEnv, payload);

      payWithSnap(token, {
        onSuccess: async (result) => {
          toast.success("Pembayaran berhasil!");
          try {
            const fayupediaOrder = await addOrder(settings.fayupediaApiKey, {
              service: service.service,
              link,
              quantity
            });
            
            const record: OrderRecord = {
              id: orderId,
              createdAt: new Date().toISOString(),
              serviceId: service.service,
              serviceName: service.name,
              link,
              quantity,
              priceIDR: Math.round(price),
              customer: {
                name: customerName,
                email: customerEmail,
                whatsapp: customerWhatsapp
              },
              midtransOrderId: orderId,
              paymentStatus: 'success',
              fayupediaOrderId: fayupediaOrder.order.toString()
            };
            saveOrder(record);
            setLocation('/riwayat');
          } catch (fayuErr: any) {
            toast.error(`Order dibayar tapi gagal diteruskan ke pusat: ${fayuErr.message}`);
            // Save order anyway so they don't lose track
            const record: OrderRecord = {
              id: orderId,
              createdAt: new Date().toISOString(),
              serviceId: service.service,
              serviceName: service.name,
              link,
              quantity,
              priceIDR: Math.round(price),
              customer: {
                name: customerName,
                email: customerEmail,
                whatsapp: customerWhatsapp
              },
              midtransOrderId: orderId,
              paymentStatus: 'success',
            };
            saveOrder(record);
            setLocation('/riwayat');
          }
        },
        onPending: (result) => {
          toast.info("Menunggu pembayaran");
          const record: OrderRecord = {
            id: orderId,
            createdAt: new Date().toISOString(),
            serviceId: service.service,
            serviceName: service.name,
            link,
            quantity,
            priceIDR: Math.round(price),
            customer: {
              name: customerName,
              email: customerEmail,
              whatsapp: customerWhatsapp
            },
            midtransOrderId: orderId,
            paymentStatus: 'pending',
          };
          saveOrder(record);
          setLocation('/riwayat');
        },
        onError: (result) => {
          toast.error("Pembayaran gagal");
          setIsProcessing(false);
        },
        onClose: () => {
          toast.info("Popup pembayaran ditutup");
          setIsProcessing(false);
        }
      });
    } catch (err: any) {
      toast.error(`Terjadi kesalahan: ${err.message}`);
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-12 max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <Card>
          <CardHeader><Skeleton className="h-6 w-full" /></CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="container py-12 max-w-3xl mx-auto">
        <Alert variant="destructive">
          <AlertTitle>Gagal Memuat Layanan</AlertTitle>
          <AlertDescription>{error || "Layanan tidak ditemukan"}</AlertDescription>
        </Alert>
        <Button onClick={() => setLocation('/layanan')} className="mt-4" variant="outline">
          Kembali ke Daftar Layanan
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4 md:px-6 mx-auto max-w-4xl">
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Detail Pesanan</h1>
        <p className="text-muted-foreground">Lengkapi data di bawah ini untuk memproses pesanan Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Pesanan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Layanan</Label>
                <div className="p-3 bg-muted rounded-md text-sm border font-medium">
                  {service.name}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="link">Target / Link / Username</Label>
                <Input 
                  id="link" 
                  placeholder="Contoh: https://instagram.com/username atau @username"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Jumlah (Min: {service.min}, Max: {service.max})</Label>
                <Input 
                  id="quantity" 
                  type="number"
                  min={service.min}
                  max={service.max}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value ? parseInt(e.target.value) : "")}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Pelanggan</CardTitle>
              <CardDescription>Untuk keperluan notifikasi dan invoice pembayaran.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Nama Lengkap</Label>
                  <Input 
                    id="customerName" 
                    placeholder="Nama Anda"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerWhatsapp">Nomor WhatsApp</Label>
                  <Input 
                    id="customerWhatsapp" 
                    placeholder="081234567890"
                    value={customerWhatsapp}
                    onChange={(e) => setCustomerWhatsapp(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerEmail">Email</Label>
                <Input 
                  id="customerEmail" 
                  type="email"
                  placeholder="email@anda.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Ringkasan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Jumlah</span>
                <span className="font-medium">{quantity || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Harga / 1000</span>
                <span className="font-medium">{formatRupiah(calculatePrice() / (quantity || 1) * 1000)}</span>
              </div>
              <div className="pt-4 border-t flex justify-between items-center">
                <span className="font-bold">Total Tagihan</span>
                <span className="text-xl font-bold text-primary">{formatRupiah(price)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full h-12 text-lg" 
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? "Memproses..." : "Bayar Sekarang"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
