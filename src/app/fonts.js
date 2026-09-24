import localFont from "next/font/local";

/* Montserrat, self-hosted (variable weight, SIL OFL - see fonts/OFL.txt).
   Split like Google Fonts serves it: the basic Latin file covers English, and
   a second file adds the Lithuanian and Latvian letters, downloaded only on
   pages that use them. That second file is cut down from Google's latin-ext
   set (69 KB) to exactly those 32 letters (9 KB) with fontTools:
     pyftsubset montserrat-latin-ext-wght-normal.woff2 --flavor=woff2
       --layout-features='*' --unicodes=<the unicode-range below>
   Two families sharing one font stack behave as one font. */

export const montserratLatin = localFont({
  src: "./fonts/montserrat-latin-wght-normal.woff2",
  weight: "100 900",
  display: "swap",
  // No metric fallback on this half: it would sit before the latin-ext file in
  // the stack and catch the Lithuanian/Latvian letters. The ext file's
  // fallback below covers both.
  variable: "--font-montserrat-latin",
  adjustFontFallback: false,
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD",
    },
  ],
});

export const montserratExt = localFont({
  src: "./fonts/montserrat-ltlv-wght-normal.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-montserrat-ext",
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0100-0101,U+0104-0105,U+010C-010D,U+0112-0113,U+0116-0119,U+0122-0123,U+012A-012B,U+012E-012F,U+0136-0137,U+013B-013C,U+0145-0146,U+0160-0161,U+016A-016B,U+0172-0173,U+017D-017E",
    },
  ],
});

export const fontVariables = `${montserratLatin.variable} ${montserratExt.variable}`;
