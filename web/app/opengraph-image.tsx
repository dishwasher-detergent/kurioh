import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "KURIOH - Curate your portfolio without the hassle";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

async function loadGoogleFont(font: string) {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@700`;
  const css = await (await fetch(url)).text();
  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/,
  );

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status == 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error("failed to load font data");
}

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "hsl(340, 3%, 13%)",
          color: "hsl(0, 0%, 95%)",
          fontFamily: "Rubik",
          padding: "40px",
        }}
      >
        <h1
          style={{
            fontSize: "160px",
            margin: "0 0 40px 0",
            fontWeight: "bold",
          }}
        >
          KURIOH.
        </h1>
        <p
          style={{
            fontSize: "32px",
            textAlign: "center",
            fontFamily: "ibmPlexMono",
          }}
        >
          Curate your portfolio without the hassle
        </p>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Rubik",
          data: await loadGoogleFont("Rubik"),
          style: "normal",
          weight: 700,
        },
        {
          name: "ibmPlexMono",
          data: await loadGoogleFont("IBM Plex Mono"),
          style: "normal",
        },
      ],
    },
  );
}
