import { company } from "@/lib/site";

const controller = `${company.legalName}, ${company.code}, ${company.address}, ${company.email}`;

export const privacyUpdated = "2026-09-24";

export const privacy = {
  lt: [
    {
      h: "1. Duomenų valdytojas",
      p: [`Jūsų asmens duomenis tvarko ${controller}. Visais duomenų apsaugos klausimais kreipkitės el. paštu ${company.email}.`],
    },
    {
      h: "2. Kokius duomenis renkame",
      p: [
        "Kontaktų formoje: vardą, telefono numerį, el. pašto adresą, žinutės tekstą ir jūsų pridėtus failus.",
        "Partnerystės formoje: įmonės pavadinimą, kontaktinį asmenį, telefoną, el. paštą, miestą, svetainę, veiklos sritį ir komentarą.",
      ],
    },
    {
      h: "3. Tikslai ir teisinis pagrindas",
      p: [
        "Duomenis naudojame tik atsakyti į jūsų užklausą, parengti pasiūlymą ir, jei susitariame, vykdyti sutartį. Teisinis pagrindas - jūsų sutikimas (BDAR 6 str. 1 d. a p.) ir veiksmai prieš sudarant sutartį (BDAR 6 str. 1 d. b p.).",
      ],
    },
    {
      h: "4. Saugojimo laikas",
      p: ["Duomenis saugome ne ilgiau, nei būtina užklausai išnagrinėti ir sutarčiai vykdyti, arba tiek, kiek reikalauja teisės aktai (pvz., apskaitos dokumentams)."],
    },
    {
      h: "5. Duomenų gavėjai",
      p: ["Duomenų neparduodame. Juos gali tvarkyti tik mūsų paslaugų teikėjai: svetainės talpinimo ir el. pašto paslaugų teikėjai, kurie veikia pagal mūsų nurodymus."],
    },
    {
      h: "6. Jūsų teisės",
      p: [
        "Turite teisę susipažinti su savo duomenimis, juos ištaisyti, ištrinti, apriboti jų tvarkymą, nesutikti su tvarkymu, gauti duomenis perkeliamu formatu ir bet kada atšaukti sutikimą.",
        "Jei manote, kad jūsų teisės pažeistos, galite pateikti skundą Valstybinei duomenų apsaugos inspekcijai (vdai.lrv.lt).",
      ],
    },
    {
      h: "7. Slapukai ir naršyklės saugykla",
      p: [
        "Svetainė nenaudoja analitikos ar reklamos slapukų. Jūsų naršyklėje saugomi tik būtini duomenys: pageidavimų sąrašas ir jūsų slapukų pasirinkimas.",
        "Google Maps žemėlapis kontaktų puslapyje įkeliamas tik jums sutikus. Tuomet Google LLC gali įrašyti savo slapukus pagal savo privatumo politiką. Svetainės šriftai įkeliami iš Google Fonts.",
        "Savo pasirinkimą galite bet kada pakeisti per nuorodą „Slapukų nustatymai“ svetainės apačioje.",
      ],
    },
  ],
  lv: [
    {
      h: "1. Datu pārzinis",
      p: [`Jūsu personas datus apstrādā ${controller}. Visos datu aizsardzības jautājumos rakstiet uz ${company.email}.`],
    },
    {
      h: "2. Kādus datus mēs vācam",
      p: [
        "Kontaktu formā: vārdu, tālruņa numuru, e-pasta adresi, ziņas tekstu un jūsu pievienotos failus.",
        "Sadarbības formā: uzņēmuma nosaukumu, kontaktpersonu, tālruni, e-pastu, pilsētu, vietni, darbības jomu un komentāru.",
      ],
    },
    {
      h: "3. Mērķi un tiesiskais pamats",
      p: [
        "Datus izmantojam tikai, lai atbildētu uz jūsu pieprasījumu, sagatavotu piedāvājumu un, ja vienojamies, izpildītu līgumu. Tiesiskais pamats - jūsu piekrišana (VDAR 6. panta 1. punkta a) apakšpunkts) un darbības pirms līguma noslēgšanas (b) apakšpunkts).",
      ],
    },
    {
      h: "4. Glabāšanas ilgums",
      p: ["Datus glabājam ne ilgāk, kā nepieciešams pieprasījuma izskatīšanai un līguma izpildei, vai tik ilgi, cik to prasa normatīvie akti."],
    },
    {
      h: "5. Datu saņēmēji",
      p: ["Datus nepārdodam. Tos var apstrādāt tikai mūsu pakalpojumu sniedzēji - vietnes mitināšanas un e-pasta pakalpojumu sniedzēji, kas rīkojas pēc mūsu norādījumiem."],
    },
    {
      h: "6. Jūsu tiesības",
      p: [
        "Jums ir tiesības piekļūt saviem datiem, tos labot, dzēst, ierobežot apstrādi, iebilst pret apstrādi, saņemt datus pārnesamā formātā un jebkurā laikā atsaukt piekrišanu.",
        "Ja uzskatāt, ka jūsu tiesības ir pārkāptas, varat iesniegt sūdzību Lietuvas Valsts datu aizsardzības inspekcijai (vdai.lrv.lt).",
      ],
    },
    {
      h: "7. Sīkdatnes un pārlūka krātuve",
      p: [
        "Vietne neizmanto analītikas vai reklāmas sīkdatnes. Jūsu pārlūkā tiek glabāti tikai nepieciešamie dati: vēlmju saraksts un jūsu sīkdatņu izvēle.",
        "Google Maps karte kontaktu lapā tiek ielādēta tikai ar jūsu piekrišanu. Tad Google LLC var saglabāt savas sīkdatnes saskaņā ar savu privātuma politiku. Vietnes fonti tiek ielādēti no Google Fonts.",
        "Savu izvēli varat jebkurā laikā mainīt, izmantojot saiti “Sīkdatņu iestatījumi” vietnes apakšā.",
      ],
    },
  ],
  en: [
    {
      h: "1. Data controller",
      p: [`Your personal data is processed by ${controller}. For any data protection question, email ${company.email}.`],
    },
    {
      h: "2. What we collect",
      p: [
        "Contact form: your name, phone number, email address, message and any files you attach.",
        "Partner form: company name, contact person, phone, email, city, website, line of business and comment.",
      ],
    },
    {
      h: "3. Purposes and legal basis",
      p: [
        "We use the data only to answer your enquiry, prepare a quote and, if we agree, perform the contract. The legal basis is your consent (GDPR Art. 6(1)(a)) and steps prior to entering a contract (Art. 6(1)(b)).",
      ],
    },
    {
      h: "4. Retention",
      p: ["We keep data no longer than needed to handle your enquiry and perform the contract, or as long as the law requires."],
    },
    {
      h: "5. Recipients",
      p: ["We do not sell your data. It may be processed only by our service providers - website hosting and email providers acting on our instructions."],
    },
    {
      h: "6. Your rights",
      p: [
        "You have the right to access, rectify and erase your data, restrict or object to processing, receive it in a portable format and withdraw consent at any time.",
        "If you believe your rights have been breached, you can lodge a complaint with the Lithuanian State Data Protection Inspectorate (vdai.lrv.lt).",
      ],
    },
    {
      h: "7. Cookies and browser storage",
      p: [
        "The website uses no analytics or advertising cookies. Only necessary data is stored in your browser: your wishlist and your cookie choice.",
        "The Google Maps map on the contacts page loads only with your consent, after which Google LLC may set its own cookies under its privacy policy. Website fonts are loaded from Google Fonts.",
        "You can change your choice at any time via the “Cookie settings” link at the bottom of the site.",
      ],
    },
  ],
};
