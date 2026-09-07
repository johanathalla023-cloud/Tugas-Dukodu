"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/Reveal";
import {
  SERVED_AREAS,
  findAreaByText,
  findAreaByCoords,
  type ServedArea,
} from "@/components/areaData";
import type {
  Map as LeafletMap,
  Circle,
  Marker,
  Polyline,
} from "leaflet";

type CheckResult =
  | {
      type: "success";
      area: ServedArea;
      distanceKm: number | null;
      via: "text" | "gps";
    }
  | { type: "error"; via: "text" | "gps" }
  | null;

type LeafletNamespace = typeof import("leaflet");

const CIRCLE_STYLE = {
  color: "#dc1212",
  weight: 2,
  fillColor: "#dc1212",
  fillOpacity: 0.12,
};

const CIRCLE_HIGHLIGHT = {
  color: "#dc1212",
  weight: 4,
  fillColor: "#dc1212",
  fillOpacity: 0.22,
};

export default function CekArea() {
  const [value, setValue] = useState("");
  const [buttonText, setButtonText] = useState(
    <><i className="fas fa-location-dot"></i> Cek Ketersediaan</>
  );
  const [gpsBusy, setGpsBusy] = useState(false);
  const [gpsError, setGpsError] = useState("");
  const [result, setResult] = useState<CheckResult>(null);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<LeafletMap | null>(null);
  const circlesRef = useRef<Record<string, Circle>>({});
  const userMarkerRef = useRef<Marker | null>(null);
  const polylineRef = useRef<Polyline | null>(null);
  const leafletRef = useRef<LeafletNamespace | null>(null);

  // Inisialisasi peta sekali (client-only, Leaflet di-import dinamis).
  useEffect(() => {
    let cancelled = false;
    let io: IntersectionObserver | null = null;

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
        const bounds = L.latLngBounds([]);
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
          bounds.extend(circle.getBounds());
        });
        circlesRef.current = circles;
        map.fitBounds(bounds.pad(0.12));

        // Pastikan ukuran peta benar saat section terlihat / jendela di-resize.
        io = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) map.invalidateSize();
          });
        });
        io.observe(mapRef.current);

        mapInstance.current = map;
        leafletRef.current = L;
      } catch {
        // Peta gagal dimuat — form tetap berfungsi.
      }
    })();

    return () => {
      cancelled = true;
      io?.disconnect();
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
      circlesRef.current = {};
      userMarkerRef.current = null;
      polylineRef.current = null;
      leafletRef.current = null;
    };
  }, []);

  const resetHighlight = () => {
    circlesRef.current &&
      Object.values(circlesRef.current).forEach((c) =>
        c.setStyle(CIRCLE_STYLE)
      );
  };

  const highlightArea = (id: string) => {
    resetHighlight();
    circlesRef.current[id]?.setStyle(CIRCLE_HIGHLIGHT);
  };

  const focusArea = (id: string) => {
    highlightArea(id);
    const map = mapInstance.current;
    if (map) map.fitBounds(circlesRef.current[id].getBounds().pad(0.3));
  };

  const placeUserMarker = (lat: number, lng: number) => {
    const L = leafletRef.current;
    const map = mapInstance.current;
    if (!L || !map) return;

    if (userMarkerRef.current) userMarkerRef.current.remove();
    userMarkerRef.current = L.marker([lat, lng], {
      icon: L.divIcon({
        className: "cek-user-pin-wrap",
        html: `
          <svg class="cek-user-pin" viewBox="0 0 24 24" width="30" height="30" aria-hidden="true">
            <circle cx="12" cy="12" r="10" fill="#2563eb" stroke="#ffffff" stroke-width="2.5"/>
            <circle cx="12" cy="12" r="4" fill="#ffffff"/>
          </svg>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      }),
      title: "Lokasi Anda",
    })
      .addTo(map)
      .bindTooltip("Lokasi Anda", { direction: "top", offset: [0, -14] });

    if (polylineRef.current) polylineRef.current.remove();
    polylineRef.current = null;
  };

  const drawLineToArea = (area: ServedArea) => {
    const L = leafletRef.current;
    const map = mapInstance.current;
    const userMarker = userMarkerRef.current;
    if (!L || !map || !userMarker) return;

    if (polylineRef.current) polylineRef.current.remove();
    polylineRef.current = L.polyline(
      [userMarker.getLatLng(), [area.lat, area.lng]],
      { color: "#dc1212", weight: 2, dashArray: "6 6", opacity: 0.7 }
    ).addTo(map);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = value.trim();
    if (!v) return;
    setResult(null);
    setGpsError("");

    setButtonText(<i className="fas fa-circle-notch fa-spin"></i>);
    setTimeout(() => {
      const area = findAreaByText(v);
      if (area) {
        highlightArea(area.id);
        const map = mapInstance.current;
        if (map) map.fitBounds(circlesRef.current[area.id].getBounds().pad(0.3));
        setResult({ type: "success", area, distanceKm: null, via: "text" });
      } else {
        resetHighlight();
        setResult({ type: "error", via: "text" });
      }
      setButtonText(
        <><i className="fas fa-location-dot"></i> Cek Ketersediaan</>
      );
    }, 500);
  };

  const checkGps = () => {
    if (!navigator.geolocation) {
      setGpsError("Browser Anda tidak mendukung geolokasi.");
      return;
    }
    setGpsBusy(true);
    setGpsError("");
    setResult(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsBusy(false);
        const { latitude, longitude } = pos.coords;
        placeUserMarker(latitude, longitude);

        const found = findAreaByCoords(latitude, longitude);
        if (found) {
          highlightArea(found.area.id);
          drawLineToArea(found.area);
          const map = mapInstance.current;
          if (map) {
            map.setView([latitude, longitude], 14);
            setTimeout(() => map.invalidateSize(), 100);
          }
          setResult({
            type: "success",
            area: found.area,
            distanceKm: found.distanceKm,
            via: "gps",
          });
        } else {
          resetHighlight();
          const map = mapInstance.current;
          if (map) {
            map.setView([latitude, longitude], 14);
            setTimeout(() => map.invalidateSize(), 100);
          }
          setResult({ type: "error", via: "gps" });
        }
      },
      (err) => {
        setGpsBusy(false);
        setGpsError(
          err.code === err.PERMISSION_DENIED
            ? "Izin lokasi ditolak. Izinkan akses lokasi lalu coba lagi."
            : "Gagal mendapatkan lokasi. Pastikan GPS aktif dan coba lagi."
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  };

  return (
    <section id="cek-area" className="section cek-area">
      <div className="container">
        <Reveal>
          <div className="cek-box">
            <span className="section-label">Cek Area</span>
            <h2>Apakah Area Anda Sudah Tersedia?</h2>
            <p>
              Masukkan alamat atau nama daerah Anda untuk mengetahui
              ketersediaan jaringan fiber optik Dukodu.
            </p>

            <form className="cek-form" onSubmit={onSubmit}>
              <div className="cek-input-wrap">
                <i className="fas fa-location-dot"></i>
                <input
                  type="text"
                  className="cek-input"
                  placeholder="Contoh: Jakarta Selatan, Dukodu Residence"
                  required
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                {buttonText}
              </button>
            </form>

            <button
              type="button"
              className="cek-gps-btn"
              onClick={checkGps}
              disabled={gpsBusy}
            >
              {gpsBusy ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <i className="fas fa-crosshairs"></i>
              )}
              {gpsBusy ? "Mencari lokasi…" : "Gunakan Lokasi Saya"}
            </button>
            {gpsError && <p className="cek-gps-error">{gpsError}</p>}

            <div
              className={`cek-result ${result?.type ?? ""}`}
              style={{ display: result ? "flex" : "none" }}
            >
              {result?.type === "success" ? (
                <div className="cek-result-success">
                  <div className="cek-result-head">
                    <i className="fas fa-circle-check"></i>
                    <span>
                      Area Anda <strong>terlayani</strong>!
                    </span>
                  </div>
                  <div className="cek-result-meta">
                    <div>
                      <i className="fas fa-location-dot"></i>{" "}
                      {result.area.name}
                      {result.distanceKm !== null && (
                        <span className="cek-result-distance">
                          {" "}
                          (±{result.distanceKm.toFixed(1)} km dari pusat area)
                        </span>
                      )}
                    </div>
                    <div>
                      <i className="fas fa-bolt"></i> Kecepatan maksimal:{" "}
                      {result.area.maxSpeed}
                    </div>
                  </div>
                  <div className="cek-pkg-chips">
                    {result.area.packages.map((p) => (
                      <span key={p} className="cek-pkg-chip">
                        {p}
                      </span>
                    ))}
                  </div>
                  <a
                    href="/berlangganan"
                    className="btn btn-primary cek-result-cta"
                  >
                    Daftar Sekarang <i className="fas fa-arrow-right"></i>
                  </a>
                </div>
              ) : result?.type === "error" ? (
                <>
                  <i className="fas fa-circle-exclamation"></i>
                  <span>
                    Area Anda <strong>belum terlayani</strong> untuk saat ini.
                    Hubungi support kami via WhatsApp untuk info lebih lanjut.
                  </span>
                </>
              ) : null}
            </div>

            <div className="cek-map">
              <div
                ref={mapRef}
                className="cek-map-canvas"
                aria-label="Peta cakupan area terlayani Dukodu"
              />
            </div>

            <p className="cek-map-legend">
              <span className="cek-legend-dot"></span>
              Lingkaran merah = area terlayani &nbsp;·&nbsp;
              <span className="cek-legend-dot cek-legend-dot--user"></span>
              Titik biru = lokasi Anda (GPS)
            </p>

            <div className="cek-areas">
              <h3 className="cek-areas-title">
                <i className="fas fa-map-location-dot"></i> Wilayah Terlayani
              </h3>
              <div className="cek-areas-grid">
                {SERVED_AREAS.map((area) => (
                  <button
                    key={area.id}
                    type="button"
                    className="cek-area-card"
                    onClick={() => focusArea(area.id)}
                    title={`Lihat ${area.name} di peta`}
                  >
                    <span className="cek-area-card-icon">
                      <i className="fas fa-location-dot"></i>
                    </span>
                    <span className="cek-area-card-info">
                      <span className="cek-area-card-name">{area.name}</span>
                      <span className="cek-area-card-region">{area.region}</span>
                    </span>
                    <span className="cek-area-card-side">
                      <span className="cek-area-card-speed">
                        <i className="fas fa-bolt"></i> {area.maxSpeed}
                      </span>
                      <span className="cek-area-card-status">
                        <i className="fas fa-circle-check"></i> Terlayani
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}