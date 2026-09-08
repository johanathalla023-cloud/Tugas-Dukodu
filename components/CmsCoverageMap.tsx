"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

interface CoverageArea {
  id: string;
  nama: string;
  lokasi: string;
  lat: number;
  lng: number;
  radius: number;
  kecepatanMax: number;
  status: "active" | "inactive";
  tanggalDibuat: string;
}

export default function CmsCoverageMap({ areas, refreshKey }: { areas: CoverageArea[]; refreshKey: number }) {
  const mapRef = useRef<any>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    let map: any;
    let cancelled = false;
    let L: any;

    const init = async () => {
      L = await import("leaflet");
      const mapEl = document.getElementById("cms-coverage-map");
      if (!mapEl || cancelled) return;

      if (!initializedRef.current) {
        map = L.map("cms-coverage-map", { zoomControl: true }).setView([-6.24, 106.82], 12);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; OpenStreetMap',
        }).addTo(map);
        mapRef.current = map;
        initializedRef.current = true;
      } else {
        map = mapRef.current;
        map.eachLayer((layer: any) => {
          if (layer.options && layer.options.dukodu) map.removeLayer(layer);
        });
      }

      const bounds: any[] = [];
      areas.forEach(a => {
        if (a.status === "inactive") return;
        const circle = L.circle([a.lat, a.lng], {
          radius: a.radius * 1000,
          color: "#dc1212",
          fillColor: "#dc1212",
          fillOpacity: 0.12,
          dukodu: true,
        });
        circle.addTo(map)
          .bindTooltip(`<strong>${a.nama}</strong><br/>Maks ${a.kecepatanMax} Mbps`, { direction: "top", offset: [0, -10] });
        L.marker([a.lat, a.lng], {
          icon: L.divIcon({ className: "cms-map-marker", html: '<i class="fa-solid fa-tower-cell"></i>', iconSize: [32, 32], iconAnchor: [16, 16] }),
          dukodu: true,
        }).addTo(map).bindTooltip(`<strong>${a.nama}</strong><br/>${a.lokasi}`);
        bounds.push([a.lat, a.lng]);
      });

      if (bounds.length) {
        map.fitBounds(L.latLngBounds(bounds).pad(0.4));
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, [areas, refreshKey]);

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        try { mapRef.current.remove(); } catch { /* ignore */ }
        mapRef.current = null;
        initializedRef.current = false;
      }
    };
  }, []);

  return <div id="cms-coverage-map" className="cms-map"></div>;
}