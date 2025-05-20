/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronRight, Calendar, Rocket, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <div className="relative h-[300px] bg-gradient-to-r from-primary to-primary/80">
        <div className="absolute inset-0 bg-black/50" />
        <div className="container mx-auto h-full flex flex-col justify-center relative z-10">
          <h1 className="text-4xl font-bold text-white mb-4">Tentang Kami</h1>
          <div className="flex items-center text-white/80 gap-2">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span>Tentang Kami</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto">
          <Tabs defaultValue="about" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
              <TabsTrigger value="about" className="text-base py-3">
                <Calendar className="mr-2 h-4 w-4" />
                Tentang Kami
              </TabsTrigger>
              <TabsTrigger value="vision" className="text-base py-3">
                <Rocket className="mr-2 h-4 w-4" />
                Visi & Misi
              </TabsTrigger>
              <TabsTrigger value="team" className="text-base py-3">
                <Users className="mr-2 h-4 w-4" />
                Tim TrashIt
              </TabsTrigger>
            </TabsList>

            <Card className="mt-6">
              <CardContent className="p-6">
                <TabsContent value="about">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold">Apa itu TrashIt?</h3>
                    <div className="space-y-4 text-muted-foreground">
                      <p>
                        TrashIt adalah bank sampah yang didirikan untuk melayani
                        kontribusi aktif semua pihak dalam pengelolaan sampah.
                        TrashIt diharapkan dapat mewujudkan pengelolaan sampah
                        secara mandiri dan berkelanjutan. Dengan mengusung
                        semangat sampahku tanggung jawabku, TrashIt hadir
                        sebagai bentuk nyata tanggung jawab kita terhadap
                        lingkungan melalui kegiatan 3R (reduce, reuse, recycle).
                      </p>
                      <p>
                        Dalam kegiatannya TrashIt akan menampung sampah
                        an-organik yang disetorkan oleh nasabah. Sampah yang
                        terkumpul akan dipilah dan dijual ke pengepul sesuai
                        jenisnya. Hasil penjualan sampah ini akan menjadi
                        tabungan bagi para nasabah bank sampah TrashIt. Tabungan
                        sampah yang telah dikonversi menjadi rupiah akan dapat
                        diambil atau didonasikan oleh nasabah secara tunai
                        maupun pemindah bukuan.
                      </p>
                      <p>
                        Salah satu yang membedakan TrashIt dengan bank sampah
                        lainnya adalah pemanfaatan aplikasi berbasis web untuk
                        pengelolaan nasabah dan jumlah sampah yang disetorkan.
                        Penggunaan aplikasi ini dimaksudkan untuk menciptakan
                        layanan yang informatif dan juga untuk meminimalkan
                        penggunaan kertas dalam kegiatan TrashIt.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="vision">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-bold mb-4">Visi</h3>
                      <p className="text-muted-foreground">
                        TrashIt Peduli Dan Mandiri Dalam Pengelolaan Sampah Yang
                        Berkelanjutan
                      </p>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-4">Misi</h3>
                      <ol className="list-decimal list-inside space-y-2 text-muted-foreground pl-4">
                        <li>Memberdayakan Pemilahan Sampah</li>
                        <li>
                          Meningkatkan Partisipasi Masyarakat Dalam Pengelolaan
                          Lingkungan
                        </li>
                        <li>
                          Mewujudkan Masyarakat Yang Lebih Kreatif, Inovatif,
                          Inspiratif Dan Mandiri Di Bidang Pengelolaan
                          Lingkungan
                        </li>
                      </ol>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="team">
                  <div className="space-y-12">
                    <div>
                      <h3 className="text-2xl font-bold mb-6">Tim TrashIt</h3>

                      <div className="space-y-8">
                        <div>
                          <h4 className="text-lg font-semibold mb-4">
                            1. Tim Manajemen
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            {[
                              {
                                src: '/placeholder-profile.jpg',
                                title: 'CEO',
                              },
                              {
                                src: '/placeholder-profile.jpg',
                                title: 'CTO',
                              },
                              {
                                src: '/placeholder-profile.jpg',
                                title: 'COO',
                              },
                            ].map((member, index) => (
                              <div key={index} className="space-y-4">
                                <div className="aspect-[3/4] relative">
                                  <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                                    <Users className="w-12 h-12 text-muted-foreground" />
                                  </div>
                                </div>
                                <p className="font-medium">{member.title}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold mb-4">
                            2. Tim Operasional
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                            {[
                              {
                                title: 'Operations Lead',
                              },
                              {
                                title: 'Technical Lead',
                              },
                              {
                                title: 'Community Manager',
                              },
                              {
                                title: 'Environmental Specialist',
                              },
                            ].map((member, index) => (
                              <div key={index} className="space-y-4">
                                <div className="aspect-square relative">
                                  <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                                    <Users className="w-12 h-12 text-muted-foreground" />
                                  </div>
                                </div>
                                <p className="font-medium">{member.title}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </CardContent>
            </Card>
          </Tabs>
        </div>
      </section>
    </main>
  );
}
