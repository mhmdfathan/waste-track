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
                Tim Dipo Waste Bank
              </TabsTrigger>
            </TabsList>

            <Card className="mt-6">
              <CardContent className="p-6">
                <TabsContent value="about">
                  <div className="space-y-6">
                    {' '}
                    <h3 className="text-2xl font-bold">Apa itu TrashIt?</h3>
                    <div className="space-y-4 text-muted-foreground">
                      <p>
                        {' '}
                        TrashIt adalah bank sampah kampus yang didirikan untuk
                        melayani kontribusi aktif semua pihak dalam pengelolaan
                        sampah di dalam kampus. TrashIt diharapkan dapat
                        mewujudkan pengelolaan sampah secara mandiri dan
                        berkelanjutan di lingkungan kampus.Dengan mengusung
                        semangat sampahku tanggung jawabku, DWB ini hadir
                        sebagai bentuk nyata tanggung jawab CAK UDI kepada
                        lingkungan melalui kegiatan 3R (reduce, reuse, recycle).
                      </p>
                      <p>
                        {' '}
                        Dalam kegiatannya TrashIt akan menampung sampah
                        an-organik yang disetorkan oleh nasabah. Sampah yang
                        terkumpul akan dipilah dan dijual ke pengepul sesuai
                        jenisnya. Hasil penjualan sampah ini akan menjadi
                        tabungan bagi para nasabah bank sampah TrashIt.Tabungan
                        sampah yang telah dikonversi menjadi rupiah akan dapat
                        diambil atau didonasikan oleh nasabah secara tunai
                        maupun pemindah bukuan.
                      </p>
                      <p>
                        {' '}
                        Salah satu yang membedakan TrashIt dengan bank sampah
                        lainnya adalah pemanfaatan aplikasi berbasis web untuk
                        pengelolaan nasabah dan jumlah sampah yang disetorkan.
                        Penggunaan aplikasi ini dimaksudkan untuk menciptakan
                        layanan yang informatif dan juga untuk meminimalkan
                        penggunaan kertas dalam kegiatan TrashIt.Aplikasi DWB
                        ini dikembangkan oleh Husni Fadhilah Dhiya Ul Haq (NIM.
                        24060118120034), mahasiswa Informatika Fakultas Sains
                        dan Matematika.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="vision">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-bold mb-4">Visi</h3>
                      <p className="text-muted-foreground">
                        Undip Peduli Dan Mandiri Dalam Pengelolaan Sampah Yang
                        Berkelanjutan
                      </p>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-4">Misi</h3>
                      <ol className="list-decimal list-inside space-y-2 text-muted-foreground pl-4">
                        <li>Memberdayakan Pemilahan Sampah</li>
                        <li>
                          Meningkatkan Partisipasi Warga Kampus Dalam
                          Pengelolaan Lingkungan
                        </li>
                        <li>
                          Mewujudkan Warga Kampus Yang Lebih Kreatif, Inovatif,
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
                      <h3 className="text-2xl font-bold mb-6">
                        Tim Dipo Waste Bank
                      </h3>

                      <div className="space-y-8">
                        <div>
                          <h4 className="text-lg font-semibold mb-4">
                            1. Powered By
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center">
                            {[
                              {
                                src: 'https://dipowastebank.com/img/logo/undip.png',
                                alt: 'Undip',
                              },
                              {
                                src: 'https://dipowastebank.com/img/logo/sdgs.png',
                                alt: 'SDGs Center Undip',
                              },
                              {
                                src: 'https://dipowastebank.com/img/logo/oxygen.png',
                                alt: 'Oxygen Undip',
                              },
                              {
                                src: 'https://dipowastebank.com/img/logo/hmtl.png',
                                alt: 'HMTL Undip',
                              },
                              {
                                src: 'https://dipowastebank.com/img/logo/ksl.png',
                                alt: 'KSL Undip',
                              },
                            ].map((partner, index) => (
                              <div key={index} className="relative w-32 h-20">
                                <Image
                                  src={partner.src}
                                  alt={partner.alt}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold mb-4">
                            2. Tim Dosen
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            {[
                              {
                                src: 'https://dipowastebank.com/img/team/bu_sri.jpg',
                                name: 'Dr. Sri Sumiyati, S.T., M.Si.',
                              },
                              {
                                src: 'https://dipowastebank.com/img/team/pak_bima.jpg',
                                name: 'Bimastyaji Surya Ramadan, S.T., M.T.',
                              },
                              {
                                src: 'https://dipowastebank.com/img/team/pak_arief.jpg',
                                name: 'M.Arief Budihardjo, S.T., M.Eng.Sc., Ph.d.',
                              },
                            ].map((member, index) => (
                              <div key={index} className="space-y-4">
                                <div className="aspect-[3/4] relative">
                                  <Image
                                    src={member.src}
                                    alt={member.name}
                                    fill
                                    className="object-cover rounded-lg"
                                  />
                                </div>
                                <p className="font-medium">{member.name}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold mb-4">
                            3. Tim Mahasiswa
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            {[
                              {
                                src: 'https://dipowastebank.com/img/team/aufa.jpg',
                                name: 'Aufa Rahma Al-Hafidz',
                              },
                              {
                                src: 'https://dipowastebank.com/img/team/haekal.jpg',
                                name: 'Haekal Awliya Muhammad Salman',
                              },
                              {
                                src: 'https://dipowastebank.com/img/team/rizal.jpg',
                                name: 'Rizal Adi Wirawan',
                              },
                              {
                                src: 'https://dipowastebank.com/img/team/husni.jpg',
                                name: 'Husni Fadhilah Dhiya Ul Haq',
                              },
                            ].map((member, index) => (
                              <div key={index} className="space-y-4">
                                <div className="aspect-square relative">
                                  <Image
                                    src={member.src}
                                    alt={member.name}
                                    fill
                                    className="object-cover rounded-lg"
                                  />
                                </div>
                                <p className="font-medium">{member.name}</p>
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
