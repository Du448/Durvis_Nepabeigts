import localFont from "next/font/local";

/* Poppins, self-hosted (SIL OFL - see fonts/OFL.txt). Poppins ships as static
   weights rather than a variable font, so unlike the previous Montserrat setup
   each weight is its own file - only the four weights actually used on the
   site (400/500/600/700) are shipped.
   Split like Google Fonts serves it: the basic Latin file covers English, and
   a second file adds the Lithuanian and Latvian letters, downloaded only on
   pages that use them. That second file is cut down from Google's latin-ext
   set to exactly those 32 letters with fontTools:
     pyftsubset poppins-ext-<weight>.woff2 --flavor=woff2
       --layout-features='*' --unicodes=<the unicode-range below>
   Two families sharing one font stack behave as one font. */

export const poppinsLatin = localFont({
  src: [
    { path: "./fonts/poppins-latin-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/poppins-latin-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/poppins-latin-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/poppins-latin-700.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  // No metric fallback on this half: it would sit before the latin-ext file in
  // the stack and catch the Lithuanian/Latvian letters. The ext file's
  // fallback below covers both.
  variable: "--font-poppins-latin",
  adjustFontFallback: false,
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD",
    },
  ],
});

export const poppinsExt = localFont({
  src: [
    { path: "./fonts/poppins-ltlv-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/poppins-ltlv-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/poppins-ltlv-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/poppins-ltlv-700.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-poppins-ext",
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0100-0101,U+0104-0105,U+010C-010D,U+0112-0113,U+0116-0119,U+0122-0123,U+012A-012B,U+012E-012F,U+0136-0137,U+013B-013C,U+0145-0146,U+0160-0161,U+016A-016B,U+0172-0173,U+017D-017E",
    },
  ],
});

/* Poppins has no Cyrillic, so the Russian pages take their Cyrillic letters
   from Montserrat (SIL OFL), the site's previous font - geometric like
   Poppins - cut down from public/fonts/Montserrat-*.ttf to Russian Cyrillic:
     pyftsubset Montserrat-<Regular|Bold>.ttf --flavor=woff2
       --layout-features='*' --unicodes=<the unicode-range below>
   Only 400 and 700 exist; 500/600 text uses the nearer of the two. It sits
   before the ext file in the stack: that file's metric fallback is a local
   Arial, which would otherwise catch the Cyrillic letters first. */
export const montserratCyrillic = localFont({
  src: [
    { path: "./fonts/montserrat-cyrillic-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/montserrat-cyrillic-700.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-montserrat-cyrillic",
  adjustFontFallback: false,
  declarations: [
    {
      prop: "unicode-range",
      value: "U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116",
    },
  ],
});

export const fontVariables = `${poppinsLatin.variable} ${montserratCyrillic.variable} ${poppinsExt.variable}`;
