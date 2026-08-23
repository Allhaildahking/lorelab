import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "LORELAB",
  description: "Find the story. Cook the story.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
