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
      {transitions((style, toast) => {
        const { id, title, description, action, ...props } = toast
        return (
          <animated.div style={style} key={id}>
            <Toast {...props}>
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
              {action}
              <ToastClose />
            </Toast>
          </animated.div>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
