import type { L } from "../i18n";
import type {
  Beast,
  BuildingId,
  Buffs,
  Confidence,
  Hero,
  HerdId,
  HistoricalState,
  ResourceId,
  Resources,
  Son,
  SonId,
  TowerType,
  Tribe,
  TroopId,
} from "../types/game";

/*
 * Historical data.
 *
 * Tribe list, order and grouping under Oghuz Khagan's six sons follow Rashid al-Din, Jāmiʿ al-Tawārīkh
 * (early 14th c.), as reported by Faruk Sümer and the TDV İslâm Ansiklopedisi. Kashgari (11th c.) lists
 * 22 tribes and does not use the names Bozok/Üçok. Each claim carries a confidence:
 *   verified  – checked in a reference work (TDV İslâm Ansiklopedisi, Encyclopaedia Iranica, Sümer)
 *   reported  – common in modern summaries or in later tradition, not checked against the primary text
 *   contested – disputed or not established
 * Game bonuses, unit names and colours are design choices, not history.
 */

export const SONS: Son[] = [
  { id: "gun", name: "Gün Han", meaning: { en: "Sun", ur: "Suraj", tr: "Güneş" }, wing: "Bozok", ongon: { en: "Şahin (falcon)", ur: "Şahin (shaheen)", tr: "Şahin" }, ongonConfidence: "verified" },
  { id: "ay", name: "Ay Han", meaning: { en: "Moon", ur: "Chaand", tr: "Ay" }, wing: "Bozok", ongon: { en: "Kartal (eagle)", ur: "Kartal (uqaab)", tr: "Kartal" }, ongonConfidence: "reported" },
  { id: "yildiz", name: "Yıldız Han", meaning: { en: "Star", ur: "Sitara", tr: "Yıldız" }, wing: "Bozok", ongon: { en: "Tavşancıl (eagle)", ur: "Tavşancıl (uqaab)", tr: "Tavşancıl" }, ongonConfidence: "verified" },
  { id: "gok", name: "Gök Han", meaning: { en: "Sky", ur: "Aasmaan", tr: "Gök" }, wing: "Üçok", ongon: { en: "Sungur (gyrfalcon)", ur: "Sungur (baaz)", tr: "Sungur" }, ongonConfidence: "verified" },
  { id: "dag", name: "Dağ Han", meaning: { en: "Mountain", ur: "Pahaar", tr: "Dağ" }, wing: "Üçok", ongon: { en: "Uç kuşu (falcon)", ur: "Uç kuşu (shikra)", tr: "Uç kuşu" }, ongonConfidence: "verified" },
  { id: "deniz", name: "Deniz Han", meaning: { en: "Sea", ur: "Samandar", tr: "Deniz" }, wing: "Üçok", ongon: { en: "Çakır (goshawk)", ur: "Çakır (baaz)", tr: "Çakır" }, ongonConfidence: "reported" },
];

export const SON_BY_ID: Record<SonId, Son> = Object.fromEntries(SONS.map((s) => [s.id, s])) as Record<SonId, Son>;

const NO_HOUSE: L = { en: "Settlements named after the tribe across Anatolia; no ruling house recorded", ur: "Anatolia mein is qabile ke naam ki bastiyan; koi hukmaran khandan darj nahi", tr: "Anadolu'da boyun adını taşıyan yerleşimler; hükümdar sülalesi kaydedilmemiş" };

type TribeRow = [string, string, SonId, L, Confidence, L, Confidence, [string, string], L, Buffs];

const TRIBE_ROWS: TribeRow[] = [
  ["kayi", "Kayı", "gun",
    { en: "Sturdy, strong (Rashid al-Din: “sağlam”)", ur: "Mazboot, taqatwar (Rashid al-Din: “sağlam”)", tr: "Sağlam, güçlü (Reşîdüddin)" }, "verified",
    { en: "Ottoman dynasty by Ottoman tradition; Rashid al-Din links the early Oghuz yabgus to the Kayı", ur: "Usmani riwayat ke mutabiq Usmani khandan; Rashid al-Din pehle Oghuz yabguon ko Kayı se jorta hai", tr: "Osmanlı geleneğine göre Osmanlı hanedanı; Reşîdüddin ilk Oğuz yabgularını Kayı'ya bağlar" }, "reported",
    ["#1f4e9c", "#e3a800"], { en: "Iron defence", ur: "Faulaadi difa", tr: "Demir savunma" }, { infantryPct: 10, defensePct: 10 }],
  ["bayat", "Bayat", "gun",
    { en: "Fortunate, rich in blessings (Rashid al-Din)", ur: "Khush naseeb, barkat wala (Rashid al-Din)", tr: "Devletli ve nimeti bol (Reşîdüddin)" }, "verified",
    { en: "Tribe of Korkut Ata in the Dede Korkut epic", ur: "Dede Korkut dastan mein Korkut Ata ka qabila", tr: "Dede Korkut destanında Korkut Ata'nın boyu" }, "reported",
    ["#c8102e", "#e3a800"], { en: "Treasury", ur: "Khazana", tr: "Hazine" }, { altinPct: 15 }],
  ["alkaevli", "Alkaevli", "gun",
    { en: "Useful and agreeable wherever they go (Rashid al-Din)", ur: "Jahan jayein kaam aayein aur ittefaq karein (Rashid al-Din)", tr: "Her yere yararlar, muvafakat ederler (Reşîdüddin)" }, "verified",
    NO_HOUSE, "reported", ["#f5f5f4", "#c8102e"], { en: "Quick march", ur: "Tez kooch", tr: "Hızlı yürüyüş" }, { cavalryPct: 6, trainCostPct: -8 }],
  ["karaevli", "Karaevli", "gun",
    { en: "“Their tents are black” (Rashid al-Din)", ur: "“Un ke khaime kaale hain” (Rashid al-Din)", tr: "“Evleri kara” (Reşîdüddin)" }, "verified",
    NO_HOUSE, "reported", ["#1c1917", "#d6d3d1"], { en: "Walls", ur: "Fasilein", tr: "Surlar" }, { defensePct: 15 }],
  ["yazir", "Yazır", "ay",
    { en: "Spreads across many lands", ur: "Kai mulkon mein phailne wala", tr: "Pek çok ülkeye yayılan" }, "reported",
    { en: "One of five tribes said to have produced pre-Islamic Oghuz rulers (with Kayı, Avşar, Eymür, Beğdili)", ur: "Un paanch qabilon mein se jin se Islam se pehle Oghuz hukmaran nikle (Kayı, Avşar, Eymür, Beğdili ke saath)", tr: "İslâm öncesi hükümdar çıkaran beş boydan biri (Kayı, Avşar, Eymür, Beğdili ile)" }, "reported",
    ["#15803d", "#e3a800"], { en: "Expansion", ur: "Phailao", tr: "Yayılma" }, { kerestePct: 10, tasPct: 10 }],
  ["doger", "Döğer", "ay",
    { en: "Gatherer", ur: "Ikattha karne wala", tr: "Toplayan" }, "reported",
    { en: "A link to the Artuqids of Mardin is claimed but not established", ur: "Mardin ke Artuqiyon se rishta bataya jata hai magar sabit nahi", tr: "Mardin Artuklularına bağlanır ama kesin değildir" }, "contested",
    ["#1e3a8a", "#d6d3d1"], { en: "Siege", ur: "Muhasara", tr: "Kuşatma" }, { infantryPct: 6, archerPct: 6 }],
  ["dodurga", "Dodurga", "ay",
    { en: "Conqueror and keeper of lands", ur: "Mulk fatah karne aur sambhalne wala", tr: "Ülke alan ve koruyan" }, "reported",
    { en: "Rashid al-Din places it under Ay Han; Abulghazi under Yıldız Han", ur: "Rashid al-Din ise Ay Han ke neeche rakhta hai; Abulghazi Yıldız Han ke", tr: "Reşîdüddin Ay Han'a, Ebülgazi Yıldız Han'a bağlar" }, "contested",
    ["#7f1d1d", "#e3a800"], { en: "Holding ground", ur: "Zameen par qabza", tr: "Yer tutma" }, { defensePct: 8, infantryPct: 5 }],
  ["yaparli", "Yaparlı", "ay",
    { en: "Fragrant, musk-scented", ur: "Khushbudar, mushk jaisa", tr: "Misk kokulu" }, "reported",
    NO_HOUSE, "reported", ["#b45309", "#1c1917"], { en: "Caravans", ur: "Qafile", tr: "Kervanlar" }, { altinPct: 10, azikPct: 5 }],
  ["avsar", "Avşar", "yildiz",
    { en: "Agile, keen hunter", ur: "Phurtila, maahir shikari", tr: "Çevik, avcı" }, "reported",
    { en: "Afsharid dynasty: Nader Shah belonged to the Qırqlu clan of the Avşar", ur: "Afshari khandan: Nadir Shah Avşar ke Qırqlu kunbe se thay", tr: "Afşarlar: Nâdir Şah Avşar'ın Kırklu obasındandı" }, "verified",
    ["#c8102e", "#facc15"], { en: "Horse archers", ur: "Ghur sawar tirandaz", tr: "Atlı okçular" }, { archerPct: 8, cavalryPct: 8 }],
  ["kizik", "Kızık", "yildiz",
    { en: "Strict, disciplined", ur: "Sakht, nazm wala", tr: "Sert, disiplinli" }, "reported",
    NO_HOUSE, "reported", ["#991b1b", "#f5f5f4"], { en: "Discipline", ur: "Nazm o zabt", tr: "Disiplin" }, { infantryPct: 8, trainCostPct: -6 }],
  ["begdili", "Beğdili", "yildiz",
    { en: "“Honoured like the great ones” (Rashid al-Din)", ur: "“Buzurgon jaisa mua'zziz” (Rashid al-Din)", tr: "“Büyükler gibi aziz” (Reşîdüddin)" }, "verified",
    { en: "Named by Rashid al-Din among five ruler-producing tribes; a link to the Khwarazmshahs is debated", ur: "Rashid al-Din ise hukmaran dene wale paanch qabilon mein ginta hai; Khwarazm Shahon se rishta ikhtilafi", tr: "Reşîdüddin hükümdar çıkaran beş boydan sayar; Harezmşahlarla bağı tartışmalı" }, "contested",
    ["#6b21a8", "#e3a800"], { en: "Heavy cavalry", ur: "Bhaari risala", tr: "Ağır süvari" }, { cavalryPct: 14 }],
  ["karkin", "Karkın", "yildiz",
    { en: "Abundant, generous", ur: "Faraawaan, sakhi", tr: "Bol, cömert" }, "reported",
    NO_HOUSE, "reported", ["#166534", "#e3a800"], { en: "Provisions", ur: "Rasad", tr: "Erzak" }, { azikPct: 18 }],
  ["bayindir", "Bayındır", "gok",
    { en: "“A place always full of blessings” (Rashid al-Din)", ur: "“Hamesha barkaton se bhari jagah” (Rashid al-Din)", tr: "“Daima nimetle dolu yer” (Reşîdüddin)" }, "verified",
    { en: "Aq Qoyunlu dynasty of Uzun Hasan, called Bayındırlu in Turkish sources", ur: "Uzun Hasan ka Aq Qoyunlu khandan, Turki manabe mein Bayındırlu", tr: "Uzun Hasan'ın Akkoyunlu hanedanı; Türk kaynaklarında Bayındırlu" }, "verified",
    ["#f5f5f4", "#38bdf8"], { en: "Builders", ur: "Mimaar", tr: "Yapıcılar" }, { buildCostPct: -12 }],
  ["pecenek", "Peçenek", "gok",
    { en: "Striver", ur: "Mehnati", tr: "Çalışkan" }, "reported",
    { en: "The Pechenegs of the Pontic steppe", ur: "Bahr-e-Aswad ke shimali maidanon ke Pechenek", tr: "Karadeniz bozkırlarının Peçenekleri" }, "reported",
    ["#0f766e", "#1c1917"], { en: "Raiders", ur: "Yalghar", tr: "Akıncılar" }, { cavalryPct: 10, huntPct: 8 }],
  ["cavuldur", "Çavuldur", "gok",
    { en: "Famous, honoured", ur: "Mashhoor, mua'zziz", tr: "Ünlü, şerefli" }, "reported",
    { en: "Çaka Bey's tribal origin is not recorded in the sources", ur: "Çaka Bey ka qabila manabe mein darj nahi", tr: "Çaka Bey'in boyu kaynaklarda kayıtlı değil" }, "contested",
    ["#0e7490", "#d6d3d1"], { en: "Flanking", ur: "Pehlu se waar", tr: "Kanat saldırısı" }, { archerPct: 8, cavalryPct: 5 }],
  ["cepni", "Çepni", "gok",
    { en: "Bold vanguard", ur: "Bahadur hirawal", tr: "Cesur öncü" }, "reported",
    { en: "Turkmen settlement of the eastern Black Sea coast", ur: "Mashriqi Bahr-e-Aswad ke saahil par Turkmen abaadi", tr: "Doğu Karadeniz kıyısının Türkmen iskânı" }, "reported",
    ["#7f1d1d", "#1c1917"], { en: "Vanguard", ur: "Hirawal", tr: "Öncü" }, { infantryPct: 6, cavalryPct: 6 }],
  ["salur", "Salur", "dag",
    { en: "“Wherever he is, his sword and mace do the work” (Rashid al-Din)", ur: "“Jahan bhi ho, us ki talwar aur gurz kaam karte hain” (Rashid al-Din)", tr: "“Nerede olsa kılıç ve topuzu iş görür” (Reşîdüddin)" }, "verified",
    { en: "Salghurids of Fars; Kadı Burhaneddin; Salur Kazan of the Dede Korkut epic", ur: "Fars ke Salghuri; Kadı Burhaneddin; Dede Korkut ka Salur Kazan", tr: "Fars Salgurluları; Kadı Burhaneddin; Dede Korkut'ta Salur Kazan" }, "verified",
    ["#c8102e", "#d6d3d1"], { en: "Blades", ur: "Talwarein", tr: "Kılıçlar" }, { infantryPct: 14 }],
  ["eymur", "Eymür", "dag",
    { en: "Wealthy", ur: "Maaldar", tr: "Varlıklı" }, "reported",
    { en: "One of five tribes said to have produced pre-Islamic Oghuz rulers", ur: "Un paanch qabilon mein se jin se Islam se pehle hukmaran nikle", tr: "İslâm öncesi hükümdar çıkaran beş boydan biri" }, "reported",
    ["#92400e", "#1e3a8a"], { en: "Mining", ur: "Kaan kani", tr: "Madencilik" }, { demirPct: 15, tasPct: 5 }],
  ["alayuntlu", "Alayuntlu", "dag",
    { en: "Owners of piebald horses", ur: "Ablaq ghoron wale", tr: "Ala atlı" }, "reported",
    { en: "Horse-breeding groups; no ruling house recorded", ur: "Ghore paalne wale gurooh; koi hukmaran khandan darj nahi", tr: "At yetiştiren topluluklar; hükümdar sülalesi kayıtlı değil" }, "reported",
    ["#78716c", "#e3a800"], { en: "Stud farms", ur: "Astabal", tr: "Haralar" }, { cavalryPct: 10, azikPct: 5 }],
  ["yuregir", "Yüreğir", "dag",
    { en: "Brave, big-hearted", ur: "Dilair, bare dil wala", tr: "Yürekli" }, "reported",
    { en: "Ramadanid beylik of Adana, founded by Ramazan Bey, son of Yüreğir", ur: "Adana ki Ramazanoğulları beylik, Yüreğir ke bete Ramazan Bey ne qaim ki", tr: "Adana'da Yüreğir'in oğlu Ramazan Bey'in kurduğu Ramazanoğulları Beyliği" }, "verified",
    ["#d97706", "#7f1d1d"], { en: "Towers", ur: "Burj", tr: "Kuleler" }, { towerPct: 15, defensePct: 5 }],
  ["igdir", "İğdir", "deniz",
    { en: "Great, noble", ur: "Azeem, shareef", tr: "Ulu, soylu" }, "reported",
    { en: "Anatolian and Iranian Turkmen groups; no ruling house recorded", ur: "Anatolia aur Iran ke Turkmen; koi hukmaran khandan darj nahi", tr: "Anadolu ve İran Türkmenleri; hükümdar sülalesi kayıtlı değil" }, "reported",
    ["#1e40af", "#e3a800"], { en: "Veterans", ur: "Tajurbakaar", tr: "Kıdemliler" }, { infantryPct: 5, archerPct: 5, cavalryPct: 5 }],
  ["bugduz", "Büğdüz", "deniz",
    { en: "Humble, serving", ur: "Munkasir, khidmat guzaar", tr: "Alçakgönüllü, hizmetkâr" }, "reported",
    NO_HOUSE, "reported", ["#4d7c0f", "#f5f5f4"], { en: "Healers", ur: "Hakeem", tr: "Şifacılar" }, { healPct: 30 }],
  ["yiva", "Yıva", "deniz",
    { en: "High in rank", ur: "Buland martaba", tr: "Rütbesi yüce" }, "reported",
    { en: "Yıva meliks ruled in Iranian Kurdistan under the Seljuks; the Qara Qoyunlu link is debated", ur: "Seljuqon ke daur mein Yıva melik Iran ke Kurdistan mein hukmaran thay; Qara Qoyunlu se rishta ikhtilafi", tr: "Selçuklular döneminde Yıva melikleri İran Kürdistanı'nda hüküm sürdü; Karakoyunlu bağı tartışmalı" }, "contested",
    ["#1c1917", "#e3a800"], { en: "Shock raids", ur: "Achaanak yalghar", tr: "Baskın akınları" }, { cavalryPct: 8, huntPct: 10 }],
  ["kinik", "Kınık", "deniz",
    { en: "Honoured", ur: "Mua'zziz", tr: "Şerefli" }, "reported",
    { en: "Great Seljuk dynasty and the Sultanate of Rum; Kashgari names the Kınık as the tribe of the sultans of his day", ur: "Azeem Seljuq khandan aur Saltanat-e-Rum; Kashgari Kınık ko apne daur ke sultanon ka qabila kehta hai", tr: "Büyük Selçuklu ve Türkiye Selçuklu hanedanı; Kâşgarlı Kınık'ı çağının sultanlarının boyu sayar" }, "verified",
    ["#0d9488", "#e3a800"], { en: "Statecraft", ur: "Jahanbani", tr: "Devlet idaresi" }, { azikPct: 5, kerestePct: 5, tasPct: 5, demirPct: 5, altinPct: 5 }],
];

export const TRIBES: Tribe[] = TRIBE_ROWS.map((r, i) => ({
  id: r[0], order: i + 1, name: r[1], son: r[2], wing: SON_BY_ID[r[2]].wing,
  meaning: r[3], meaningConfidence: r[4], legacy: r[5], legacyConfidence: r[6], colors: r[7], specialty: r[8], buffs: r[9],
}));

export const TRIBE_BY_ID: Record<string, Tribe> = Object.fromEntries(TRIBES.map((t) => [t.id, t]));

/** States and beyliks to conquer, with the seat's approximate longitude and latitude for the map. */
type StateRow = [string, string, string, HistoricalState["region"], string, number, [number, number, number], Buffs, [number, number], L, string?, Confidence?];

const STATE_ROWS: StateRow[] = [
  ["yabgu", "Oghuz Yabgu State", "Yangikent", "Central Asia", "9th–11th c.", 1, [15, 10, 5], { azikPct: 4 }, [62.0, 45.0],
    { en: "The yabgus ruled the Oghuz on the lower Syr Darya; Rashid al-Din links them to the Kayı.", ur: "Yabgu Syr Darya ke zairein ilaqe mein Oghuz par hukmaran thay; Rashid al-Din unhein Kayı se jorta hai.", tr: "Yabgular Seyhun'un aşağı kesiminde Oğuzları yönetti; Reşîdüddin onları Kayı'ya bağlar." }, "kayi", "reported"],
  ["pecheneg", "Pecheneg Steppe", "Pontic steppe", "Pontic Steppe", "9th–11th c.", 1, [10, 15, 8], { cavalryPct: 3 }, [34.0, 47.0],
    { en: "The Pechenegs held the steppe north of the Black Sea.", ur: "Pechenek Bahr-e-Aswad ke shimal ke maidanon par qaabiz thay.", tr: "Peçenekler Karadeniz'in kuzeyindeki bozkırı tuttu." }, "pecenek", "reported"],
  ["seljuk", "Great Seljuk Empire", "Isfahan & Merv", "Iran", "1037–1194", 5, [260, 220, 240], { altinPct: 6, azikPct: 6 }, [51.7, 32.7],
    { en: "Founded by Tughril and Chaghri Bey of the Kınık tribe; Alp Arslan won at Malazgirt in 1071.", ur: "Kınık qabile ke Tughril aur Chaghri Bey ne qaim ki; Alp Arslan ne 1071 mein Malazgirt jeeta.", tr: "Kınık boyundan Tuğrul ve Çağrı Bey kurdu; Alp Arslan 1071'de Malazgirt'i kazandı." }, "kinik", "verified"],
  ["rum", "Sultanate of Rum", "Konya", "Anatolia", "1077–1308", 4, [200, 170, 150], { buildCostPct: -4 }, [32.5, 37.9],
    { en: "The Anatolian Seljuk branch of the Kınık, builders of caravanserais and madrasas.", ur: "Kınık ki Anatolian Seljuq shaakh, karwan saraon aur madrason ke banane wale.", tr: "Kınık'ın Anadolu Selçuklu kolu; kervansaray ve medreselerin kurucuları." }, "kinik", "verified"],
  ["ghaznavid", "Ghaznavid Empire", "Ghazni", "Khorasan & Afghanistan", "977–1186", 4, [160, 170, 190], { altinPct: 5 }, [68.4, 33.5],
    { en: "Founded by Sebüktigin, a Turkic mamluk; Mahmud of Ghazni campaigned deep into Hindustan. Oghuz tribe not recorded.", ur: "Turk mamluk Sebüktigin ne qaim ki; Mahmud Ghaznavi ne Hindustan ke andar door tak muhimmat kin. Oghuz qabila darj nahi.", tr: "Türk memlûkü Sebüktigin kurdu; Gazneli Mahmud Hindistan içlerine seferler yaptı. Oğuz boyu kayıtlı değil." }],
  ["ghurid", "Ghurid Sultanate", "Firuzkuh & Ghazni", "Khorasan & Afghanistan", "c. 1148–1215", 4, [170, 160, 170], { infantryPct: 4 }, [64.9, 34.4],
    { en: "The Ghurid house came from Ghor; its Turkic mamluks, among them Aibak, founded the Delhi Sultanate.", ur: "Ghauri khandan Ghor se tha; is ke Turk mamluk, jin mein Aibak bhi thay, ne Delhi Sultanate qaim ki.", tr: "Gurlu hanedanı Gur'dan geldi; Türk memlûkleri, aralarında Aybek, Delhi Sultanlığı'nı kurdu." }],
  ["khwarazm", "Khwarazmian Empire", "Gurganj", "Central Asia", "1077–1231", 4, [140, 130, 220], { cavalryPct: 5 }, [59.1, 42.3],
    { en: "The Anushteginid shahs; Jalal al-Din Mingburnu fought the Mongols to the end. A Beğdili origin is reported but debated.", ur: "Anushtegini shah; Jalaluddin Mingburnu aakhir tak Mongolon se lare. Beğdili se nasab ki riwayat ikhtilafi hai.", tr: "Anuştegin şahları; Celâleddin Mengüberti Moğollarla sonuna dek savaştı. Beğdili kökeni tartışmalı." }, "begdili", "contested"],
  ["salghurid", "Salghurids of Fars", "Shiraz", "Iran", "1148–1282", 3, [130, 80, 70], { infantryPct: 4 }, [52.5, 29.6],
    { en: "Atabegs of Fars from the Salur tribe.", ur: "Salur qabile ke Fars ke atabeg.", tr: "Salur boyundan Fars atabegleri." }, "salur", "verified"],
  ["danishmend", "Danishmendid Emirate", "Sivas", "Anatolia", "1071–1178", 2, [40, 25, 15], { infantryPct: 3 }, [37.0, 39.75],
    { en: "Turkmen dynasty of central Anatolia; tribe not recorded.", ur: "Wasti Anatolia ka Turkmen khandan; qabila darj nahi.", tr: "Orta Anadolu'nun Türkmen hanedanı; boyu kayıtlı değil." }],
  ["saltuk", "Saltukid Beylik", "Erzurum", "Anatolia", "1072–1202", 2, [35, 30, 15], { demirPct: 4 }, [41.3, 39.9],
    { en: "Early Turkmen beylik of eastern Anatolia; tribe not recorded.", ur: "Mashriqi Anatolia ki ibtidai Turkmen beylik; qabila darj nahi.", tr: "Doğu Anadolu'nun ilk Türkmen beyliklerinden; boyu kayıtlı değil." }],
  ["mengujek", "Mengujekid Beylik", "Erzincan", "Anatolia", "1072–1228", 2, [30, 25, 25], { tasPct: 4 }, [39.5, 39.75],
    { en: "Turkmen beylik of the upper Euphrates; tribe not recorded.", ur: "Bala-e-Furat ki Turkmen beylik; qabila darj nahi.", tr: "Yukarı Fırat'ın Türkmen beyliği; boyu kayıtlı değil." }],
  ["caka", "Beylik of Çaka Bey", "İzmir", "Anatolia", "c. 1081–1092", 2, [25, 45, 12], { archerPct: 3 }, [27.1, 38.4],
    { en: "Çaka Bey built the first Turkish fleet in the Aegean; tribe not recorded.", ur: "Çaka Bey ne Bahr-e-Ijiyan mein pehla Turk bahri beda banaya; qabila darj nahi.", tr: "Çaka Bey Ege'de ilk Türk donanmasını kurdu; boyu kayıtlı değil." }],
  ["artuqid", "Artuqid Dynasty", "Mardin & Hasankeyf", "Levant & Iraq", "1102–1409", 3, [110, 90, 60], { tasPct: 5 }, [40.7, 37.3],
    { en: "Turkmen dynasty of Diyarbakır; the Döğer link is claimed but not established.", ur: "Diyarbakır ka Turkmen khandan; Döğer se rishta bataya jata hai magar sabit nahi.", tr: "Diyarbakır'ın Türkmen hanedanı; Döğer bağı ileri sürülür ama kesin değil." }, "doger", "contested"],
  ["zengid", "Zengid Atabegate", "Aleppo & Mosul", "Levant & Iraq", "1127–1250", 3, [120, 100, 80], { infantryPct: 4 }, [37.2, 36.2],
    { en: "Turkic atabegs: Imad al-Din Zengi, son of Aq Sunqur, and Nur al-Din, who united Syria against the Crusaders. Tribe not recorded.", ur: "Turk atabeg: Aq Sunqur ke bete Imaduddin Zangi aur Nooruddin, jinhon ne Saleebiyon ke khilaf Shaam ko mutahid kiya. Qabila darj nahi.", tr: "Türk atabegler: Aksungur oğlu İmâdüddin Zengî ve Haçlılara karşı Suriye'yi birleştiren Nûreddin. Boyu kayıtlı değil." }],
  ["ayyubid", "Ayyubid Sultanate", "Cairo & Damascus", "Egypt", "1171–1260", 4, [150, 150, 170], { altinPct: 5 }, [31.2, 30.0],
    { en: "Salah al-Din, a Kurd, rose in Nur al-Din Zengi's service and freed Jerusalem in 1187 with armies built largely on Turkic horsemen. In 1244 the Khwarazmian remnants of Jalal al-Din's army took Jerusalem for the Ayyubid sultan as-Salih Ayyub.", ur: "Salahuddin, jo Kurd thay, Nooruddin Zangi ki khidmat mein ubhre aur 1187 mein Quds aazaad kiya; un ki fauj ka bara hissa Turk sawar thay. 1244 mein Jalaluddin ki fauj ke bache hue Khwarazmi sipahiyon ne Ayyubi Sultan as-Salih Ayyub ke liye Quds liya.", tr: "Bir Kürt olan Selâhaddin, Nûreddin Zengî'nin hizmetinde yükseldi ve 1187'de büyük ölçüde Türk süvarilerine dayanan ordusuyla Kudüs'ü aldı. 1244'te Celâleddin ordusunun Harezmli kalıntıları Kudüs'ü Eyyûbî sultanı es-Sâlih Eyyûb için aldı." }],
  ["mamluk", "Mamluk Sultanate", "Cairo", "Egypt", "1250–1517", 5, [200, 220, 260], { cavalryPct: 5 }, [31.25, 30.05],
    { en: "Turkic (mostly Kipchak) and later Circassian mamluks; Baybars and Qutuz stopped the Mongols at Ayn Jalut (1260).", ur: "Turk (zyada tar Kipchak) aur baad mein Circassian mamluk; Baybars aur Qutuz ne 1260 mein Ain Jalut par Mongolon ko roka.", tr: "Türk (çoğu Kıpçak) ve sonra Çerkez memlûkler; Baybars ve Kutuz Moğolları Aynicâlût'ta (1260) durdurdu." }],
  ["delhi", "Delhi Sultanate", "Delhi", "Hindustan", "1206–1526", 5, [240, 200, 200], { azikPct: 8 }, [77.2, 28.6],
    { en: "Founded by Qutb al-Din Aibak, a Turkic mamluk of Muhammad of Ghor; Oghuz tribe not recorded.", ur: "Muhammad Ghauri ke Turk mamluk Qutbuddin Aibak ne qaim ki; Oghuz qabila darj nahi.", tr: "Gurlu Muhammed'in Türk memlûkü Kutbüddin Aybek kurdu; Oğuz boyu kayıtlı değil." }],
  ["khalji", "Khalji Sultanate", "Delhi", "Hindustan", "1290–1320", 4, [170, 160, 150], { altinPct: 5 }, [77.3, 28.5],
    { en: "Khalaj Turkic dynasty that held back the Mongols from Hindustan; not one of the 24 Oghuz tribes.", ur: "Khalaj Turk khandan jis ne Mongolon ko Hindustan se roka; Oghuz ke 24 qabilon mein se nahi.", tr: "Moğolları Hindistan'dan uzak tutan Halaç Türk hanedanı; 24 Oğuz boyundan değil." }],
  ["qutbshahi", "Qutb Shahi Sultanate", "Golconda", "Hindustan", "1518–1687", 5, [230, 230, 180], { altinPct: 7 }, [78.4, 17.4],
    { en: "Founded by Sultan Quli of a Qara Qoyunlu family; Oghuz tribe not recorded.", ur: "Qara Qoyunlu khandan ke Sultan Quli ne qaim ki; Oghuz qabila darj nahi.", tr: "Karakoyunlu ailesinden Sultan Kulı kurdu; Oğuz boyu kayıtlı değil." }],
  ["timurid", "Timurid Empire", "Samarkand & Herat", "Central Asia", "1370–1507", 6, [280, 300, 340], { cavalryPct: 6 }, [67.0, 39.65],
    { en: "Timur of the Barlas, a Turkicised Mongol tribe; patrons of Samarkand and Herat. Not one of the 24 Oghuz tribes.", ur: "Barlas qabile ke Timur, Turk ban jane wala Mongol qabila; Samarqand aur Herat ke sarparast. Oghuz ke 24 qabilon mein se nahi.", tr: "Türkleşmiş Moğol boyu Barlas'tan Timur; Semerkant ve Herat'ın hamileri. 24 Oğuz boyundan değil." }],
  ["germiyan", "Germiyanid Beylik", "Kütahya", "Anatolia", "c. 1300–1429", 3, [80, 90, 70], { tasPct: 4 }, [29.98, 39.42],
    { en: "Western Anatolian beylik; an Avşar origin is suggested.", ur: "Maghribi Anatolia ki beylik; Avşar se nasab ka khayal hai.", tr: "Batı Anadolu beyliği; Avşar kökeni ileri sürülür." }, "avsar", "contested"],
  ["candar", "Candarid Beylik", "Kastamonu & Sinop", "Anatolia", "1292–1461", 3, [90, 80, 60], { altinPct: 4 }, [33.78, 41.38],
    { en: "Black Sea beylik with a fleet; Yazıcızade's Selçukname links its house, like the Ottomans, to the Kayı.", ur: "Bahri beda rakhne wali Bahr-e-Aswad ki beylik; Yazıcızade ki Selçukname is ke khandan ko Usmaniyon ki tarah Kayı se jorti hai.", tr: "Donanmalı Karadeniz beyliği; Yazıcızâde'nin Selçuknâmesi hanedanı Osmanlılar gibi Kayı'ya bağlar." }, "kayi", "reported"],
  ["karesi", "Karesid Beylik", "Balıkesir", "Anatolia", "c. 1297–1360", 2, [30, 35, 15], { archerPct: 3 }, [27.9, 39.65],
    { en: "Beylik of the Aegean and Marmara coasts, joined to the Ottomans; tribe not recorded.", ur: "Ijiyan aur Marmara ke saahil ki beylik, Usmaniyon mein shamil hui; qabila darj nahi.", tr: "Ege ve Marmara kıyılarının beyliği, Osmanlılara katıldı; boyu kayıtlı değil." }],
  ["saruhan", "Saruhanid Beylik", "Manisa", "Anatolia", "1313–1410", 2, [35, 30, 20], { azikPct: 4 }, [27.43, 38.61],
    { en: "Aegean beylik of Saruhan Bey; tribe not recorded.", ur: "Saruhan Bey ki Ijiyan beylik; qabila darj nahi.", tr: "Saruhan Bey'in Ege beyliği; boyu kayıtlı değil." }],
  ["aydin", "Aydinid Beylik", "Birgi & İzmir", "Anatolia", "1308–1426", 3, [70, 95, 50], { archerPct: 4 }, [28.06, 38.25],
    { en: "Umur Bey's naval beylik of the Aegean; tribe not recorded.", ur: "Umur Bey ki Ijiyan ki bahri beylik; qabila darj nahi.", tr: "Umur Bey'in Ege'deki denizci beyliği; boyu kayıtlı değil." }],
  ["mentese", "Menteşe Beylik", "Milas & Beçin", "Anatolia", "c. 1261–1424", 2, [35, 40, 15], { kerestePct: 4 }, [27.78, 37.31],
    { en: "South-west Anatolian coastal beylik; tribe not recorded.", ur: "Junoob maghribi Anatolia ki saahili beylik; qabila darj nahi.", tr: "Güneybatı Anadolu kıyı beyliği; boyu kayıtlı değil." }],
  ["hamid", "Hamidid Beylik", "Eğirdir & Antalya", "Anatolia", "c. 1300–1423", 2, [40, 30, 20], { tasPct: 3 }, [30.87, 37.87],
    { en: "Turkmen beylik of the Isparta, Burdur and Eğirdir lakes; tribe not recorded.", ur: "Isparta, Burdur aur Eğirdir jheelon ki Turkmen beylik; qabila darj nahi.", tr: "Isparta, Burdur ve Eğirdir göllerinin Türkmen beyliği; boyu kayıtlı değil." }],
  ["karaman", "Karamanid Beylik", "Karaman & Konya", "Anatolia", "1250–1487", 4, [180, 140, 120], { tasPct: 5 }, [33.2, 37.18],
    { en: "Leading Anatolian beylik. Köprülü linked it to the Salur; Yazıcızade's Selçukname to the Avşar.", ur: "Anatolia ki sab se bari beylik. Köprülü ne ise Salur se joda; Yazıcızade ki Selçukname ne Avşar se.", tr: "Anadolu'nun önde gelen beyliği. Köprülü Salur'a, Yazıcızâde'nin Selçuknâmesi Avşar'a bağlar." }, "salur", "contested"],
  ["ramadanid", "Ramadanid Beylik", "Adana", "Anatolia", "1352–1608", 3, [100, 110, 70], { towerPct: 6 }, [35.32, 37.0],
    { en: "Founded by Ramazan Bey of the Yüreğir tribe.", ur: "Yüreğir qabile ke Ramazan Bey ne qaim ki.", tr: "Yüreğir boyundan Ramazan Bey kurdu." }, "yuregir", "verified"],
  ["dulkadir", "Dulkadirid Beylik", "Elbistan & Maraş", "Anatolia", "1337–1522", 3, [90, 90, 120], { cavalryPct: 4 }, [36.93, 37.58],
    { en: "Turkmen beylik of the Taurus; ruling tribe debated.", ur: "Taurus ki Turkmen beylik; hukmaran qabila ikhtilafi.", tr: "Toroslar'ın Türkmen beyliği; hükümdar boyu tartışmalı." }],
  ["eretna", "Eretnid State", "Sivas & Kayseri", "Anatolia", "1335–1381", 3, [100, 90, 90], { demirPct: 4 }, [35.49, 38.73],
    { en: "Founded by Eretna, an Uyghur commander of the Ilkhanids; not an Oghuz tribe.", ur: "Ilkhaniyon ke Uyghur commander Eretna ne qaim ki; Oghuz qabila nahi.", tr: "İlhanlıların Uygur kumandanı Eretna kurdu; Oğuz boyu değil." }],
  ["kadiburhan", "State of Kadı Burhaneddin", "Sivas & Kayseri", "Anatolia", "1381–1398", 4, [150, 130, 160], { defensePct: 4 }, [37.02, 39.73],
    { en: "Founded by Kadı Burhaneddin, of a family of the Salur tribe.", ur: "Salur qabile ke khandan se Kadı Burhaneddin ne qaim ki.", tr: "Salur boyundan bir aileden gelen Kadı Burhaneddin kurdu." }, "salur", "reported"],
  ["qaraqoyunlu", "Qara Qoyunlu", "Tabriz & Van", "Caucasus", "1375–1468", 5, [210, 180, 260], { cavalryPct: 5 }, [46.3, 38.08],
    { en: "Turkmen confederation of the Black Sheep; a Yıva origin is reported but debated.", ur: "Kaali Bheir ka Turkmen ittehad; Yıva se nasab ki riwayat ikhtilafi.", tr: "Karakoyunlu Türkmen birliği; Yıva kökeni tartışmalı." }, "yiva", "contested"],
  ["aqqoyunlu", "Aq Qoyunlu", "Diyarbakır & Tabriz", "Caucasus", "1378–1503", 5, [220, 200, 250], { buildCostPct: -5 }, [40.23, 37.91],
    { en: "Uzun Hasan's confederation of the White Sheep, ruled by the Bayındır house.", ur: "Uzun Hasan ka Safed Bheir ittehad, Bayındır khandan ki hukumat.", tr: "Uzun Hasan'ın Akkoyunlu birliği; Bayındır hanedanı yönetti." }, "bayindir", "verified"],
  ["ottoman", "Ottoman Beylik", "Söğüt & Bursa", "Anatolia", "1299–1922", 6, [320, 260, 260], { defensePct: 6, infantryPct: 4 }, [30.18, 40.02],
    { en: "Osman Gazi's beylik at Söğüt, which grew into a world empire; Ottoman tradition traces the dynasty to the Kayı.", ur: "Söğüt mein Osman Gazi ki beylik jo aalami saltanat bani; Usmani riwayat khandan ko Kayı se jorti hai.", tr: "Söğüt'te Osman Gazi'nin beyliği bir cihan devletine dönüştü; Osmanlı geleneği hanedanı Kayı'ya bağlar." }, "kayi", "reported"],
  ["afsharid", "Afsharid Empire", "Mashhad", "Iran", "1736–1796", 6, [260, 300, 320], { archerPct: 6, cavalryPct: 4 }, [59.6, 36.3],
    { en: "Nader Shah's empire, of the Avşar tribe.", ur: "Avşar qabile ke Nadir Shah ki saltanat.", tr: "Avşar boyundan Nâdir Şah'ın imparatorluğu." }, "avsar", "verified"],
  ["qajar", "Qajar Iran", "Tehran", "Iran", "1789–1925", 6, [300, 280, 280], { altinPct: 8 }, [51.4, 35.7],
    { en: "Founded by Agha Mohammad Khan of the Qajar tribe; its link to the 24 tribes is debated.", ur: "Qajar qabile ke Agha Muhammad Khan ne qaim ki; 24 qabilon se rishta ikhtilafi.", tr: "Kaçar boyundan Ağa Muhammed Han kurdu; 24 boyla bağı tartışmalı." }],
];

export const STATES: HistoricalState[] = STATE_ROWS.map((r) => ({
  id: r[0], name: r[1], seat: r[2], region: r[3], era: r[4], tier: r[5],
  defenders: { azap: r[6][0], okcu: r[6][1], sipahi: r[6][2] }, tribute: r[7], lonLat: r[8],
  note: r[9], tribeLink: r[10], linkConfidence: r[11],
}));

type HeroRow = [string, string, string, Hero["troop"], string | undefined, L, string, number, number, Hero["gender"], [string, string]];

/** Heroes. Tribe is given only where the sources or the epic tradition give one; the others are allied commanders. */
const HERO_ROWS: HeroRow[] = [
  ["ertugrul", "Ertuğrul Gazi", "Cavalry · Command", "sipahi", "kayi", { en: "Father of Osman, settled at Söğüt on the Byzantine frontier", ur: "Osman ke walid, Byzantine sarhad par Söğüt mein aabaad hue", tr: "Osman'ın babası, Bizans uç bölgesinde Söğüt'e yerleşti" }, "Söğüt Frontier Raid", 16, 1000, "m", ["#7f1d1d", "#e3a800"]],
  ["osman", "Osman Gazi", "Infantry · Command", "azap", "kayi", { en: "Founder of the Ottoman beylik (c. 1299)", ur: "Usmani beylik ke baani (taqreeban 1299)", tr: "Osmanlı Beyliği'nin kurucusu (y. 1299)" }, "Iron Shield of Söğüt", 20, 0, "m", ["#1f4e9c", "#e3a800"]],
  ["orhan", "Orhan Gazi", "Infantry · Siege", "azap", "kayi", { en: "Took Bursa (1326) and made it the Ottoman capital", ur: "1326 mein Bursa fatah kar ke Usmani darul hukumat banaya", tr: "Bursa'yı aldı (1326) ve başkent yaptı" }, "Bursa Siege", 18, 1800, "m", ["#166534", "#e3a800"]],
  ["fatih", "Sultan Mehmed Fatih", "Archers · Siege", "okcu", "kayi", { en: "Conquered Constantinople in 1453", ur: "1453 mein Qustuntunia fatah kiya", tr: "1453'te İstanbul'u fethetti" }, "Great Bombards", 24, 4000, "m", ["#c8102e", "#e3a800"]],
  ["tugrul", "Tuğrul Bey", "Cavalry · Command", "sipahi", "kinik", { en: "Founder of the Great Seljuk state; entered Baghdad in 1055", ur: "Azeem Seljuq riyasat ke baani; 1055 mein Baghdad mein daakhil hue", tr: "Büyük Selçuklu'nun kurucusu; 1055'te Bağdat'a girdi" }, "Dandanakan", 20, 2600, "m", ["#0d9488", "#e3a800"]],
  ["cagri", "Çağrı Bey", "Cavalry", "sipahi", "kinik", { en: "Tuğrul's brother; together they won at Dandanakan (1040)", ur: "Tuğrul ke bhai; dono ne 1040 mein Dandanakan jeeta", tr: "Tuğrul'un kardeşi; birlikte Dandanakan'ı (1040) kazandılar" }, "Khorasan Riders", 18, 2200, "m", ["#0f766e", "#d6d3d1"]],
  ["alparslan", "Sultan Alp Arslan", "Cavalry · Command", "sipahi", "kinik", { en: "Great Seljuk sultan, victor of Malazgirt (1071)", ur: "Azeem Seljuq sultan, Malazgirt (1071) ke fateh", tr: "Büyük Selçuklu sultanı, Malazgirt galibi (1071)" }, "Turan Pincer", 22, 3000, "m", ["#1f4e9c", "#5fa65a"]],
  ["melikshah", "Sultan Melikşah", "Support · Statecraft", "support", "kinik", { en: "Under him and his vizier Nizam al-Mulk the Seljuk realm reached its height", ur: "In ke aur wazeer Nizam ul Mulk ke daur mein Seljuq saltanat urooj par pohanchi", tr: "Onun ve veziri Nizâmülmülk'ün döneminde Selçuklu zirveye ulaştı" }, "Nizamiye Madrasas", 12, 2800, "m", ["#0d9488", "#f5f5f4"]],
  ["kilicarslan", "Kılıç Arslan I", "Archers", "okcu", "kinik", { en: "Seljuk sultan of Rum who faced the First Crusade", ur: "Rum ke Seljuq sultan jinhon ne pehli Saleebi jang ka muqabla kiya", tr: "Birinci Haçlı Seferi'ne karşı koyan Türkiye Selçuklu sultanı" }, "Steppe Arrow Rain", 18, 2200, "m", ["#7f1d1d", "#d6d3d1"]],
  ["mahmudghazni", "Mahmud of Ghazni", "Cavalry · Raider", "sipahi", undefined, { en: "Turkic Ghaznavid sultan who campaigned deep into Hindustan", ur: "Turk Ghaznavi sultan jinhon ne Hindustan ke andar door tak muhimmat kin", tr: "Hindistan içlerine seferler yapan Türk Gazneli sultanı" }, "Seventeen Campaigns", 18, 2400, "m", ["#166534", "#e3a800"]],
  ["jalaladdin", "Jalal al-Din Mingburnu", "Cavalry", "sipahi", undefined, { en: "Last Khwarazmshah, fought the Mongols from the Indus to Anatolia", ur: "Aakhri Khwarazm Shah, Sindh se Anatolia tak Mongolon se lare", tr: "Son Harezmşah; İndus'tan Anadolu'ya Moğollarla savaştı" }, "Indus Crossing", 20, 2600, "m", ["#6b21a8", "#e3a800"]],
  ["nuraddin", "Nur al-Din Zengi", "Infantry · Support", "azap", undefined, { en: "Turkic Zengid ruler who united Syria against the Crusaders", ur: "Turk Zangi hukmaran jinhon ne Saleebiyon ke khilaf Shaam ko mutahid kiya", tr: "Haçlılara karşı Suriye'yi birleştiren Türk Zengî hükümdarı" }, "Aleppo Bastion", 18, 2400, "m", ["#1e3a8a", "#f5f5f4"]],
  ["salahaddin", "Salah al-Din Ayyubi", "Cavalry · Support", "sipahi", undefined, { en: "Kurdish sultan who rose in Nur al-Din's service; freed Jerusalem in 1187 with largely Turkic cavalry", ur: "Kurd sultan jo Nooruddin ki khidmat mein ubhre; 1187 mein zyada tar Turk sawaron ke saath Quds aazaad kiya", tr: "Nûreddin'in hizmetinde yükselen Kürt sultan; 1187'de çoğu Türk süvarisiyle Kudüs'ü aldı" }, "Turkic Regiments of Hattin", 20, 3000, "m", ["#e3a800", "#1c1917"]],
  ["baybars", "Sultan Baybars", "Cavalry", "sipahi", undefined, { en: "Kipchak Turkic mamluk; fought at Ayn Jalut (1260) and became sultan", ur: "Kipchak Turk mamluk; 1260 mein Ain Jalut mein lare aur sultan bane", tr: "Kıpçak Türkü memlûk; Aynicâlût'ta (1260) savaştı ve sultan oldu" }, "Ayn Jalut", 22, 3200, "m", ["#c8102e", "#f5f5f4"]],
  ["aibak", "Qutb al-Din Aibak", "Infantry · Siege", "azap", undefined, { en: "Turkic mamluk, first sultan of Delhi", ur: "Turk mamluk, Delhi ke pehle sultan", tr: "Türk memlûkü, ilk Delhi sultanı" }, "Lakh-Bakhsh Vanguard", 16, 2000, "m", ["#1e40af", "#e3a800"]],
  ["uzunhasan", "Uzun Hasan", "Cavalry", "sipahi", "bayindir", { en: "Aq Qoyunlu ruler", ur: "Aq Qoyunlu hukmaran", tr: "Akkoyunlu hükümdarı" }, "White Sheep Charge", 18, 2400, "m", ["#f5f5f4", "#38bdf8"]],
  ["nadershah", "Nader Shah Afshar", "Archers", "okcu", "avsar", { en: "Founder of the Afsharid empire", ur: "Afshari saltanat ke baani", tr: "Afşar İmparatorluğu'nun kurucusu" }, "Zamburak Volley", 22, 3200, "m", ["#c8102e", "#facc15"]],
  ["barbaros", "Barbaros Hayreddin Pasha", "Archers · Naval", "okcu", undefined, { en: "Ottoman grand admiral, victor at Preveza (1538)", ur: "Usmani amir-ul-bahr, Preveza (1538) ke fateh", tr: "Osmanlı kaptan-ı deryası, Preveze galibi (1538)" }, "Preveza Broadside", 20, 2800, "m", ["#1e3a8a", "#c8102e"]],
  ["dedekorkut", "Dede Korkut", "Support · Wisdom", "support", "bayat", { en: "Sage of the Oghuz epic", ur: "Oghuz dastan ke daana buzurg", tr: "Oğuz destanının bilgesi" }, "Kopuz Blessing", 10, 1200, "m", ["#f5f5f4", "#5fa65a"]],
  ["salurkazan", "Salur Kazan", "Infantry · Hunter", "azap", "salur", { en: "Hero of the Dede Korkut epic", ur: "Dede Korkut dastan ke hero", tr: "Dede Korkut destanının kahramanı" }, "Beast Slayer", 18, 1800, "m", ["#c8102e", "#d6d3d1"]],
  ["banucicek", "Banu Çiçek", "Mounted archer", "okcu", undefined, { en: "Heroine of the Dede Korkut epic, a rider and archer", ur: "Dede Korkut dastan ki heroine, sawar aur tirandaz", tr: "Dede Korkut destanının kadın kahramanı; binici ve okçu" }, "Twin Steppe Arrows", 16, 1600, "f", ["#1f4e9c", "#f5f5f4"]],
  ["selcanhatun", "Selcan Hatun", "Cavalry duelist", "sipahi", undefined, { en: "Heroine of the Dede Korkut epic", ur: "Dede Korkut dastan ki heroine", tr: "Dede Korkut destanının kadın kahramanı" }, "Thunder Sabre", 16, 1600, "f", ["#7f1d1d", "#e3a800"]],
];

export const HEROES: Hero[] = HERO_ROWS.map((r) => ({
  id: r[0], name: r[1], role: r[2], troop: r[3], tribe: r[4], origin: r[5], skill: r[6], power: r[7], unlockCost: r[8],
  gender: r[9], colors: r[10],
}));

export const HERO_BY_ID: Record<string, Hero> = Object.fromEntries(HEROES.map((h) => [h.id, h]));

export const BEASTS: Beast[] = [
  { id: "geyik", name: { en: "Red stag", ur: "Laal barahsingha", tr: "Kızıl Geyik" }, power: 40, reward: { azik: 400, celik: 4 }, xp: 20, cooldownMin: 10 },
  { id: "domuz", name: { en: "Wild boar", ur: "Jangli suar", tr: "Yaban Domuzu" }, power: 90, reward: { azik: 600, demir: 120, celik: 8 }, xp: 35, cooldownMin: 20 },
  { id: "bozkurt", name: { en: "Grey wolf pack", ur: "Bhure bheriyon ka gol", tr: "Bozkurt sürüsü" }, power: 180, reward: { altin: 300, celik: 16 }, xp: 60, cooldownMin: 45 },
  { id: "bozayi", name: { en: "Boz Ayı, the raging steppe bear", ur: "Boz Ayı, ghazabnak bhaloo", tr: "Boz Ayı" }, power: 650, reward: { altin: 1500, celik: 80 }, xp: 250, cooldownMin: 48 * 60, boss: true },
];

export const RESOURCE_INFO: Record<ResourceId, { name: string; label: L; color: string }> = {
  azik: { name: "Azık", label: { en: "Food", ur: "Khurak", tr: "Azık", ar: "زاد", fa: "آذوقه" }, color: "#5fa65a" },
  kereste: { name: "Kereste", label: { en: "Wood", ur: "Lakri", tr: "Kereste", ar: "خشب", fa: "چوب" }, color: "#a16207" },
  tas: { name: "Taş", label: { en: "Stone", ur: "Pathar", tr: "Taş", ar: "حجر", fa: "سنگ" }, color: "#a8a29e" },
  demir: { name: "Demir", label: { en: "Iron", ur: "Lohaa", tr: "Demir", ar: "حديد", fa: "آهن" }, color: "#64748b" },
  altin: { name: "Altın", label: { en: "Gold", ur: "Sona", tr: "Altın", ar: "ذهب", fa: "زر" }, color: "#e3a800" },
  celik: { name: "Çelik", label: { en: "Forged steel", ur: "Dövme çelik", tr: "Dövme çelik", ar: "فولاذ", fa: "پولاد" }, color: "#38bdf8" },
};

export interface BuildingInfo {
  id: BuildingId;
  name: string;
  label: L;
  text: L;
  baseCost: Partial<Resources>;
}

export const BUILDINGS: BuildingInfo[] = [
  { id: "otag", name: "Otağ", label: { en: "Royal command tent", ur: "Shahi khaima", tr: "Hükümdar çadırı" }, text: { en: "Other buildings can be at most one level above it; adds gold tax and pasture.", ur: "Baqi imaratein is se zyada se zyada ek level upar; sona aur charagah barhata hai.", tr: "Diğer yapılar en fazla bir seviye yukarı çıkabilir; vergi ve otlak ekler." }, baseCost: { kereste: 300, tas: 250, altin: 120 } },
  { id: "cami", name: "Cami", label: { en: "Mosque", ur: "Masjid", tr: "Cami" }, text: { en: "The heart of the oba: +2% power for all troops per level.", ur: "Oba ka dil: har level par tamam fauj ki taqat +2%.", tr: "Obanın kalbi: her seviyede tüm askerlere +%2 güç." }, baseCost: { kereste: 250, tas: 350, altin: 150 } },
  { id: "medrese", name: "Medrese", label: { en: "Madrasa", ur: "Madrasa", tr: "Medrese" }, text: { en: "Learning and strategy: +10% hero experience per level.", ur: "Ilm aur hikmat-e-amali: har level par hero XP +10%.", tr: "İlim ve strateji: her seviyede +%10 kahraman tecrübesi." }, baseCost: { kereste: 220, tas: 280, altin: 180 } },
  { id: "kervansaray", name: "Kervansaray", label: { en: "Caravanserai", ur: "Karwan sarai", tr: "Kervansaray" }, text: { en: "Trade on the Silk Road: +0.3 gold per second per level.", ur: "Shahrah-e-Resham ki tijarat: har level par +0.3 sona fi second.", tr: "İpek Yolu ticareti: her seviyede saniyede +0,3 altın." }, baseCost: { kereste: 260, tas: 300, azik: 200 } },
  { id: "ciftlik", name: "Çiftlik", label: { en: "Fields", ur: "Khait", tr: "Tarla" }, text: { en: "Produces food.", ur: "Khurak paida karta hai.", tr: "Azık üretir." }, baseCost: { kereste: 80, tas: 40 } },
  { id: "kerestehane", name: "Kerestehane", label: { en: "Lumber camp", ur: "Lakri ka karkhana", tr: "Kerestehane" }, text: { en: "Produces wood.", ur: "Lakri paida karta hai.", tr: "Kereste üretir." }, baseCost: { azik: 60, tas: 50 } },
  { id: "tasocagi", name: "Taş Ocağı", label: { en: "Quarry", ur: "Pathar ki kaan", tr: "Taş ocağı" }, text: { en: "Produces stone.", ur: "Pathar nikalta hai.", tr: "Taş üretir." }, baseCost: { azik: 60, kereste: 70 } },
  { id: "maden", name: "Maden", label: { en: "Iron mine", ur: "Lohe ki kaan", tr: "Demir madeni" }, text: { en: "Produces iron.", ur: "Lohaa nikalta hai.", tr: "Demir üretir." }, baseCost: { azik: 80, kereste: 90, tas: 60 } },
  { id: "depo", name: "Depo", label: { en: "Storehouse", ur: "Godam", tr: "Depo" }, text: { en: "Raises how much of each resource you can hold.", ur: "Har cheez ka zakheera barhata hai.", tr: "Her kaynaktan ne kadar tutabileceğini artırır." }, baseCost: { kereste: 150, tas: 150 } },
  { id: "kisla", name: "Kışla", label: { en: "Barracks", ur: "Chhaoni", tr: "Kışla" }, text: { en: "Trains Azap and Okçu; raises the army limit.", ur: "Azap aur Okçu tayyar karta hai; fauj ki hadd barhata hai.", tr: "Azap ve okçu yetiştirir; ordu sınırını artırır." }, baseCost: { kereste: 160, tas: 120, azik: 100 } },
  { id: "ahir", name: "Ahır", label: { en: "Stables", ur: "Astabal", tr: "Ahır" }, text: { en: "Unlocks Sipahi and raises the army limit.", ur: "Sipahi kholta hai aur fauj ki hadd barhata hai.", tr: "Sipahiyi açar ve ordu sınırını artırır." }, baseCost: { kereste: 200, tas: 100, azik: 200 } },
  { id: "demirci", name: "Demirci", label: { en: "Blacksmith", ur: "Lohar", tr: "Demirci" }, text: { en: "Forges steel from iron; steel raises heroes' levels.", ur: "Lohe se çelik banata hai; çelik heroes ka level barhata hai.", tr: "Demirden çelik döver; çelik kahramanları yükseltir." }, baseCost: { tas: 200, demir: 150 } },
  { id: "sifahane", name: "Şifahane", label: { en: "Hospital", ur: "Shifa khana", tr: "Şifahane" }, text: { en: "Heals wounded troops back into the army.", ur: "Zakhmi sipahiyon ko theek kar ke fauj mein wapas bhejta hai.", tr: "Yaralı askerleri iyileştirip orduya döndürür." }, baseCost: { kereste: 180, tas: 160, altin: 80 } },
];

export const TROOPS: Record<TroopId, { name: string; label: L; power: number; cost: Partial<Resources>; beats: TroopId; building: BuildingId }> = {
  azap: { name: "Azap", label: { en: "Infantry", ur: "Piyada", tr: "Piyade", ar: "مشاة", fa: "پیاده" }, power: 1.0, cost: { azik: 20, kereste: 10, altin: 2 }, beats: "okcu", building: "kisla" },
  okcu: { name: "Okçu", label: { en: "Archers", ur: "Tirandaz", tr: "Okçu", ar: "رماة", fa: "کماندار" }, power: 1.1, cost: { azik: 20, kereste: 25, altin: 3 }, beats: "sipahi", building: "kisla" },
  sipahi: { name: "Sipahi", label: { en: "Cavalry", ur: "Sawar", tr: "Süvari", ar: "فرسان", fa: "سوار" }, power: 1.8, cost: { azik: 40, demir: 15, altin: 6 }, beats: "azap", building: "ahir" },
};

export const HERDS: Record<HerdId, { name: string; label: L; cost: number; text: L }> = {
  koyun: { name: "Koyun", label: { en: "Sheep flock", ur: "Bheiron ka rewar", tr: "Koyun sürüsü" }, cost: 60, text: { en: "+0.25 food/s each", ur: "har ek +0.25 khurak/s", tr: "her biri +0,25 azık/sn" } },
  at: { name: "Türkmen Atı", label: { en: "Warhorses", ur: "Jangi ghore", tr: "Türkmen atı" }, cost: 160, text: { en: "+1% cavalry power each (max 30%)", ur: "har ek sawar taqat +1% (zyada se zyada 30%)", tr: "her biri +%1 süvari gücü (en çok %30)" } },
  deve: { name: "Baktriya Devesi", label: { en: "Bactrian camels", ur: "Do kohan wale oont", tr: "Baktriya devesi" }, cost: 220, text: { en: "+0.06 gold/s each", ur: "har ek +0.06 sona/s", tr: "her biri +0,06 altın/sn" } },
};

export const TOWERS: Record<TowerType, { name: string; label: L; cost: Partial<Resources>; damage: number; range: number; cooldown: number; splash: number; color: string }> = {
  gozcu: { name: "Gözcü Kulesi", label: { en: "Watchtower", ur: "Nigrani burj", tr: "Gözcü kulesi" }, cost: { kereste: 120, tas: 60 }, damage: 6, range: 95, cooldown: 0.35, splash: 0, color: "#5fa65a" },
  okcuBurcu: { name: "Okçu Burcu", label: { en: "Archer tower", ur: "Tirandaz burj", tr: "Okçu burcu" }, cost: { kereste: 200, tas: 150, altin: 40 }, damage: 16, range: 80, cooldown: 0.7, splash: 0, color: "#e3a800" },
  mancinik: { name: "Mancınık", label: { en: "Catapult", ur: "Manjaniq", tr: "Mancınık" }, cost: { kereste: 260, tas: 260, demir: 80 }, damage: 34, range: 110, cooldown: 1.8, splash: 28, color: "#c8102e" },
};

export const SOURCES = [
  "Rashid al-Din, Jāmiʿ al-Tawārīkh (Oghuzname), early 14th c.",
  "Mahmud al-Kashgari, Dīwān Lughāt al-Turk (1072–74).",
  "Faruk Sümer, Oğuzlar (Türkmenler): Tarihleri, Boy Teşkilâtı, Destanları (1980).",
  "TDV İslâm Ansiklopedisi: entries Kayı, Bayat, Bayındır, Beydili, Salur, Yıva, Üçoklar, Bozoklar, Akkoyunlular, Özeroğulları, Candaroğulları.",
  "Encyclopaedia Iranica: Afšār.",
];

/** Names of the bonuses shown on tribes, states and tribute. */
export const BUFF_LABELS: Record<string, L> = {
  azikPct: { en: "food", ur: "khurak", tr: "azık", ar: "زاد", fa: "آذوقه" },
  kerestePct: { en: "wood", ur: "lakri", tr: "kereste", ar: "خشب", fa: "چوب" },
  tasPct: { en: "stone", ur: "pathar", tr: "taş", ar: "حجر", fa: "سنگ" },
  demirPct: { en: "iron", ur: "lohaa", tr: "demir", ar: "حديد", fa: "آهن" },
  altinPct: { en: "gold", ur: "sona", tr: "altın", ar: "ذهب", fa: "زر" },
  infantryPct: { en: "infantry", ur: "piyada", tr: "piyade", ar: "المشاة", fa: "پیاده" },
  archerPct: { en: "archers", ur: "tirandaz", tr: "okçu", ar: "الرماة", fa: "کماندار" },
  cavalryPct: { en: "cavalry", ur: "sawar", tr: "süvari", ar: "الفرسان", fa: "سوار" },
  defensePct: { en: "defence", ur: "difa", tr: "savunma", ar: "الدفاع", fa: "دفاع" },
  buildCostPct: { en: "building cost", ur: "tameer ki laagat", tr: "inşa maliyeti", ar: "كلفة البناء", fa: "هزینه ساخت" },
  trainCostPct: { en: "training cost", ur: "tarbiyat ki laagat", tr: "eğitim maliyeti", ar: "كلفة التدريب", fa: "هزینه آموزش" },
  healPct: { en: "healing", ur: "shifa", tr: "şifa", ar: "الشفاء", fa: "درمان" },
  huntPct: { en: "hunting", ur: "shikar", tr: "av", ar: "الصيد", fa: "شکار" },
  towerPct: { en: "towers", ur: "burj", tr: "kuleler", ar: "الأبراج", fa: "برج‌ها" },
};
