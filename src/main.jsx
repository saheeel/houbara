import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "./styles.css";

import ministryLogo from "../MNSTRY of ENV.png";
import externaLogo from "../externa.png";

import dunesArt from "../for any slide.jpeg";
import featherImg from "../bird images/A1_09798.JPG";
import EditPage from "./EditPage.jsx";

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

function FeatherCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frameCount = 357;
    const images = [];
    let currentFrame = 0;
    let animId = null;
    let lastTime = performance.now();
    const fps = 24;
    const interval = 1000 / fps;

    const drawCoverImage = (img) => {
      if (!img || !img.complete || img.naturalWidth === 0) return;
      const cW = canvas.width;
      const cH = canvas.height;
      const iW = img.naturalWidth;
      const iH = img.naturalHeight;
      const scale = Math.max(cW / iW, cH / iH);
      const x = (cW - iW * scale) / 2;
      const y = (cH - iH * scale) * 0.4;
      ctx.clearRect(0, 0, cW, cH);
      ctx.drawImage(img, x, y, iW * scale, iH * scale);
    };

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      if (images[currentFrame] && images[currentFrame].complete) {
        drawCoverImage(images[currentFrame]);
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const numStr = i.toString().padStart(3, "0");
      img.src = `/assets/feather_frames/frame_${numStr}.jpg`;
      img.onload = () => {
        if (i === 1 && currentFrame === 0) {
          drawCoverImage(img);
        }
      };
      images.push(img);
    }

    const render = (now) => {
      animId = requestAnimationFrame(render);
      const delta = now - lastTime;
      if (delta >= interval) {
        lastTime = now - (delta % interval);
        currentFrame = (currentFrame + 1) % frameCount;
        if (images[currentFrame] && images[currentFrame].complete) {
          drawCoverImage(images[currentFrame]);
        }
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        backgroundColor: "#1c110a",
      }}
    />
  );
}

function SplashScreen() {
  const splashRef = useRef(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.to(".splash-logo", { autoAlpha: 1, scale: 1, duration: 0.8, ease: "power3.out", delay: 0.15 })
        .to(".splash-logo", { autoAlpha: 0, scale: 0.95, duration: 0.5, ease: "power2.inOut", delay: 0.6 })
        .to(splashRef.current, { autoAlpha: 0, duration: 0.6, ease: "power2.inOut" }, "-=0.2");
    }, splashRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="splash-screen" ref={splashRef}>
      <svg style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }} aria-hidden="true">
        <filter id="to-nadwa-brown" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="
            0 0 0 0 0.2431
            0 0 0 0 0.1608
            0 0 0 0 0.1176
            0 0 0 1 0" />
        </filter>
      </svg>
      <img src={externaLogo} alt="مكتب محميات الدولة الخارجية" className="splash-logo" />
    </div>
  );
}

// Replace with your deployed Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzYma4IqRjs3tqukIxqjGdvL7do3OKc4lNTjKQACtrFswyyo6m0PopBEY__eTU4q7fbfA/exec";

const MAX_SEATS_PER_DAY = 50;

function Rsvp({ defaultGuest = "" }) {
  const [formData, setFormData] = useState({
    name: defaultGuest,
    phone: "",
    attendanceDate: "both", // '09/09/2026', '10/09/2026', or 'both'
    guestCount: "1",
    notes: "",
  });

  const [seatCounts, setSeatCounts] = useState({
    day1Count: 0,
    day2Count: 0,
    loading: true,
  });

  const [status, setStatus] = useState("idle"); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState("");

  const isDay1Full = seatCounts.day1Count >= MAX_SEATS_PER_DAY;
  const isDay2Full = seatCounts.day2Count >= MAX_SEATS_PER_DAY;
  const isBothFull = isDay1Full || isDay2Full;
  const isAllFull = isDay1Full && isDay2Full;

  useEffect(() => {
    if (!GOOGLE_SCRIPT_URL) {
      setSeatCounts({ day1Count: 0, day2Count: 0, loading: false });
      return;
    }

    fetch(GOOGLE_SCRIPT_URL)
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.day1Count === "number") {
          setSeatCounts({
            day1Count: data.day1Count,
            day2Count: data.day2Count,
            loading: false,
          });

          // Adjust initial selection if default 'both' is unavailable due to capacity
          if (data.day1Count >= MAX_SEATS_PER_DAY || data.day2Count >= MAX_SEATS_PER_DAY) {
            if (data.day1Count < MAX_SEATS_PER_DAY) {
              setFormData((prev) => ({ ...prev, attendanceDate: "09/09/2026" }));
            } else if (data.day2Count < MAX_SEATS_PER_DAY) {
              setFormData((prev) => ({ ...prev, attendanceDate: "10/09/2026" }));
            } else {
              setFormData((prev) => ({ ...prev, attendanceDate: "" }));
            }
          }
        } else {
          setSeatCounts((prev) => ({ ...prev, loading: false }));
        }
      })
      .catch((err) => {
        console.warn("Could not fetch seat counts:", err);
        setSeatCounts((prev) => ({ ...prev, loading: false }));
      });
  }, []);

  // Automatically switch selected date if the current choice becomes full/disabled
  useEffect(() => {
    if (isBothFull && formData.attendanceDate === "both") {
      if (!isDay1Full) {
        setFormData((prev) => ({ ...prev, attendanceDate: "09/09/2026" }));
      } else if (!isDay2Full) {
        setFormData((prev) => ({ ...prev, attendanceDate: "10/09/2026" }));
      } else {
        setFormData((prev) => ({ ...prev, attendanceDate: "" }));
      }
    } else if (isDay1Full && formData.attendanceDate === "09/09/2026") {
      if (!isDay2Full) {
        setFormData((prev) => ({ ...prev, attendanceDate: "10/09/2026" }));
      } else {
        setFormData((prev) => ({ ...prev, attendanceDate: "" }));
      }
    } else if (isDay2Full && formData.attendanceDate === "10/09/2026") {
      if (!isDay1Full) {
        setFormData((prev) => ({ ...prev, attendanceDate: "09/09/2026" }));
      } else {
        setFormData((prev) => ({ ...prev, attendanceDate: "" }));
      }
    }
  }, [isDay1Full, isDay2Full, isBothFull, formData.attendanceDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateSelect = (val) => {
    setFormData((prev) => ({ ...prev, attendanceDate: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isAllFull) {
      setErrorMessage("عذراً، اكتمل العدد لجميع أيام الندوة.");
      return;
    }
    if (
      (formData.attendanceDate === "09/09/2026" && isDay1Full) ||
      (formData.attendanceDate === "10/09/2026" && isDay2Full) ||
      (formData.attendanceDate === "both" && isBothFull)
    ) {
      setErrorMessage("عذراً، اكتمل العدد لهذا الموعد. يرجى اختيار موعد آخر.");
      return;
    }
    if (!formData.name.trim()) {
      setErrorMessage("يرجى إدخال الاسم");
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage("يرجى إدخال رقم الهاتف");
      return;
    }
    if (!formData.attendanceDate) {
      setErrorMessage("يرجى تحديد موعد الحضور المناسب");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      if (GOOGLE_SCRIPT_URL) {
        const payload = new URLSearchParams();
        payload.append("name", formData.name);
        payload.append("phone", formData.phone);
        payload.append(
          "attendanceDateFormatted",
          formData.attendanceDate === "both"
            ? "09/09/2026 & 10/09/2026 (كلا اليومين)"
            : formData.attendanceDate
        );
        const now = new Date();
        const dd = String(now.getDate()).padStart(2, "0");
        const mm = String(now.getMonth() + 1).padStart(2, "0");
        const yyyy = now.getFullYear();
        const hh = String(now.getHours()).padStart(2, "0");
        const min = String(now.getMinutes()).padStart(2, "0");
        const formattedTimestamp = `${dd}/${mm}/${yyyy} ${hh}:${min}`;

        payload.append("timestamp", formattedTimestamp);

        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: payload.toString(),
        });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      // Optimistically update local count for instant UI locking
      setSeatCounts((prev) => ({
        ...prev,
        day1Count:
          formData.attendanceDate === "09/09/2026" || formData.attendanceDate === "both"
            ? prev.day1Count + 1
            : prev.day1Count,
        day2Count:
          formData.attendanceDate === "10/09/2026" || formData.attendanceDate === "both"
            ? prev.day2Count + 1
            : prev.day2Count,
      }));

      setStatus("success");
    } catch (err) {
      console.error("RSVP Error:", err);
      setStatus("error");
      setErrorMessage("حدث خطأ أثناء إرسال التأكيد. يرجى المحاولة مرة أخرى.");
    }
  };

  const isDay1Selected = formData.attendanceDate === "09/09/2026" && !isDay1Full;
  const isDay2Selected = formData.attendanceDate === "10/09/2026" && !isDay2Full;
  const isBothSelected = formData.attendanceDate === "both" && !isBothFull;

  return (
    <section className="rsvp" id="rsvp">
      <div className="rsvp__card fade-up">
        <p className="rsvp__kicker">تأكيد الحضور</p>
        <h2>تأكيد الحضور</h2>
        <p className="lead">
          يسر مكتب محميات الدولة الخارجية دعوتكم لحضور الندوة العلمية الفنية الوطنية
        </p>

        {status === "success" ? (
          <div className="rsvp__success">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3>شكراً لكم، تم استلام تأكيد الحضور بنجاح!</h3>
            <p>نتطلع لرؤيتكم في الندوة العلمية الفنية الوطنية.</p>
            <button
              type="button"
              className="rsvp__reset-btn"
              onClick={() => setStatus("idle")}
            >
              تعديل التأكيد
            </button>
          </div>
        ) : (
          <form className="rsvp__form" onSubmit={handleSubmit}>
            <div className="rsvp__field">
              <label htmlFor="rsvp-name">الاسم *</label>
              <input
                type="text"
                id="rsvp-name"
                name="name"
                required
                disabled={isAllFull}
                placeholder="أدخل الاسم الكامل"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="rsvp__field">
              <label htmlFor="rsvp-phone">رقم الهاتف *</label>
              <input
                type="tel"
                id="rsvp-phone"
                name="phone"
                required
                disabled={isAllFull}
                placeholder="أدخل رقم الهاتف"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="rsvp__field">
              <label>
                يرجى تحديد الموعد الملائم لحضوركم *
              </label>
              <div className="rsvp__date-options">
                <button
                  type="button"
                  disabled={isDay1Full}
                  className={`rsvp__date-card ${isDay1Selected ? "selected" : ""} ${isDay1Full ? "disabled" : ""}`}
                  onClick={() => !isDay1Full && handleDateSelect("09/09/2026")}
                >
                  <div className="rsvp__radio-indicator">
                    <span className="rsvp__radio-dot" />
                  </div>
                  <div className="rsvp__date-info">
                    <span className="rsvp__date-num">09/09/2026</span>
                    <span className="rsvp__date-lbl">
                      {isDay1Full ? "اكتمل العدد" : "اليوم الأول"}
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  disabled={isDay2Full}
                  className={`rsvp__date-card ${isDay2Selected ? "selected" : ""} ${isDay2Full ? "disabled" : ""}`}
                  onClick={() => !isDay2Full && handleDateSelect("10/09/2026")}
                >
                  <div className="rsvp__radio-indicator">
                    <span className="rsvp__radio-dot" />
                  </div>
                  <div className="rsvp__date-info">
                    <span className="rsvp__date-num">10/09/2026</span>
                    <span className="rsvp__date-lbl">
                      {isDay2Full ? "اكتمل العدد" : "اليوم الثاني"}
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  disabled={isBothFull}
                  className={`rsvp__date-card rsvp__date-card--full ${isBothSelected ? "selected" : ""} ${isBothFull ? "disabled" : ""}`}
                  onClick={() => !isBothFull && handleDateSelect("both")}
                >
                  <div className="rsvp__radio-indicator">
                    <span className="rsvp__radio-dot" />
                  </div>
                  <div className="rsvp__date-info">
                    <span className="rsvp__date-num">09/09/2026 & 10/09/2026</span>
                    <span className="rsvp__date-lbl">
                      {isBothFull ? "اكتمل العدد" : "كلا اليومين"}
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {errorMessage && <p className="rsvp__error">{errorMessage}</p>}

            <div className="rsvp__actions">
              <button type="submit" disabled={status === "loading" || isAllFull}>
                {isAllFull
                  ? "اكتمل العدد"
                  : status === "loading"
                  ? "جاري الإرسال..."
                  : "تأكيد الحضور"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

function App() {
  const rootRef = useRef(null);
  const rawParam = new URLSearchParams(window.location.search).get("to")?.trim() || "";
  let guest = "";
  if (rawParam) {
    try {
      guest = decodeURIComponent(rawParam).replace(/_/g, " ");
    } catch (e) {
      guest = rawParam.replace(/_/g, " ");
    }
  }

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
        .from(".brand img", { y: -18, autoAlpha: 0, duration: 0.7, stagger: 0.14 })
        .from(".hero__kicker-wrapper", { y: 22, autoAlpha: 0, duration: 0.6 }, "-=0.4")
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

      const isMobile = window.innerWidth <= 768;
      const frameCount = isMobile ? 73 : 79; // Frames 0 to 72 (mobile), 0 to 78 (desktop)
      const currentFrame = index => isMobile 
        ? `/assets/0003/000/frame-${index.toString().padStart(6, '0')}.jpg`
        : `/assets/0001/frame-${index.toString().padStart(6, '0')}.jpg`;

      const canvas = document.getElementById("hero-canvas");
      let context = null;
      if (canvas) context = canvas.getContext("2d");

      const images = [];
      const imageSeq = { frame: 0 };

      if (canvas) {
        for (let i = 0; i < frameCount; i++) {
          const img = new Image();
          img.src = currentFrame(i);
          images.push(img);
        }

        const renderFrame = () => {
          if(images[imageSeq.frame] && images[imageSeq.frame].complete && images[imageSeq.frame].naturalHeight !== 0) {
             const img = images[imageSeq.frame];
             if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
             }
             context.clearRect(0, 0, canvas.width, canvas.height);
             context.drawImage(img, 0, 0);
          }
        };

        images[0].onload = renderFrame;

        /* hero — slow drift out while leaving */
        gsap.set(".hero__bg", { scale: 1.12 });

        let heroTl = gsap.timeline({
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top", // Natural 100vh scroll, no pinning
            scrub: 1, // Smooth scrub for the drift
          },
        });

        heroTl
          .to(".hero__bg", { scale: 1, yPercent: 10, ease: "none" }, 0)
          .to(imageSeq, {
            frame: frameCount - 1,
            ease: "none",
            onUpdate: () => {
              imageSeq.frame = Math.floor(imageSeq.frame);
              renderFrame();
            }
          }, 0)
          .to(".hero__content", { yPercent: -40, autoAlpha: 0, ease: "none" }, 0)
          .to(".scrollcue", { autoAlpha: 0, ease: "none" }, 0)
          .to(".brand", { autoAlpha: 0, ease: "none" }, 0.1)
          .to("#hero-canvas", { autoAlpha: 0, ease: "none" }, 0);
      }

      /* the letter — greeting, invitation and title all reveal on one page */
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".letter",
            start: "top 60%",
            toggleActions: "play reverse play reverse",
          },
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
        scrollTrigger: {
          trigger: ".appreciation",
          start: "top 78%",
          toggleActions: "play reverse play reverse",
        },
      });
      gsap.from(".card", {
        y: 60,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.16,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".cards",
          start: "top 80%",
          toggleActions: "play reverse play reverse",
        },
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
        scrollTrigger: {
          trigger: ".closing",
          start: "top 55%",
          toggleActions: "play reverse play reverse",
        },
      });

      /* rsvp + footer */
      gsap.from(".rsvp__card", {
        y: 70,
        autoAlpha: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".rsvp",
          start: "top 78%",
          toggleActions: "play reverse play reverse",
        },
      });
      gsap.from(".footer > *", {
        y: 30,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".footer",
          start: "top 92%",
          toggleActions: "play reverse play reverse",
        },
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
      <SplashScreen />
      <div className="progress" aria-hidden="true">
        <span />
      </div>
      <div className="grain" aria-hidden="true" />
      <ThreeAtmosphere />

      {/* ١ — الافتتاح */}
      <section className="hero" id="invitation">
        <div className="hero__bg" aria-hidden="true">
          <canvas id="hero-canvas" />
        </div>
        <div className="hero__tint" aria-hidden="true" />
        <header className="brand" aria-label="شعارات الجهات المنظمة">
          <img src={ministryLogo} alt="وزارة البيئة والتغير المناخي" />
          <img src={externaLogo} alt="مكتب محميات الدولة الخارجية" />
        </header>
        <div className="hero__content">
          <div className="hero__kicker-wrapper" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
            <span style={{ fontSize: "1.15em", color: "var(--ink-soft)" }}>سهيل</span>
            <p className="hero__kicker" style={{ margin: 0 }}>معرض كتارا الدولي للصيد والصقور</p>
          </div>
          <h1 className="hero__word">الندوة</h1>
          <p className="hero__sub">العلمية الفنية الوطنية</p>
        </div>
        <div className="scrollcue" aria-hidden="true">
          <span>اسحب للأعلى للمتابعة</span>
          <span className="scrollcue__line" />
        </div>
      </section>

      {/* ٢ — الرسالة والعنوان معًا */}
      <section className="letter" id="message">
        <div className="letter__bg" aria-hidden="true">
          <picture>
            <source media="(max-width: 600px)" srcSet="/assets/for-mobile.png" />
            <img src={dunesArt} alt="" />
          </picture>
        </div>
        <div className="letter__paper">
          <p className="l-dear">
            السيد / <em>{guest || "………………………………"}</em> المحترم
          </p>
          <p className="l-invite">
            يسر مكتب محميات الدولة الخارجية دعوتكم لحضور الندوة العلمية الفنية الوطنية بعنوان:
          </p>
          <h1 className="l-title">
            {GRAND_TITLE.split(" ").map((word, index) => (
              <span className="tw" key={index}>
                {word}
              </span>
            ))}
          </h1>
          <p className="appreciation" style={{ textAlign: "center" }}>
            والتي تهدف إلى تسليط الضوء على الجهود والممارسات الوطنية في مجال المحافظة على الحبارى وإكثارها، واستعراض أحدث التوجهات والابتكارات، وتعزيز تبادل الخبرات والمعارف بين المختصين والمهتمين.
          </p>
        </div>
      </section>

      {/* ٣ — التفاصيل */}
      <section className="details" id="details">
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
          <FeatherCanvas />
        </div>
        <div className="closing__content">
          <p className="closing__line">
            نتشرف بحضوركم، ونتطلع الى مشاركتكم في إثراء أعمال الندوة.
          </p>
        </div>
      </section>

      <Rsvp defaultGuest={guest} />

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

function Main() {
  const pathname = window.location.pathname;
  const search = window.location.search;
  const hash = window.location.hash;
  const isEdit =
    pathname === "/edit" ||
    pathname.endsWith("/edit") ||
    search.includes("edit=true") ||
    hash === "#edit";

  return isEdit ? <EditPage /> : <App />;
}

createRoot(document.getElementById("root")).render(<Main />);
