/** Snippets GA4 / Search Console para el HTML estático del blog. */

export function gaMeasurementId(): string {
  return (process.env.GA_MEASUREMENT_ID ?? process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "").trim();
}

export function googleSiteVerification(): string {
  return (
    process.env.GOOGLE_SITE_VERIFICATION ??
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ??
    ""
  ).trim();
}

/** Bloques <script>/<meta> para <head> del blog. Vacío si no hay IDs. */
export function analyticsHeadSnippets(): string {
  const ga = gaMeasurementId();
  const verify = googleSiteVerification();
  const parts: string[] = [];

  if (verify) {
    parts.push(
      `    <meta name="google-site-verification" content="${verify.replace(/"/g, "")}" />`,
    );
  }

  if (ga) {
    parts.push(`    <script async src="https://www.googletagmanager.com/gtag/js?id=${ga}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${ga}', { anonymize_ip: true });
    </script>`);
  }

  return parts.length ? parts.join("\n") + "\n" : "";
}
