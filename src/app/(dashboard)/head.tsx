export default function Head() {
  return (
    <>
      <title>
        On the Hill
      </title>
      <link
        rel="alternate"
        type="application/rss+xml"
        href={`${process.env.NEXT_PUBLIC_SITE_URL}/rss/feed.xml`}
      />
      <link
        rel="alternate"
        type="application/feed+json"
        href={`${process.env.NEXT_PUBLIC_SITE_URL}/rss/feed.json`}
      />
    </>
  )
}