// Ražotājs-2 reference catalogue: door design series, film colours and the
// powder-coating palette from the Chernihiv factory "Bulat" (bulat-doors.com.ua).
// Structure mirrors src/data/finishes.js. Photos are the manufacturer's own
// catalogue photography; labels/leads are written in-house rather than
// translated verbatim from the source pages.

const B100 = "https://www.bulat-doors.com.ua/wp-content/uploads/2023/08/";
const B2511 = "https://www.bulat-doors.com.ua/wp-content/uploads/2025/11/";
const B0909 = "https://www.bulat-doors.com.ua/wp-content/uploads/2023/09/";

// ImageKit-hosted copies of the design-series photos (our own CDN, no longer
// pulled live from the manufacturer's site). One folder per series.
const IK = "https://ik.imagekit.io/vbvwdejj5/NTdurys-HOMEPAGE/series_doors/";
const IK100 = `${IK}series100%20without/`;
const IK200 = `${IK}series200without/`;
const IK400 = `${IK}series400without/`;
const IK500 = `${IK}series500without/`;
const IK600 = `${IK}series600without/`;
const IK800 = `${IK}series800without/`;
const IK900 = `${IK}series900without/`;
const IKSTREET = `${IK}streetwithout/`;

function series(prefix, entries) {
  return entries.map(([label, file, base]) => ({
    label,
    image: `${base || prefix}${file}`,
  }));
}

export const manufacturer2Sections = [
  {
    key: "dizains",
    title: "Durvju dizaina sērijas",
    lead: "Durvju vērtņu frēzējumu katalogs - vairāk nekā 200 modeļu, sagrupēti sērijās pēc frēzējuma dziļuma un stila. Katru zīmējumu var izgatavot jebkuram durvju modelim un kombinēt ar jebkuru pārklājuma krāsu no zemāk redzamajām paletēm.",
    groups: [
      {
        title: "100. sērija",
        included: true,
        items: series(IK100, [
          ["105", "105.jpg"], ["111", "111.jpg"], ["112", "112.jpg"],
          ["117", "117.jpg"], ["122", "122.jpg"], ["131", "131.jpg"],
          ["154", "154.jpg"], ["155", "155.jpg"], ["156", "156.jpg"],
          ["157", "157.jpg"], ["158", "158.jpg"], ["159", "159.jpg"],
          ["160", "160.jpg"], ["163", "163.jpg"], ["164", "164.jpg"],
          ["165", "165.jpg"], ["166", "166.jpg"], ["167", "167.jpg"],
          ["168", "168.jpg"], ["169", "169.jpg"], ["170", "170.jpg"],
          ["171", "171.jpg"], ["172", "172.jpg"], ["173", "173.jpg"],
          ["176", "176.jpg"], ["177", "177.jpg"], ["178", "178.jpg"],
          ["184", "184.jpg"], ["185", "185.jpg"], ["186", "186.jpg"],
          ["187", "187.jpg"], ["188", "188.jpg"], ["189", "189.jpg"],
          ["190", "190.jpg"], ["191", "191.jpg"], ["192", "192.jpg"],
          ["193", "193.jpg"], ["194", "194.jpg"], ["195", "195.jpg"],
          ["196", "196.jpg"], ["197", "197.jpg"], ["198", "198.jpg"],
          ["199", "199.jpg"],
        ]).concat([
          { label: "Gluda (bez frēzējuma)", image: `${IK100}gladka.jpg` },
          { label: "Individuāli pēc pasūtījuma", image: `${IK100}Individually.jpg` },
        ]),
      },
      {
        title: "200. sērija",
        included: true,
        items: series(IK200, [
          ["201", "201.jpg"], ["204", "204.jpg"], ["215", "215.jpg"],
          ["216", "216.jpg"], ["218", "218.jpg"], ["219", "219.jpg"],
          ["220", "220.jpg"], ["221", "221.jpg"], ["222", "222.jpg"],
          ["223", "223(2).jpg"], ["225", "225.jpg"], ["226", "226.jpg"],
          ["227", "227.jpg"], ["228", "228.jpg"], ["229", "229.jpg"],
          ["230", "230(2).jpg"], ["231", "231.jpg"], ["232", "232.jpg"],
          ["233", "233.jpg"], ["234", "234.jpg"], ["235", "235.jpg"],
          ["236", "236.jpg"], ["237", "237.jpg"], ["238", "238.jpg"],
          ["245", "245.jpg"], ["248", "248.jpg"], ["249", "249(2).jpg"],
          ["250", "250.jpg"], ["251", "251.jpg"], ["252", "252.jpg"],
          ["253", "253.jpg"], ["254", "254.jpg"], ["255", "255.jpg"],
          ["256", "256.jpg"], ["257", "257.jpg"], ["258", "258-2.jpg"],
          ["259", "259.jpg"], ["260", "260-2.jpg"], ["261", "261.jpg"],
          ["262", "262.jpg"], ["263", "263.jpg"], ["264", "264.jpg"],
          ["265", "265.jpg"], ["266", "266.jpg"], ["267", "267.jpg"],
          ["268", "268.jpg"], ["269", "269.jpg"], ["271", "271.jpg"],
          ["272", "272.jpg"], ["273", "273.jpg"], ["274", "274.jpg"],
          ["275", "275.jpg"], ["276", "276.jpg"], ["277", "277.jpg"],
        ]),
      },
      {
        title: "400. sērija",
        surchargeOptionId: "series-400-inlay",
        items: series(IK400, [
          ["412", "412.jpg"], ["418", "418.jpg"], ["420", "420.jpg"],
          ["423", "423.jpg"], ["424", "424.jpg"], ["425", "425.jpg"],
          ["426", "426.jpg"], ["427", "427.jpg"], ["428", "428.jpg"],
          ["429", "429.jpg"], ["431", "431.jpg"], ["432", "432.jpg"],
          ["433", "433.jpg"], ["434", "434.jpg"],
        ]),
      },
      {
        title: "500. sērija",
        surchargeOptionId: "series-500-molding",
        items: series(IK500, [
          ["508", "508.jpg"], ["513", "513.jpg"], ["514", "514.jpg"],
          ["515", "515.jpg"], ["516", "516.jpg"], ["517", "517.jpg"],
          ["518", "518.jpg"], ["519", "519.jpg"], ["520", "520.jpg"],
          ["521", "521.jpg"], ["522", "522.jpg"], ["523", "523.jpg"],
          ["524", "524.jpg"], ["525", "525.jpg"], ["526", "526.jpg"],
          ["527", "527.jpg"], ["528", "528.jpg"], ["529", "529.jpg"],
          ["531", "531.jpg"], ["532", "532.jpg"], ["533", "533.jpg"],
          ["534", "534.jpg"], ["535", "535.jpg"], ["536", "536.jpg"],
          ["537", "537.jpg"], ["538", "538.jpg"], ["539", "539.jpg"],
          ["540", "540.jpg"], ["541", "541.jpg"], ["542", "542.jpg"],
          ["543", "543.jpg"], ["544", "544.jpg"], ["545", "545.jpg"],
          ["546", "546.jpg"], ["547", "547.jpg"], ["548", "548.jpg"],
          ["549", "549.jpg"], ["550", "550.jpg"], ["551", "551.jpg"],
          ["552", "552.jpg"], ["553", "553.jpg"], ["554", "554.jpg"],
          ["555", "555.jpg"], ["556", "556.jpg"], ["557", "557.jpg"],
          ["558", "558.jpg"], ["559", "559.jpg"], ["560", "560.jpg"],
          ["561", "561.jpg"], ["562", "562.jpg"], ["563", "563.jpg"],
          ["564", "564.jpg"], ["565", "565.jpg"], ["566", "566.jpg"],
          ["567", "567.jpg"], ["568", "568.jpg"], ["569", "569.jpg"],
          ["570", "570-2.jpg"], ["571", "571.jpg"], ["572", "572.jpg"],
          ["573", "573.jpg"], ["574", "574.jpg"], ["575", "575.jpg"],
          ["576", "576.jpg"], ["577", "577.jpg"], ["578", "578.jpg"],
          ["579", "579.jpg"], ["580", "580.jpg"], ["581", "581.jpg"],
          ["582", "582.jpg"], ["583", "583.jpg"], ["584", "584.jpg"],
          ["585", "585.jpg"], ["586", "586.jpg"], ["587", "587.jpg"],
          ["588", "588.jpg"], ["589", "589.jpg"], ["590", "590.jpg"],
          ["591", "591.jpg"], ["592", "592.jpg"], ["593", "593.jpg"],
          ["594", "594.jpg"], ["595", "595.jpg"], ["596", "596.jpg"],
        ]),
      },
      {
        title: "600. sērija",
        surchargeOptionId: "series-600-mirror",
        items: [
          { label: "604 tonēts", image: `${IK600}604%20tinted%20mirror.jpg` },
          { label: "605", image: `${IK600}605.jpg` },
          { label: "606", image: `${IK600}606.jpg` },
          { label: "607", image: `${IK600}607.jpg` },
          { label: "607 tonēts", image: `${IK600}607%20tinted%20mirror.jpg` },
          { label: "609", image: `${IK600}609.jpg` },
        ],
      },
      {
        title: "800. sērija",
        surchargeOptionId: "series-800-3d",
        // ImageKit copies of this series kept their original (non-numeric)
        // upload filenames - mapped by hand against each door's design.
        items: [
          { label: "801", image: `${IK800}Q7X0E.jpg` },
          { label: "802", image: `${IK800}iI34z.jpg` },
          { label: "803", image: `${IK800}MmZAp.jpg` },
          { label: "805", image: `${IK800}image%20(1).jpg` },
          { label: "806", image: `${IK800}JiqnS.jpg` },
          { label: "808", image: `${IK800}image.jpg` },
        ],
      },
      {
        title: "900. sērija",
        surchargeOptionId: "series-900-glass",
        items: series(IK900, [
          ["901", "901.jpg"], ["902", "902.jpg"], ["903", "903.jpg"],
          ["905", "905.jpg"], ["906", "906.jpg"], ["907", "907.jpg"],
          ["908", "908.jpg"], ["910", "910.jpg"], ["911", "911.jpg"],
          ["912", "912.jpg"],
        ]),
      },
      {
        title: "Iela",
        items: series(IKSTREET, [
          ["710", "710.png"], ["705", "705.jpg"], ["706 (1200 mm)", "706%201200mm.jpg"],
          ["710 (1200 mm)", "710%201200mm.png"], ["707", "707.png"],
          ["711 (1200 mm)", "711%201200mm.png"], ["716 (1200 mm)", "716%201200mm.png"],
        ]).concat([
          { label: "705 (1200 mm)", image: `${IK}705-1200.png` },
        ]),
      },
    ],
  },
  {
    key: "krasas",
    title: "Pārklājuma plēves krāsas",
    lead: "Divi plēves seguma veidi: iekštelpu PVC plēve durvīm dzīvoklī un izturīgākā Winshield plēve ārdurvīm ielas pusē. Abas pārklāj MDF apdares plāksni un ir pieejamas jebkurai vērtnes frēzējuma sērijai.",
    groups: [
      {
        title: "Durvīm dzīvoklī (PVC plēve)",
        items: [
          { label: "Nr. 1 Rieksts tumšs", image: `${B0909}001.jpg` },
          { label: "Nr. 3 Venge dienvidu (tumšs)", image: `${B0909}003.jpg` },
          { label: "Nr. 12 Venge Horizonts tumšs", image: `${B0909}012.jpg` },
          { label: "Nr. 13 Venge Horizonts pelēks", image: `${B0909}013.jpg` },
          { label: "Nr. 14 Betons tumšs", image: `${B0909}14-pvh-plivka-beton-temniy-7806-dlya-vhidnih-dverey-u-kvartiru.jpg` },
          { label: "Nr. 15 Ozols Šato", image: `${B0909}015.jpg` },
          { label: "Nr. 17 Balta struktūra", image: `${B0909}17-pvh-plivka-bile-derevo-mbp-3t-dlya-vhidnih-dverey-u-kvartiru.jpg` },
          { label: "Nr. 20 Provansas priede", image: `${B0909}020.jpg` },
          { label: "Nr. 21 Ozols Sonoma", image: `${B0909}021.jpg` },
          { label: "Nr. 22 Antracīts", image: `${B0909}22-pvh-plivka-grafit-matoviy-001-dlya-vhidnih-dverey-u-kvartiru.jpg` },
          { label: "Nr. 23 Betons tumši pelēks", image: `${B0909}23-pvh-plivka-beton-temniy-grey-dlya-vhidnih-dverey-u-kvartiru.jpg` },
          { label: "Nr. 25 Betons pelēks", image: `${B0909}25-pvh-plivka-beton-siriy-130-dlya-vhidnih-dverey-u-kvartiru.jpg` },
          { label: "Nr. 26 Betons bēšs", image: `${B0909}026.jpg` },
          { label: "Nr. 29 Marmors pelēks", image: `${B0909}29-pvh-plivka-mramor-siriy-294-3-dlya-vhidnih-dverey-u-kvartiru.jpg` },
          { label: "Nr. 30 Marmors tumšs", image: `${B0909}030.jpg` },
          { label: "Nr. 31 Ozols Šale sirmais", image: `${B0909}031.jpg` },
          { label: "Nr. 34 Koka grieziens brūns", image: `${B0909}034.jpg` },
          { label: "Nr. 37 Balts matēts gluds", image: `${B0909}37-pvh-plivka-biliy-supermat-white-dlya-vhidnih-dverey-u-kvartiru.jpg` },
          { label: "Nr. 38 Ozols Grafīts", image: `${B0909}38-pvh-plivka-dub-graphite-7640-dlya-vhidnih-dverey-u-kvartiru.jpg` },
          { label: "Nr. 67 Slāneklis tumšs", image: `${B0909}067.jpg` },
          { label: "Nr. 68 Ozols Nemo sudraba", image: `${B0909}68-pvh-plivka-dub-nemo-sribniy-dlya-vhidnih-dverey-u-kvartiru.jpg` },
          { label: "Nr. 69 Ozols Nemo karbona", image: `${B0909}069.jpg` },
          { label: "Nr. 70 Platīna koks", image: `${B0909}070.jpg` },
          { label: "Nr. 72 Musona koks", image: `${B0909}072.jpg` },
          { label: "Nr. 74 Melna šagrēna", image: `${B0909}74-pvh-plivka-chorna-shagren-dlya-vhidnih-dverey-u-kvartiru.jpg` },
          { label: "Nr. 75 Koka grieziens, konjaka tonis", image: `${B0909}075.jpg` },
          { label: "Nr. 76 Ozols tabakas", image: `${B0909}076.jpg` },
          { label: "Nr. 82 Koka grieziens, medus tonis", image: `${B0909}82-pvh-plivka-spil-dereva-medoviy-dlya-vhidnih-dverey-u-kvartiru.jpg` },
          { label: "Nr. 84 Ozols Nemo latte", image: `${B0909}084.jpg` },
          { label: "Nr. 85 Titāns horizontāls", image: `${B0909}85-pvh-plivka-dub-grifel-gorizont-331t-dlya-vhidnih-dverey-u-kvartiru.jpg` },
          { label: "Nr. 86 Šale horizontāls", image: `${B0909}086.jpg` },
          { label: "Nr. 89 Pelēks šīferis", image: `${B0909}089.jpg` },
          { label: "Nr. 90 Krējuma brašs", image: `${B0909}090.jpg` },
          { label: "Nr. 94 Pelnu metālisks", image: `${B0909}094.jpg` },
          { label: "Nr. 95 Betons antracīts", image: `${B0909}95-pvh-plivka-beton-antracit-1135-dlya-vhidnih-dverey-u-kvartiru.jpg` },
          { label: "Nr. 105 Ozols Sahāras horizontāls", image: `${B0909}105.jpg` },
          { label: "Nr. 106 Ozols Traupa horizontāls", image: `${B0909}106-pvh-plivka-dub-traup-gorizont-329t-dlya-vhidnih-dverey-u-kvartiru.jpg` },
          { label: "Nr. 107 Grifelis, struktūra soft", image: `${B0909}107.jpg` },
          { label: "Nr. 108 Plombīrs, struktūra soft", image: `${B0909}108-pvh-plivka-plombir-struktura-soft-418s-dlya-vhidnih-dverey-u-kvartiru.jpg` },
          { label: "Nr. 115 Sahāra, struktūra soft", image: `${B0909}115-pvh-plivka-sahara-struktura-soft-428st-dlya-vhidnih-dverey-u-kvartiru.jpg` },
          { label: "Nr. 120 Balta šagrēna", image: `${B0909}120-pvh-plivka-bila-shagren-dlya-vhidnih-dverey-u-kvartiru.jpg` },
          { label: "Nr. 122 Oksīds balts", image: `${B0909}122.jpg` },
          { label: "Nr. 123 Musona koks, gaišs", image: `${B0909}123-pvh-plivka-musonne-derevo-svitle-dlya-vhidnih-dverey-u-kvartiru.jpg` },
          { label: "Nr. 124 Rustikls Avinjona blanc", image: `${B0909}124.jpg` },
          { label: "Nr. 125 Mamba morions", image: `${B0909}125-pvh-plivka-mamba-morion-dlya-vhidnih-dverey-u-kvartiru.jpg` },
          { label: "Nr. 127 Roksī antracīts pelēks", image: `${B0909}127.jpg` },
          { label: "Nr. 128 Ozols Dorato tumšs", image: `${B0909}128-pvh-plivka-dub-dorato-temniy-dlya-vhidnih-dverey-u-kvartiru.jpg` },
          { label: "Nr. 130 Oksīds tumšs", image: `${B0909}130.jpg` },
          { label: "Nr. 131 Oksīds gaišs", image: `${B0909}131-pvh-plivka-oksid-svitliy-dlya-vhidnih-dverey-u-kvartiru.jpg` },
          { label: "Nr. 132 Cements balts", image: `${B0909}132-pvh-plivka-cement-biliy-dlya-vhidnih-dverey-u-kvartiru.jpg` },
          { label: "Nr. 134 Akmens grieziens", image: `${B0909}134_zriz-kamenyu.jpg` },
          { label: "Nr. 135 Balta struktūra, horizontāla", image: `${B0909}135.jpg` },
          { label: "Nr. 136 Venge Parma", image: `${B0909}136_venge-parma.jpg` },
          { label: "Nr. 138 Hroms", image: `${B0909}138.jpg` },
          { label: "Nr. 139 Alva, supermatēts", image: `${B0909}139.jpg` },
          { label: "Nr. 140 Ziloņkauls, supermatēts", image: `${B0909}140.jpg` },
          { label: "Nr. 141 Kašmirs, supermatēts", image: `${B0909}№141-kashemyr-supermat.jpg` },
          { label: "Nr. 143 Dreamwood tumšs", image: `${B0909}143.jpg` },
          { label: "Nr. 144 Dreamwood gaišs", image: `${B0909}144.jpg` },
          { label: "Nr. 145 Venge Palermo", image: `${B0909}venge-palermo-№145.jpg` },
          { label: "Nr. 146 Oksīds melns", image: `${B0909}146.jpg` },
          { label: "Nr. 147 Reljefs akmens, Sjena", image: `${B2511}147_tysnennyj-kamin-siyena.jpg` },
          { label: "Nr. 148 Oksīds melns (viss dekors)", image: `${B2511}148_oksyd-chornyj.jpg` },
        ],
      },
      {
        title: "Durvīm ielas pusē (Winshield)",
        items: [
          { label: "Antracīts smilškrāsas 59S-1", image: `${B0909}1-pvh-plivka-windshield-antracit-pishchaniy-59s-1-dlya-vhidnih-dverey-u-budinok-300x300.jpg` },
          { label: "Antracīts pelēks 58P-1", image: `${B0909}2-pvh-plivka-windshield-antracit-siriy-58r-1-dlya-vhidnih-dverey-u-kvartiru.jpg` },
          { label: "Betons pelēks 123A-1", image: `${B0909}3-pvh-plivka-windshield-beton-siriy-123a-1-dlya-vhidnih-dverey-u-kvartiru.jpg` },
          { label: "Balts 05P-1", image: `${B0909}4-pvh-plivka-windshield-biliy-05r-1-dlya-vhidnih-dverey-u-kvartiru.jpg` },
          { label: "Balts satīns 06S-1", image: `${B0909}5-pvh-plivka-windshield-biliy-atlasniy-06s-1-dlya-vhidnih-dverey-u-kvartiru.jpg` },
          { label: "Ozols zeltains 89P-1", image: `${B0909}11-pvh-plivka-windshield-dub-zolotiy-89p-1-dlya-vhidnih-dverey-u-kvartiru-300x300.jpg` },
          { label: "Ozols polārais 91P-1", image: `${B0909}12-pvh-plivka-windshield-dub-polyarniy-91r-1-dlya-vhidnih-dverey-u-kvartiru.jpg` },
          { label: "Ozols pelēks 93P-1", image: `${B0909}13-pvh-plivka-windshield-dub-siriy-93r-1-dlya-vhidnih-dverey-u-kvartiru.jpg` },
          { label: "Ozols Sonoma 92P-1", image: `${B0909}14-pvh-plivka-windshield-dub-sonoma-92r-1-dlya-vhidnih-dverey-u-kvartiru.jpg` },
          { label: "Ozols tumšs 23P-1", image: `${B0909}15-pvh-plivka-windshield-dub-temniy-23r-1-dlya-vhidnih-dverey-u-kvartiru.jpg` },
          { label: "Lapegle vulkāniskā 136N-1", image: `${B0909}16-pvh-plivka-windshield-modrina-vulkanichna-136n-1-dlya-vhidnih-dverey-u-kvartiru-300x300.jpg` },
          { label: "Lapegle morēna 134N-1", image: `${B0909}17-pvh-plivka-windshield-modrina-morena-134n-1-dlya-vhidnih-dverey-u-kvartiru.jpg` },
          { label: "Lapegle dabīgā 131N-1", image: `${B0909}18-pvh-plivka-windshield-modrina-naturalna-131n-1-dlya-vhidnih-dverey-u-kvartiru.jpg` },
          { label: "Piena tonis 51R-5", image: `${B0909}19-pvh-plivka-windshield-molochniy-51r-5-dlya-vhidnih-dverey-u-kvartiru.jpg` },
          { label: "Pelēks gaišs 108S-1", image: `${B0909}20-pvh-plivka-windshield-siriy-svitliy-108s-1-dlya-vhidnih-dverey-u-kvartiru.jpg` },
          { label: "Venge tumšs 20P-1", image: `${B0909}6-pvh-plivka-windshield-venge-temne-20r-1-dlya-vhidnih-dverey-u-kvartiru-300x300.jpg` },
          { label: "Rieksts dabīgais 25P-1", image: `${B0909}8-pvh-plivka-windshield-gorih-naturalniy-25r-1-dlya-vhidnih-dverey-u-kvartiru.jpg` },
          { label: "Pelēks skandināvu 38D-1", image: `${B0909}21-pvh-plivka-windshield-siriy-skandinavskiy-38d-1-dlya-vhidnih-dverey-u-kvartiru-300x300.jpg` },
          { label: "Titāns 32S-1", image: `${B0909}22-pvh-plivka-windshield-titan-32s-1-dlya-vhidnih-dverey-u-kvartiru.jpg` },
          { label: "Antracīts stilīgs 58N-1", image: `${B2511}58n-1_antraczyt-stylnyj.jpg` },
          { label: "Melns auksts, smilškrāsas 110S-1", image: `${B2511}110s-1_chornyj-holodnyj-pishhanyj-300x300.jpg` },
          { label: "Ozols Montāna 130N-1", image: `${B2511}130n-1_dub-montana.jpg` },
          { label: "Tīkoks gaišs 34H-1", image: "https://www.bulat-doors.com.ua/wp-content/uploads/2025/12/34h-1-tyk-svitlyj.jpg" },
          { label: "Rieksts konjaka tonī 37P-1", image: "https://www.bulat-doors.com.ua/wp-content/uploads/2025/12/37p-1-gorih-konyachnyj.jpg" },
          { label: "Kapučīno 53R-5", image: "https://www.bulat-doors.com.ua/wp-content/uploads/2025/12/53r-5-kapuchino.jpg" },
        ],
      },
    ],
  },
  {
    key: "ral",
    title: "Pulverkrāsojuma katalogs",
    lead: "Metāla karkasam un kārbai izmantotais pulverkrāsojums - matēts izpildījums vai koka tekstūras imitācija. Krāsa tiek iededzināta augstā temperatūrā, tāpēc virsma ir noturīga pret skrāpējumiem un koroziju.",
    groups: [
      {
        title: "Matēts pārklājums",
        items: [
          { label: "Metāliski melns", image: "https://www.bulat-doors.com.ua/wp-content/uploads/2024/02/metalic-black_chorna-279x300.jpg" },
          { label: "Metāliski pelēks (antracīts)", image: "https://www.bulat-doors.com.ua/wp-content/uploads/2024/02/metalic-grey_antraczyt.jpg" },
          { label: "Metāliski grafīts", image: "https://www.bulat-doors.com.ua/wp-content/uploads/2024/02/metalic-grafite_grafit.jpg" },
          { label: "Metāliski brūns (koka tonis)", image: "https://www.bulat-doors.com.ua/wp-content/uploads/2024/02/metalic-wood_korychneva-279x300.jpg" },
          { label: "Metāliski balts", image: "https://www.bulat-doors.com.ua/wp-content/uploads/2024/02/metalic-white_bila.jpg" },
          { label: "Metāliski Chalet (pelēks)", image: "https://www.bulat-doors.com.ua/wp-content/uploads/2024/02/metalic-chalet_sira.jpg" },
          { label: "Metāliski tumši antracīts", image: "https://www.bulat-doors.com.ua/wp-content/uploads/2023/10/metalic-anthracite.jpg" },
        ],
      },
      {
        title: "Koka tekstūras pārklājums",
        items: [
          { label: "Antracīts", image: "https://www.bulat-doors.com.ua/wp-content/uploads/2023/10/farba-pid-teksturu-dereva-antratsyt-300x193.jpg" },
          { label: "Tumši antracīts", image: "https://www.bulat-doors.com.ua/wp-content/uploads/2023/10/kolir-temnyj-antraczyt-300x193.jpg" },
          { label: "Ozols bronza", image: "https://www.bulat-doors.com.ua/wp-content/uploads/2023/10/farba-pid-teksturu-dereva-dub-bronza.jpg" },
          { label: "Venge tumšs", image: "https://www.bulat-doors.com.ua/wp-content/uploads/2023/10/farba-pid-teksturu-dereva-venhe-temnyi.jpg" },
        ],
      },
    ],
  },
];
