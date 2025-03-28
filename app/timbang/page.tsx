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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface WasteEntry {
  type: 'recyclable' | 'non-recyclable';
  amount: number;
}

export default function TimbangPage() {
  const [wasteEntries, setWasteEntries] = useState<WasteEntry[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Calculate totals
  const recyclableTotal = wasteEntries.reduce(
    (sum, entry) => (entry.type === 'recyclable' ? sum + entry.amount : sum),
    0,
  );
  const nonRecyclableTotal = wasteEntries.reduce(
    (sum, entry) =>
      entry.type === 'non-recyclable' ? sum + entry.amount : sum,
    0,
  );
  const totalWaste = recyclableTotal + nonRecyclableTotal;

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
          Waste Tracking
        </h1>
        <p className="text-muted-foreground">
          Monitor and manage your waste disposal records
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Recyclable Waste</CardDescription>
            <CardTitle>{recyclableTotal.toFixed(2)} kg</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Non-Recyclable Waste</CardDescription>
            <CardTitle>{nonRecyclableTotal.toFixed(2)} kg</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Waste</CardDescription>
            <CardTitle>{totalWaste.toFixed(2)} kg</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Waste Tracking Form */}
      <Card>
        <CardHeader>
          <CardTitle>Track Your Waste</CardTitle>
          <CardDescription>
            Add new waste records or update existing ones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="wasteForm"
            onSubmit={handleSubmit}
            className="space-y-4 overflow-hidden"
          >
            <div className="space-y-2 relative z-50">
              <Label htmlFor="wasteType">Waste Type</Label>
              <div key={editIndex}>
                <Select name="wasteType" defaultValue="recyclable" required>
                  <SelectTrigger className="w-full min-w-[150px]">
                    <SelectValue>
                      {editIndex !== null
                        ? wasteEntries[editIndex].type
                        : 'Select waste type'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent
                    side="bottom"
                    position="popper"
                    className="w-[var(--radix-select-trigger-width)]"
                    sideOffset={0}
                  >
                    <SelectItem value="recyclable">Recyclable</SelectItem>
                    <SelectItem value="non-recyclable">
                      Non-Recyclable
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="wasteAmount">Amount (kg)</Label>
              <Input
                type="number"
                id="wasteAmount"
                name="wasteAmount"
                placeholder="Enter weight in kg"
                step="0.01"
                min="0"
                required
              />
            </div>

            <Button type="submit" className="w-full sm:w-auto">
              {editIndex !== null ? 'Update Waste' : 'Add Waste'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Waste History */}
      <Card>
        <CardHeader>
          <CardTitle>Waste History</CardTitle>
          <CardDescription>View and manage your waste records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <table className="w-full border-collapse border-spacing-0">
              <thead className="bg-muted/50">
                <tr>
                  <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">
                    Type
                  </th>
                  <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">
                    Amount (kg)
                  </th>
                  <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">
                    Actions
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
                      No waste entries yet
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
                            Delete
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
