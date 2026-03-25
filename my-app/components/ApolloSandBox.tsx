"use client";

import Script from "next/script";

type EmbeddedSandboxConstructor = new (opts: {
  target: string;
  initialEndpoint: string;
}) => unknown;

export default function ApolloSandboxEmbed() {
  const initSandbox = () => {
    const EmbeddedSandbox = (window as Window & {
      EmbeddedSandbox?: EmbeddedSandboxConstructor;
    }).EmbeddedSandbox;

    if (EmbeddedSandbox) {
      new EmbeddedSandbox({
        target: "#embedded-sandbox",
        initialEndpoint: "http://localhost:8080/graphql",
      });
    }
  };

  return (
    <div className="w-screen h-screen">
      {/* Load script properly */}
      <Script
        src="https://embeddable-sandbox.cdn.apollographql.com/v2/embeddable-sandbox.umd.production.min.js"
        strategy="afterInteractive"
        onLoad={initSandbox}
      />

      <div id="embedded-sandbox" className="w-full h-full"></div>
    </div>
  );
}
