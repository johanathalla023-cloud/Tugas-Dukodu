"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import Reveal from "@/components/Reveal";
import { SERVED_AREAS } from "@/components/areaData";
import type { Map as LeafletMap, Circle } from "leaflet";

const CIRCLE_STYLE = {
  color: "#dc1212",
  weight: 2,
  fillColor: "#dc1212",
  fillOpacity: 0.12,
};

export default function CekArea() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<LeafletMap | null>(null);
  const circlesRef = useRef<Record<string, Circle>>({});

  // Inisialisasi peta sekali (client-only, Leaflet di-import dinamis).
  useEffect(() => {
    let cancelled = false;
    let io: IntersectionObserver | null = null;
    let loadListener: (() => void) | null = null;

    const fitAreaBounds = (map: LeafletMap, L: typeof import("leaflet")) => {
      const bounds = L.latLngBounds([]);
      SERVED_AREAS.forEach((area) => {
        bounds.extend(
          L.latLngBounds(
            L.latLng(area.lat - area.radiusKm / 111, area.lng - area.radiusKm / 111),
            L.latLng(area.lat + area.radiusKm / 111, area.lng + area.radiusKm / 111)
          )
        );
      });
      map.fitBounds(bounds.pad(0.12), { animate: false });
    };

    (async () => {
      try {
        const L = await import("leaflet");
        if (cancelled || !mapRef.current) return;

        const map = L.map(mapRef.current, {
          center: [-6.235, 106.826],
          zoom: 13,
          scrollWheelZoom: false,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        // Lingkaran cakupan untuk tiap area terlayani.
        const circles: Record<string, Circle> = {};
        SERVED_AREAS.forEach((area) => {
          const circle = L.circle([area.lat, area.lng], {
            radius: area.radiusKm * 1000,
            ...CIRCLE_STYLE,
          })
            .addTo(map)
            .bindTooltip(area.name, {
              permanent: true,
              direction: "center",
              className: "cek-area-label",
            });
          circles[area.id] = circle;
        });
        circlesRef.current = circles;

        map.whenReady(() => {
          if (cancelled) return;
          // Ukuran peta perlu disegarkan setelah layout/animasi reveal selesai,
          // agar tampilan langsung besar tanpa perlu refresh manual.
          const fixSize = () => {
            if (cancelled) return;
            map.invalidateSize();
            fitAreaBounds(map, L);
          };
          requestAnimationFrame(() => requestAnimationFrame(fixSize));
          setTimeout(fixSize, 300);
          setTimeout(fixSize, 1000);
          if (document.readyState === "complete") {
            fixSize();
          } else {
            const onLoad = () => fixSize();
            window.addEventListener("load", onLoad);
            loadListener = () => window.removeEventListener("load", onLoad);
          }
        });

        // Pastikan ukuran peta benar saat section terlihat / jendela di-resize.
        io = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              map.invalidateSize();
              fitAreaBounds(map, L);
              io?.disconnect();
            }
          });
        });
        io.observe(mapRef.current);

        mapInstance.current = map;
      } catch {
        // Peta gagal dimuat — form tetap berfungsi.
      }
    })();

    return () => {
      cancelled = true;
      loadListener?.();
      io?.disconnect();
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
      circlesRef.current = {};
    };
  }, []);

  return (
    <section id="cek-area" className="section cek-area">
      <div className="container">
        <Reveal>
          <div className="cek-box">
            <span className="section-label">Cek Area</span>
            <h2>Apakah Area Anda Sudah Tersedia?</h2>
            <p>
              Lihat cakupan jaringan fiber optik Dukodu pada peta berikut.
            </p>

            <div className="cek-map">
              <div
                ref={mapRef}
                className="cek-map-canvas"
                aria-label="Peta cakupan area terlayani Dukodu"
              />
            </div>

            <p className="cek-map-legend">
              <span className="cek-legend-dot"></span>
              Lingkaran merah = area terlayani
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}