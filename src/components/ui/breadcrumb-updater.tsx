"use client"

import { useEffect } from "react"
import { useBreadcrumb } from "@/context/breadcrumb-context"

export default function BreadcrumbUpdater({
  items,
}: {
  items: { label: string; href?: string }[]
}) {
  const { setItems } = useBreadcrumb()

  useEffect(() => {
    setItems(items)
  }, [items, setItems])

  return null
}
