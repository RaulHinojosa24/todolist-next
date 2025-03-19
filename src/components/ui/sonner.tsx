"use client"

import { useTheme } from "next-themes"
import { useEffect } from "react"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

const ClientToastTrigger = ({
  message,
  type,
}: {
  message: string
  type?: "success" | "info" | "warning" | "error"
}) => {
  useEffect(() => {
    switch (type) {
      case "success":
        toast.success(message)
        break
      case "info":
        toast.info(message)
        break
      case "warning":
        toast.warning(message)
        break
      case "error":
        toast.error(message)
        break
      default:
        toast(message)
        break
    }
  }, [message, type])

  return null
}

export { Toaster, ClientToastTrigger }
