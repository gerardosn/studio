"use client";

import { useState, type ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useWebsiteData } from "@/contexts/WebsiteDataProvider";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  url: z.string().url({ message: "Please enter a valid URL." }),
});

export function AddWebsiteDialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { addWebsite } = useWebsiteData();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      url: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const success = addWebsite(values.name, values.url);
    if (success) {
      toast({
        title: "Website Added",
        description: `${values.name} has been added to your list.`,
      });
      form.reset();
      setOpen(false);
    } else {
        toast({
            variant: "destructive",
            title: "Already Exists",
            description: `The website with this URL is already in your list.`,
        });
    }
  }

  function onUrlBlur(e: React.FocusEvent<HTMLInputElement>) {
    const url = e.target.value;
    if (form.getValues("name") === "" && url) {
      try {
        const hostname = new URL(url).hostname;
        const name = hostname.replace(/^www\./, "").split(".")[0];
        const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
        form.setValue("name", capitalizedName);
      } catch (error) {
        // Ignore invalid URL, validation will catch it
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Website</DialogTitle>
          <DialogDescription>
            Enter the details of the website you want to track.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} onBlur={onUrlBlur} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Example" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Add Website</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
