import type { Metadata } from "next";
import { ArrowUpRight, Clock3, ShieldCheck } from "lucide-react";
import { AnimatedPageHero } from "@/components/public/animated-page-hero";
import { ContactForm } from "@/components/public/contact-form";
import { I18nText } from "@/components/public/preferences";
import { SiteShell } from "@/components/public/site-shell";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contato — Joao Pedro dos Santos",
  description: "Entre em contato para conversar sobre scripts para FiveM, bots para Discord, sites e aplicações.",
};

export default async function ContactPage() {
  const settings = await getSettings();
  const socials = [["GitHub", settings.github], ["Instagram", settings.instagram], ["WhatsApp", settings.whatsapp]]
    .filter((item): item is [string, string] => Boolean(item[1]));

  return (
    <SiteShell settings={settings} compact>
      <main className="inner-page contact-page">
        <AnimatedPageHero
          eyebrow="contact.hero.eyebrow"
          lines={["contact.hero.line1", "contact.hero.line2", "contact.hero.line3"]}
          accentLine={1}
          description="contact.hero.description"
          index="04"
          actionHref="#iniciar-contato"
          actionLabel="contact.hero.action"
          variant="contact"
          translate
        />

        <section className="contact-form-section" id="iniciar-contato">
          <aside className="contact-aside">
            <p><I18nText id="contact.start" /></p>
            <h2><I18nText id="contact.title" /></h2>
            <span><I18nText id="contact.description" /></span>
            <div className="contact-assurances">
              <div><Clock3 /><span><b><I18nText id="contact.direct" /></b><I18nText id="contact.directText" /></span></div>
              <div><ShieldCheck /><span><b><I18nText id="contact.private" /></b><I18nText id="contact.privateText" /></span></div>
            </div>
            <div className="contact-socials">
              {socials.map(([label, url]) => <a key={label} href={url} target="_blank" rel="noreferrer">{label}<ArrowUpRight /></a>)}
            </div>
            <div className="contact-aside-orbit" aria-hidden="true"><span>JP</span><i /><i /></div>
          </aside>
          <ContactForm />
        </section>
      </main>
    </SiteShell>
  );
}
