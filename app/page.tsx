import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/browse');
  }

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative h-[600px] w-full bg-gradient-to-r from-primary/20 to-primary/30">
        <div className="container mx-auto h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4 animate-fade-up">TRASHIT</h1>
            <p className="text-xl mb-8 animate-fade-up delay-200">
              TrashIt peduli dan mandiri dalam pengelolaan sampah yang
              berkelanjutan
            </p>
            <Button asChild size="lg" className="animate-fade-up delay-300">
              <Link href="/register">Gabung Sekarang</Link>
            </Button>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
              <a href="#about-section" className="text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14" />
                  <path d="m19 12-7 7-7-7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Counter Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
              <div>
                <h2 className="text-3xl font-bold">
                  AYO INVESTASIKAN{' '}
                  <span className="text-yellow-300">SAMPAHMU!</span>
                </h2>
                <p className="text-xl">
                  Bersama kami di{' '}
                  <span className="text-green-300 font-bold">TrashIt</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Waste Types Section */}
      <section
        className="py-24 bg-gradient-to-b from-background to-secondary/10"
        id="about-section"
      >
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Sampah Yang Kami Terima</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Kami menerima berbagai jenis sampah yang dapat didaur ulang untuk
              menciptakan lingkungan yang lebih bersih
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8 animate-fade-right">
              <Card className="group hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="w-16 h-16 relative group-hover:scale-110 transition-transform">
                    <Image
                      src="https://dipowastebank.com/img/icon/kardus.png"
                      alt="Kardus"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <CardTitle className="text-2xl">Kardus</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Kardus yang berbentuk boks tebal yang biasanya digunakan
                    untuk tempat menyimpan benda agar benda tersebut menjadi
                    aman di dalamnya
                  </p>
                </CardContent>
              </Card>
              <Card className="group hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="w-16 h-16 relative group-hover:scale-110 transition-transform">
                    <Image
                      src="https://dipowastebank.com/img/icon/duplex.png"
                      alt="Marga/Duplex"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <CardTitle className="text-2xl">Marga/Duplex</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Marga/Duplex berbentuk boks tipis yang sering digunakan
                    sebagai kemasan produk dengan bentuk berbagai macam namun
                    lebih sering berbentuk balok
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8 animate-fade-left">
              <Card className="group hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="w-16 h-16 relative group-hover:scale-110 transition-transform">
                    <Image
                      src="https://dipowastebank.com/img/icon/kertas.png"
                      alt="Kertas"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <CardTitle className="text-2xl">Kertas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Kertas dengan bahan yang tipis yang dihasilkan dengan
                    kompresi serat yang berasal dari pulp dan berwarna putih
                  </p>
                </CardContent>
              </Card>
              <Card className="group hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="w-16 h-16 relative group-hover:scale-110 transition-transform">
                    <Image
                      src="https://dipowastebank.com/img/icon/botol.png"
                      alt="Botol Plastik"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <CardTitle className="text-2xl">Botol Plastik</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Botol Plastik yang biasanya dipakai untuk wadah minuman atau
                    lainnya. Ukurannya beragam dari botol yang berukuran kurang
                    dari 200 ml sampai lebih dari 1000 ml
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* SOP Section */}
      <section className="py-24 bg-secondary/10">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">TrashIt SOP</h2>
          <div className="relative max-w-5xl mx-auto">
            <Image
              src="/SOP jagoan timbang.jpg"
              alt="TrashIt Standard Operating Procedure"
              width={1200}
              height={800}
              className="w-full rounded-lg shadow-lg"
              priority
            />
          </div>
        </div>
      </section>

      {/* Registration Flow Section */}
      <section className="py-24">
        {/* Removed background image classes */}
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <div className="mb-8">
                <h3 className="text-3xl font-bold text-foreground">
                  {' '}
                  {/* Changed text color */}
                  ALUR PENDAFTARAN AKUN
                </h3>
                <p className="text-muted-foreground mt-2">
                  {' '}
                  {/* Changed text color */}
                  Ikuti alur berikut untuk mendaftar akun di TrashIt
                </p>
              </div>
              <div className="space-y-8">
                {[
                  {
                    number: '1',
                    title: 'DAFTAR',
                    description: 'Akses halaman trashit.my.id/register',
                  },
                  {
                    number: '2',
                    title: 'ISI FORM PENDAFTARAN AKUN',
                    description:
                      'Mengisi form data diri lalu klik tombol daftar',
                  },
                  {
                    number: '3',
                    title: 'VERIFIKASI EMAIL',
                    description:
                      'Mendapatkan email verifikasi & klik verifikasi email',
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 bg-card border p-6 rounded-lg" /* Changed background and added border */
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                      {item.number}
                    </span>
                    <div>
                      <h5 className="font-bold text-foreground">
                        {item.title}
                      </h5>{' '}
                      {/* Changed text color */}
                      <p className="text-muted-foreground">
                        {item.description}
                      </p>{' '}
                      {/* Changed text color */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-4 flex flex-col items-center justify-center">
              <div className="relative w-full max-w-[300px] aspect-[3/4]"></div>
              <div className="mt-4"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Get in Touch</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <form className="space-y-6">
                <Textarea
                  placeholder="Masukkan pesan Anda"
                  className="min-h-[150px]"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input placeholder="Masukkan nama Anda" />
                  <Input type="email" placeholder="Masukkan alamat email" />
                </div>
                <Input placeholder="Masukkan subjek" />
                <Button type="submit" size="lg">
                  Kirim
                </Button>
              </form>
            </div>
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    Lokasi
                  </CardTitle>
                  <CardDescription>
                    Tempat Pengelolaan Sampah Terpadu (TPST) TrashIt, Tembalang,
                    Semarang
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    Telepon
                  </CardTitle>
                  <CardDescription>081382443800 (TrashIt)</CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    Email
                  </CardTitle>
                  <CardDescription>
                    contact@trashit.id Hubungi kami melalui email
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <div className="w-full h-[450px]">
        <iframe
          className="w-full h-full border-0"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.6497647792708!2d110.43791137483662!3d-7.050377392951865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708d00728a162b%3A0xc6a261d1a37b6189!2sTeknik%20Lingkungan%20Universitas%20Diponegoro!5e0!3m2!1sen!2sid!4v1747833756106!5m2!1sen!2sid"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </main>
  );
}
