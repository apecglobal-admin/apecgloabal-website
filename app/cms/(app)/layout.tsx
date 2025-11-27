'use client';

import CMSLayout from "@/components/cms-layout";


export default function Layout({ children }: { children: React.ReactNode }) {
  // CMSLayout chỉ mount 1 lần, children sẽ thay đổi khi route change
  return <CMSLayout>{children}</CMSLayout>;
}