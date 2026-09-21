import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs/config";

const nextConfig: NextConfig = {
  /* config options here */
};

export default withSentryConfig(nextConfig, {
  silent: true,
  // Sem SENTRY_AUTH_TOKEN configurado, o upload de source maps é ignorado
  // (não falha o build) — a adicionar mais tarde se quisermos stack traces
  // legíveis no Sentry em produção.
});
