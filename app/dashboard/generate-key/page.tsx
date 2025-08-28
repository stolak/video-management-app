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
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

type Key = {
  id: number;
  description: string;
  key: string;
  status: boolean;
};

export default function GenerateKeyPage() {
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState("");
  const [key, setKey] = useState("");
  const [keys, setKeys] = useState<Key[]>([]);
  const [loading, setLoading] = useState(false);

  // Generate a random key string
  function generateRandomKey(length = 32) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // When modal opens, auto-generate key
  function handleOpenChange(open: boolean) {
    console.log("Modal open:", open);
    setShowModal(open);
    if (open) {
      setKey(generateRandomKey());
    } else {
      setDescription("");
      setKey("");
    }
  }

  useEffect(() => {
    fetchKeys();
  }, []);

  useEffect(() => {
    handleOpenChange(showModal);
  }, [showModal]);

  async function fetchKeys() {
    setLoading(true);
    const { data, error } = await supabase.from("keys").select("*");
    if (!error) setKeys(data || []);
    setLoading(false);
  }

  async function handleAddKey(e: React.FormEvent) {
    e.preventDefault();
    if (!description || !key) return;
    setLoading(true);
    try {
      // You may want to get the user_id from your auth context/session
      const response = await fetch("/api/keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description, key }),
      });
      if (response.ok) {
        setDescription("");
        setKey("");
        setShowModal(false);
        fetchKeys();
        toast.success("Key generated and saved!");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to save key");
      }
    } catch (err) {
      toast.error("Failed to save key");
    } finally {
      setLoading(false);
    }
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
                  <th className="text-left py-3 px-4 font-medium">Key</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {keys.map((keyObj) => (
                  <tr key={keyObj.id} className="border-b">
                    <td className="py-3 px-4 font-medium">
                      <Badge variant="secondary">{keyObj.description}</Badge>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs break-all">
                      {keyObj.key}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={keyObj.status ? "default" : "destructive"}
                      >
                        {keyObj.status ? "Active" : "Disabled"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteKey(keyObj.id)}
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

      <Dialog open={showModal} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Generate Key</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddKey} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
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
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Key</label>
                <div className="relative flex items-center">
                  <Input
                    name="key"
                    value={key}
                    readOnly
                    placeholder="Auto-generated key"
                    required
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                    onClick={() => {
                      navigator.clipboard.writeText(key);
                      toast.success("Key copied to clipboard!");
                    }}
                    title="Copy key"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <rect
                        x="9"
                        y="9"
                        width="13"
                        height="13"
                        rx="2"
                        strokeWidth="2"
                      />
                      <rect
                        x="3"
                        y="3"
                        width="13"
                        height="13"
                        rx="2"
                        strokeWidth="2"
                      />
                    </svg>
                  </Button>
                </div>
              </div>
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
