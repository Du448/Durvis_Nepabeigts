/* Lithuanian for the Ražotājs-2 (Bulat) door calculator: base filters, tier
   names/intros/specs, hardware/lock/option catalogues and every hardcoded
   label in Manufacturer2Calculator.jsx. Brand and model designations
   (Securemme, Kale, Mottura, Abloy, DISEC, MUL-T-LOCK, Winshield, Yale,
   Tedee, RAL codes, tier codenames already international like Tandem, Ultra,
   Trend, Alfa, Expert, Grand, Fortezza, Omega, Power, Cottage) are kept as
   in the source — only the descriptive Latvian words are translated. */

export const ltManufacturer2Calculator = {
  // ---- Hardcoded JSX literals (Manufacturer2Calculator.jsx) ----
  "palielināt attēlu": "padidinti nuotrauką",
  "atzīmēt kā izvēlēto": "pažymėti kaip pasirinktą",
  "Aizvērt": "Uždaryti",
  "Iepriekšējais": "Ankstesnis",
  "Nākamais": "Kitas",
  "Meklēt pēc modeļa numura...": "Ieškoti pagal modelio numerį...",
  "Nekas netika atrasts.": "Nieko nerasta.",
  "Meklēt pēc krāsas nosaukuma vai numura...": "Ieškoti pagal spalvos pavadinimą arba numerį...",
  "Durvju kalkulators": "Durų kalkuliatorius",
  "Atzīmē vēlamos pamatparametrus — piedāvāsim sērijas, kas atbilst tieši Tavam pieprasījumam. Cenas ir mazumtirdzniecības cenas, kas spēkā no 01.08.2024.":
    "Pažymėk norimus pagrindinius parametrus — pasiūlysime serijas, atitinkančias būtent Tavo poreikį. Kainos yra mažmeninės, galiojančios nuo 2024-08-01.",
  "Durvju pielietojums": "Durų paskirtis",
  "Vēlamais izmērs": "Pageidaujamas dydis",
  "Vēršanās virziens": "Atidarymo kryptis",
  "Vēršanās puse": "Atidarymo pusė",
  "Notīrīt filtru": "Išvalyti filtrą",
  "Atlasīt durvis": "Atrinkti duris",
  "Atpakaļ": "Atgal",
  "Šīs sērijas atbilst Tavam pieprasījumam": "Šios serijos atitinka Tavo pageidavimą",
  "sērijas": "serijos",
  "Durvis privātmājai": "Durys namui",
  "Durvis dzīvoklim": "Durys butui",
  "no": "nuo",
  "Neviena sērija neatbilst izvēlētajiem filtriem. Mēģini paplašināt kritērijus.":
    "Nė viena serija neatitinka pasirinktų filtrų. Pabandyk išplėsti kriterijus.",
  "Atpakaļ pie sērijām": "Atgal prie serijų",
  "Izvēlētais dizains — ārpuse": "Pasirinktas raštas — išorė",
  "Ārpuse": "Išorė",
  "Izvēlētais dizains — iekšpuse": "Pasirinktas raštas — vidus",
  "Iekšpuse": "Vidus",
  "Garantija": "Garantija",
  "Standarta izmēri": "Standartiniai dydžiai",
  "Konstrukcija": "Konstrukcija",
  "Apdare un izolācija": "Apdaila ir izoliacija",
  "Slēdzenes un furnitūra": "Spynos ir furnitūra",
  "Izmērs": "Dydis",
  "Individuāls izmērs": "Individualus dydis",
  "Platums, mm": "Plotis, mm",
  "Augstums, mm": "Aukštis, mm",
  "Papildu opcija maiņai — slēdzenes un cilindri": "Papildoma keitimo opcija — spynos ir cilindrai",
  "Var atzīmēt vairākas — cenas summējas ar bāzes komplektāciju.":
    "Galima pažymėti kelias — kainos susumuojamos su bazine komplektacija.",
  "Jau iekļauts standartā": "Jau įtraukta į standartą",
  "Šai sērijai ir iekļauta viedā slēdzene — atsevišķa cilindra jaunināšana nav nepieciešama.":
    "Šioje serijoje jau įtraukta išmanioji spyna — atskiro cilindro atnaujinimo nereikia.",
  "Furnitūras krāsa": "Furnitūros spalva",
  "Durvju vērtnes dizains": "Durų varčios raštas",
  "Zīmējums — ārpuse": "Raštas — išorė",
  "Zīmējums — iekšpuse": "Raštas — vidus",
  "Pārklājuma plēves krāsa": "Dangos plėvelės spalva",
  "Plēve — ārpuse": "Plėvelė — išorė",
  "Plēve — iekšpuse": "Plėvelė — vidus",
  "Kārbas pārklājums": "Staktos danga",
  "Skata acs": "Durų akutė",
  "Papildu opcijas": "Papildomos opcijos",
  "MDF izstrādājumi (aplodes)": "MDF gaminiai (aplaidos)",
  "Aplodes un MDF paneļu komplekti — cenas atbilstoši durvju pielietojumam (dzīvoklis / privātmāja).":
    "Aplaidų ir MDF plokščių komplektai — kainos priklauso nuo durų paskirties (butas / namas).",
  "Provizoriskā summa": "Preliminari suma",
  "Cena aprēķināta pēc mazumtirdzniecības cenrāža (spēkā no 01.08.2024). Galīgā cena tiek apstiprināta pasūtījuma noformēšanas brīdī.":
    "Kaina apskaičiuota pagal mažmeninį kainoraštį (galiojantį nuo 2024-08-01). Galutinė kaina patvirtinama užsakymo įforminimo metu.",
  "Individuālā izmēra cena aprēķināta pēc formulas: platums (m) × augstums (m) ×":
    "Individualaus dydžio kaina apskaičiuojama pagal formulę: plotis (m) × aukštis (m) ×",
  "Pieprasīt piedāvājumu": "Pateikti užklausą",

  // ---- Base filters (manufacturer2Calculator.js) ----
  "Uz āru (uz sevi)": "Į lauką (į save)",
  "Uz iekšu (no sevis) — +60 € (skatīt Papildu opcijas)": "Į vidų (nuo savęs) — +60 € (žr. Papildomos opcijos)",
  "Kreisā": "Kairė",
  "Labā": "Dešinė",

  "Garantijas nosacījumus lūdzu precizēt pasūtījuma noformēšanas brīdī.":
    "Garantijos sąlygas prašome patikslinti užsakymo įforminimo metu.",

  // ---- Shared construction / finish spec blocks ----
  "Auksti velmēts tērauds 1,2 mm, pulverkrāsa ar matētu apdari (180°C)":
    "Šaltai valcuotas plienas 1,2 mm, milteliniai dažai su matine apdaila (180°C)",
  "Svars 91–130 kg atkarībā no izmēra": "Svoris 91–130 kg priklausomai nuo dydžio",
  "Kārba 100 mm: pastiprināta slēdzeņu rīģeļu plāksne (1,2 mm), 6 stingruma ribas":
    "Stakta 100 mm: sustiprinta spynų skląsčių plokštė (1,2 mm), 6 standumo briaunos",
  "Durvju vērtnes piespiešanās regulators (Securemme), 6 uzstādīšanas stiprinājumu vietas":
    "Durų varčios prispaudimo reguliatorius (Securemme), 6 montavimo tvirtinimo vietos",
  "Durvju kārba apšūta ar metālu": "Durų stakta apkalta metalu",
  "Vērtnes biezums 95 mm, stiprināts tērauda rāmis ar 4 stingruma ribām":
    "Varčios storis 95 mm, sustiprintas plieninis rėmas su 4 standumo briaunomis",
  "Vērtnes konstrukcijas metāla biezums 1,2 mm, tērauda loksnes biezums 1 mm, aizsargājoša metāla kabata slēdzenēm 1,2 mm":
    "Varčios konstrukcijos metalo storis 1,2 mm, plieno lakšto storis 1 mm, apsauginė metalinė kišenė spynoms 1,2 mm",
  "3 eņģes (d-24/120 mm) ar pretnoņemamiem aizsargiem (14 mm)":
    "3 vyriai (d-24/120 mm) su apsauga nuo nuėmimo (14 mm)",
  "MDF biezums uz vērtnes 16/16 mm, mala apšūta ar MDF": "MDF storis ant varčios 16/16 mm, kraštas apkaltas MDF",
  "Skaņas un siltuma izolācija: minerālvate 2 slāņi 50 mm, 15 kg/m³, folijas izolācija":
    "Garso ir šilumos izoliacija: mineralinė vata 2 sluoksniai po 50 mm, 15 kg/m³, folijos izoliacija",
  "2 blīvējuma kontūri": "2 sandarinimo kontūrai",
  "MDF aplodas biezums/platums 16 mm/80 mm — slēptā montāža": "MDF aplaidos storis/plotis 16 mm/80 mm — paslėptas montavimas",

  "Svars 92–98 kg": "Svoris 92–98 kg",
  "Kārba 110 mm: pastiprināta slēdzeņu rīģeļu plāksne (1,2 mm), 6 stingruma ribas":
    "Stakta 110 mm: sustiprinta spynų skląsčių plokštė (1,2 mm), 6 standumo briaunos",
  "Vērtnes biezums 105 mm, stiprināts tērauda rāmis ar 4 stingruma ribām":
    "Varčios storis 105 mm, sustiprintas plieninis rėmas su 4 standumo briaunomis",
  "3 eņģes (d-27/120 mm) ar pretnoņemamiem aizsargiem (14 mm)":
    "3 vyriai (d-27/120 mm) su apsauga nuo nuėmimo (14 mm)",
  "3 blīvējuma kontūri": "3 sandarinimo kontūrai",
  "MDF aplodas biezums/platums 22 mm/80 mm — slēptā montāža": "MDF aplaidos storis/plotis 22 mm/80 mm — paslėptas montavimas",

  "Auksti velmēts tērauds 1,5 mm, pulverkrāsa ar matētu apdari (180°C)":
    "Šaltai valcuotas plienas 1,5 mm, milteliniai dažai su matine apdaila (180°C)",
  "Svars 103–140 kg atkarībā no izmēra": "Svoris 103–140 kg priklausomai nuo dydžio",
  "Kārba 110 mm: pastiprināta slēdzeņu rīģeļu plāksne (1,5 mm), 6 stingruma ribas":
    "Stakta 110 mm: sustiprinta spynų skląsčių plokštė (1,5 mm), 6 standumo briaunos",
  "Vērtnes konstrukcijas metāla biezums 1,5 mm, tērauda loksnes biezums 1,4 mm, aizsargājoša metāla kabata slēdzenēm 1,2 mm":
    "Varčios konstrukcijos metalo storis 1,5 mm, plieno lakšto storis 1,4 mm, apsauginė metalinė kišenė spynoms 1,2 mm",
  "Nestandarta izmēros pieejams līdz 2600×1500 mm": "Nestandartiniais dydžiais galima gaminti iki 2600×1500 mm",

  "Auksti velmēts tērauds 2 mm, pulverkrāsa ar matētu apdari (180°C)":
    "Šaltai valcuotas plienas 2 mm, milteliniai dažai su matine apdaila (180°C)",
  "Svars 135–145 kg": "Svoris 135–145 kg",
  "Kārba 130 mm: pastiprināta slēdzeņu rīģeļu plāksne (2 mm), 8 stingruma ribas":
    "Stakta 130 mm: sustiprinta spynų skląsčių plokštė (2 mm), 8 standumo briaunos",
  "Durvju vērtnes piespiešanās regulators (Securemme), 8 uzstādīšanas stiprinājumu vietas":
    "Durų varčios prispaudimo reguliatorius (Securemme), 8 montavimo tvirtinimo vietos",
  "Durvju kārba apšūta ar metālu, nerūsējošā tērauda slieksnis": "Durų stakta apkalta metalu, nerūdijančio plieno slenkstis",
  "Vērtnes konstrukcijas metāla biezums 2 mm, tērauda loksnes biezums 2 mm, aizsargājoša metāla kabata slēdzenēm 2 mm":
    "Varčios konstrukcijos metalo storis 2 mm, plieno lakšto storis 2 mm, apsauginė metalinė kišenė spynoms 2 mm",

  "Auksti velmēts tērauds 1,2 mm, pulverkrāsa ar UV aizsardzību un cinka gruntējumu pret koroziju (180°C)":
    "Šaltai valcuotas plienas 1,2 mm, milteliniai dažai su UV apsauga ir cinko gruntu nuo korozijos (180°C)",
  "Svars 91–125 kg atkarībā no izmēra": "Svoris 91–125 kg priklausomai nuo dydžio",
  "Kārba 100 mm: pastiprināta slēdzeņu rīģeļu plāksne (1,2 mm), 6 stingruma ribas, piespiešanās regulators (Securemme), 6 uzstādīšanas vietas":
    "Stakta 100 mm: sustiprinta spynų skląsčių plokštė (1,2 mm), 6 standumo briaunos, prispaudimo reguliatorius (Securemme), 6 montavimo vietos",
  "Vērtnes biezums 100/95 mm (atkarībā no platuma), 7 stingruma ribas, metāla biezums 1,2 mm, tērauda loksne 1 mm":
    "Varčios storis 100/95 mm (priklausomai nuo pločio), 7 standumo briaunos, metalo storis 1,2 mm, plieno lakštas 1 mm",
  "3 eņģes (d-24/120 mm) ar pretnoņemamiem aizsargiem (14 mm), durvju rāmis pārklāts ar metālu, nerūsējošā tērauda slieksnis":
    "3 vyriai (d-24/120 mm) su apsauga nuo nuėmimo (14 mm), durų rėmas dengtas metalu, nerūdijančio plieno slenkstis",
  "Ārējā apdare: sendvičpanelis — 0,8 mm tērauda loksne + 20 mm ekstrudēts putupolistirols, cinka gruntējums, UV aizsargājoša krāsa":
    "Išorės apdaila: sumuštinio panelė — 0,8 mm plieno lakštas + 20 mm ekstruzinis putų polistirenas, cinko gruntas, UV apsauginiai dažai",
  "Iekšējā apdare: 16 mm mitrumizturīgs MDF panelis, Winshield PVC plēve (Izraēla)":
    "Vidaus apdaila: 16 mm drėgmei atsparus MDF panelis, Winshield PVC plėvelė (Izraelis)",
  "Vērtnes mala bez MDF apšuvuma": "Varčios kraštas be MDF apkalimo",
  "Metāla aploda 60 mm, monolīta ar durvju rāmi": "Metalinė aplaida 60 mm, monolitinė su durų rėmu",

  "Kārba 100 mm ar termopārrāvumu: pastiprināta slēdzeņu rīģeļu plāksne (1,2 mm), 6 stingruma ribas, piespiešanās regulators, 6 uzstādīšanas vietas, papildu siltumizolācija — korķa koks":
    "Stakta 100 mm su termopertrauka: sustiprinta spynų skląsčių plokštė (1,2 mm), 6 standumo briaunos, prispaudimo reguliatorius, 6 montavimo vietos, papildoma šilumos izoliacija — kamštinė mediena",
  "Vērtnes biezums 95 mm, 7 stingruma ribas, metāla biezums 1,2 mm, tērauda loksne 1,2 mm":
    "Varčios storis 95 mm, 7 standumo briaunos, metalo storis 1,2 mm, plieno lakštas 1,2 mm",
  "3 eņģes (d-24/120 mm) ar pretnoņemamiem aizsargiem (14 mm), nerūsējošā tērauda slieksnis":
    "3 vyriai (d-24/120 mm) su apsauga nuo nuėmimo (14 mm), nerūdijančio plieno slenkstis",
  "Ārējā apdare: sendvičpanelis — 0,8 mm tērauda loksne + 20 mm ekstrudēts putupolistirols, cinka gruntējums, UV krāsa ar koka struktūras efektu":
    "Išorės apdaila: sumuštinio panelė — 0,8 mm plieno lakštas + 20 mm ekstruzinis putų polistirenas, cinko gruntas, UV dažai su medienos faktūros efektu",
  "Vērtnes mala apšūta ar MDF": "Varčios kraštas apkaltas MDF",
  "Skaņas un siltuma izolācija: minerālvate 2 slāņi 50 mm, folijas izolācija":
    "Garso ir šilumos izoliacija: mineralinė vata 2 sluoksniai po 50 mm, folijos izoliacija",
  "2 Eurosealer blīvējuma kontūri": "2 Eurosealer sandarinimo kontūrai",
  "Nestandarta izmēros pieejams līdz 2300×1500 mm": "Nestandartiniais dydžiais galima gaminti iki 2300×1500 mm",

  "Auksti velmēts tērauds 1,5 mm, pulverkrāsa ar UV aizsardzību un cinka gruntējumu pret koroziju (180°C)":
    "Šaltai valcuotas plienas 1,5 mm, milteliniai dažai su UV apsauga ir cinko gruntu nuo korozijos (180°C)",
  "Svars 103–160 kg atkarībā no izmēra": "Svoris 103–160 kg priklausomai nuo dydžio",
  "Kārba 110 mm ar termopārrāvumu: pastiprināta slēdzeņu rīģeļu plāksne (2 mm), 6 stingruma ribas, piespiešanās regulators, 6 uzstādīšanas vietas, papildu siltumizolācija — korķa koks":
    "Stakta 110 mm su termopertrauka: sustiprinta spynų skląsčių plokštė (2 mm), 6 standumo briaunos, prispaudimo reguliatorius, 6 montavimo vietos, papildoma šilumos izoliacija — kamštinė mediena",
  "Vērtnes biezums 105 mm, 7 stingruma ribas, metāla biezums 1,5 mm, tērauda loksne 1,4 mm":
    "Varčios storis 105 mm, 7 standumo briaunos, metalo storis 1,5 mm, plieno lakštas 1,4 mm",
  "Skaņas un siltuma izolācija: minerālvate, folijas izolācija": "Garso ir šilumos izoliacija: mineralinė vata, folijos izoliacija",
  "3 Eurosealer blīvējuma kontūri": "3 Eurosealer sandarinimo kontūrai",

  // ---- Door tier names (Latvian-word codenames only; international names unchanged) ----
  "Standarts": "Standartas",
  "Prestižs": "Prestižas",
  "Garants": "Garantas",
  "Statuss": "Statusas",
  "Olimps": "Olimpas",

  // ---- Tier intros ----
  "Bāzes divkontūru ārdurvis dzīvoklim ar drošu 1,2 mm tērauda konstrukciju un labu siltumizolāciju.":
    "Bazinės dviejų kontūrų lauko durys butui su patikima 1,2 mm plieno konstrukcija ir gera šilumos izoliacija.",
  "Divkontūru ārdurvis dzīvoklim ar kvadrātveida furnitūru, pieejamas arī platākā 1200 mm versijā.":
    "Dviejų kontūrų lauko durys butui su kvadratine furnitūra, taip pat prieinamos platesnės 1200 mm versijos.",
  "Trīskontūru ārdurvis dzīvoklim ar Tandem tipa slēdzeņu sistēmu — divi cilindri, kas slēdzas sinhroni.":
    "Trijų kontūrų lauko durys butui su Tandem tipo spynų sistema — du cilindrai, kurie užsirakina sinchroniškai.",
  "Trīskontūru ārdurvis dzīvoklim ar Kale slēdzeņu sistēmu un augstu siltuma un skaņas izolāciju.":
    "Trijų kontūrų lauko durys butui su Kale spynų sistema ir aukšta šilumos bei garso izoliacija.",
  "Trīskontūru ārdurvis dzīvoklim ar deviatora tipa augšējo slēdzeni un Mottura monobloku.":
    "Trijų kontūrų lauko durys butui su deviatoriaus tipo viršutine spyna ir Mottura monobloku.",
  "Trīskontūru ārdurvis dzīvoklim ar pastiprinātu 1,5 mm tērauda konstrukciju un Kale slēdzeni ar nakts slēdzi.":
    "Trijų kontūrų lauko durys butui su sustiprinta 1,5 mm plieno konstrukcija ir Kale spyna su nakties skląsčiu.",
  "Trīskontūru ārdurvis dzīvoklim ar itāļu Securemme slēdzeņu sistēmu papildu drošībai.":
    "Trijų kontūrų lauko durys butui su itališka Securemme spynų sistema papildomam saugumui.",
  "Trīskontūru ārdurvis dzīvoklim ar tehnoloģisku Mottura deviatora slēdzeni maksimālai aizsardzībai.":
    "Trijų kontūrų lauko durys butui su technologiška Mottura deviatoriaus spyna maksimaliai apsaugai.",
  "Trīskontūru ārdurvis dzīvoklim ar Securemme TOP GEAR reduktora slēdzenēm augstākajam drošības līmenim.":
    "Trijų kontūrų lauko durys butui su Securemme TOP GEAR reduktoriaus spynomis aukščiausiam saugumo lygiui.",
  "Trīskontūru ārdurvis ar 2 mm tērauda konstrukciju un Mottura MATIC slēdzeni.":
    "Trijų kontūrų lauko durys su 2 mm plieno konstrukcija ir Mottura MATIC spyna.",
  "Trīskontūru ārdurvis ar 2 mm tērauda konstrukciju un Mottura MyKey slēdzeni.":
    "Trijų kontūrų lauko durys su 2 mm plieno konstrukcija ir Mottura MyKey spyna.",
  "Trīskontūru ārdurvis ar Securemme TOP GEAR Tandem slēdzeņu sistēmu, 2 mm tērauda konstrukcija.":
    "Trijų kontūrų lauko durys su Securemme TOP GEAR Tandem spynų sistema, 2 mm plieno konstrukcija.",
  "Prēmiuma trīskontūru ārdurvis ar DISEC bruņu uzliku un MUL-T-LOCK 3-WAY reduktora slēdzeni.":
    "Premium klasės trijų kontūrų lauko durys su DISEC šarvine apkala ir MUL-T-LOCK 3-WAY reduktoriaus spyna.",
  "Sērijas flagmanis: 2 mm tērauda konstrukcija, nerūsējošā tērauda slieksnis un Mottura 3D KEY slēdzene.":
    "Serijos flagmanas: 2 mm plieno konstrukcija, nerūdijančio plieno slenkstis ir Mottura 3D KEY spyna.",
  "Divkontūru ārdurvis privātmājai bez stiklojuma — izturīgas pret laikapstākļu maiņu.":
    "Dviejų kontūrų lauko durys namui be stiklinimo — atsparios oro sąlygų pokyčiams.",
  "Cottage sērija ar vienu stikla paketi (1233×88 mm gaismas atvērums).":
    "Cottage serija su vienu stiklo paketu (1233×88 mm šviesos anga).",
  "Cottage sērija ar divām stikla paketēm (1233×88 mm gaismas atvērums katrā).":
    "Cottage serija su dviem stiklo paketais (1233×88 mm šviesos anga kiekviename).",
  "Ārdurvis privātmājai ar termopārrāvumu kārbas profilā, bez stiklojuma.":
    "Lauko durys namui su termopertrauka staktos profilyje, be stiklinimo.",
  "Termo House ar termopārrāvumu un vienu divkameru energoefektīvu stikla paketi (1233×88 mm).":
    "Termo House su termopertrauka ir vienu dviejų kamerų energiją taupančiu stiklo paketu (1233×88 mm).",
  "Termo House ar termopārrāvumu un divām divkameru energoefektīvām stikla paketēm.":
    "Termo House su termopertrauka ir dviem dviejų kamerų energiją taupančiais stiklo paketais.",
  "Trīskontūru ārdurvis privātmājai ar termopārrāvumu, pastiprināta 1,5 mm konstrukcija, bez stiklojuma.":
    "Trijų kontūrų lauko durys namui su termopertrauka, sustiprinta 1,5 mm konstrukcija, be stiklinimo.",
  "Termo Street ar termopārrāvumu un vienu energoefektīvu divkameru stikla paketi ar tonējumu.":
    "Termo Street su termopertrauka ir vienu energiją taupančiu dviejų kamerų toniruotu stiklo paketu.",
  "Termo Street ar termopārrāvumu un divām energoefektīvām divkameru stikla paketēm ar tonējumu.":
    "Termo Street su termopertrauka ir dviem energiją taupančiais dviejų kamerų toniruotais stiklo paketais.",

  // ---- Size note ----
  "850/950 mm izmērā nav pieejams — tikai 1200 mm.": "850/950 mm dydžio nėra — tik 1200 mm.",

  // ---- Hardware spec bullets (per tier) ----
  "Augšējā slēdzene: Securemme 2029 (Itālija), dekoratīvā uzlika ovāla, hroms":
    "Viršutinė spyna: Securemme 2029 (Italija), dekoratyvinė apkala ovali, chromas",
  "Apakšējā slēdzene: Kale 252 (Turcija)": "Apatinė spyna: Kale 252 (Turkija)",
  "Cilindrs: Kale (Turcija), izmērs 40×50T": "Cilindras: Kale (Turkija), dydis 40×50T",
  "Bruņuzlika: ovāla, hroms": "Šarvinė apkala: ovali, chromas",
  "Nakts aizbīdnis: nav": "Nakties skląstis: nėra",
  "Actiņa: Securemme (Itālija)": "Akutė: Securemme (Italija)",
  "Rokturis, krāsa: Smart-A (hroms)": "Rankena, spalva: Smart-A (chromas)",

  "Augšējā slēdzene: Kale 257 (Turcija), dekoratīvā uzlika kvadrāta, hroms/melns":
    "Viršutinė spyna: Kale 257 (Turkija), dekoratyvinė apkala kvadratinė, chromas/juoda",
  "Bruņuzlika: kvadrāta, hroms/melns": "Šarvinė apkala: kvadratinė, chromas/juoda",
  "Nakts aizbīdnis: Securemme (Itālija)": "Nakties skląstis: Securemme (Italija)",
  "Rokturis, krāsa: Smart kvadro (mat. hroms/melns)": "Rankena, spalva: Smart kvadro (mat. chromas/juoda)",

  "Augšējā slēdzene: Kale 257 zem cilindra (Turcija), bruņu plāksne kvadrāta, mat. hroms/melns":
    "Viršutinė spyna: Kale 257 po cilindru (Turkija), šarvinė plokštė kvadratinė, mat. chromas/juoda",
  "Cilindrs: Kale (Turcija), 5 atslēgas, izmērs 50×50T — 2 cilindru komplekta tandēma sistēma":
    "Cilindras: Kale (Turkija), 5 raktai, dydis 50×50T — 2 cilindrų komplekto tandeminė sistema",
  "Bruņuzlika: kvadrāta, mat. hroms/melns": "Šarvinė apkala: kvadratinė, mat. chromas/juoda",

  "Augšējā slēdzene: Kale 257 (Turcija), dekoratīvā uzlika kvadrāta, mat. hroms/melns":
    "Viršutinė spyna: Kale 257 (Turkija), dekoratyvinė apkala kvadratinė, mat. chromas/juoda",
  "Cilindrs: Kale (Turcija), izmērs 50×50T": "Cilindras: Kale (Turkija), dydis 50×50T",

  "Augšējā slēdzene: deviatoru sistēma uz augšu un leju, dekoratīvā uzlika kvadrāta, mat. hroms/melns":
    "Viršutinė spyna: deviatoriaus sistema aukštyn ir žemyn, dekoratyvinė apkala kvadratinė, mat. chromas/juoda",
  "Apakšējā slēdzene: monobloks Mottura 54.797 (Itālija)": "Apatinė spyna: monoblokas Mottura 54.797 (Italija)",
  "Cilindrs: Securemme K-2 (1+5 atslēgas) (Itālija), izmērs 50×30 stieņi — jau iekļauts standartā":
    "Cilindras: Securemme K-2 (1+5 raktai) (Italija), dydis 50×30 kaiščiai — jau įtraukta į standartą",

  "Augšējā slēdzene: Kale 257 LX ar nakts slēdzi (Turcija), dekoratīvā uzlika kvadrāta, mat. hroms/melns":
    "Viršutinė spyna: Kale 257 LX su nakties skląsčiu (Turkija), dekoratyvinė apkala kvadratinė, mat. chromas/juoda",
  "Apakšējā slēdzene: Securemme 2061 (Itālija) — jau iekļauts standartā":
    "Apatinė spyna: Securemme 2061 (Italija) — jau įtraukta į standartą",
  "Nakts aizbīdnis: uzstādīts augšējās slēdzenes pamatnē": "Nakties skląstis: įmontuotas viršutinės spynos korpuse",

  "Augšējā slēdzene: Securemme 2030 ar nakts slēdzi (Turcija), dekoratīvā uzlika kvadrāta, mat. hroms/melns":
    "Viršutinė spyna: Securemme 2030 su nakties skląsčiu (Turkija), dekoratyvinė apkala kvadratinė, mat. chromas/juoda",
  "Apakšējā slēdzene: Securemme 2061 (Itālija)": "Apatinė spyna: Securemme 2061 (Italija)",

  "Augšējā slēdzene: Securemme 2663 TOP GEAR reduktora (Itālija), deviatoru sistēma, dekoratīvā uzlika kvadrāta, mat. hroms/melns":
    "Viršutinė spyna: Securemme 2663 TOP GEAR reduktoriaus (Italija), deviatoriaus sistema, dekoratyvinė apkala kvadratinė, mat. chromas/juoda",
  "Apakšējā slēdzene: Securemme 2653 TOP GEAR reduktora, deviatoru sistēma (Itālija)":
    "Apatinė spyna: Securemme 2653 TOP GEAR reduktoriaus, deviatoriaus sistema (Italija)",
  "Cilindrs: Securemme K-2 (1+5 atslēgas) (Itālija), izmērs 50×30 stieņi — 2 cilindri komplektā":
    "Cilindras: Securemme K-2 (1+5 raktai) (Italija), dydis 50×30 kaiščiai — 2 cilindrai komplekte",

  "Apakšējā slēdzene: monobloks Mottura 54.797 MATIC (2+5 atslēgas) (Itālija) — jau iekļauts standartā":
    "Apatinė spyna: monoblokas Mottura 54.797 MATIC (2+5 raktai) (Italija) — jau įtraukta į standartą",

  "Apakšējā slēdzene: monobloks Mottura 54.J797 My Key (1+5 atslēgas) (Itālija) — jau iekļauts standartā":
    "Apatinė spyna: monoblokas Mottura 54.J797 My Key (1+5 raktai) (Italija) — jau įtraukta į standartą",
  "Cilindrs: Securemme K-64 (1+5 atslēgas) (Itālija), izmērs 50×30 stieņi — jau iekļauts standartā":
    "Cilindras: Securemme K-64 (1+5 raktai) (Italija), dydis 50×30 kaiščiai — jau įtraukta į standartą",

  "Augšējā slēdzene: Securemme 2663 TOP GEAR reduktora (Itālija), deviatoru sistēma, bruņu uzlika kvadrāta, mat. hroms/melns":
    "Viršutinė spyna: Securemme 2663 TOP GEAR reduktoriaus (Italija), deviatoriaus sistema, šarvinė apkala kvadratinė, mat. chromas/juoda",
  "Cilindrs: Securemme K-64 duetu sistēma (1+5 atslēgas) (Itālija), izmērs 50×30 stieņi — 2 cilindru komplekti — jau iekļauts standartā":
    "Cilindras: Securemme K-64 dueto sistema (1+5 raktai) (Italija), dydis 50×30 kaiščiai — 2 cilindrų komplektai — jau įtraukta į standartą",
  "Bruņuzlika: kvadrāts, mat. hroms/melns": "Šarvinė apkala: kvadratinė, mat. chromas/juoda",

  "Augšējā slēdzene: deviatoru sistēma uz augšu un leju, bruņu uzlika Disec Omega (Itālija), mat. hroms/melns":
    "Viršutinė spyna: deviatoriaus sistema aukštyn ir žemyn, šarvinė apkala Disec Omega (Italija), mat. chromas/juoda",
  "Apakšējā slēdzene: monobloks MUL-T-LOCK 3-WAY, 3+5 atslēgas, Omega+DIN reduktors (Izraēla)":
    "Apatinė spyna: monoblokas MUL-T-LOCK 3-WAY, 3+5 raktai, Omega+DIN reduktorius (Izraelis)",

  "Augšējā slēdzene: deviatoru sistēma uz augšu un leju, bruņu uzlika Defender Mottura (Itālija), mat. hroms/melns":
    "Viršutinė spyna: deviatoriaus sistema aukštyn ir žemyn, šarvinė apkala Defender Mottura (Italija), mat. chromas/juoda",
  "Apakšējā slēdzene: monobloks Mottura 3D787 3D KEY reduktors (Itālija)":
    "Apatinė spyna: monoblokas Mottura 3D787 3D KEY reduktorius (Italija)",

  "Augšējā slēdzene: Kale 257 zem cilindra (Turcija), bruņu apšuvums kvadrāts, melns":
    "Viršutinė spyna: Kale 257 po cilindru (Turkija), šarvinė apkala kvadratinė, juoda",
  "Apakšējā slēdzene: Kale 257 zem cilindra (Turcija)": "Apatinė spyna: Kale 257 po cilindru (Turkija)",
  "Cilindrs: Kale (Turcija), izmērs 50×50T, tandēma sistēma": "Cilindras: Kale (Turkija), dydis 50×50T, tandeminė sistema",
  "Bruņuzlika: kvadrāts, melns": "Šarvinė apkala: kvadratinė, juoda",
  "Actiņa: nav": "Akutė: nėra",
  "Rokturis, krāsa: Smart kvadro, šagrīns melns": "Rankena, spalva: Smart kvadro, šagrenė juoda",

  "Augšējā slēdzene: Kale 257 zem cilindra (Turcija), bruņu apšuvums kvadrāts, šagrīns melns":
    "Viršutinė spyna: Kale 257 po cilindru (Turkija), šarvinė apkala kvadratinė, šagrenė juoda",
  "Dubultstiklojums (divkameru, energoefektīvs): izmērs 1233×88 mm (gaismas atvērums)":
    "Dvigubas stiklinimas (dviejų kamerų, energiją taupantis): dydis 1233×88 mm (šviesos anga)",
  "Dubultstiklojums (divkameru, energoefektīvs): izmērs 1233×88 mm (gaismas atvērums) katrā stiklā":
    "Dvigubas stiklinimas (dviejų kamerų, energiją taupantis): dydis 1233×88 mm (šviesos anga) kiekviename stikle",

  "Augšējā slēdzene: Securemme 2069 zem cilindra (Itālija), bruņu apšuvums kvadrāts, melns":
    "Viršutinė spyna: Securemme 2069 po cilindru (Italija), šarvinė apkala kvadratinė, juoda",
  "Apakšējā slēdzene: Securemme 2061 zem cilindra (Itālija) — jau iekļauts standartā":
    "Apatinė spyna: Securemme 2061 po cilindru (Italija) — jau įtraukta į standartą",
  "Cilindrs: Securemme (Itālija) K-22, izmērs 60×50T, tandēma sistēma — jau iekļauts standartā":
    "Cilindras: Securemme (Italija) K-22, dydis 60×50T, tandeminė sistema — jau įtraukta į standartą",
  "Stiklapakete (energoefektīva divkameru, ar tonējumu): izmērs 1233×88 mm (tīrais gaismas atvērums)":
    "Stiklo paketas (energiją taupantis dviejų kamerų, toniruotas): dydis 1233×88 mm (grynoji šviesos anga)",
  "Stiklapaketes (energoefektīvas divkameru, ar tonējumu): izmērs 1233×88 mm (tīrais gaismas atvērums) katrā":
    "Stiklo paketai (energiją taupantys dviejų kamerų, toniruoti): dydis 1233×88 mm (grynoji šviesos anga) kiekviename",

  // ---- Cylinder / lock upgrade catalogue ----
  "Cilindrs Securemme K-2 (1+5 atslēgas)": "Cilindras Securemme K-2 (1+5 raktai)",
  "Cilindrs Securemme K-22 (1+5 atslēgas)": "Cilindras Securemme K-22 (1+5 raktai)",
  "Cilindrs Securemme K-64 (1+5 atslēgas)": "Cilindras Securemme K-64 (1+5 raktai)",
  "Securemme K-22 Tandem, 2 cilindri (1+5 atslēgas)": "Securemme K-22 Tandem, 2 cilindrai (1+5 raktai)",
  "Securemme K-64 Tandem, 2 cilindri (1+5 atslēgas)": "Securemme K-64 Tandem, 2 cilindrai (1+5 raktai)",
  "Cilindrs Mottura Champions 39 (5 atslēgas)": "Cilindras Mottura Champions 39 (5 raktai)",
  "Cilindrs Mottura Champions 55 (5 atslēgas)": "Cilindras Mottura Champions 55 (5 raktai)",
  "Cilindrs Abloy Protec 2 (5 atslēgas)": "Cilindras Abloy Protec 2 (5 raktai)",
  "Aizsargs DISEC MAGNETIC (3 atslēgas), melns": "Apsauga DISEC MAGNETIC (3 raktai), juoda",
  "Smart lock Tedee, grafīts (Polija)": "Išmanioji spyna Tedee, grafitas (Lenkija)",
  "Slēdzenes centrmezgls, balts (Polija)": "Spynos centrinis mazgas, baltas (Lenkija)",
  "Augšējā slēdzene Securemme 2019 (Itālija)": "Viršutinė spyna Securemme 2019 (Italija)",
  "Apakšējā slēdzene Securemme 2061 (Itālija)": "Apatinė spyna Securemme 2061 (Italija)",
  "Mangāna plāksne monobloku slēdzenēm (Mottura)": "Mangano plokštelė monoblokinėms spynoms (Mottura)",
  "Monobloks Mottura 54.797 MATIC (2+5 atslēgas) — vienreizēja pārkodēšana":
    "Monoblokas Mottura 54.797 MATIC (2+5 raktai) — vienkartinis perkodavimas",
  "Monobloks Mottura 54.J797 My Key (1+5 atslēgas) — vairākkārtēja pārkodēšana":
    "Monoblokas Mottura 54.J797 My Key (1+5 raktai) — daugkartinis perkodavimas",

  // ---- Furniture ----
  "Furnitūra melna matēta": "Furnitūra juoda matinė",
  "Furnitūra hroma matējums": "Furnitūra chromo matinė",

  // ---- Peephole options ----
  "Bez acs": "Be akutės",
  "Standarta actiņa (Securemme, iekļauta)": "Standartinė akutė (Securemme, įtraukta)",
  "Yale 500 viedā actiņa": "Yale 500 išmanioji akutė",
  "Yale 5800 viedā actiņa (kustības sensors, foto/video, zvans, atmiņas karte)":
    "Yale 5800 išmanioji akutė (judesio jutiklis, foto/video, skambutis, atminties kortelė)",

  // ---- Additional options ----
  "Paātrināta izgatavošana 14 kalendārās dienās (tikai dzīvokļa tipa 2050×850/950 mm)":
    "Pagreitinta gamyba per 14 kalendorinių dienų (tik buto tipo 2050×850/950 mm)",
  "Durvis atveramas uz iekšpusi": "Durys atidaromos į vidų",
  "Ārdurvju (ielu) tipa durvis — mitrumizturīga MDF un Winshield PVC plēve (Izraēla)":
    "Lauko (gatvės) tipo durys — drėgmei atsparus MDF ir Winshield PVC plėvelė (Izraelis)",
  "Individuāla zīmējuma izstrāde": "Individualaus rašto sukūrimas",
  "PVC plēve pēc pasūtījuma (nav kataloga), viena puse": "PVC plėvelė pagal užsakymą (nėra kataloge), viena pusė",
  "Zīmējumu sērija 400, MDF ieliktņi, viena puse": "Raštų serija 400, MDF įdėklai, viena pusė",
  "Zīmējumu sērija 500, moldingi pelēks/melns, viena puse": "Raštų serija 500, moldingai pilki/juodi, viena pusė",
  "Zīmējumu sērija 600, spogulis (tikai no iekšpuses)": "Raštų serija 600, veidrodis (tik iš vidaus)",
  "Tonēts spogulis (tikai modelim 607)": "Toniruotas veidrodis (tik modeliui 607)",
  "Zīmējumu sērija 800, MDF 3D dizains, viena puse": "Raštų serija 800, MDF 3D dizainas, viena pusė",
  "Zīmējumu sērija 900, stikla ieliktņi melns/balts, viena puse": "Raštų serija 900, stiklo įdėklai juodi/balti, viena pusė",
  "Nerūsējošā tērauda slieksnis (visu veidu durvis)": "Nerūdijančio plieno slenkstis (visų tipų durims)",
  "Metāla rāmja krāsa pēc RAL kataloga (glancēts pārklājums)": "Metalinio rėmo spalva pagal RAL katalogą (blizgi danga)",
  "Termopārrāvums un divkrāsu rāmis, standarta izmēri (iekļauts nerūsējošā tērauda slieksnis)":
    "Termopertrauka ir dvispalvis rėmas, standartiniai dydžiai (įtrauktas nerūdijančio plieno slenkstis)",
  "Termopārrāvums un divkrāsu rāmis, individuāli izmēri (iekļauts nerūsējošā tērauda slieksnis)":
    "Termopertrauka ir dvispalvis rėmas, individualūs dydžiai (įtrauktas nerūdijančio plieno slenkstis)",

  // ---- Casing / MDF products ----
  "Aplodes — standarta izmēra komplekts, dzīvokļa tipa (visu veidu durvīm)":
    "Aplaidos — standartinio dydžio komplektas, buto tipo (visų tipų durims)",
  "Aplodes — standarta izmēra komplekts, privātmāju tipa (visu veidu durvīm)":
    "Aplaidos — standartinio dydžio komplektas, namo tipo (visų tipų durims)",
  "Augšējā aplode — platuma izmaiņa līdz 400 mm": "Viršutinė aplaida — pločio pakeitimas iki 400 mm",
  "Aplodes komplekts — platuma diapazons 90–300 mm, dzīvokļa tipa": "Aplaidų komplektas — pločio diapazonas 90–300 mm, buto tipo",
  "Aplodes komplekts — platuma diapazons 90–300 mm, privātmāju tipa": "Aplaidų komplektas — pločio diapazonas 90–300 mm, namo tipo",
  "MDF paneļa komplekts ar aplodēm, dzīvokļa tipa": "MDF plokštės komplektas su aplaidomis, buto tipo",
  "MDF paneļa komplekts ar aplodēm, privātmāju tipa": "MDF plokštės komplektas su aplaidomis, namo tipo",
  "MDF izstrādājumi pēc pasūtījuma, dzīvokļa tips (min. no 1 m²), €/m²":
    "MDF gaminiai pagal užsakymą, buto tipas (min. nuo 1 m²), €/m²",
  "MDF izstrādājumi pēc pasūtījuma, privātmājas tips (min. no 1 m²), €/m²":
    "MDF gaminiai pagal užsakymą, namo tipas (min. nuo 1 m²), €/m²",
};
