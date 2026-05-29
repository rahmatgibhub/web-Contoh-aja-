import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Zap, Shield, Wallet, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { SiInstagram, SiTiktok, SiYoutube, SiFacebook, SiX, SiTelegram } from "react-icons/si";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-primary/10 to-background">
        <div className="container px-4 md:px-6 mx-auto text-center space-y-8">
          <div className="space-y-4 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-primary">
              Panel SMM Termurah & Tercepat di Indonesia
            </h1>
            <p className="text-xl text-muted-foreground md:text-2xl">
              Tingkatkan interaksi sosial media Anda dengan layanan berkualitas tinggi, proses instan, dan harga paling kompetitif.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/layanan">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 h-14">
                Lihat Layanan <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/cek-pesanan">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 h-14">
                Cek Pesanan
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Platforms Strip */}
      <section className="w-full py-8 border-y bg-muted/30">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
            <SiInstagram className="h-8 w-8" />
            <SiTiktok className="h-8 w-8" />
            <SiYoutube className="h-8 w-8" />
            <SiFacebook className="h-8 w-8" />
            <SiX className="h-8 w-8" />
            <SiTelegram className="h-8 w-8" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="w-full py-16 md:py-24">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Kenapa SMMID?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Kami menawarkan solusi terbaik untuk kebutuhan social media marketing Anda.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <Zap className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Proses Cepat</CardTitle>
                <CardDescription>Pesanan Anda diproses secara instan oleh sistem otomatis kami.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Aman & Terpercaya</CardTitle>
                <CardDescription>Kami tidak pernah meminta password. Transaksi Anda 100% aman.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Wallet className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Harga Termurah</CardTitle>
                <CardDescription>Nikmati layanan premium dengan harga reseller paling bersaing.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Clock className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Layanan 24/7</CardTitle>
                <CardDescription>Sistem kami online 24 jam setiap hari tanpa hari libur.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="w-full py-16 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Cara Kerja</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hanya 3 langkah mudah untuk mulai meningkatkan interaksi media sosial Anda.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-border border-dashed border-t-2" />
            <div className="flex flex-col items-center text-center space-y-4 relative z-10">
              <div className="w-24 h-24 rounded-full bg-background border-4 border-primary flex items-center justify-center text-3xl font-bold text-primary">1</div>
              <h3 className="text-xl font-semibold">Pilih Layanan</h3>
              <p className="text-muted-foreground">Pilih paket yang sesuai dengan kebutuhan dan budget Anda.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 relative z-10">
              <div className="w-24 h-24 rounded-full bg-background border-4 border-primary flex items-center justify-center text-3xl font-bold text-primary">2</div>
              <h3 className="text-xl font-semibold">Bayar</h3>
              <p className="text-muted-foreground">Lakukan pembayaran dengan berbagai metode yang tersedia.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 relative z-10">
              <div className="w-24 h-24 rounded-full bg-background border-4 border-primary flex items-center justify-center text-3xl font-bold text-primary">3</div>
              <h3 className="text-xl font-semibold">Order Diproses</h3>
              <p className="text-muted-foreground">Sistem akan memproses pesanan Anda secara otomatis.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full py-16 md:py-24">
        <div className="container px-4 md:px-6 mx-auto max-w-3xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Tanya Jawab (FAQ)</h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Apakah SMMID aman digunakan?</AccordionTrigger>
              <AccordionContent>
                Ya, 100% aman. Kami tidak pernah meminta kata sandi (password) akun media sosial Anda. Kami hanya membutuhkan username atau link postingan yang ingin diproses.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Berapa lama waktu proses pesanan?</AccordionTrigger>
              <AccordionContent>
                Sebagian besar pesanan diproses secara instan (0-1 jam). Namun, beberapa layanan mungkin memerlukan waktu 24-48 jam tergantung pada antrian server dan pembaruan media sosial terkait.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Metode pembayaran apa saja yang diterima?</AccordionTrigger>
              <AccordionContent>
                Kami menerima berbagai metode pembayaran melalui Midtrans, termasuk GoPay, ShopeePay, QRIS, Virtual Account (BCA, BNI, BRI, Mandiri, dll), Dana, dan LinkAja.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Bagaimana jika pesanan saya tidak masuk?</AccordionTrigger>
              <AccordionContent>
                Jika pesanan belum masuk setelah 24 jam, Anda dapat mengecek status pesanan di halaman "Cek Pesanan". Jika statusnya "Canceled" (Dibatalkan), dana akan otomatis dikembalikan (Refund) atau Anda bisa mencoba layanan lain.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>Apakah ada garansi (Refill)?</AccordionTrigger>
              <AccordionContent>
                Ya, beberapa layanan memiliki garansi isi ulang (Refill) jika followers/likes mengalami penurunan. Pastikan untuk memilih layanan yang memiliki label "Refill" saat memesan.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6 mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Siap Untuk Memulai?</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Pilih layanan sekarang dan rasakan sendiri kualitas panel SMM terbaik di Indonesia.
          </p>
          <Link href="/layanan">
            <Button size="lg" variant="secondary" className="text-lg px-8 h-14">
              Pesan Sekarang
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
