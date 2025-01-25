const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""

export async function subscribeToPushNotifications() {
  if ("serviceWorker" in navigator && "PushManager" in window) {
    try {
      const register = await navigator.serviceWorker.ready

      const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      })

      await fetch("/api/subscribe", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
          "Content-Type": "application/json",
        },
      })

      return true
    } catch (error) {
      console.error("Error subscribing to push notifications:", error)
      return false
    }
  }
  return false
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }

  return outputArray
}

