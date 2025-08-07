
"use client";

import { useState, type ReactNode, useEffect } from "react";
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import type { Website } from "@/lib/types";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  url: z.string().min(1, { message: "URL cannot be empty." }),
});

type FormValues = z.infer<typeof formSchema>;

export function EditWebsiteDialog({ children, website }: { children: ReactNode, website: Website }) {
  const [open, setOpen] = useState(false);
  const [showVerificationAlert, setShowVerificationAlert] = useState(false);
  const [failedUrl, setFailedUrl] = useState<FormValues | null>(null);
  const { editWebsite } = useWebsiteData();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: website.name,
      url: website.url,
    },
  });

  useEffect(() => {
    form.reset({
        name: website.name,
        url: website.url,
    });
  }, [website, form, open]);


  const handleEdit = async (values: FormValues, force: boolean = false) => {
    try {
      let fullUrl = values.url;
      if (!/^https?:\/\//i.test(fullUrl)) {
        fullUrl = "https://" + fullUrl;
      }

      const urlCheck = z.string().url().safeParse(fullUrl);
      if (!urlCheck.success) {
        form.setError("url", {
          type: "manual",
          message: "Please enter a valid URL.",
        });
        return;
      }

      const result = await editWebsite(website.id, values.name, fullUrl, force);

      if (result.success) {
        toast({
          title: "Website Updated",
          description: `${values.name} has been updated.`,
        });
        setOpen(false);
        setFailedUrl(null);
        setShowVerificationAlert(false);
      } else if (result.verificationFailed) {
        setFailedUrl({ name: values.name, url: fullUrl });
        setShowVerificationAlert(true);
      } else {
        toast({
          variant: "destructive",
          title: "Error Updating Website",
          description: result.message || "An unknown error occurred.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update website. Please try again.",
      });
    }
  };

  const onSubmit = (values: FormValues) => {
    handleEdit(values, false);
  };

  const handleForceEdit = () => {
    if (failedUrl) {
      handleEdit(failedUrl, true);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Website</DialogTitle>
            <DialogDescription>
              Update the details of the website you want to track.
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
                      <Input
                        placeholder="example.com"
                        {...field}
                      />
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
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={showVerificationAlert}
        onOpenChange={setShowVerificationAlert}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Website Unreachable</AlertDialogTitle>
            <AlertDialogDescription>
              The URL could not be verified. It might be incorrect, or the
              website might be temporarily down. Do you want to save it anyway?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleForceEdit}>
              Save Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
