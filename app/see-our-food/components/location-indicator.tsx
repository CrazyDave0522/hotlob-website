"use client"

import { useEffect, useState } from "react"
import { getCurrentPositionWithTimeout } from "@/lib/utils/geo"


export default function LocationIndicator() {
  const [status, setStatus] = useState<"locating"|"idle"|"success"|"error">("locating")
  const [coords, setCoords] = useState<{lat:number, lng:number}|null>(null)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    getCurrentPositionWithTimeout(5000)
      .then(pos => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setStatus("success")
      })
      .catch(e => {
        setError(e.message || "定位失败")
        setStatus("error")
      })
  }, [])

  let content = null
  if (status === "locating") content = "定位中..."
  else if (status === "success" && coords) content = `已定位 (${coords.lat.toFixed(3)}, ${coords.lng.toFixed(3)})`
  else if (status === "error") content = error
  else content = "未定位"

  return (
    <div className="fixed bottom-4 right-4 z-50 px-4 py-2 rounded-full bg-white/90 shadow text-xs text-gray-700 select-none pointer-events-none">
      <span>{content}</span>
    </div>
  )
}
