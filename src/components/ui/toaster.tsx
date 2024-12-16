"use client"

import { useToast } from "@/hooks/use-toast"
import { useTransition, animated } from "@react-spring/web"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  const transitions = useTransition(toasts, {
    from: {
      opacity: 0,
      transform: 'translateX(100%)'
    },
    enter: {
      opacity: 1,
      transform: 'translateX(0%)'
    },
    leave: {
      opacity: 0,
      transform: 'translateX(100%)'
    },
    config: {
      tension: 300,
      friction: 20
    }
  })

  return (
    <ToastProvider>
      {transitions((style, toast) => (
        <animated.div style={style}>
          <Toast key={toast.id} {...toast}>
            <div className="grid gap-1">
              {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
              {toast.description && (
                <ToastDescription>{toast.description}</ToastDescription>
              )}
            </div>
            {toast.action}
            <ToastClose />
          </Toast>
        </animated.div>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}
