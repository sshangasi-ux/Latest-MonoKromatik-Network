"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { createPlaylist } from "@/lib/supabase";

const playlistFormSchema = z.object({
  name: z.string().min(3, { message: "Playlist name must be at least 3 characters." }).max(100, { message: "Playlist name must not be longer than 100 characters." }),
  description: z.string().max(500, { message: "Description must not be longer than 500 characters." }).optional(),
  isPublic: z.boolean().default(false),
  coverImageUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
});

type PlaylistFormValues = z.infer<typeof playlistFormSchema>;

interface CreatePlaylistDialogProps {
  onPlaylistCreated?: () => void;
  trigger?: React.ReactNode;
}

const CreatePlaylistDialog: React.FC<CreatePlaylistDialogProps> = ({ onPlaylistCreated, trigger }) => {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PlaylistFormValues>({
    resolver: zodResolver(playlistFormSchema),
    defaultValues: {
      name: "",
      description: "",
      isPublic: false,
      coverImageUrl: "",
    },
  });

  const onSubmit = async (data: PlaylistFormValues) => {
    if (!isAuthenticated || !user) {
      toast.error("You must be logged in to create a playlist.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createPlaylist(user.id, data.name, data.description, data.isPublic, data.coverImageUrl || undefined);
      toast.success("Playlist created successfully!");
      form.reset();
      setIsOpen(false);
      onPlaylistCreated?.();
    } catch (error: any) {
      toast.error(`Failed to create playlist: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground border-border hover:border-primary uppercase font-semibold text-sm">
            Create New Playlist
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle className="font-heading uppercase tracking-tight">Create New Playlist</DialogTitle>
          <DialogDescription className="font-sans text-muted-foreground">
            Give your playlist a name and description.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-foreground uppercase text-sm">
              Name
            </Label>
            <Input
              id="name"
              placeholder="My Awesome Playlist"
              className="col-span-3 bg-input border-border text-foreground focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground uppercase text-sm"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="col-span-4 text-destructive text-xs text-right mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right text-foreground uppercase text-sm">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="A collection of my favorite content."
              className="col-span-3 bg-input border-border text-foreground focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground uppercase text-sm min-h-[80px]"
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <p className="col-span-4 text-destructive text-xs text-right mt-1">{form.formState.errors.description.message}</p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="coverImageUrl" className="text-right text-foreground uppercase text-sm">
              Cover Image URL
            </Label>
            <Input
              id="coverImageUrl"
              placeholder="https://example.com/cover.jpg"
              className="col-span-3 bg-input border-border text-foreground focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground uppercase text-sm"
              {...form.register("coverImageUrl")}
            />
            {form.formState.errors.coverImageUrl && (
              <p className="col-span-4 text-destructive text-xs text-right mt-1">{form.formState.errors.coverImageUrl.message}</p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isPublic" className="text-right text-foreground uppercase text-sm">
              Public
            </Label>
            <Switch
              id="isPublic"
              checked={form.watch("isPublic")}
              onCheckedChange={(checked) => form.setValue("isPublic", checked)}
              className="col-span-3 justify-self-start data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-6 py-3 rounded-lg uppercase font-semibold transition-all hover:scale-[1.02] hover:shadow-primary/20">
              {isSubmitting ? "Creating..." : "Create Playlist"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePlaylistDialog;