'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';

interface WasteEntry {
  type: 'recyclable' | 'non-recyclable';
  amount: number;
}

export default function TimbangPage() {
  const [wasteEntries, setWasteEntries] = useState<WasteEntry[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const recyclableTotal = wasteEntries.reduce(
    (sum, entry) => (entry.type === 'recyclable' ? sum + entry.amount : sum),
    0,
  );
  const nonRecyclableTotal = wasteEntries.reduce(
    (sum, entry) =>
      entry.type === 'non-recyclable' ? sum + entry.amount : sum,
    0,
  );
  const totalWaste = wasteEntries.reduce((sum, entry) => sum + entry.amount, 0);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const type = formData.get('wasteType') as 'recyclable' | 'non-recyclable';
    const amount = Number(formData.get('wasteAmount'));

    if (editIndex !== null) {
      const updatedEntries = [...wasteEntries];
      updatedEntries[editIndex] = { type, amount };
      setWasteEntries(updatedEntries);
      setEditIndex(null);
    } else {
      setWasteEntries([...wasteEntries, { type, amount }]);
    }
    form.reset();
  };

  const handleEdit = (index: number) => {
    const entry = wasteEntries[index];
    const form = document.getElementById('wasteForm') as HTMLFormElement;
    form.wasteType.value = entry.type;
    form.wasteAmount.value = entry.amount.toString();
    setEditIndex(index);
  };

  const handleDelete = (index: number) => {
    setWasteEntries(wasteEntries.filter((_, i) => i !== index));
  };

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
          Pencatatan Sampah
        </h1>
        <p className="text-muted-foreground">
          Pantau dan kelola catatan pembuangan sampah Anda
        </p>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Sampah Daur Ulang</CardDescription>
            <CardTitle>{recyclableTotal.toFixed(2)} kg</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Sampah Tidak Daur Ulang</CardDescription>
            <CardTitle>{nonRecyclableTotal.toFixed(2)} kg</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Sampah</CardDescription>
            <CardTitle>{totalWaste.toFixed(2)} kg</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Formulir Pencatatan Sampah */}
      <Card>
        <CardHeader>
          <CardTitle>Catat Sampah Anda</CardTitle>
          <CardDescription>
            Tambahkan atau perbarui catatan sampah
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="wasteForm"
            onSubmit={handleSubmit}
            className="space-y-4 overflow-hidden"
          >
            <div className="space-y-2">
              <Label htmlFor="wasteType">Jenis Sampah</Label>
              <Input
                type="text"
                id="wasteType"
                name="wasteType"
                placeholder="Masukkan jenis sampah (contoh: recyclable, non-recyclable)"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wasteAmount">Jumlah (kg)</Label>
              <Input
                type="number"
                id="wasteAmount"
                name="wasteAmount"
                placeholder="Masukkan berat dalam kg"
                step="0.01"
                min="0"
                required
              />
            </div>

            <Button type="submit" className="w-full sm:w-auto">
              {editIndex !== null ? 'Perbarui Sampah' : 'Tambah Sampah'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Riwayat Sampah */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Sampah</CardTitle>
          <CardDescription>
            Lihat dan kelola catatan sampah Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <table className="w-full border-collapse border-spacing-0">
              <thead className="bg-muted/50">
                <tr>
                  <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">
                    Jenis
                  </th>
                  <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">
                    Jumlah (kg)
                  </th>
                  <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {wasteEntries.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="p-4 text-center text-muted-foreground"
                    >
                      Belum ada catatan sampah
                    </td>
                  </tr>
                ) : (
                  wasteEntries.map((entry, index) => (
                    <tr
                      key={index}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <td className="p-4 align-middle capitalize">
                        {entry.type}
                      </td>
                      <td className="p-4 align-middle">
                        {entry.amount.toFixed(2)} kg
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleEdit(index)}
                            variant="outline"
                            size="sm"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDelete(index)}
                            variant="destructive"
                            size="sm"
                          >
                            Hapus
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
