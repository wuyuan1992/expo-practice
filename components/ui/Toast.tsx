import { Toast as ToastComponent, useToastController, useToastState } from '@tamagui/toast'
import { useCallback } from 'react'
import { YStack, isWeb } from 'tamagui'

export function Toast() {
  const currentToast = useToastState()

  if (!currentToast || currentToast.isHandledNatively) return null

  return (
    <ToastComponent
      key={currentToast.id}
      duration={currentToast.duration}
      viewportName={currentToast.viewportName}
      enterStyle={{ opacity: 0, scale: 0.5, y: -25 }}
      exitStyle={{ opacity: 0, scale: 1, y: -20 }}
      y={isWeb ? '$12' : 0}
      theme="purple"
      br="$6"
      animation="quick"
    >
      <YStack ai="center" p="$2" gap="$2">
        <ToastComponent.Title fow="bold">{currentToast.title}</ToastComponent.Title>
        {!!currentToast.message && (
          <ToastComponent.Description>{currentToast.message}</ToastComponent.Description>
        )}
      </YStack>
    </ToastComponent>
  )
}

export function useToast() {
  const toast = useToastController()

  const showError = useCallback((title: string, message: string,) => {
    toast.show(title, {
        message,
        customData: {  preset: 'error'}
    })
  }, [])

  const showSuccess = useCallback((title: string, message: string,) => {
    toast.show(title, {
        message,
        customData: {  preset: 'success'}
    })
  }, [])

  return { error: showError, success: showSuccess, hide: toast.hide };
}
