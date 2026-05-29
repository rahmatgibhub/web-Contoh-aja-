import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { RefreshCw, ExternalLink, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getOrders, OrderRecord, saveOrder } from "@/lib/storage";
import { getOrderStatus } from "@/lib/fayupedia";
import { getSettings } from "@/lib/storage";
import { formatRupiah, formatDate } from "@/lib/format";

export default function History() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [refreshing, setRefreshing] = useState<string | null>(null);
  const settings = getSettings();

  useEffect(() => {
    setOrders(getOrders());
  }, []);

  const handleRefreshStatus = async (orderId: string, fayupediaOrderId?: string) => {
    if (!fayupediaOrderId) {
      toast.error("Order belum dikirim ke penyedia layanan.");
      return;
    }
    if (!settings.fayupediaApiKey) {
      toast.error("API Key belum dikonfigurasi.");
      return;
    }

    setRefreshing(orderId);
    try {
      const status = await getOrderStatus(settings.fayupediaApiKey, fayupediaOrderId);
      
      const updatedOrders = orders.map(o => {
        if (o.id === orderId) {
          const updated = { ...o, fayupediaStatus: status.status };
          saveOrder(updated);
          return updated;
        }
        return o;
      });
      setOrders(updatedOrders);
      toast.success("Status berhasil diperbarui");
    } catch (err: any) {
      toast.error(`Gagal memuat status: ${err.message}`);
    } finally {
      setRefreshing(null);
    }
  };

  const getPaymentBadgeColor = (status: string) => {
    switch(status) {
      case 'success': return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'pending': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'failed': case 'expired': case 'cancel': return 'bg-red-100 text-red-800 hover:bg-red-100';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const getFayupediaBadgeColor = (status?: string) => {
    if (!status) return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    const s = status.toLowerCase();
    if (['completed', 'success'].includes(s)) return 'bg-green-100 text-green-800 hover:bg-green-100';
    if (['processing', 'in progress', 'pending'].includes(s)) return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
    if (['partial', 'canceled', 'error'].includes(s)) return 'bg-red-100 text-red-800 hover:bg-red-100';
    return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
  };

  return (
    <div className="container py-8 px-4 md:px-6 mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Riwayat Pesanan</h1>
          <p className="text-muted-foreground">Daftar pesanan yang pernah Anda buat di perangkat ini.</p>
        </div>
        <Link href="/layanan">
          <Button>Buat Pesanan Baru</Button>
        </Link>
      </div>

      {orders.length === 0 ? (
        <Card className="py-12 text-center border-dashed">
          <CardContent className="space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">Belum Ada Pesanan</h3>
            <p className="text-muted-foreground">Anda belum membuat pesanan apapun.</p>
            <Link href="/layanan">
              <Button variant="outline">Lihat Layanan</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop Table */}
          <Card className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal & ID</TableHead>
                  <TableHead>Layanan</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead className="text-right">Jumlah & Harga</TableHead>
                  <TableHead>Pembayaran</TableHead>
                  <TableHead>Status Layanan</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order, index) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="font-medium">{formatDate(order.createdAt)}</div>
                      <div className="text-xs text-muted-foreground font-mono">{order.id}</div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate" title={order.serviceName}>
                      {order.serviceName}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[150px] truncate" title={order.link}>
                        {order.link}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div>{order.quantity.toLocaleString('id-ID')}</div>
                      <div className="font-medium text-primary">{formatRupiah(order.priceIDR)}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getPaymentBadgeColor(order.paymentStatus)}>
                        {order.paymentStatus.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {order.fayupediaStatus ? (
                        <Badge variant="secondary" className={getFayupediaBadgeColor(order.fayupediaStatus)}>
                          {order.fayupediaStatus.toUpperCase()}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {order.fayupediaOrderId && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleRefreshStatus(order.id, order.fayupediaOrderId)}
                          disabled={refreshing === order.id}
                        >
                          <RefreshCw className={`h-4 w-4 ${refreshing === order.id ? 'animate-spin' : ''}`} />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Mobile Cards */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-base line-clamp-2">{order.serviceName}</CardTitle>
                        <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                      </div>
                      <Badge variant="secondary" className={getPaymentBadgeColor(order.paymentStatus)}>
                        {order.paymentStatus}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 pb-4">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Target: </span>
                      <span className="font-medium break-all">{order.link}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-t pt-3">
                      <div>
                        <span className="text-muted-foreground">Jumlah: </span>
                        <span className="font-medium">{order.quantity}</span>
                      </div>
                      <div className="font-bold text-primary">
                        {formatRupiah(order.priceIDR)}
                      </div>
                    </div>
                    {order.fayupediaOrderId && (
                      <div className="flex justify-between items-center bg-muted/50 p-2 rounded border">
                        <span className="text-xs font-medium">Status: {order.fayupediaStatus || 'Menunggu'}</span>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-7 px-2 text-xs"
                          onClick={() => handleRefreshStatus(order.id, order.fayupediaOrderId)}
                          disabled={refreshing === order.id}
                        >
                          <RefreshCw className={`h-3 w-3 mr-1 ${refreshing === order.id ? 'animate-spin' : ''}`} />
                          Refresh
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
