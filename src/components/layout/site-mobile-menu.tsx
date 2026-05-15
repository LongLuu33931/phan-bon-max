"use client";

import Link from "next/link";
import { Mail, Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";

type NavItem = {
  href: string;
  label: string;
};

type SiteMobileMenuProps = {
  nav: NavItem[];
  email: string;
  hotline: string;
};

export function SiteMobileMenu({ nav, email, hotline }: SiteMobileMenuProps) {
  const [open, setOpen] = useState(false);
  const phoneHref = `tel:${hotline.replace(/\s/g, "")}`;
  const portalTarget = typeof document === "undefined" ? null : document.body;
  const menu = open ? (
    <div className="fixed inset-0 z-[999] bg-white lg:hidden" onClick={() => setOpen(false)}>
      <div
        id="site-mobile-menu"
        role="dialog"
        aria-modal="true"
        className="flex h-dvh w-full flex-col bg-white"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3">
          <span className="font-bold text-emerald-900">Menu</span>
          <button
            type="button"
            aria-label="Đóng menu"
            onClick={() => setOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-stone-200 text-stone-700"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="grid gap-1 px-4 py-5 text-base font-bold text-stone-900">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex min-h-12 items-center rounded-md px-2 hover:bg-emerald-50 hover:text-emerald-800"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto grid gap-3 border-t border-stone-200 p-4 text-sm font-semibold">
          <a href={phoneHref} className="flex min-h-11 items-center gap-2 rounded-md bg-amber-100 px-3 text-amber-900">
            <Phone size={16} />
            {hotline}
          </a>
          <a href={`mailto:${email}`} className="flex min-h-11 items-center gap-2 rounded-md bg-emerald-50 px-3 text-emerald-950">
            <Mail size={16} />
            {email}
          </a>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Đóng menu" : "Mở menu"}
        aria-expanded={open}
        aria-controls="site-mobile-menu"
        onClick={() => setOpen((value) => !value)}
        className="flex h-11 w-11 items-center justify-center rounded-md border border-stone-200 text-stone-700 hover:border-emerald-700 hover:text-emerald-800 lg:hidden"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {portalTarget && menu ? createPortal(menu, portalTarget) : null}
    </>
  );
}
