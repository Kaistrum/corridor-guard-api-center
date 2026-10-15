import { useState } from "react";
import { Badge, Button, Card, Input, Select } from "@kaistrum/stratum-ui";
import { CodeBlock } from "./CodeBlock";
import { INITIAL_KEYS } from "@/lib/data";

const BASE_URL = "https://api.corridorguard.io/v1";

const ENDPOINTS = [
  { value: "/corridors", label: "GET /corridors" },
  { value: "/corridors/{id}", label: "GET /corridors/{id}" },
  { value: "/segments", label: "GET /segments" },
  { value: "/wfs", label: "GET /wfs (GetCapabilities)" },
];

const FORMATS = [
  { value: "geojson", label: "GeoJSON" },
  { value: "json", label: "JSON" },
  { value: "mvt", label: "Vector tile (MVT)" },
];

const KEY_OPTIONS = INITIAL_KEYS.map((k) => ({ value: k.id, label: k.name }));

const SAMPLE_RESPONSE = `{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [[36.806, -1.283], [36.821, -1.274], [36.838, -1.262]]
      },
      "properties": {
        "id": "cor_7f3a9c",
        "name": "Mombasa Rd Freight Corridor",
        "class": "arterial",
        "risk_score": 0.42,
        "length_km": 4.8
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [[36.799, -1.301], [36.812, -1.289]]
      },
      "properties": {
        "id": "cor_2b8e14",
        "name": "Uhuru Hwy Link",
        "class": "collector",
        "risk_score": 0.17,
        "length_km": 2.1
      }
    }
  ],
  "metadata": { "count": 2, "crs": "EPSG:4326" }
}`;

export function PlaygroundView() {
  const [endpoint, setEndpoint] = useState(ENDPOINTS[0].value);
  const [keyId, setKeyId] = useState(KEY_OPTIONS[0]?.value ?? "");
  const [bbox, setBbox] = useState("36.80,-1.30,36.84,-1.26");
  const [format, setFormat] = useState(FORMATS[0].value);
  const [sending, setSending] = useState(false);
  const [response, setResponse] = useState<{ latency: number } | null>(null);

  const requestUrl = `${BASE_URL}${endpoint}?bbox=${bbox}&format=${format}`;
  const curl = `curl -H "X-API-Key: YOUR_API_KEY" \\
  "${requestUrl}"`;

  const send = () => {
    setSending(true);
    setResponse(null);
    // Simulated round-trip — swap for a real fetch once the API is live.
    window.setTimeout(() => {
      setResponse({ latency: 150 + Math.floor(Math.random() * 90) });
      setSending(false);
    }, 650);
  };

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          API playground
        </h1>
        <p className="mt-1 text-text-dim">
          Build a request, run it, and copy the exact call into your QGIS or
          ArcGIS workflow.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        {/* Request builder */}
        <Card padding="spacious" className="h-fit">
          <h2 className="mb-4 font-semibold text-text">Request</h2>
          <div className="space-y-4">
            <Select
              label="Endpoint"
              options={ENDPOINTS}
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
            />
            <Select
              label="API key"
              options={KEY_OPTIONS}
              value={keyId}
              onChange={(e) => setKeyId(e.target.value)}
              hint="Sent as the X-API-Key header. Your secret is never shown here."
            />
            <Input
              label="Bounding box"
              value={bbox}
              onChange={(e) => setBbox(e.target.value)}
              hint="xmin,ymin,xmax,ymax in EPSG:4326"
            />
            <Select
              label="Format"
              options={FORMATS}
              value={format}
              onChange={(e) => setFormat(e.target.value)}
            />
            <Button
              variant="primary"
              fullWidth
              loading={sending}
              onClick={send}
            >
              {sending ? "Sending…" : "Send request"}
            </Button>
          </div>
        </Card>

        {/* Request / response */}
        <div className="space-y-5">
          <div>
            <p className="mb-2 text-sm font-medium text-text">Request preview</p>
            <CodeBlock language="bash" code={curl} />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium text-text">Response</p>
              {response && (
                <div className="flex items-center gap-2">
                  <Badge variant="success" dot>
                    200 OK
                  </Badge>
                  <span className="text-xs text-text-muted">
                    {response.latency}ms
                  </span>
                </div>
              )}
            </div>
            {response ? (
              <CodeBlock language="JSON" code={SAMPLE_RESPONSE} />
            ) : (
              <div className="flex h-40 items-center justify-center rounded-radius-lg border border-dashed border-border text-sm text-text-muted">
                {sending ? "Waiting for response…" : "Send a request to see the response."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
