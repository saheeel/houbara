import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "./styles.css";

import ministryLogo from "../MNSTRY of ENV.png";
import externaLogo from "../externa.png";
import heroBird from "../bird images/DSC_7328-Enhanced-NR.JPG";
import dunesArt from "../for any slide.jpeg";
import featherImg from "../bird images/A1_09798.JPG";

gsap.registerPlugin(ScrollTrigger);

const GRAND_TITLE =
  "«استدامة الحبارى بين المحافظة والإنتاج والابتكار نحو منظومة متكاملة للأمن الحيوي والإكثار المستدام والتحول الرقمي»";

function FeatherDivider() {
  return (
    <svg viewBox="0 0 200 24" fill="none" aria-hidden="true">
      <path
        d="M4 12h56M140 12h56"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M100 4c-7 2-13 8-14 14 6-1 12-7 14-14Zm0 0c7 2 13 8 14 14-6-1-12-7-14-14Z"
        fill="currentColor"
        opacity="0.9"
      />
      <circle cx="76" cy="12" r="1.6" fill="currentColor" />
      <circle cx="124" cy="12" r="1.6" fill="currentColor" />
    </svg>
  );
}

/* floating golden dust, kept behind the grain layer */
function ThreeAtmosphere() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      40,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const particles = new THREE.BufferGeometry();
    const count = 520;
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 7;
      speeds[i] = Math.random() * 0.0022 + 0.0006;
    }

    particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: new THREE.Color("#d8b98a"),
      size: 0.04,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(particles, material);
    scene.add(points);

    const mouse = { x: 0, y: 0 };
    const onPointerMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    let frameId = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const pos = particles.attributes.position;
      for (let i = 0; i < count; i += 1) {
        let y = pos.getY(i) + speeds[i];
        if (y > 4.6) y = -4.6;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
      points.rotation.y += 0.0006;
      points.position.x += (mouse.x * 0.35 - points.position.x) * 0.02;
      points.position.y += (-mouse.y * 0.2 - points.position.y) * 0.02;
      renderer.render(scene, camera);
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointerMove);
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      renderer.dispose();
      particles.dispose();
      material.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="three-atmosphere" ref={mountRef} aria-hidden="true" />;
}

function Rsvp() {
  const [note, setNote] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim() || "ضيفنا الكريم";
    const status = String(data.get("status") || "");
    window.localStorage.setItem(
      "houbara-rsvp",
      JSON.stringify({ name, status, submittedAt: new Date().toISOString() })
    );
    setNote(`شكرًا ${name}، تم حفظ تأكيدكم: ${status}.`);
  }

  return (
    <section className="rsvp" id="rsvp">
      <div className="rsvp__card fade-up">
        <p className="rsvp__kicker">RSVP</p>
        <h2>تأكيد الحضور</h2>
        <p className="lead">يسعدنا استقبال تأكيدكم للمشاركة في أعمال الندوة.</p>
        <form onSubmit={handleSubmit}>
          <label>
            الاسم الكريم
            <input name="name" type="text" placeholder="اكتب الاسم هنا" autoComplete="name" />
          </label>
          <label>
            حالة المشاركة
            <select name="status" defaultValue="سأحضر بإذن الله">
              <option>سأحضر بإذن الله</option>
              <option>أعتذر عن الحضور</option>
              <option>أحتاج إلى تواصل من المنظمين</option>
            </select>
          </label>
          <button type="submit">إرسال التأكيد</button>
          <p className="rsvp__note" role="status" aria-live="polite">
            {note}
          </p>
        </form>
      </div>
    </section>
  );
}

function App() {
  const rootRef = useRef(null);
  const guest =
    new URLSearchParams(window.location.search).get("to")?.trim() || "";

  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let lenis = null;
    let tickerFn = null;
    if (!reduce) {
      lenis = new Lenis({ duration: 1.15, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      tickerFn = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(tickerFn);
      gsap.ticker.lagSmoothing(0);
    }

    if (import.meta.env.DEV) {
      window.__gsap = gsap;
      window.__ST = ScrollTrigger;
      window.__lenis = lenis;
    }

    const ctx = gsap.context(() => {
      /* entrance — plays once the fonts are ready */
      const entrance = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
      entrance
        .to(".veil", { autoAlpha: 0, duration: 0.9, ease: "power2.inOut" })
        .from(".brand img", { y: -18, autoAlpha: 0, duration: 0.7, stagger: 0.14 }, "-=0.45")
        .from(".hero__kicker", { y: 22, autoAlpha: 0, duration: 0.6 }, "-=0.4")
        .from(
          ".hero__word",
          { scale: 1.08, autoAlpha: 0, filter: "blur(16px)", duration: 1.15 },
          "-=0.35"
        )
        .from(".hero__sub", { y: 18, autoAlpha: 0, duration: 0.6 }, "-=0.55")
        .from(".scrollcue", { autoAlpha: 0, duration: 0.7 }, "-=0.3");

      const fallback = window.setTimeout(() => entrance.play(), 1600);
      document.fonts.ready.then(() => {
        window.clearTimeout(fallback);
        entrance.play();
      });

      if (reduce) {
        gsap.set(".fade-up", { clearProps: "all" });
        return;
      }

      /* reading progress */
      gsap.to(".progress span", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.4 },
      });

      /* hero — slow drift out while leaving */
      gsap.set(".hero__bg", { scale: 1.12 });
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        })
        .to(".hero__bg", { scale: 1, yPercent: 10, ease: "none" }, 0)
        .to(".hero__content", { yPercent: -40, autoAlpha: 0, ease: "none" }, 0)
        .to(".scrollcue", { autoAlpha: 0, ease: "none" }, 0)
        .to(".brand", { autoAlpha: 0, ease: "none" }, 0.1);

      /* the letter — greeting, invitation and title all reveal on one page */
      gsap
        .timeline({
          scrollTrigger: { trigger: ".letter", start: "top 60%" },
          defaults: { ease: "power3.out" },
        })
        .from(".l-dear", { y: 34, autoAlpha: 0, filter: "blur(6px)", duration: 0.5 })
        .from(
          ".l-invite",
          { y: 34, autoAlpha: 0, filter: "blur(6px)", duration: 0.5 },
          "-=0.35"
        )
        .fromTo(
          ".l-title .tw",
          { opacity: 0.12 },
          { opacity: 1, stagger: 0.03, duration: 0.18, ease: "none" },
          "-=0.15"
        )
        .from(".l-orn", { autoAlpha: 0, scale: 0.9, duration: 0.4 }, "-=0.1");

      /* details */
      gsap.from(".appreciation", {
        y: 50,
        autoAlpha: 0,
        filter: "blur(6px)",
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".appreciation", start: "top 78%" },
      });
      gsap.from(".card", {
        y: 60,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.16,
        ease: "power3.out",
        scrollTrigger: { trigger: ".cards", start: "top 80%" },
      });

      /* closing */
      gsap.fromTo(
        ".closing__bg",
        { scale: 1.15, yPercent: -6 },
        {
          scale: 1,
          yPercent: 4,
          ease: "none",
          scrollTrigger: {
            trigger: ".closing",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );
      gsap.from(".closing__content > *", {
        y: 40,
        autoAlpha: 0,
        filter: "blur(8px)",
        duration: 1.1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: { trigger: ".closing", start: "top 55%" },
      });

      /* rsvp + footer */
      gsap.from(".rsvp__card", {
        y: 70,
        autoAlpha: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".rsvp", start: "top 78%" },
      });
      gsap.from(".footer > *", {
        y: 30,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: ".footer", start: "top 92%" },
      });
    }, rootRef);

    return () => {
      ctx.revert();
      if (lenis) {
        gsap.ticker.remove(tickerFn);
        lenis.destroy();
      }
    };
  }, []);

  return (
    <div ref={rootRef}>
      <div className="veil" aria-hidden="true">
        <span>دعوة</span>
      </div>
      <div className="progress" aria-hidden="true">
        <span />
      </div>
      <div className="grain" aria-hidden="true" />
      <ThreeAtmosphere />

      {/* ١ — الافتتاح */}
      <section className="hero" id="invitation">
        <div className="hero__bg" aria-hidden="true">
          <img src={heroBird} alt="" fetchPriority="high" />
        </div>
        <div className="hero__tint" aria-hidden="true" />
        <header className="brand" aria-label="شعارات الجهات المنظمة">
          <img src={ministryLogo} alt="وزارة البيئة والتغير المناخي" />
          <img src={externaLogo} alt="مكتب محميات الدولة الخارجية" />
        </header>
        <div className="hero__content">
          <p className="hero__kicker">معرض سهيل 2026</p>
          <h1 className="hero__word">دعوة</h1>
          <p className="hero__sub">الندوة العلمية الفنية الوطنية</p>
        </div>
        <div className="scrollcue" aria-hidden="true">
          <span>اسحب للأعلى للمتابعة</span>
          <span className="scrollcue__line" />
        </div>
      </section>

      {/* ٢ — الرسالة والعنوان معًا */}
      <section className="letter" id="message">
        <div className="letter__bg" aria-hidden="true">
          <img src={dunesArt} alt="" />
        </div>
        <div className="letter__paper">
          <p className="l-dear">
            السيد/ <em>{guest || "………………………………"}</em> المحترم
          </p>
          <p className="l-invite">
            يسر مكتب محميات الدولة الخارجية بدعوتكم للمشاركة كأحد المتحدثين في
            الندوة العلمية الفنية الوطنية بعنوان:
          </p>
          <h1 className="l-title">
            {GRAND_TITLE.split(" ").map((word, index) => (
              <span className="tw" key={index}>
                {word}
              </span>
            ))}
          </h1>
          <div className="l-orn" aria-hidden="true">
            <FeatherDivider />
          </div>
        </div>
      </section>

      {/* ٣ — التقدير والتفاصيل */}
      <section className="details" id="details">
        <p className="appreciation">
          تقديرًا لخبراتكم وإسهاماتكم، وتطلعًا إلى مشاركتكم في إثراء محاور
          الندوة وتبادل الخبرات والمعارف.
        </p>
        <div className="cards">
          <article className="card">
            <span>التاريخ</span>
            <strong>9 – 10 سبتمبر 2026م</strong>
          </article>
          <article className="card">
            <span>المناسبة</span>
            <strong>على هامش معرض سهيل 2026</strong>
          </article>
          <article className="card">
            <span>المكان</span>
            <strong>المؤسسة العامة للحي الثقافي – كتارا</strong>
            <a
              className="map-btn"
              href="https://maps.app.goo.gl/Rf9tu5pXZK5iUG2K7"
              target="_blank"
              rel="noreferrer"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 21s7-6.3 7-11.5A7 7 0 1 0 5 9.5C5 14.7 12 21 12 21Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="9.3" r="2.5" stroke="currentColor" strokeWidth="1.6" />
              </svg>
              <span>الموقع على الخريطة</span>
            </a>
          </article>
        </div>
      </section>

      {/* ٥ — الختام */}
      <section className="closing">
        <div className="closing__bg" aria-hidden="true">
          <img src={featherImg} alt="" loading="lazy" />
        </div>
        <div className="closing__content">
          <p className="closing__line">
            نتشرف بمشاركتكم، ونتطلع إلى إسهامكم القيّم في إثراء أعمال الندوة.
          </p>
          <p className="closing__sig">مكتب محميات الدولة الخارجية</p>
        </div>
      </section>

      <Rsvp />

      <footer className="footer">
        <div className="footer__logos">
          <img src={ministryLogo} alt="وزارة البيئة والتغير المناخي" loading="lazy" />
          <img src={externaLogo} alt="مكتب محميات الدولة الخارجية" loading="lazy" />
        </div>
        <small>الندوة العلمية الفنية الوطنية — على هامش معرض سهيل 2026 — كتارا</small>
      </footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
