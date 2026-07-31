import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Ardvix — AI Automation Systems for Indian SMBs";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const OBSIDIAN = "#0B0B0E";
const COPPER = "#E8541D";
const STEEL_MIST = "#ABB8CC";
const PAPER = "#F4F4F2";

async function getMarkDataUri() {
  const raw = await readFile(
    join(process.cwd(), "public/ardvix-mark.svg"),
    "utf-8"
  );
  const recolored = raw.replace(/fill="#111111"/, `fill="${PAPER}"`);
  return `data:image/svg+xml;base64,${Buffer.from(recolored).toString(
    "base64"
  )}`;
}

export default async function Image() {
  const markSrc = await getMarkDataUri();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: OBSIDIAN,
          padding: "64px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background: `radial-gradient(circle at 12% 18%, rgba(232, 84, 29, 0.28), transparent 55%)`,
          }}
        />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={markSrc}
          width={80}
          height={80}
          alt="Ardvix"
          style={{ position: "relative" }}
        />

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              color: COPPER,
              fontFamily: "monospace",
              fontSize: 26,
              letterSpacing: 4,
              marginBottom: 28,
            }}
          >
            {"// AI AUTOMATION SYSTEMS"}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              color: PAPER,
              fontSize: 82,
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 760,
            }}
          >
            <div style={{ display: "flex" }}>Your business,</div>
            <div style={{ display: "flex" }}>on autopilot.</div>
          </div>

          <div
            style={{
              display: "flex",
              color: STEEL_MIST,
              fontSize: 28,
              lineHeight: 1.4,
              maxWidth: 640,
              marginTop: 28,
            }}
          >
            AI voice, WhatsApp, and workflow automation for real estate,
            solar, and clinics.
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
