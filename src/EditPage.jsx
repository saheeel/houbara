import React, { useState } from "react";
import ministryLogo from "../MNSTRY of ENV.png";
import externaLogo from "../externa.png";
import dunesArt from "../for any slide.jpeg";

const GRAND_TITLE =
  "«استدامة الحبارى بين المحافظة والإنتاج والابتكار نحو منظومة متكاملة للأمن الحيوي والإكثار المستدام والتحول الرقمي»";

function FeatherDivider() {
  return (
    <svg viewBox="0 0 200 24" fill="none" aria-hidden="true" className="feather-icon">
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

export default function EditPage() {
  const [guestName, setGuestName] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const baseUrl = window.location.origin + window.location.pathname.replace(/\/edit(?:\.html)?\/?$/, "");
  const cleanName = guestName.trim();
  const slug = cleanName.replace(/\s+/g, "_");
  const guestUrl = `${baseUrl}?to=${slug}`;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 2800);
  };

  const copyToClipboard = () => {
    if (!cleanName) {
      showToast("⚠️ يرجى كتابة اسم المدعو أولاً في البطاقة أدناه");
      return;
    }
    navigator.clipboard.writeText(guestUrl).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2200);
      showToast("✨ تم نسخ الرابط المخصص بنجاح!");
    });
  };

  return (
    <div className="luxury-edit-page">
      {/* Background grain and ambient glows */}
      <div className="grain" aria-hidden="true" />
      <div className="ambient-glow ambient-glow--top" aria-hidden="true" />
      <div className="ambient-glow ambient-glow--bottom" aria-hidden="true" />

      {/* Floating Toast */}
      {toastMessage && (
        <div className="luxury-toast">
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="edit-shell">
        {/* Luxury Header */}
        <header className="luxury-header luxury-header--centered">
          <div className="luxury-header__brand">
            <img src={ministryLogo} alt="وزارة البيئة والتغير المناخي" className="brand-logo" />
            <div className="brand-divider" aria-hidden="true" />
            <img src={externaLogo} alt="مكتب محميات الدولة الخارجية" className="brand-logo" />
          </div>
        </header>

        {/* Main Workspace Card */}
        <main className="luxury-main">
          <div className="luxury-card">
            {/* Card Ribbon / Title */}
            <div className="luxury-card__top">
              <div className="card-ornament">
                <FeatherDivider />
              </div>
              <h2 className="card-heading">توليد بطاقة ومستند دعوة شخصية</h2>
              <p className="card-subheading">
                اكتب اسم المدعو لتحديث البطاقة فورًا وتوليد رابطها الخاص.
              </p>
            </div>

            {/* The Live Interactive Invitation Paper */}
            <div className="invitation-paper-frame">
              <div className="invitation-paper">
                <div className="paper-bg">
                  <img src={dunesArt} alt="" />
                </div>

                <div className="paper-inner-border" aria-hidden="true" />

                <div className="paper-body">
                  {/* Greeting Line with Seamless Inline Input */}
                  <div className="paper-greeting">
                    <div className="input-wrapper">
                      <input
                        type="text"
                        className="luxury-name-input"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="اسم المدعو..."
                      />
                      <span className="input-gold-line" aria-hidden="true" />
                    </div>
                    <span className="muhtaram-label">المحترم</span>
                  </div>

                  <p className="paper-invitation-text">
                    يسر مكتب محميات الدولة الخارجية دعوتكم لحضور الندوة العلمية الفنية الوطنية بعنوان:
                  </p>

                  <div className="paper-grand-title">
                    {GRAND_TITLE}
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic URL Output Box */}
            <div className={`generated-link-card ${cleanName ? "is-active" : ""}`}>
              <div className="link-card-header">
                <span className="link-icon">🔗</span>
                <span className="link-label">الرابط الخاص المولد للمستلم:</span>
              </div>
              <div className="link-card-body">
                <input
                  type="text"
                  readOnly
                  value={cleanName ? guestUrl : "سيتم توليد الرابط فور كتابة الاسم أعلاه..."}
                  className="link-card-input"
                  onClick={(e) => e.target.select()}
                />
              </div>
            </div>

            {/* Main Action Bar */}
            <div className="luxury-actions-bar">
              <button
                className={`luxury-btn-primary ${isCopied ? "is-copied" : ""}`}
                onClick={copyToClipboard}
              >
                <span className="btn-icon-symbol">{isCopied ? "✓" : "📋"}</span>
                <span>{isCopied ? "تم نسخ الرابط بنجاح!" : "نسخ رابط الدعوة لهذا الشخص"}</span>
              </button>

              {cleanName && (
                <a
                  className="luxury-btn-secondary"
                  href={guestUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>فتح بطاقة المستلم في تبويب جديد</span>
                </a>
              )}
            </div>
          </div>

          {/* Quick Guide Card */}
          <div className="luxury-guide-card">
            <div className="guide-item">
              <span className="guide-num">١</span>
              <p>اكتب اسم المدعو (مثل: <em>سعادة الشيخ محمد آل ثاني</em>) في الخانة المخصصة.</p>
            </div>
            <div className="guide-divider" aria-hidden="true" />
            <div className="guide-item">
              <span className="guide-num">٢</span>
              <p>انقر على زر <strong>نسخ رابط الدعوة</strong> لإرساله مباشرة للمستلم عبر الواتساب أو البريد.</p>
            </div>
            <div className="guide-divider" aria-hidden="true" />
            <div className="guide-item">
              <span className="guide-num">٣</span>
              <p>عند فتح الشخص للرابط، ستظهر الدعوة باسمه الكامل وبشكل مخصص راقٍ.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
