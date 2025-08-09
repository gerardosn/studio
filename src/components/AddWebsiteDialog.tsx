
"use client";

import { useState, type ReactNode, useMemo } from "react";
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
import { useLanguage } from "@/contexts/LanguageProvider";

export function AddWebsiteDialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [showVerificationAlert, setShowVerificationAlert] = useState(false);
  const [failedUrl, setFailedUrl] = useState<FormValues | null>(null);
  const { addWebsite } = useWebsiteData();
  const { toast } = useToast();
  const { t } = useLanguage();

  const formSchema = useMemo(() => z.object({
    name: z.string().min(2, {
      message: t('nameMinLength'),
    }),
    url: z.string().min(1, { message: t('urlMinLength') }),
  }), [t]);

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      url: "",
    },
  });

  const handleAdd = async (values: FormValues, force: boolean = false) => {
    try {
      let fullUrl = values.url;
      if (!/^https?:\/\//i.test(fullUrl)) {
        fullUrl = "https://" + fullUrl;
      }

      const urlCheck = z.string().url().safeParse(fullUrl);
      if (!urlCheck.success) {
        form.setError("url", {
          type: "manual",
          message: t('validUrlError'),
        });
        return;
      }

      const result = await addWebsite(values.name, fullUrl, force);

      if (result.success) {
        toast({
          title: t('websiteAddedToastTitle'),
          description: t('websiteAddedToastDescription', { name: values.name }),
        });
        form.reset();
        setOpen(false);
        setFailedUrl(null);
        setShowVerificationAlert(false);
      } else if (result.verificationFailed) {
        setFailedUrl({ name: values.name, url: fullUrl });
        setShowVerificationAlert(true);
      } else {
        toast({
          variant: "destructive",
          title: t('errorAddingWebsiteToastTitle'),
          description: result.message || "An unknown error occurred.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add website. Please try again.",
      });
    }
  };

  const onSubmit = (values: FormValues) => {
    handleAdd(values, false);
  };

  const handleForceAdd = () => {
    if (failedUrl) {
      handleAdd(failedUrl, true);
    }
  };

  function onUrlBlur(e: React.FocusEvent<HTMLInputElement>) {
    const url = e.target.value;
    if (form.getValues("name") === "" && url) {
      try {
        const fullUrl = url.startsWith("http") ? url : `https://${url}`;
        const hostname = new URL(fullUrl).hostname;
        const name = hostname.replace(/^www\./, "").split(".")[0];
        const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
        form.setValue("name", capitalizedName);
      } catch (error) {
        // Ignore invalid URL, validation will catch it
      }
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('addNewWebsiteTitle')}</DialogTitle>
            <DialogDescription>
             {t('addNewWebsiteDescription')}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('websiteUrlLabel')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="example.com"
                        {...field}
                        onBlur={onUrlBlur}
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
                    <FormLabel>{t('displayNameLabel')}</FormLabel>
                    <FormControl>
                      <Input placeholder="Example" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">{t('addWebsiteButton')}</Button>
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
            <AlertDialogTitle>{t('verificationAlertTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('verificationAlertDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancelButton')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleForceAdd}>
              {t('addAnywayButton')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
