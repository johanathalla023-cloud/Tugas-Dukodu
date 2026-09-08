"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import Reveal from "@/components/Reveal";
import { SERVED_AREAS, findAreaByText, findAreaByCoords } from "@/components/areaData";
import type { Map as LeafletMap, Circle } from "leaflet";
import type { ServedArea } from "@/components/areaData";

const CIRCLE_STYLE = {
  color: "#dc1212",
  weight: 2,
  fillColor: "#dc1212",
  fillOpacity: 0.12,
};

type ServedLike = ServedArea;

type SearchState =
  | { type: "idle" }
  | { type: "searching" }
  | { type: "found"; areaName: string; namaAlt: string; distanceKm: number }
  | { type: "notfound"; namaAlt?: string }
  | { type: "error" };

export default function CekArea() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<LeafletMap | null>(null);
  const circlesRef = useRef<Record<string, Circle>>({});
  const [address, setAddress] = useState("");
  const [searchState, setSearchState] = useState<SearchState>({ type: "idle" });
  const pinRef = useRef<any>(null);

  const [areas, setAreas] = useState<ServedLike[]>(SERVED_AREAS);
  const areasRef = useRef<ServedLike[]>(SERVED_AREAS);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    const syncAreas = () => { areasRef.current = areas; };
    syncAreas();
  }, [areas]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/coverage");
        const data = await res.json();
        if (cancelled) return;
        const list = (data.areas || [])
          .filter((a: any) => a.status === "active")
          .map((a: any) => ({
            id: a.id,
            name: a.nama,
            region: a.lokasi,
            lat: a.lat,
            lng: a.lng,
            radiusKm: a.radius,
            maxSpeed: `${a.kecepatanMax} Mbps`,
            packages: [] as string[],
          }));
        if (list.length) {
          setAreas(list);
          areasRef.current = list;
        }
      } catch {
        // Gagal memuat dari admin — gunakan data bawaan.
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let io: IntersectionObserver | null = null;
    let loadListener: (() => void) | null = null;

    const fitAreaBounds = (map: LeafletMap, L: typeof import("leaflet")) => {
      const bounds = L.latLngBounds([]);
      areasRef.current.forEach((area) => {
        bounds.extend(
          L.latLngBounds(
            L.latLng(area.lat - area.radiusKm / 111, area.lng - area.radiusKm / 111),
            L.latLng(area.lat + area.radiusKm / 111, area.lng + area.radiusKm / 111)
          )
        );
      });
      if (bounds.isValid()) map.fitBounds(bounds.pad(0.12), { animate: false });
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

        mapInstance.current = map;
        setMapReady(true);

        map.whenReady(() => {
          if (cancelled) return;
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

  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;
    let L: any;
    let removed = false;

    (async () => {
      L = await import("leaflet");
      if (removed) return;
      Object.values(circlesRef.current).forEach((c) => {
        try { map.removeLayer(c); } catch { /* ignore */ }
      });
      circlesRef.current = {};

      areasRef.current.forEach((area) => {
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
        circlesRef.current[area.id] = circle;
      });

      if (Object.keys(circlesRef.current).length) {
        map.fitBounds(
          L.latLngBounds(
            areasRef.current.flatMap((a) => [
              L.latLng(a.lat - a.radiusKm / 111, a.lng - a.radiusKm / 111),
              L.latLng(a.lat + a.radiusKm / 111, a.lng + a.radiusKm / 111),
            ])
          ).pad(0.12),
          { animate: false }
        );
      }
    })();

    return () => { removed = true; };
  }, [areas, mapReady]);

  const placePin = async (lat: number, lng: number) => {
    const map = mapInstance.current;
    if (!map) return;
    const L = await import("leaflet");
    if (pinRef.current) {
      map.removeLayer(pinRef.current);
    }
    const icon = L.divIcon({
      className: "cek-search-pin",
      html: '<i class="fas fa-map-pin"></i>',
      iconSize: [38, 38],
      iconAnchor: [19, 36],
    });
    pinRef.current = L.marker([lat, lng], { icon }).addTo(map);
    map.flyTo([lat, lng], 14, { duration: 0.8 });
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = address.trim();
    if (!q) return;

    // 1) Coba cocokkan teks alamat ke nama area + alias.
    const areaMatch = findAreaByText(q, areas);
    if (areaMatch) {
      await placePin(areaMatch.lat, areaMatch.lng);
      setSearchState({
        type: "found",
        areaName: areaMatch.name,
        namaAlt: areaMatch.region,
        distanceKm: 0,
      });
      return;
    }

    // 2) Geocode via Nominatim (OSM) — gratis, tanpa API key.
    setSearchState({ type: "searching" });
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&countrycodes=id&limit=1&q=${encodeURIComponent(q)}`,
        { headers: { "User-Agent": "DukoduChecker/1.0" } }
      );
      const results = await res.json();
      if (!results || results.length === 0) {
        setSearchState({ type: "notfound" });
        return;
      }
      const { lat, lon, display_name } = results[0];
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lon);
      await placePin(latNum, lngNum);

      const nearest = findAreaByCoords(latNum, lngNum, areas);
      if (nearest) {
        setSearchState({
          type: "found",
          areaName: nearest.area.name,
          namaAlt: display_name,
          distanceKm: nearest.distanceKm,
        });
      } else {
        setSearchState({ type: "notfound", namaAlt: display_name });
      }
    } catch {
      setSearchState({ type: "error" });
    }
  };

  return (
    <section id="cek-area" className="section cek-area">
      <div className="container">
        <Reveal>
          <div className="cek-box">
            <span className="section-label">Cek Area</span>
            <h2>Apakah Area Anda Sudah Tersedia?</h2>
            <p>
              Ketik alamat atau kecamatan Anda, lalu cari tahu apakah area Anda
              sudah terjangkau jaringan fiber optik Dukodu.
            </p>

            <form className="cek-search" onSubmit={handleSearch}>
              <div className="cek-search-input">
                <i className="fas fa-magnifying-glass"></i>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ketik alamat, kecamatan, atau nama area (cth: Mampang, Tebet, Kebayoran Baru)..."
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={searchState.type === "searching"}>
                {searchState.type === "searching" ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-location-crosshairs"></i>}
                <span>Cek Area</span>
              </button>
            </form>

            <div className="cek-result">
              {searchState.type === "found" && searchState.areaName && (
                <div className="cek-result-card found">
                  <div className="cek-result-icon"><i className="fas fa-circle-check"></i></div>
                  <div>
                    <strong>Area Anda Jangkau! 🎉</strong>
                    <p>
                      Alamat Anda berada dalam cakupan <b>{searchState.areaName}</b>.
                      {searchState.distanceKm > 0 &&
                        ` Jarak titik permanen ±${searchState.distanceKm.toFixed(1)} km dari pusat area.`}
                    </p>
                    <span className="cek-result-meta">
                      {searchState.namaAlt}
                    </span>
                    <a href="/berlangganan" className="btn btn-primary cek-result-cta">
                      Langsung Berlangganan <i className="fas fa-arrow-right"></i>
                    </a>
                  </div>
                </div>
              )}
              {searchState.type === "notfound" && (
                <div className="cek-result-card notfound">
                  <div className="cek-result-icon"><i className="fas fa-circle-xmark"></i></div>
                  <div>
                    <strong>Belum tercakup saat ini</strong>
                    <p>
                      Alamat Anda belum masuk area pelayanan Dukodu. Jangan khawatir —
                      kami terus memperluas jaringan. Tinggalkan kontak dan kami akan
                      kabari jika area Anda sudah tersedia.
                    </p>
                    {searchState.namaAlt && <span className="cek-result-meta">{searchState.namaAlt}</span>}
                    <a
                      href="https://wa.me/628115634634?text=Halo%20Dukodu,%20saya%20mau%20bertanya%20tentang%20jangkauan%20jaringan%20di%20area%20saya"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-whatsapp cek-result-cta"
                    >
                      <i className="fab fa-whatsapp"></i> Tanya ketersediaan via WhatsApp
                    </a>
                  </div>
                </div>
              )}
              {searchState.type === "error" && (
                <div className="cek-result-card notfound">
                  <div className="cek-result-icon"><i className="fas fa-triangle-exclamation"></i></div>
                  <div>
                    <strong>Gagal memproses pencarian</strong>
                    <p>Terjadi kesalahan saat memeriksa area. Silakan coba lagi.</p>
                  </div>
                </div>
              )}
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
              Lingkaran merah = area terlayani
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}