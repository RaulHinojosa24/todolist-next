"use client"

import { ThemeToggle } from "./theme-toggle"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useBreadcrumb } from "@/context/breadcrumb-context"
import { Fragment } from "react"
import Link from "next/link"

export default function NavBar() {
  const { items } = useBreadcrumb()

  return (
    <div className="flex items-center gap-4 px-3 py-2">
      <SidebarTrigger />
      {items.length > 0 && (
        <>
          <Separator orientation="vertical" className="h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {items.map((item, index) => (
                <Fragment key={index}>
                  <BreadcrumbItem>
                    {item.href ? (
                      <BreadcrumbLink asChild>
                        <Link href={item.href}>{item.label}</Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {index < items.length - 1 && <BreadcrumbSeparator />}
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </>
      )}
      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </div>
  )
}
