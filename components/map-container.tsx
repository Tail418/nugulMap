"use client"

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { apiService, type ZoneResponse } from "@/lib/api"
import Image from "next/image"

declare global {
  interface Window {
    kakao: any
  }
}

interface LocationMarker extends ZoneResponse {}

export interface MapContainerRef {
  handleZoneCreated: (zone: ZoneResponse) => void
  centerOnLocation: (lat: number, lng: number) => void
}

export const MapContainer = forwardRef<MapContainerRef>((props, ref) => {
  const [selectedMarker, setSelectedMarker] = useState<LocationMarker | null>(null)
  const [selectedMarkerId, setSelectedMarkerId] = useState<number | null>(null)
  const [zones, setZones] = useState<ZoneResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapInstance, setMapInstance] = useState<any>(null)
  const currentOverlays = useRef<any[]>([])

  const loadZones = async () => {
    try {
      setLoading(true)
      const zonesData = await apiService.getAllZones(37.5665, 126.978)
      console.log("[v0] Loaded zones from API:", zonesData)
      setZones(zonesData)
      setError(null)
    } catch (err) {
      console.log("[v0] API not available, using sample data")
      setError("흡연구역 데이터를 불러오는데 실패했습니다.")
      setTimeout(() => setError(null), 3000)

      setZones([
        {
          id: 1,
          region: "서울특별시 중구",
          type: "지정구역",
          subtype: "흡연부스",
          description: "명동역 근처 지정 흡연구역입니다. 실외 공간으로 환기가 잘 됩니다.",
          latitude: 37.5665,
          longitude: 126.978,
          address: "서울특별시 중구 명동길 26",
          user: "관리자",
          image: "/modern-outdoor-smoking-booth.png",
        },
        {
          id: 2,
          region: "서울특별시 중구",
          type: "일반구역",
          subtype: "야외공간",
          description: "동대문디자인플라자 인근 흡연 공간입니다.",
          latitude: 37.57,
          longitude: 126.985,
          address: "서울특별시 중구 을지로 281",
          user: "사용자1",
          image: "/modern-building-smoking-area.png",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadZones()
  }, [])

  useEffect(() => {
    const KAKAO_APP_KEY = process.env.NEXT_PUBLIC_KAKAOMAP_APIKEY

    console.log("[v0] Checking Kakao API key...")
    console.log("[v0] API key exists:", !!KAKAO_APP_KEY)
    console.log("[v0] API key length:", KAKAO_APP_KEY?.length || 0)
    console.log("[v0] First 10 chars:", KAKAO_APP_KEY?.substring(0, 10) || "none")

    if (!KAKAO_APP_KEY) {
      console.error("[v0] 카카오맵 API 키가 설정되지 않았습니다.")
      console.error("[v0] 환경 변수 이름: NEXT_PUBLIC_KAKAOMAP_APIKEY")
      console.error(
        "[v0] 현재 환경 변수들:",
        Object.keys(process.env).filter((key) => key.startsWith("NEXT_PUBLIC")),
      )
      setError("카카오맵 API 키가 설정되지 않았습니다.")
      return
    }

    if (typeof window === "undefined" || !mapRef.current) {
      console.log("[v0] Window or mapRef not ready")
      return
    }

    console.log("[v0] Starting to load Kakao Maps script...")
    const script = document.createElement("script")
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&autoload=false`
    script.async = true
    document.head.appendChild(script)

    script.onload = () => {
      console.log("[v0] Kakao Maps script loaded successfully")
      console.log("[v0] window.kakao exists:", !!window.kakao)
      console.log("[v0] window.kakao.maps exists:", !!window.kakao?.maps)

      if (!window.kakao || !window.kakao.maps) {
        console.error("[v0] Kakao Maps SDK not properly loaded")
        setError("카카오맵 SDK가 제대로 로드되지 않았습니다.")
        return
      }

      window.kakao.maps.load(() => {
        console.log("[v0] Kakao Maps load callback triggered")
        console.log("[v0] mapRef.current exists:", !!mapRef.current)

        if (!mapRef.current) {
          console.error("[v0] Map container element not found")
          return
        }

        try {
          const options = {
            center: new window.kakao.maps.LatLng(37.5665, 126.978),
            level: 3,
          }
          console.log("[v0] Creating map with options:", options)
          const map = new window.kakao.maps.Map(mapRef.current!, options)
          console.log("[v0] Map created successfully:", !!map)
          setMapInstance(map)
          setError(null)
        } catch (error) {
          console.error("[v0] Error creating map:", error)
          setError("지도 생성 중 오류가 발생했습니다.")
        }
      })
    }

    script.onerror = (error) => {
      console.error("[v0] Kakao Maps script failed to load:", error)
      const currentDomain = window.location.origin
      setError(
        `카카오맵 스크립트 로드 실패\n\n현재 도메인: ${currentDomain}\n\n해결 방법:\n1. developers.kakao.com 접속\n2. 내 애플리케이션 선택\n3. 앱 설정 → 플랫폼 → Web 플랫폼 설정\n4. 사이트 도메인에 "${currentDomain}" 추가\n5. 페이지 새로고침`,
      )
    }

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  useEffect(() => {
    if (mapInstance && zones.length > 0) {
      currentOverlays.current.forEach((overlay) => overlay.setMap(null))
      currentOverlays.current = []

      zones.forEach((zone) => {
        const isSelected = selectedMarkerId === zone.id
        const fillColor = isSelected ? "#F5E6C8" : "#D97742"
        const strokeColor = isSelected ? "#5C3A21" : "#2C2C2C"

        const markerContent = document.createElement("div")
        markerContent.className = `custom-kakao-marker ${isSelected ? "selected" : ""}`
        markerContent.setAttribute("data-zone-id", zone.id.toString())
        markerContent.innerHTML = `
          <svg width="32" height="32" viewBox="0 0 24 24" fill="${fillColor}" stroke="${strokeColor}" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        `

        markerContent.addEventListener("mouseenter", () => {
          if (!isSelected) {
            const svg = markerContent.querySelector("svg")
            if (svg) {
              svg.setAttribute("fill", "#E4CDA7")
              svg.setAttribute("stroke", "#5C3A21")
            }
          }
        })

        markerContent.addEventListener("mouseleave", () => {
          if (!isSelected) {
            const svg = markerContent.querySelector("svg")
            if (svg) {
              svg.setAttribute("fill", "#D97742")
              svg.setAttribute("stroke", "#2C2C2C")
            }
          }
        })

        markerContent.addEventListener("click", () => {
          setSelectedMarker(zone as LocationMarker)
          setSelectedMarkerId(zone.id)
        })

        const position = new window.kakao.maps.LatLng(zone.latitude, zone.longitude)
        const customOverlay = new window.kakao.maps.CustomOverlay({
          position,
          content: markerContent,
          yAnchor: 1,
        })

        customOverlay.setMap(mapInstance)
        currentOverlays.current.push(customOverlay)
      })
    }
  }, [mapInstance, zones, selectedMarkerId])

  useImperativeHandle(ref, () => ({
    handleZoneCreated: (newZone: ZoneResponse) => {
      setZones((prev) => [...prev, newZone])
      if (mapInstance) {
        mapInstance.setCenter(new window.kakao.maps.LatLng(newZone.latitude, newZone.longitude))
      }
    },
    centerOnLocation: (lat: number, lng: number) => {
      if (mapInstance) {
        mapInstance.setCenter(new window.kakao.maps.LatLng(lat, lng))
        mapInstance.setLevel(3)
      }
    },
  }))

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full z-10" />

      <style jsx global>{`
        .custom-kakao-marker {
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }
        
        .custom-kakao-marker:hover {
          transform: scale(1.3);
          z-index: 1000;
        }
        
        .custom-kakao-marker:hover svg {
          filter: drop-shadow(0 0 12px rgba(228, 205, 167, 0.8));
        }
        
        .custom-kakao-marker.selected {
          transform: scale(1.2);
          z-index: 999;
        }
        
        .custom-kakao-marker.selected svg {
          filter: drop-shadow(0 0 16px rgba(245, 230, 200, 1));
        }
        
        .custom-kakao-marker:active {
          transform: scale(1.1);
        }
      `}</style>

      {loading && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="text-foreground">지도 데이터를 불러오는 중...</div>
        </div>
      )}

      {error && (
        <div className="absolute top-4 left-4 right-4 bg-red-500/20 border-2 border-red-500/40 text-red-100 p-4 rounded-lg z-20 backdrop-blur-sm">
          <div className="font-semibold mb-2">오류 발생</div>
          <div className="text-sm leading-relaxed">{error}</div>
        </div>
      )}

      {selectedMarker && (
        <div className="absolute bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <Card className="mx-4 mb-4 bg-card/95 backdrop-blur-sm border-border shadow-xl transition-all duration-300 hover:shadow-2xl rounded-t-xl">
            <CardContent className="p-4">
              {selectedMarker.image && (
                <div className="mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={selectedMarker.image || "/placeholder.svg"}
                    alt={`${selectedMarker.address} 흡연구역 사진`}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                    priority
                  />
                </div>
              )}

              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="text-sm font-medium text-card-foreground mb-1">주소</div>
                  <div className="text-sm text-muted-foreground mb-3">{selectedMarker.address}</div>
                  <div className="text-sm font-medium text-card-foreground mb-1">상세 설명</div>
                  <div className="text-sm text-muted-foreground mb-3">{selectedMarker.description}</div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>지역: {selectedMarker.region}</div>
                    <div>등록자: {selectedMarker.user}</div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-200 hover:scale-110"
                  onClick={() => {
                    setSelectedMarker(null)
                    setSelectedMarkerId(null)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full transition-all duration-200 hover:bg-primary/30">
                  {selectedMarker.type}
                </span>
                <span className="text-xs px-2 py-1 bg-secondary/50 text-secondary-foreground rounded-full">
                  {selectedMarker.subtype}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
})

MapContainer.displayName = "MapContainer"
