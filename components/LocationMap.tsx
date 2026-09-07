"use client";

import { useEffect, useRef, useState } from "react";
import type {
  Map as LeafletMap,
  Marker,
  LeafletMouseEvent,
} from "leaflet";
import "leaflet/dist/leaflet.css";

type LocationMapProps = {
  initialLat?: number;
  initialLng?: number;
  lat?: string;
  lng?: string;
  onCoordsChange?: (lat: number, lng: number) => void;
};

/** Pusat awal: Mampang Prapatan, Jakarta Selatan */
const DEFAULT_LAT = -6.2483;
const DEFAULT_LNG = 106.8256;

/** Ikon pin merah inline (DivIcon) — tidak bergantung file gambar bawaan Leaflet. */
function createPinIcon(L: typeof import("leaflet")) {
  return L.divIcon({
    className: "subs-pin-wrap",
    html: `
      <svg class="subs-pin" viewBox="0 0 24 24" width="36" height="36" aria-hidden="true">
        <path
          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
          fill="#e31b23"
          stroke="#ffffff"
          stroke-width="1.6"
        />
        <circle cx="12" cy="9" r="3.2" fill="#ffffff" />
      </svg>`,
    iconSize: [36, 36],
    iconAnchor: [18, 34],
    popupAnchor: [0, -32],
  });
}

export default function LocationMap({
  initialLat = DEFAULT_LAT,
  initialLng = DEFAULT_LNG,
  lat,
  lng,
  onCoordsChange,
}: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<LeafletMap | null>(null);
  const markerInstance = useRef<Marker | null>(null);
  const setCoordsRef = useRef<(lat: number, lng: number) => void>(() => {});
  const onCoordsChangeRef = useRef(onCoordsChange);
  onCoordsChangeRef.current = onCoordsChange;

  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [gpsBusy, setGpsBusy] = useState(false);
  const [gpsError, setGpsError] = useState("");

  useEffect(() => {
    let cancelled = false;
    let resizeTimer: number | undefined;

    // Leaflet di-import secara dinamis agar hanya berjalan di sisi klien.
    (async () => {
      try {
        const L = await import("leaflet");
        if (cancelled || !mapRef.current) return;

        const map = L.map(mapRef.current, {
          center: [initialLat, initialLng],
          zoom: 16,
          scrollWheelZoom: true,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        const marker = L.marker([initialLat, initialLng], {
          draggable: true,
          icon: createPinIcon(L),
          title: "Lokasi Anda",
        }).addTo(map);

        const setCoords = (nextLat: number, nextLng: number, pan: boolean) => {
          marker.setLatLng([nextLat, nextLng]);
          if (pan) map.panTo([nextLat, nextLng]);
          onCoordsChangeRef.current?.(nextLat, nextLng);
        };

        setCoordsRef.current = (nextLat: number, nextLng: number) =>
          setCoords(nextLat, nextLng, true);

        marker.on("dragend", () => {
          const pos = marker.getLatLng();
          setCoords(pos.lat, pos.lng, false);
        });

        map.on("click", (e: LeafletMouseEvent) => {
          setCoords(e.latlng.lat, e.latlng.lng, false);
        });

        mapInstance.current = map;
        markerInstance.current = marker;

        // Pastikan ukuran peta benar setelah layout selesai dirender.
        resizeTimer = window.setTimeout(() => map.invalidateSize(), 150);

        if (!cancelled) setStatus("ready");
      } catch (err) {
        if (!cancelled) {
          setStatus("error");
          setErrorMsg(
            err instanceof Error ? err.message : "Gagal memuat peta."
          );
        }
      }
    })();

    return () => {
      cancelled = true;
      if (resizeTimer) window.clearTimeout(resizeTimer);
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
      markerInstance.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const takeGps = () => {
    if (!navigator.geolocation) {
      setGpsError("Browser Anda tidak mendukung geolokasi.");
      return;
    }
    setGpsBusy(true);
    setGpsError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsBusy(false);
        const { latitude, longitude } = pos.coords;
        if (mapInstance.current && markerInstance.current) {
          setCoordsRef.current(latitude, longitude);
        } else {
          onCoordsChangeRef.current?.(latitude, longitude);
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
    <div className="subs-mapbox">
      <div className="subs-mapbox-head">
        <div className="subs-mapbox-title-wrap">
          <h3 className="subs-mapbox-title">
            <i className="fas fa-location-dot"></i> Koordinat Lokasi
          </h3>
          <p className="subs-mapbox-sub">
            Gunakan tombol GPS untuk menandai lokasi Anda.
          </p>
        </div>
        <button
          type="button"
          className="subs-gps-btn"
          onClick={takeGps}
          disabled={gpsBusy}
        >
          {gpsBusy ? (
            <i className="fas fa-spinner fa-spin"></i>
          ) : (
            <i className="fas fa-location-dot"></i>
          )}
          {gpsBusy ? "Mencari lokasi…" : "Ambil Lokasi GPS"}
        </button>
      </div>

      <div className="subs-coord-grid">
        <div className="subs-field">
          <label>Latitude</label>
          <input
            type="text"
            readOnly
            value={lat || "-"}
            placeholder="-"
            aria-label="Latitude"
          />
        </div>
        <div className="subs-field">
          <label>Longitude</label>
          <input
            type="text"
            readOnly
            value={lng || "-"}
            placeholder="-"
            aria-label="Longitude"
          />
        </div>
      </div>

      <div className="subs-map">
        <div
          ref={mapRef}
          className="subs-map-canvas"
          style={{ visibility: status === "ready" ? "visible" : "hidden" }}
          aria-label="Peta untuk menentukan koordinat lokasi"
        />

        {status === "loading" && (
          <div className="subs-map-state">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Memuat peta…</p>
          </div>
        )}

        {status === "error" && (
          <div className="subs-map-state">
            <i className="fas fa-map-location-dot"></i>
            <p className="subs-map-state-title">Peta tidak dapat dimuat.</p>
            <p>{errorMsg}</p>
            <p className="subs-map-hint">
              Periksa koneksi internet Anda, lalu muat ulang halaman.
            </p>
          </div>
        )}
      </div>

      {gpsError && <p className="subs-gps-error">{gpsError}</p>}
    </div>
  );
}