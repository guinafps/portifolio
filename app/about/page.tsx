import type { Metadata } from "next";
import { AnimatedPageHero } from "@/components/public/animated-page-hero";
import { I18nText } from "@/components/public/preferences";
import { Reveal, SectionHeading, SiteShell } from "@/components/public/site-shell";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Sobre — Joao Pedro dos Santos",
  description: "Programador freelancer com experiência em Lua para FiveM, mod menus, bots para Discord, sites e aplicações.",
};

const principles = [["about.p1.title", "about.p1.text"], ["about.p2.title", "about.p2.text"], ["about.p3.title", "about.p3.text"]];

export default async function AboutPage() {
  const settings = await getSettings();
  const portrait = settings.avatar && !settings.avatar.includes("avatars.githubusercontent.com") ? settings.avatar : "/joao-pedro.png";

  return (
    <SiteShell settings={settings} compact>
      <main className="inner-page about-page">
        <AnimatedPageHero
          eyebrow="about.hero.eyebrow"
          lines={["about.hero.line1", "about.hero.line2", "about.hero.line3"]}
          accentLine={1}
          description="about.hero.description"
          index="01"
          variant="about"
          translate
        />

        <section className="manifesto">
          <p><I18nText id="about.journey" /></p>
          <div className="about-manifesto-layout">
            <Reveal className="about-profile-card">
              <div className="about-profile-image">
                <img src={portrait} alt={`João Pedro dos Santos, programador freelancer`} />
                <span>JP / PORTRAIT 01</span>
              </div>
              <div className="about-profile-meta"><b>09.2024</b><span><I18nText id="about.started" /></span></div>
            </Reveal>
            <Reveal className="about-manifesto-copy">
              <h2><I18nText id="about.manifesto" /></h2>
              <div>
                <p><I18nText id="about.bio" /></p>
                <p><I18nText id="about.work" /></p>
              </div>
            </Reveal>
          </div>
        </section>

        <div className="about-stack-rail" aria-label="Áreas de atuação">
          <div>{["LUA / FIVEM", "DISCORD BOTS", "SITES", "APLICAÇÕES", "NODE.JS"].map((item) => <span key={item}>{item}<i /></span>)}</div>
        </div>

        <section className="principles">
          <SectionHeading index="02" kicker={<I18nText id="about.workStyle" />}><I18nText id="about.build1" /><br /><em><I18nText id="about.build2" /></em></SectionHeading>
          <div className="principles-list">
            {principles.map((item, index) => (
              <Reveal className="principle" key={item[0]}>
                <span>0{index + 1}</span>
                <h3><I18nText id={item[0]} /></h3>
                <p><I18nText id={item[1]} /></p>
                <i aria-hidden="true" />
              </Reveal>
            ))}
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
