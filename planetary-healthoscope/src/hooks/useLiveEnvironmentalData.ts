import { useEffect, useState, useRef } from "react";

export interface LiveEnvironmentalData {
  loading: boolean;
  error: string | null;
  tempC: number | null;
  tempFetchedAt: Date | null;
  pm25: number | null;
  pm25FetchedAt: Date | null;
  forestPct: number | null;
  forestYear: string | null;
}

const cache = new Map<string, LiveEnvironmentalData>();

/**
 * Pulls genuinely live data for a given lat/lng + ISO3 country code:
 * - Current temperature from Open-Meteo (free, keyless, updated hourly by weather models)
 * - Current PM2.5 from Open-Meteo Air Quality API (CAMS-based, free, keyless)
 * - Forest area % from the World Bank Open Data API (annual dataset — not live,
 *   clearly labeled as such in the UI since no genuine real-time global
 *   deforestation feed exists)
 */
export function useLiveEnvironmentalData(lat: number, lng: number, iso3: string) {
  const cacheKey = `${iso3}:${lat}:${lng}`;
  const [data, setData] = useState<LiveEnvironmentalData>(
    cache.get(cacheKey) || {
      loading: true,
      error: null,
      tempC: null,
      tempFetchedAt: null,
      pm25: null,
      pm25FetchedAt: null,
      forestPct: null,
      forestYear: null,
    }
  );
  const reqIdRef = useRef(0);

  useEffect(() => {
    const cached = cache.get(cacheKey);
    if (cached && !cached.loading) {
      setData(cached);
      return;
    }

    const reqId = ++reqIdRef.current;
    setData(prev => ({ ...prev, loading: true, error: null }));

    async function run() {
      let tempC: number | null = null;
      let tempFetchedAt: Date | null = null;
      let pm25: number | null = null;
      let pm25FetchedAt: Date | null = null;
      let forestPct: number | null = null;
      let forestYear: string | null = null;
      let errorMsg: string | null = null;

      try {
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m&timezone=auto`
        );
        if (weatherRes.ok) {
          const wJson = await weatherRes.json();
          if (typeof wJson?.current?.temperature_2m === "number") {
            tempC = wJson.current.temperature_2m;
            tempFetchedAt = new Date();
          }
        }
      } catch {
        errorMsg = "Live weather feed unreachable";
      }

      try {
        const aqRes = await fetch(
          `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=pm2_5&timezone=auto`
        );
        if (aqRes.ok) {
          const aqJson = await aqRes.json();
          if (typeof aqJson?.current?.pm2_5 === "number") {
            pm25 = aqJson.current.pm2_5;
            pm25FetchedAt = new Date();
          }
        }
      } catch {
        errorMsg = errorMsg || "Live air quality feed unreachable";
      }

      try {
        const fRes = await fetch(
          `https://api.worldbank.org/v2/country/${iso3}/indicator/AG.LND.FRST.ZS?format=json&per_page=10&date=2010:2023`
        );
        if (fRes.ok) {
          const fJson = await fRes.json();
          const rows = fJson?.[1];
          if (Array.isArray(rows)) {
            const withValue = rows.find((r: any) => r.value !== null);
            if (withValue) {
              forestPct = withValue.value;
              forestYear = withValue.date;
            }
          }
        }
      } catch {
        // Forest dataset is best-effort; non-fatal if unavailable.
      }

      if (reqIdRef.current !== reqId) return;

      const result: LiveEnvironmentalData = {
        loading: false,
        error: tempC === null && pm25 === null ? (errorMsg || "Live data unavailable") : null,
        tempC,
        tempFetchedAt,
        pm25,
        pm25FetchedAt,
        forestPct,
        forestYear,
      };
      cache.set(cacheKey, result);
      setData(result);
    }

    run();
  }, [cacheKey, lat, lng, iso3]);

  return data;
}
