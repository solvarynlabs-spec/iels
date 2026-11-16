/* =========================================================
   IELTS Pro — RÉGLAGES (à modifier par Solvarynlabs)
   ========================================================= */
const PREMIUM_CONFIG = {
  // Prix affiché sur la page Premium
  price: 5000,
  currency: "DA",
  priceNote: "one payment",

  // Compte marchand SofizPay : ton adresse PUBLIQUE (commence par G). Elle peut être publiée sans risque.
  // Ne mets JAMAIS ici une clé secrète (qui commence par S).
  sofizpayAccount: "GCBOEMS52WXFD2IC2YUJVQI74TTP3RBETE74TM6ZHGQL3R4B43RMMMKI",
  // Adresse SofizPay qui crée le paiement par carte CIB / Edahabia (d'après le kit officiel sofizpay-sdk-js).
  sofizpayEndpoint: "https://www.sofizpay.com/make-cib-transaction/",

  // (Optionnel) lien de paiement créé à la main dans ton espace SofizPay, utilisé seulement si le compte est vide.
  sofizpayLink: "",

  // Contact pour envoyer le reçu et les corrections (laisse vide si tu ne veux pas l afficher).
  // WhatsApp : numéro au format international sans + ni espaces, ex. "213XXXXXXXXX"
  whatsapp: "",
  // E-mail du professeur ou de Solvarynlabs
  email: "",

  // Empreintes SHA-256 des codes d activation (les codes eux-mêmes sont dans premium-codes-PRIVE.txt, jamais publié).
  codeHashes: []
};

/* =========================================================
   OFFRES (page de paiement après la création du compte)
   rank : 1 = test de niveau seulement, 2 = préparation de son niveau, 3 = préparation + professeur
   Change les prix ici. Les codes d'activation de chaque offre sont dans codes-PRIVES-ielts.txt
   (jamais publié) ; ici il n'y a que leurs empreintes SHA-256.
   Les codes Premium existants (codeHashes ci-dessus) activent l'offre « Prep + Teacher ».
   ========================================================= */
const PLANS = [
  { id: "level", rank: 1, name: "Know my level", price: 1500, tagline: "Just find out your IELTS band",
    features: ["Quick placement test (15 min)", "5 full timed tests: Listening, Reading, Grammar, Writing", "Band score for each skill", "Writing feedback"],
    codeHashes: [] },
  { id: "prep", rank: 2, name: "IELTS preparation", price: 4500, tagline: "Find your level, then prepare for the exam", best: true,
    features: ["Everything in Know my level", "Full course at your level: 72 corrected exercises", "Grammar, vocabulary, reading, listening, writing, speaking", "Study book for your level", "Dashboard and 7-day plan"],
    codeHashes: [] },
  { id: "premium", rank: 3, name: "Preparation + Teacher", price: 8000, tagline: "The full course with a real teacher",
    features: ["Everything in IELTS preparation", "Writing essays corrected by a teacher", "Speaking recordings assessed by a teacher", "Personal advice on what to improve"],
    codeHashes: [] }
];

/* =========================================================
   COURS EN DIRECT (vidéo, comme Zoom) — élève + professeur
   Chaque formule donne des séances. L'élève choisit un créneau, envoie la demande
   au professeur (WhatsApp / e-mail) avec le lien de la salle, puis rejoint la salle vidéo.
   Salle vidéo : Jitsi Meet (gratuit, sans installation). Le professeur se connecte
   avec son compte Google dans la salle pour l'ouvrir.
   Les codes d'activation sont dans codes-PRIVES-cours-en-direct.txt (jamais publié).
   ========================================================= */
const LIVE_CONFIG = {
  teacher: "Your IELTS teacher",
  minutes: 60,                       // durée d'une séance
  closedDays: [5],                   // 0 = dimanche … 5 = vendredi (fermé)
  slots: ["09:00", "11:00", "14:00", "17:00", "20:00"],
  roomBase: "https://meet.jit.si/"
};
const LIVE_PACKS = [
  { id: "live1", sessions: 1, name: "1 live session", price: 2000, tagline: "Try a 1-to-1 video class",
    features: ["60 min video call with a teacher", "Speaking practice and feedback", "Questions about your level"],
    codeHashes: [] },
  { id: "live4", sessions: 4, name: "Pack 4 sessions", price: 7000, tagline: "One class a week for a month", best: true,
    features: ["4 × 60 min video calls", "Speaking mock tests (Parts 1, 2, 3)", "Writing reviewed live, on screen", "Personal plan for your level"],
    codeHashes: [] },
  { id: "live8", sessions: 8, name: "Pack 8 sessions", price: 12000, tagline: "Intensive preparation before the exam",
    features: ["8 × 60 min video calls", "Full mock exam with the teacher", "Speaking and Writing every session", "Best price per session"],
    codeHashes: [] }
];

/* =========================================================
   MODE TEST DU PROPRIÉTAIRE (Solvarynlabs)
   Page secrète : #/owner. Avec le bon code PIN, tout est débloqué sur CET appareil
   (test, cours, cours en direct, professeur) sans payer. Le PIN n'est pas ici :
   seulement son empreinte SHA-256.
   ========================================================= */
const OWNER_PIN_HASH = "852929f230c61f736c1e60871b869cb130206db5f7333da3f65eba4e145d85c6";

/* =========================================================
   SERVEUR (Supabase) — comptes élève / professeur / admin, codes, cours, corrections
   La clé « publishable » est publique : elle peut être publiée sans risque.
   ========================================================= */
const SUPABASE_URL = "https://iubrwhwiogriaupvuzml.supabase.co";
const SUPABASE_KEY = "sb_publishable_ZmPt54AB6KkzKH32fcxiLQ_ybeG7L7R";

/* Abonnement des professeurs (codes TEACH-XXXX-XXXX) */
const TEACHER_PLANS = [
  { months: 1, name: "1 month", price: 3000, note: "Try it" },
  { months: 3, name: "3 months", price: 8000, note: "Most chosen", best: true },
  { months: 12, name: "12 months", price: 28000, note: "Best value" }
];
const TEACHER_FEATURES = ["Your teacher profile shown to all students", "Students book live video classes with you", "Your own timetable: days and hours", "See each student's level, band and progress", "Correct Writing and Speaking requests", "Teacher dashboard with all your classes"];

/* =========================================================
   COMPTES ÉLÈVES (Google Cloud — « Se connecter avec Google »)
   ID client OAuth créé dans console.cloud.google.com > API et services > Identifiants.
   Il est public : on peut le publier sans risque.
   Ne mets JAMAIS ici le « code secret du client » (GOCSPX-…).
   Origines JavaScript autorisées : https://solvarynlabs-spec.github.io et http://localhost:8080
   ========================================================= */
const GOOGLE_CLIENT_ID = "244682237571-eoe9ni7aobshloth5c1ss3kdlvnphtat.apps.googleusercontent.com";
