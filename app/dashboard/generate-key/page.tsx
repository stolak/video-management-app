"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PageHeader from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Key as KeyIcon, Plus, MoreHorizontal } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

type Key = {
  id: number;
  description: string;
};

export default function GenerateKeyPage() {
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState("");
  const [keys, setKeys] = useState<Key[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchKeys();
  }, []);

  async function fetchKeys() {
    setLoading(true);
    const { data, error } = await supabase.from("keys").select("*");
    if (!error) setKeys(data || []);
    setLoading(false);
  }

  async function handleAddKey(e: React.FormEvent) {
    e.preventDefault();
    if (!description) return;
    setLoading(true);
    const { error } = await supabase.from("keys").insert([{ description }]);
    if (!error) {
      setDescription("");
      setShowModal(false);
      fetchKeys();
    }
    setLoading(false);
  }

  async function handleDeleteKey(id: number) {
    setLoading(true);
    await supabase.from("keys").delete().eq("id", id);
    fetchKeys();
    setLoading(false);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <PageHeader title="Keys" subtitle="Manage API keys and descriptions" />
        <Button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Generate Key
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyIcon className="h-5 w-5" />
            All Keys ({keys.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">
                    Description
                  </th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {keys.map((key) => (
                  <tr key={key.id} className="border-b">
                    <td className="py-3 px-4 font-medium">
                      <Badge variant="secondary">{key.description}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteKey(key.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Key</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddKey} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <Input
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter key description"
                required
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={loading || !description}>
                Generate
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
