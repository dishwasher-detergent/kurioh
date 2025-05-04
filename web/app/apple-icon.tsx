import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

async function loadGoogleFont(font: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(text)}:wght@700`;
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

export default async function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 120,
          background: "hsl(340, 3%, 13%)",
          color: "hsl(0, 0%, 95%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          fontFamily: "Rubik",
        }}
      >
        K.
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Rubik",
          data: await loadGoogleFont("Rubik", "K"),
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}
