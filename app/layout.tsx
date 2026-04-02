import type { Metadata } from "next";
import { Orbitron, IBM_Plex_Mono, Exo_2 } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const orbitron = Orbitron({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const exo2 = Exo_2({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
});

export const metadata: Metadata = {
  title: "talkies.exe",
  description: "Log films, share reviews, and connect with communities",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#00A3FF", // Electric Blue
          colorBackground: "#020204",
          colorInputBackground: "#204829",
          colorInputText: "#92e5a1",
          colorText: "#92e5a1",
          colorTextSecondary: "#80ce87",
          colorTextOnPrimaryBackground: "#020204",
          colorNeutral: "#22b455",
          colorDanger: "#FFD700", // Gold for warnings/importance
          colorSuccess: "#22b455",
          colorWarning: "#FFD700", // Gold
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "13px",
          borderRadius: "0px",
          spacingUnit: "18px",
        },

        elements: {
          /* ── outer overlay ── */
          modalBackdrop: "backdrop-blur-sm bg-[rgba(4,5,14,0.85)]",

          /* ── modal card ── */
          card: [
            "!bg-[#000500]",
            "border border-[rgba(0,255,65,0.2)]",
            "shadow-[0_0_60px_rgba(0,255,65,0.07),0_0_0_1px_rgba(0,255,65,0.1)]",
            "rounded-none",
          ].join(" "),
          cardBox: "shadow-none rounded-none !bg-[#000500]",
          scrollBox: "!bg-[#000500]",

          /* ── header ── */
          headerTitle: [
            "!text-[#00FF41]",
            "font-bold tracking-[0.25em] uppercase",
            "text-base",
          ].join(" "),
          headerSubtitle: [
            "!text-[rgba(34,180,85,0.6)]",
            "text-[10px] tracking-[0.3em] uppercase",
          ].join(" "),

          /* ── close button ── */
          modalCloseButton: [
            "!text-[rgba(0,255,65,0.35)]",
            "hover:!text-[#00FF41]",
            "transition-colors duration-200",
            "!rounded-none",
          ].join(" "),

          /* ── social OAuth buttons ── */
          socialButtonsBlockButton: [
            "!bg-[#051005]",
            "!border !border-[rgba(0,255,65,0.15)]",
            "hover:!bg-[rgba(0,255,65,0.06)]",
            "hover:!border-[rgba(0,255,65,0.4)]",
            "!rounded-none",
            "transition-all duration-200",
            "!shadow-none",
          ].join(" "),
          socialButtonsBlockButtonText: [
            "!text-[#00FF41]",
            "text-[11px] tracking-[0.2em] font-black",
          ].join(" "),
          providerIcon__discord: "opacity-60 grayscale",
          providerIcon__google: "opacity-60 grayscale",

          /* ── divider ── */
          dividerLine: "!bg-[rgba(0,255,65,0.1)]",
          dividerText: [
            "!text-[rgba(0,255,65,0.28)]",
            "text-[10px] tracking-[0.35em] uppercase",
          ].join(" "),

          /* ── form labels ── */
          formFieldLabel: [
            "!text-[#22b455]",
            "text-[9px] font-bold tracking-[0.3em] uppercase",
          ].join(" "),

          /* ── inputs ── */
          formFieldInput: [
            "!bg-[#051005]",
            "!border !border-[rgba(0,163,255,0.4)]",
            "!text-[#00FF41]",
            "placeholder:!text-[rgba(0,255,100,0.25)]",
            "focus:!border-[#0070FF]",
            "focus:!ring-0",
            "focus:!shadow-[0_0_12px_rgba(0,255,65,0.15)]",
            "!rounded-none",
            "transition-all duration-200",
          ].join(" "),
          formFieldInputShowPasswordButton: [
            "!text-[rgba(0,194,255,0.35)]",
            "hover:!text-[#00FF41]",
          ].join(" "),
          formFieldInputGroup: "!rounded-none",

          /* ── hint / error text ── */
          formFieldHintText: "!text-[rgba(0,255,255,0.4)] text-[10px] tracking-wide font-medium",
          formFieldErrorText: "!text-[#00FF41] text-[10px] tracking-wide font-bold",

          /* ── primary CTA ── */
          formButtonPrimary: [
            "!bg-[#0070FF] !text-white",
            "hover:!bg-[#00A3FF]",
            "hover:shadow-[0_0_24px_rgba(0,163,255,0.4)]",
            "font-black uppercase tracking-[0.35em] text-[11px]",
            "!rounded-none !shadow-none !border-0",
            "transition-all duration-300",
          ].join(" "),

          /* ── secondary / ghost buttons ── */
          formButtonReset: [
            "!text-[rgba(0,255,65,0.45)]",
            "hover:!text-[#00FF41]",
            "text-[11px] tracking-[0.2em]",
            "transition-colors",
          ].join(" "),

          /* ── footer ── */
          footer: [
            "!border-t !border-[rgba(0,255,65,0.08)]",
            "!bg-[#051005]",
          ].join(" "),
          footerActionText: [
            "!text-[#80ce87]",
            "text-[11px] tracking-wide font-bold",
          ].join(" "),
          footerActionLink: [
            "!text-[#00FF41]",
            "hover:!text-[rgba(0,255,65,0.65)]",
            "font-bold tracking-wider transition-colors",
          ].join(" "),
          footerPages: "opacity-50",
          footerPagesLink: "!text-[rgba(0,255,65,0.2)] hover:!text-[rgba(0,255,65,0.45)] transition-colors",

          /* ── internal nav tabs ── */
          navbar: "!border-b !border-[rgba(0,255,65,0.1)] !bg-[#000500]",
          navbarButton: [
            "!text-[rgba(0,255,65,0.38)]",
            "hover:!text-[#00FF41]",
            "text-[10px] tracking-[0.25em] uppercase",
            "transition-colors !rounded-none",
          ].join(" "),

          /* ── OTP / code inputs ── */
          otpCodeFieldInput: [
            "!border !border-[rgba(0,255,65,0.2)]",
            "!bg-[#051005]",
            "!text-[#00FF41]",
            "focus:!border-[#00FF41]",
            "focus:!shadow-[0_0_10px_rgba(0,255,65,0.15)]",
            "!rounded-none",
            "text-lg tracking-widest",
          ].join(" "),

          /* ── alerts / banners ── */
          alert: [
            "!border !border-[rgba(0,255,65,0.28)]",
            "!bg-[rgba(0,255,65,0.05)]",
            "!rounded-none",
          ].join(" "),
          alertText: "!text-[rgba(0,255,65,0.85)] text-[11px] tracking-wide",
          alertIcon: "!text-[rgba(0,255,65,0.7)]",

          /* ── identity preview ── */
          identityPreviewText: "!text-[#00FF41] text-[11px] tracking-wide font-bold",
          identityPreviewEditButton: [
            "!text-[#00FF41] hover:!text-[rgba(0,255,65,0.65)]",
            "text-[11px] transition-colors font-bold uppercase",
          ].join(" "),

          /* ── user button popover ── */
          userButtonAvatarBox: "!border !border-[rgba(0,255,65,0.25)] !rounded-none",
          userButtonPopoverCard: [
            "!bg-[#000500]",
            "!border !border-[rgba(0,255,65,0.2)]",
            "!rounded-none",
            "shadow-[0_0_40px_rgba(0,255,65,0.08)]",
          ].join(" "),
          userButtonPopoverActionButton: [
            "hover:!bg-[rgba(0,255,65,0.05)]",
            "!rounded-none transition-colors",
          ].join(" "),
          userButtonPopoverActionButtonText: "!text-[#00FF41] text-[11px] tracking-wide font-bold",
          userButtonPopoverActionButtonIcon: "!text-[#00FF41]",
          userButtonPopoverFooter: "!border-t !border-[rgba(0,255,65,0.08)] !bg-[#000500]",

          /* ── badge ── */
          badge: [
            "!bg-[rgba(0,255,65,0.15)]",
            "!border !border-[rgba(0,255,65,0.3)]",
            "!text-[#00FF41]",
            "!rounded-none",
            "text-[9px] tracking-[0.25em] uppercase font-bold",
          ].join(" "),
        },
      }}
    >
      <html
        lang="en"
        className={`${orbitron.variable} ${ibmPlexMono.variable} ${exo2.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col bg-[#05060e] text-[rgba(210,220,255,0.9)]">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}