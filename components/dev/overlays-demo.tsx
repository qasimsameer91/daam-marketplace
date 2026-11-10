"use client";

import { Ellipsis, Pencil, Search, Share2, SlidersHorizontal, Tag, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
  Drawer,
  DrawerContent,
  DrawerClose,
  DrawerFooter,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function OverlaysDemo({ models }: { models: string[] }) {
  const t = useTranslations("DevDesign.overlays");
  const tCommon = useTranslations("Common");
  const locale = useLocale();
  const [commandOpen, setCommandOpen] = useState(false);
  // Sheets come from the inline-end side (right in English, left in Urdu).
  const sheetSide = locale === "ur" ? "left" : "right";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-3">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">{t("openDialog")}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("dialogTitle")}</DialogTitle>
              <DialogDescription>{t("dialogBody")}</DialogDescription>
            </DialogHeader>
            <DialogFooter showCloseButton>
              <Button>{t("submit")}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <SlidersHorizontal aria-hidden />
              {t("openSheet")}
            </Button>
          </SheetTrigger>
          <SheetContent side={sheetSide}>
            <SheetHeader>
              <SheetTitle>{t("sheetTitle")}</SheetTitle>
              <SheetDescription>{t("sheetBody")}</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>

        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">{t("openDrawer")}</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{t("drawerTitle")}</DrawerTitle>
              <DrawerDescription>{t("sheetBody")}</DrawerDescription>
            </DrawerHeader>
            <div className="h-24" />
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">{tCommon("close")}</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" aria-label={t("menu")}>
              <Ellipsis aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Pencil aria-hidden />
              {t("menuEdit")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Share2 aria-hidden />
              {t("menuShare")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Tag aria-hidden />
              {t("menuSold")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <Trash2 aria-hidden />
              {t("menuDelete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost">{t("tooltip")}</Button>
          </TooltipTrigger>
          <TooltipContent>{t("tooltipBody")}</TooltipContent>
        </Tooltip>

        <Button variant="secondary" onClick={() => toast.success(t("toastMessage"))}>
          {t("toast")}
        </Button>

        <CommandDialog
          trigger={
            <Button variant="outline">
              <Search aria-hidden />
              {t("openCommand")}
            </Button>
          }
          open={commandOpen}
          onOpenChange={setCommandOpen}
          title={t("commandTitle")}
          description={t("commandDescription")}
        >
          <CommandInput placeholder={t("commandPlaceholder")} />
          <CommandList>
            <CommandEmpty>{t("commandEmpty")}</CommandEmpty>
            <CommandGroup heading={t("commandGroup")}>
              {models.map((m) => (
                <CommandItem key={m} onSelect={() => setCommandOpen(false)}>
                  {m}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>

      <Tabs defaultValue="active" className="max-w-md">
        <TabsList>
          <TabsTrigger value="active">{t("tabActive")}</TabsTrigger>
          <TabsTrigger value="pending">{t("tabPending")}</TabsTrigger>
          <TabsTrigger value="sold">{t("tabSold")}</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="pt-3 text-sm text-muted-foreground">
          {t("tabActiveBody")}
        </TabsContent>
        <TabsContent value="pending" className="pt-3 text-sm text-muted-foreground">
          {t("tabPendingBody")}
        </TabsContent>
        <TabsContent value="sold" className="pt-3 text-sm text-muted-foreground">
          {t("tabSoldBody")}
        </TabsContent>
      </Tabs>

      <Toaster
        position="bottom-center"
        closeButton
        toastOptions={{ closeButtonAriaLabel: tCommon("close") }}
      />
    </div>
  );
}
