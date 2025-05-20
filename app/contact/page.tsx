'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Phone, MapPin, Mail } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { MAP_CONFIG } from '@/lib/config';
import { submitContactForm } from './actions';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await submitContactForm(formData);

    if (result?.error) {
      setError(result.error);
      toast.error(result.error);
    } else {
      toast.success('Pesan berhasil terkirim!');
      (event.target as HTMLFormElement).reset();
    }
    setIsSubmitting(false);
  };

  return (
    <div className="container mx-auto p-6">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-12 mb-12 text-white">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4">Kontak Kami</h1>
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-2">
              <li className="inline-flex items-center">
                <Link href="/" className="hover:text-gray-200">
                  Home
                </Link>
              </li>
              <li className="inline-flex items-center">
                <span className="mx-2">/</span>
                <span>Kontak Kami</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Textarea
                  name="message"
                  placeholder="Masukkan pesan Anda"
                  className="min-h-[150px]"
                  required
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    name="name"
                    type="text"
                    placeholder="Masukkan nama Anda"
                    required
                  />
                  <Input
                    name="email"
                    type="email"
                    placeholder="Masukkan alamat email"
                    required
                  />
                </div>
                <Input
                  name="subject"
                  type="text"
                  placeholder="Masukkan subjek"
                  required
                />
                <Button type="submit" className="w-fit" disabled={isSubmitting}>
                  {isSubmitting ? 'Mengirim...' : 'Kirim'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Contact Info */}
        <div>
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-emerald-500" />
                  <div>
                    <h3 className="font-semibold">
                      Tempat Pengelolaan Sampah Terpadu (TPST) UNDIP
                    </h3>
                    <p className="text-muted-foreground">
                      Universitas Diponegoro, Tembalang, Semarang
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-emerald-500" />
                  <div>
                    <h3 className="font-semibold">081382443800</h3>
                    <p className="text-muted-foreground">(Dipo Waste Bank)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-emerald-500" />
                  <div>
                    <h3 className="font-semibold">dipowastebank@gmail.com</h3>
                    <p className="text-muted-foreground">
                      Hubungi kami melalui email
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="mt-8 rounded-lg overflow-hidden">
        <iframe
          src={MAP_CONFIG.embed_url}
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          title={MAP_CONFIG.title}
          className="rounded-lg"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
