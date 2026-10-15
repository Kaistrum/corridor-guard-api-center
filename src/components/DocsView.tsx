import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  Badge,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@kaistrum/stratum-ui";
import { CodeBlock } from "./CodeBlock";
import { KeyIcon } from "./icons";

const BASE_URL = "https://api.corridorguard.io/v1";

const CURL_EXAMPLE = `curl -H "X-API-Key: YOUR_API_KEY" \\
  "${BASE_URL}/corridors?bbox=36.80,-1.30,36.84,-1.26"`;

const QGIS_PYTHON = `# QGIS Python Console  (Plugins ▸ Python Console)
import requests
from qgis.core import QgsVectorLayer, QgsProject

API_KEY = "YOUR_API_KEY"
BASE_URL = "${BASE_URL}"

resp = requests.get(
    f"{BASE_URL}/corridors",
    headers={"X-API-Key": API_KEY},
    params={"bbox": "36.80,-1.30,36.84,-1.26"},
    timeout=30,
)
resp.raise_for_status()

# The endpoint returns GeoJSON, which QGIS can load directly.
layer = QgsVectorLayer(resp.text, "Corridors", "ogr")
QgsProject.instance().addMapLayer(layer)`;

const QGIS_WFS = `# Layer ▸ Add Layer ▸ Add WFS/OGC API Layer ▸ New
# Paste this as the connection URL (key passed as a query param
# because WFS connections can't send custom headers):

${BASE_URL}/wfs?api_key=YOUR_API_KEY`;

const ARCGIS_TOOLBOX = `# corridor_guard.pyt  —  an ArcGIS Pro Python toolbox
import arcpy, os, requests

API_KEY = "YOUR_API_KEY"          # better: read from a GP parameter or env var
BASE_URL = "${BASE_URL}"

class Toolbox(object):
    def __init__(self):
        self.label = "Corridor Guard"
        self.alias = "corridorguard"
        self.tools = [FetchCorridors]

class FetchCorridors(object):
    def __init__(self):
        self.label = "Fetch Corridors"
        self.description = "Download corridor features into a feature class."

    def getParameterInfo(self):
        bbox = arcpy.Parameter(
            displayName="Bounding box (xmin,ymin,xmax,ymax)",
            name="bbox", datatype="GPString",
            parameterType="Required", direction="Input")
        out_fc = arcpy.Parameter(
            displayName="Output feature class",
            name="out_fc", datatype="DEFeatureClass",
            parameterType="Required", direction="Output")
        return [bbox, out_fc]

    def execute(self, parameters, messages):
        bbox   = parameters[0].valueAsText
        out_fc = parameters[1].valueAsText

        resp = requests.get(
            f"{BASE_URL}/corridors",
            headers={"X-API-Key": API_KEY},
            params={"bbox": bbox}, timeout=30)
        resp.raise_for_status()

        tmp = os.path.join(arcpy.env.scratchFolder, "corridors.geojson")
        with open(tmp, "w", encoding="utf-8") as f:
            f.write(resp.text)

        arcpy.conversion.JSONToFeatures(tmp, out_fc)
        messages.addMessage(
            f"Loaded {arcpy.management.GetCount(out_fc)[0]} features.")`;

const ARCGIS_WINDOW = `# Quick one-off in the ArcGIS Pro Python window
import arcpy, requests, os

resp = requests.get(
    "${BASE_URL}/corridors",
    headers={"X-API-Key": "YOUR_API_KEY"},
    params={"bbox": "36.80,-1.30,36.84,-1.26"}, timeout=30)
resp.raise_for_status()

tmp = os.path.join(arcpy.env.scratchFolder, "corridors.geojson")
open(tmp, "w", encoding="utf-8").write(resp.text)
arcpy.conversion.JSONToFeatures(tmp, "corridors")`;

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-24 text-xl font-bold tracking-tight">
      {children}
    </h2>
  );
}

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "get-key", label: "1. Get your API key" },
  { id: "authenticate", label: "2. Authenticate requests" },
  { id: "integrations", label: "3. Use it in your GIS" },
  { id: "limits", label: "Rate limits" },
  { id: "troubleshooting", label: "Troubleshooting" },
];

export function DocsView() {
  return (
    <div className="mx-auto flex max-w-6xl gap-10">
      {/* Main column */}
      <article className="min-w-0 max-w-3xl flex-1">
        <header className="mb-8">
          <Badge variant="accent">Guide</Badge>
          <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            Using your API key
          </h1>
          <p className="mt-2 text-text-dim">
            The Corridor Guard API serves encroachment and wayleave-corridor data
            over HTTP. This guide shows how to create a key and consume it from a{" "}
            <strong className="text-text">QGIS plugin</strong> or an{" "}
            <strong className="text-text">ArcGIS Pro toolbox</strong>.
          </p>
        </header>

        <section className="space-y-4">
          <SectionHeading id="overview">Overview</SectionHeading>
          <p className="text-text-dim">
            Every request is authenticated with an API key you generate in this
            console. Endpoints return standard GeoJSON (or vector tiles / WFS), so
            they drop straight into desktop GIS software.
          </p>
          <div className="overflow-hidden rounded-radius-lg border border-border">
            <dl className="divide-y divide-border-subtle text-sm">
              <div className="flex gap-4 px-4 py-3">
                <dt className="w-32 shrink-0 text-text-muted">Base URL</dt>
                <dd className="font-mono text-text">{BASE_URL}</dd>
              </div>
              <div className="flex gap-4 px-4 py-3">
                <dt className="w-32 shrink-0 text-text-muted">Auth header</dt>
                <dd className="font-mono text-text">X-API-Key: YOUR_API_KEY</dd>
              </div>
              <div className="flex gap-4 px-4 py-3">
                <dt className="w-32 shrink-0 text-text-muted">Formats</dt>
                <dd className="text-text">GeoJSON · Vector tiles (MVT) · WFS</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="mt-10 space-y-4">
          <SectionHeading id="get-key">1. Get your API key</SectionHeading>
          <ol className="list-decimal space-y-2 pl-5 text-text-dim marker:text-text-muted">
            <li>
              Open the{" "}
              <Link href="/dashboard" className="font-medium text-accent hover:underline">
                API keys
              </Link>{" "}
              page.
            </li>
            <li>
              Click <strong className="text-text">Create new key</strong>, name it
              (e.g. <em>QGIS laptop</em>), and choose a usage limit.
            </li>
            <li>Reveal the key with the eye icon and copy it with the copy icon.</li>
          </ol>
          <Alert variant="warning" title="Treat your key like a password">
            A key grants access to your plan&apos;s quota. Don&apos;t commit it to
            version control or share it in screenshots. Create a separate key per
            machine so you can revoke one without disrupting the others.
          </Alert>
        </section>

        <section className="mt-10 space-y-4">
          <SectionHeading id="authenticate">2. Authenticate requests</SectionHeading>
          <p className="text-text-dim">
            Send your key in the <code className="rounded bg-bg-surface px-1.5 py-0.5 font-mono text-sm">X-API-Key</code>{" "}
            header. For connections that can&apos;t set headers (QGIS WFS/XYZ
            sources), pass it as an <code className="rounded bg-bg-surface px-1.5 py-0.5 font-mono text-sm">api_key</code>{" "}
            query parameter instead.
          </p>
          <CodeBlock language="bash" code={CURL_EXAMPLE} />
        </section>

        <section className="mt-10 space-y-4">
          <SectionHeading id="integrations">3. Use it in your GIS</SectionHeading>
          <p className="text-text-dim">
            Pick your platform. Replace <code className="rounded bg-bg-surface px-1.5 py-0.5 font-mono text-sm">YOUR_API_KEY</code>{" "}
            with the key you copied above.
          </p>

          <Tabs defaultValue="qgis">
            <TabsList>
              <TabsTrigger value="qgis">QGIS plugin</TabsTrigger>
              <TabsTrigger value="arcgis">ArcGIS Pro toolbox</TabsTrigger>
            </TabsList>

            <TabsContent value="qgis">
              <div className="space-y-5 pt-2">
                <div className="space-y-2">
                  <h3 className="font-semibold text-text">Option A — Plugin settings</h3>
                  <p className="text-sm text-text-dim">
                    In the Corridor Guard plugin, open{" "}
                    <strong className="text-text">Plugins ▸ Corridor Guard ▸ Settings</strong>,
                    paste your key into the <em>API key</em> field, and save. The
                    plugin stores it in your QGIS profile and attaches it to every
                    request.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-text">Option B — Python console</h3>
                  <p className="text-sm text-text-dim">
                    Fetch GeoJSON and add it as a layer programmatically:
                  </p>
                  <CodeBlock language="Python" code={QGIS_PYTHON} />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-text">Option C — WFS connection</h3>
                  <p className="text-sm text-text-dim">
                    Add corridors as a live WFS layer with no code:
                  </p>
                  <CodeBlock language="Connection URL" code={QGIS_WFS} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="arcgis">
              <div className="space-y-5 pt-2">
                <div className="space-y-2">
                  <h3 className="font-semibold text-text">Option A — Python toolbox (.pyt)</h3>
                  <p className="text-sm text-text-dim">
                    Save this as <code className="rounded bg-bg-surface px-1.5 py-0.5 font-mono text-sm">corridor_guard.pyt</code>,
                    then add it in the Catalog pane under{" "}
                    <strong className="text-text">Toolboxes</strong>. The tool
                    downloads corridors into a feature class.
                  </p>
                  <CodeBlock language="Python" code={ARCGIS_TOOLBOX} />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-text">Option B — Python window</h3>
                  <p className="text-sm text-text-dim">
                    For a quick, one-off pull, paste this into the ArcGIS Pro Python
                    window:
                  </p>
                  <CodeBlock language="Python" code={ARCGIS_WINDOW} />
                </div>
                <Alert variant="info" title="requests not installed?">
                  Clone the default <code className="font-mono">arcgispro-py3</code>{" "}
                  environment and run{" "}
                  <code className="font-mono">conda install requests</code>, or use
                  the bundled <code className="font-mono">urllib.request</code>{" "}
                  instead.
                </Alert>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        <section className="mt-10 space-y-4">
          <SectionHeading id="limits">Rate limits</SectionHeading>
          <p className="text-text-dim">
            Each key is capped by the limit shown next to it on the API keys page.
            Responses include <code className="rounded bg-bg-surface px-1.5 py-0.5 font-mono text-sm">X-RateLimit-Remaining</code>{" "}
            so your tool can back off before hitting{" "}
            <code className="rounded bg-bg-surface px-1.5 py-0.5 font-mono text-sm">429 Too Many Requests</code>.
            Need more headroom? Adjust it from{" "}
            <span className="text-text">Settings ▸ Manage plan</span>.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <SectionHeading id="troubleshooting">Troubleshooting</SectionHeading>
          <Accordion type="single">
            <AccordionItem value="401">
              <AccordionTrigger>401 Unauthorized</AccordionTrigger>
              <AccordionContent>
                The key is missing, mistyped, or revoked. Confirm you copied the full
                value and that the header name is exactly{" "}
                <code className="font-mono">X-API-Key</code>. Generate a fresh key if
                you deleted the old one.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="429">
              <AccordionTrigger>429 Too Many Requests</AccordionTrigger>
              <AccordionContent>
                You&apos;ve exceeded the key&apos;s usage limit. Wait for the window
                to reset, raise the limit on the API keys page, or spread load across
                multiple keys.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="empty">
              <AccordionTrigger>Layer loads but is empty</AccordionTrigger>
              <AccordionContent>
                Your <code className="font-mono">bbox</code> probably doesn&apos;t
                overlap any corridors. Coordinates are{" "}
                <code className="font-mono">xmin,ymin,xmax,ymax</code> in WGS84
                (EPSG:4326).
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-border pt-6">
          <Link href="/dashboard">
            <Button variant="primary" icon={<KeyIcon width={18} height={18} />}>
              Go to API keys
            </Button>
          </Link>
          <span className="text-sm text-text-dim">
            Create a key and start pulling corridors into your map.
          </span>
        </div>
      </article>

      {/* On-page table of contents */}
      <aside className="hidden w-56 shrink-0 xl:block">
        <nav className="sticky top-24">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">
            On this page
          </p>
          <ul className="space-y-2 text-sm">
            {TOC.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-text-dim transition-colors hover:text-accent"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </div>
  );
}
