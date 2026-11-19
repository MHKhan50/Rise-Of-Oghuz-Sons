import type { L } from "../i18n";
import type { Confidence, TroopId } from "../types/game";

/*
 * Paths through history.
 *
 * A path is the story of one state: the player's tribe starts as an oba and grows era by era until the state
 * reaches its historical extent. Each era has a ruler, the companions remembered with that ruler, and goals:
 * frontier forts to take, Muslim states to unite with, hunts, the Otağ level and frontier defence.
 * Dates follow the standard references listed in SOURCES (oghuzData.ts). Where the chronicles disagree the
 * item carries "reported" or "contested".
 */

export type HolderId = "byz" | "bul" | "ser" | "bos" | "hun" | "hab" | "ven" | "ita" | "nap" | "mol" | "cru" | "kni" | "geo" | "mon" | "hin" | "pol" | "rus" | "gre";

export const HOLDERS: Record<HolderId, { name: L; colors: [string, string]; mix: [number, number, number] }> = {
  byz: { name: { en: "Byzantine Empire", ur: "Byzantine saltanat", tr: "Bizans", ar: "الإمبراطورية البيزنطية", fa: "امپراتوری بیزانس" }, colors: ["#7e22ce", "#e3a800"], mix: [0.5, 0.3, 0.2] },
  bul: { name: { en: "Bulgarian Tsardom", ur: "Bulgarian riyasat", tr: "Bulgar Çarlığı", ar: "مملكة البلغار", fa: "تزارنشین بلغار" }, colors: ["#166534", "#f5f5f4"], mix: [0.45, 0.2, 0.35] },
  ser: { name: { en: "Serbian lords", ur: "Serb umara", tr: "Sırp beyleri", ar: "أمراء الصرب", fa: "امیران صرب" }, colors: ["#991b1b", "#f5f5f4"], mix: [0.4, 0.2, 0.4] },
  bos: { name: { en: "Kingdom of Bosnia", ur: "Bosnia ki badshahat", tr: "Bosna Krallığı", ar: "مملكة البوسنة", fa: "پادشاهی بوسنی" }, colors: ["#1e3a8a", "#e3a800"], mix: [0.45, 0.25, 0.3] },
  hun: { name: { en: "Kingdom of Hungary", ur: "Hungary ki badshahat", tr: "Macar Krallığı", ar: "مملكة المجر", fa: "پادشاهی مجارستان" }, colors: ["#b91c1c", "#166534"], mix: [0.3, 0.2, 0.5] },
  hab: { name: { en: "Habsburg forces", ur: "Habsburg fauj", tr: "Habsburg kuvvetleri", ar: "قوات آل هابسبورغ", fa: "نیروهای هابسبورگ" }, colors: ["#e3a800", "#1c1917"], mix: [0.5, 0.4, 0.1] },
  ven: { name: { en: "Republic of Venice", ur: "Venice ki jamhuriya", tr: "Venedik", ar: "جمهورية البندقية", fa: "جمهوری ونیز" }, colors: ["#b91c1c", "#e3a800"], mix: [0.4, 0.5, 0.1] },
  ita: { name: { en: "Italian lords of Epirus", ur: "Epirus ke Italvi umara", tr: "Epir'in İtalyan beyleri", ar: "أمراء إبيروس الإيطاليون", fa: "امیران ایتالیایی اپیروس" }, colors: ["#0f766e", "#f5f5f4"], mix: [0.45, 0.35, 0.2] },
  nap: { name: { en: "Kingdom of Naples", ur: "Naples ki badshahat", tr: "Napoli Krallığı", ar: "مملكة نابولي", fa: "پادشاهی ناپل" }, colors: ["#1e40af", "#f5f5f4"], mix: [0.45, 0.35, 0.2] },
  mol: { name: { en: "Principality of Moldavia", ur: "Moldavia ki riyasat", tr: "Boğdan Prensliği", ar: "إمارة البغدان", fa: "امیرنشین مولداوی" }, colors: ["#1e3a8a", "#c8102e"], mix: [0.4, 0.2, 0.4] },
  cru: { name: { en: "Crusader forces", ur: "Saleebi fauj", tr: "Haçlı kuvvetleri", ar: "القوات الصليبية", fa: "نیروهای صلیبی" }, colors: ["#f5f5f4", "#c8102e"], mix: [0.4, 0.2, 0.4] },
  kni: { name: { en: "Knights of St John", ur: "St John ke naait", tr: "Saint-Jean Şövalyeleri", ar: "فرسان القديس يوحنا", fa: "شوالیه‌های سن‌ژان" }, colors: ["#c8102e", "#f5f5f4"], mix: [0.55, 0.35, 0.1] },
  geo: { name: { en: "Kingdom of Georgia", ur: "Georgia ki badshahat", tr: "Gürcü Krallığı", ar: "مملكة الكرج", fa: "پادشاهی گرجستان" }, colors: ["#f5f5f4", "#b91c1c"], mix: [0.4, 0.3, 0.3] },
  mon: { name: { en: "Mongol armies", ur: "Mongol lashkar", tr: "Moğol orduları", ar: "جيوش المغول", fa: "سپاهیان مغول" }, colors: ["#57534e", "#d6d3d1"], mix: [0.1, 0.4, 0.5] },
  hin: { name: { en: "Rajput and Hindu kingdoms", ur: "Rajput aur Hindu riyasatein", tr: "Racput ve Hindu krallıkları", ar: "ممالك الراجبوت والهندوس", fa: "پادشاهی‌های راجپوت و هندو" }, colors: ["#ea580c", "#e3a800"], mix: [0.5, 0.2, 0.3] },
  pol: { name: { en: "Polish–Lithuanian Commonwealth", ur: "Poland–Lithuania", tr: "Lehistan", ar: "بولندا وليتوانيا", fa: "لهستان و لیتوانی" }, colors: ["#f5f5f4", "#c8102e"], mix: [0.3, 0.2, 0.5] },
  rus: { name: { en: "Russian Empire", ur: "Roosi saltanat", tr: "Rus İmparatorluğu", ar: "الإمبراطورية الروسية", fa: "امپراتوری روسیه" }, colors: ["#1c1917", "#e3a800"], mix: [0.5, 0.4, 0.1] },
  gre: { name: { en: "Kingdom of Greece", ur: "Yunan ki badshahat", tr: "Yunan Krallığı", ar: "مملكة اليونان", fa: "پادشاهی یونان" }, colors: ["#1e40af", "#f5f5f4"], mix: [0.5, 0.35, 0.15] },
};

export interface Fort {
  id: string;
  name: string;
  /** Today's name when it differs. */
  modern?: string;
  holder: HolderId;
  lonLat: [number, number];
  year: string;
  tier: number;
  /** True for a field battle rather than a fortress. */
  battle?: boolean;
  conf: Confidence;
}

export interface EraGoal {
  forts?: string[];
  /** Number of Muslim and Turkic states united (cumulative), or the exact states. */
  unions?: number | string[];
  /** Successful hunts (cumulative). */
  hunts?: number;
  otag?: number;
  /** Frontier waves held (cumulative). */
  wave?: number;
}

/** The name a troop type carries in an era; an era inherits the units of earlier eras. */
export interface Unit {
  name: string;
  note: L;
  conf: Confidence;
}

/** The banner of an era. Tuğ: horse-tail standard with the tribe's game emblem. */
export interface EraBanner {
  kind: "tug" | "red" | "redCrescent" | "redCrescentStar";
  note: L;
  conf: Confidence;
}

export interface Era {
  id: string;
  /** Hero id of the ruler; none for an opening oba era. */
  ruler?: string;
  title: L;
  years: string;
  /** Every ruler of the era, so the silsile leaves no one out. */
  rulers: string[];
  companions: string[];
  goal: EraGoal;
  note: L;
  conf: Confidence;
  units?: Partial<Record<TroopId, Unit>>;
  banner?: EraBanner;
}

export interface Ocak {
  id: string;
  name: string;
  text: L;
  /** Commanders in order; each joins in the era given. */
  commanders: { hero: string; era: number }[];
}

export interface Path {
  id: string;
  name: L;
  /** Tribes the sources link to this state; any other tribe may join it as an ally. */
  tribes: string[];
  /** Id in STATES (oghuzData) of the state this path builds. */
  state?: string;
  eras: Era[];
  forts: Fort[];
  ocaks: Ocak[];
  /** Rulers after the last playable era, so the silsile is complete. */
  after?: string[];
}

const fort = (id: string, name: string, holder: HolderId, lonLat: [number, number], year: string, tier: number, conf: Confidence = "verified", modern?: string, battle?: boolean): Fort =>
  ({ id, name, holder, lonLat, year, tier, conf, modern, battle });

/* ------------------------------------------------------------------------------------------------ Ottoman */

const OTTOMAN: Path = {
  id: "osmanli",
  name: { en: "Ottoman State", ur: "Saltanat-e-Usmania", tr: "Osmanlı Devleti", az: "Osmanlı Dövləti", tk: "Osman döwleti", ar: "الدولة العثمانية", fa: "دولت عثمانی" },
  tribes: ["kayi"],
  state: "ottoman",
  forts: [
    fort("karacahisar", "Karacahisar", "byz", [30.55, 39.75], "c. 1288", 1, "reported", "Eskişehir"),
    fort("bilecik", "Bilecik", "byz", [29.98, 40.14], "1299", 1, "reported"),
    fort("inegol", "İnegöl", "byz", [29.51, 40.08], "1299", 1, "reported"),
    fort("yarhisar", "Yarhisar", "byz", [29.75, 40.25], "1299", 2, "reported"),
    fort("koyunhisar", "Koyunhisar (Bapheus)", "byz", [29.95, 40.68], "1302", 2, "verified", undefined, true),
    fort("bursa", "Bursa (Prusa)", "byz", [29.06, 40.19], "1326", 3),
    fort("iznik", "İznik (Nicaea)", "byz", [29.72, 40.43], "1331", 3),
    fort("izmit", "İzmit (Nicomedia)", "byz", [30.1, 40.77], "1337", 3),
    fort("gelibolu", "Gelibolu (Gallipoli)", "byz", [26.67, 40.41], "1354", 4),
    fort("edirne", "Edirne (Adrianople)", "byz", [26.56, 41.68], "1361–1371", 4, "contested"),
    fort("filibe", "Filibe", "bul", [24.75, 42.15], "c. 1363", 4, "reported", "Plovdiv"),
    fort("cirmen", "Çirmen (Maritsa)", "ser", [26.1, 41.95], "1371", 5, "verified", undefined, true),
    fort("sofya", "Sofya", "bul", [23.32, 42.7], "1385", 5, "reported", "Sofia"),
    fort("nis", "Niş", "ser", [21.9, 43.32], "1386", 5, "reported", "Niš"),
    fort("kosova", "Kosova", "ser", [21.1, 42.7], "1389", 6, "verified", undefined, true),
    fort("tirnova", "Tırnova", "bul", [25.63, 43.08], "1393", 6, "verified", "Veliko Tarnovo"),
    fort("vidin", "Vidin", "bul", [22.88, 43.99], "1396", 6),
    fort("nigbolu", "Niğbolu (Nicopolis)", "cru", [24.9, 43.7], "1396", 7, "verified", "Nikopol", true),
    fort("selanik", "Selanik", "ven", [22.94, 40.64], "1430", 7, "verified", "Thessaloniki"),
    fort("yanya", "Yanya", "ita", [20.85, 39.66], "1430", 7, "verified", "Ioannina"),
    fort("varna", "Varna", "cru", [27.91, 43.21], "1444", 8, "verified", undefined, true),
    fort("kosova2", "II. Kosova", "hun", [20.9, 42.55], "1448", 8, "verified", undefined, true),
    fort("istanbul", "Kostantiniyye (Constantinople)", "byz", [28.98, 41.01], "1453", 10, "verified", "İstanbul"),
    fort("semendire", "Semendire", "ser", [20.93, 44.66], "1459", 8, "verified", "Smederevo"),
    fort("trabzon", "Trabzon (Trebizond)", "byz", [39.72, 41.0], "1461", 8),
    fort("bobovac", "Bobovac", "bos", [18.28, 44.15], "1463", 8),
    fort("egriboz", "Eğriboz (Negroponte)", "ven", [23.6, 38.46], "1470", 9, "verified", "Chalcis"),
    fort("otranto", "Otranto", "nap", [18.49, 40.15], "1480", 9),
    fort("kili", "Kili", "mol", [29.25, 45.43], "1484", 8, "verified", "Kiliia"),
    fort("akkerman", "Akkerman", "mol", [30.35, 46.2], "1484", 8, "verified", "Bilhorod-Dnistrovskyi"),
    fort("inebahti", "İnebahtı (Lepanto)", "ven", [21.83, 38.39], "1499", 9, "verified", "Nafpaktos"),
    fort("moton", "Moton (Modon)", "ven", [21.7, 36.82], "1500", 9, "verified", "Methoni"),
    fort("belgrad", "Belgrad", "hun", [20.46, 44.82], "1521", 10),
    fort("rodos", "Rodos", "kni", [28.22, 36.44], "1522", 10, "verified", "Rhodes"),
    fort("mohac", "Mohaç", "hun", [18.68, 45.99], "1526", 10, "verified", "Mohács", true),
    fort("budin", "Budin", "hun", [19.04, 47.5], "1541", 11, "verified", "Buda"),
    fort("trablusgarp", "Trablusgarp", "kni", [13.19, 32.89], "1551", 10, "verified", "Tripoli"),
    fort("zigetvar", "Zigetvar", "hab", [17.79, 46.05], "1566", 11, "verified", "Szigetvár"),
    fort("lefkosa", "Lefkoşa", "ven", [33.36, 35.17], "1570", 11, "verified", "Nicosia"),
    fort("magosa", "Magosa", "ven", [33.94, 35.12], "1571", 11, "verified", "Famagusta"),
    fort("egri", "Eğri", "hab", [20.38, 47.9], "1596", 12, "verified", "Eger"),
    fort("uyvar", "Uyvar", "hab", [18.16, 47.99], "1663", 12, "verified", "Nové Zámky"),
    fort("kandiye", "Kandiye", "ven", [25.13, 35.34], "1669", 12, "verified", "Heraklion"),
    fort("kamanice", "Kamaniçe", "pol", [26.58, 48.68], "1672", 12, "verified", "Kamianets-Podilskyi"),
    fort("prut", "Prut", "rus", [28.1, 47.1], "1711", 13, "verified", undefined, true),
    fort("belgrad1739", "Belgrad (1739)", "hab", [20.62, 44.7], "1739", 13),
    fort("plevne", "Plevne", "rus", [24.62, 43.42], "1877", 14, "verified", "Pleven", true),
    fort("domeke", "Dömeke", "gre", [22.3, 39.13], "1897", 14, "verified", "Domokos", true),
  ],
  ocaks: [
    { id: "mihal", name: "Mihaloğulları", text: { en: "Akıncı house founded by Köse Mihal, Osman Gazi's companion; led raids on the Danube.", ur: "Osman Gazi ke saathi Köse Mihal ka akıncı gharana; Danube par chaapay maarta tha.", tr: "Osman Gazi'nin silah arkadaşı Köse Mihal'in akıncı ocağı; Tuna boyunda akın etti." }, commanders: [{ hero: "kosemihal", era: 3 }, { hero: "mihaloglumehmed", era: 7 }, { hero: "mihaloglualibey", era: 9 }] },
    { id: "evrenos", name: "Evrenosoğulları", text: { en: "House of Gazi Evrenos Bey, conqueror in Thrace and Macedonia; seat at Yenice-i Vardar.", ur: "Gazi Evrenos Bey ka gharana, Thrace aur Macedonia ke fateh; markaz Yenice-i Vardar.", tr: "Trakya ve Makedonya fatihi Gazi Evrenos Bey'in ocağı; merkezi Yenice-i Vardar." }, commanders: [{ hero: "evrenos", era: 5 }] },
    { id: "malkoc", name: "Malkoçoğulları", text: { en: "Akıncı house on the Bosnian and Hungarian frontier; Malkoçoğlu Bali Bey fought at Mohács.", ur: "Bosnia aur Hungary ki sarhad ka akıncı gharana; Malkoçoğlu Bali Bey Mohaç mein lare.", tr: "Bosna ve Macar serhaddinin akıncı ocağı; Malkoçoğlu Bali Bey Mohaç'ta savaştı." }, commanders: [{ hero: "malkocbey", era: 6 }, { hero: "malkocbali", era: 10 }] },
    { id: "turahan", name: "Turahanoğulları", text: { en: "House of Turahan Bey, march-lord of Thessaly who raided the Morea.", ur: "Turahan Bey ka gharana, Thessaly ke sarhadi ameer jinhon ne Morea par chaapay maare.", tr: "Tesalya uç beyi Turahan Bey'in ocağı; Mora'ya akınlar yaptı." }, commanders: [{ hero: "turahan", era: 8 }, { hero: "turahanomer", era: 9 }] },
  ],
  eras: [
    { id: "o0", years: "10th–12th c.", rulers: [], companions: [], conf: "reported",
      title: { en: "The Kayı in the Oghuz land", ur: "Oghuz watan mein Kayı boyu", tr: "Oğuz yurdunda Kayı boyu", ar: "قبيلة قايي في أرض الأوغوز", fa: "ایل قایی در سرزمین اوغوز" },
      note: { en: "Rashid al-Din names the Kayı first of the 24 tribes. The Oghuz turned to Islam on the Syr Darya in the 10th–11th centuries; the year for the Kayı is not recorded. Before Islam the Turks held Tengri, the creator of earth and man in the Orkhon inscriptions, to be supreme, and buried their dead in kurgans. Ottoman tradition places the Kayı at Mahan near Merv before the migration.", ur: "Rashid al-Din Kayı ko 24 qabilon mein sab se pehle likhta hai. Oghuz 10vi–11vi sadi mein Syr Darya par Musalman hue; Kayı ka saal darj nahi. Islam se pehle Turk Tengri ko sab se aala maante thay, jo Orhun kitabon mein zameen aur insaan ka khaaliq hai, aur apne murdon ko kurganon mein dafnate thay. Usmani riwayat hijrat se pehle Kayı ko Merv ke qareeb Mahan mein batati hai.", tr: "Reşîdüddin Kayı'yı 24 boyun ilki olarak anar. Oğuzlar 10.–11. yüzyılda Seyhun boyunda Müslüman oldu; Kayı için yıl kayıtlı değildir. İslam'dan önce Türkler, Orhun yazıtlarında yeri ve insanı yaratan Tengri'yi en yüce varlık sayar ve ölülerini kurganlara gömerdi. Osmanlı geleneği göçten önce Kayı'yı Merv yakınındaki Mahan'da gösterir." },
      units: { azap: { name: "Yaya Alp", note: { en: "Tribal foot warriors of the oba", ur: "Oba ke paidal jangju", tr: "Obanın yaya cengâverleri" }, conf: "reported" }, okcu: { name: "Okçu", note: { en: "Steppe archers with the composite bow", ur: "Murakkab kaman wale maidani tirandaz", tr: "Bileşik yaylı bozkır okçuları" }, conf: "verified" }, sipahi: { name: "Atlı Alp", note: { en: "Mounted warriors of the tribe", ur: "Qabile ke sawar jangju", tr: "Boyun atlı cengâverleri" }, conf: "reported" } },
      banner: { kind: "tug", note: { en: "Steppe armies marched under the tuğ, a horse-tail standard; the tamga on the banner is a game emblem", ur: "Maidani lashkar tuğ (ghore ke baalon wala nishaan) ke neeche chalte thay; jhande par tamga game ka nishaan hai", tr: "Bozkır orduları tuğ altında yürüdü; sancaktaki damga oyun amblemidir" }, conf: "verified" },
      goal: { hunts: 2, otag: 2 } },
    { id: "o1", ruler: "suleymansah", years: "c. 1220s", rulers: ["Süleyman Şah"], companions: ["dundar", "haymeana"], conf: "contested",
      title: { en: "Migration to Anatolia", ur: "Anatolia ki taraf hijrat", tr: "Anadolu'ya göç", ar: "الهجرة إلى الأناضول", fa: "کوچ به آناتولی" },
      note: { en: "Ottoman tradition names Süleyman Şah as Ertuğrul's father, drowned in the Euphrates; other chronicles name Gündüz Alp. Build the oba and feed it by hunting.", ur: "Usmani riwayat Süleyman Şah ko Ertuğrul ke walid kehti hai jo Furaat mein doob gaye; kuch tareekhein Gündüz Alp ka naam leti hain. Oba banayein aur shikar se pet palein.", tr: "Osmanlı geleneği Ertuğrul'un babası olarak Fırat'ta boğulan Süleyman Şah'ı anar; bazı kroniklere göre baba Gündüz Alp'tir. Obayı kur, avla besle." },
      goal: { hunts: 3, otag: 3 } },
    { id: "o2", ruler: "ertugrul", years: "d. c. 1280", rulers: ["Ertuğrul Gazi"], companions: ["turgutalp", "samsacavus", "bamsi"], conf: "reported",
      title: { en: "The frontier at Söğüt", ur: "Söğüt ki sarhad", tr: "Söğüt uç beyliği", ar: "ثغر سوغوت", fa: "مرز سوگوت" },
      note: { en: "Ertuğrul settles at Söğüt on the Byzantine frontier. Hold the frontier against the tekfurs' raids.", ur: "Ertuğrul Byzantine sarhad par Söğüt mein aabaad hote hain. Tekfuron ke hamlon se sarhad bachayein.", tr: "Ertuğrul Bizans ucunda Söğüt'e yerleşir. Tekfurların akınlarına karşı ucu koru." },
      goal: { wave: 3, hunts: 5, otag: 4 } },
    { id: "o3", ruler: "osman",
      units: { sipahi: { name: "Akıncı", note: { en: "Light raiding cavalry of the frontier; the akıncı tradition goes back to Osman's companions", ur: "Sarhad ke halke chaapamaar sawar; akıncı riwayat Osman ke saathiyon tak jaati hai", tr: "Uç bölgesinin hafif akıncı süvarisi; gelenek Osman'ın silah arkadaşlarına uzanır" }, conf: "reported" } }, banner: { kind: "tug", note: { en: "Tradition says the Seljuk sultan sent Osman a drum, a banner and a tuğ as signs of his beylik", ur: "Riwayat hai ke Seljuq sultan ne Osman ko beylik ki nishani ke taur par naqqara, sancak aur tuğ bheja", tr: "Rivayete göre Selçuklu sultanı Osman'a beylik alameti olarak tabl, alem ve tuğ gönderdi" }, conf: "reported" }, years: "c. 1299–1324", rulers: ["Osman Gazi"], companions: ["sheikhedebali", "akcakoca", "konuralp", "abdurrahmangazi", "kosemihal", "turgutalp", "malhunhatun", "rabiabala"], conf: "reported",
      title: { en: "Founding of the beylik", ur: "Beylik ki bunyaad", tr: "Beyliğin kuruluşu", ar: "تأسيس الإمارة", fa: "بنیاد بیگ‌نشین" },
      note: { en: "Osman Gazi takes the frontier forts and beats a Byzantine army at Bapheus (1302).", ur: "Osman Gazi sarhadi qile fatah karte hain aur 1302 mein Bapheus par Byzantine fauj ko shikast dete hain.", tr: "Osman Gazi uç kalelerini alır ve 1302'de Koyunhisar'da Bizans ordusunu yener." },
      goal: { forts: ["karacahisar", "bilecik", "inegol", "yarhisar", "koyunhisar"] } },
    { id: "o4", ruler: "orhan",
      units: { azap: { name: "Yaya", note: { en: "Paid foot soldiers organised under Orhan", ur: "Orhan ke daur mein muqarrar tankhwah wale paidal", tr: "Orhan döneminde ücretli yaya askerleri" }, conf: "reported" }, sipahi: { name: "Müsellem", note: { en: "Paid horsemen organised under Orhan", ur: "Orhan ke daur ke tankhwahdar sawar", tr: "Orhan döneminin ücretli atlıları" }, conf: "reported" } }, banner: { kind: "red", note: { en: "Early Ottoman banners varied; red is attested in a document of Orhan from 1348", ur: "Ibtidai Usmani jhande mukhtalif thay; 1348 ki Orhan ki ek dastavez mein surkh rang ka zikr hai", tr: "Erken Osmanlı sancakları çeşitliydi; kırmızı, Orhan'ın 1348 tarihli bir belgesinde geçer" }, conf: "reported" }, years: "1324–1362", rulers: ["Orhan Gazi"], companions: ["alaeddinpasa", "suleymanpasa", "lalasahin", "hacilbey", "karahalil", "nilufer"], conf: "verified",
      title: { en: "Bursa, İznik and the crossing to Rumelia", ur: "Bursa, İznik aur Rumeli ka safar", tr: "Bursa, İznik ve Rumeli'ye geçiş", ar: "بورصة وإزنيق والعبور إلى الروملي", fa: "بورسا، ازنیک و گذر به روم‌ایلی" },
      note: { en: "Orhan takes Bursa (1326) and makes it the capital; his son Süleyman Pasha crosses to Gallipoli (1354).", ur: "Orhan 1326 mein Bursa le kar darul hukumat banate hain; un ke bete Süleyman Paşa 1354 mein Gelibolu paar karte hain.", tr: "Orhan Bursa'yı (1326) alıp başkent yapar; oğlu Süleyman Paşa Gelibolu'ya (1354) geçer." },
      goal: { forts: ["bursa", "iznik", "izmit", "gelibolu"] } },
    { id: "o5", ruler: "murad1",
      units: { azap: { name: "Yeniçeri", note: { en: "Standing infantry of the sultan; the corps took shape at Gelibolu under Murad I, c. 1363, advised by Çandarlı Kara Halil; the exact year is not certain", ur: "Sultan ki mustaqil paidal fauj; Murad I ke daur mein Gelibolu mein taqreeban 1363 mein Çandarlı Kara Halil ki tajweez se bani; saal pakka nahi", tr: "Padişahın daimî piyadesi; ocak I. Murad devrinde Gelibolu'da, y. 1363, Çandarlı Kara Halil'in yönlendirmesiyle şekillendi; kesin yıl belli değil" }, conf: "verified" }, sipahi: { name: "Tımarlı Sipahi", note: { en: "Cavalry holding timar land grants", ur: "Timar jageer rakhne wale sawar", tr: "Tımar sahibi süvariler" }, conf: "verified" } }, years: "1362–1389", rulers: ["Murad I Hüdavendigâr"], companions: ["lalasahin", "evrenos", "karahalil", "timurtas", "hacilbey"], conf: "verified",
      title: { en: "Hüdavendigâr: Rumelia", ur: "Hüdavendigâr: Rumeli", tr: "Hüdavendigâr: Rumeli", ar: "خداوندگار: الروملي", fa: "خداوندگار: روم‌ایلی" },
      note: { en: "Edirne becomes the capital; victories at Çirmen (1371) and Kosova (1389), where Sultan Murad was martyred.", ur: "Edirne darul hukumat banta hai; Çirmen (1371) aur Kosova (1389) ki fatah, jahan Sultan Murad shaheed hue.", tr: "Edirne başkent olur; Çirmen (1371) ve Kosova (1389) zaferleri; Sultan Murad Kosova'da şehit düştü." },
      goal: { forts: ["edirne", "filibe", "cirmen", "sofya", "nis", "kosova"] } },
    { id: "o6", ruler: "bayezid1", years: "1389–1402", rulers: ["Bayezid I Yıldırım"], companions: ["candarliali", "evrenos", "timurtas", "malkocbey"], conf: "verified",
      title: { en: "Yıldırım: the Danube", ur: "Yıldırım: Danube", tr: "Yıldırım: Tuna", ar: "يلدرم: الدانوب", fa: "ییلدیریم: دانوب" },
      note: { en: "Tırnova falls (1393) and the crusade is crushed at Niğbolu (1396).", ur: "Tırnova 1393 mein fatah hota hai aur 1396 mein Niğbolu par Saleebi lashkar toot jata hai.", tr: "Tırnova düşer (1393) ve Haçlı ordusu Niğbolu'da (1396) bozguna uğrar." },
      goal: { forts: ["tirnova", "vidin", "nigbolu"] } },
    { id: "o7", ruler: "mehmed1", years: "1413–1421", rulers: ["Mehmed I Çelebi"], companions: ["bayezidpasa", "mihaloglumehmed", "evrenos"], conf: "verified",
      title: { en: "Çelebi: the state restored", ur: "Çelebi: riyasat ki bahaali", tr: "Çelebi: devletin yeniden birliği", ar: "جلبي: عودة الدولة", fa: "چلبی: بازسازی دولت" },
      note: { en: "After Ankara (1402) the realm is split among Bayezid's sons; Mehmed Çelebi reunites it. Unite the Muslim states and hold the frontier.", ur: "Ankara (1402) ke baad saltanat Bayezid ke beton mein bat jaati hai; Mehmed Çelebi ise phir jorte hain. Muslim riyasaton ko mutahid karein aur sarhad bachayein.", tr: "Ankara'dan (1402) sonra ülke Bayezid'in oğulları arasında bölünür; Mehmed Çelebi birliği yeniden kurar. Müslüman devletlerle birleş ve ucu koru." },
      goal: { unions: 2, wave: 8 } },
    { id: "o8", ruler: "murad2",
      units: { okcu: { name: "Okçu ve Topçu", note: { en: "Archers joined by gunners; firearms spread in the army under Murad II and Fatih", ur: "Tirandazon ke saath topchi; Murad II aur Fatih ke daur mein fauj mein barood ke hathiyar phaile", tr: "Okçulara topçular katıldı; ateşli silahlar II. Murad ve Fatih döneminde yayıldı" }, conf: "reported" } }, years: "1421–1451", rulers: ["Murad II"], companions: ["candarlihalil", "turahan", "mihaloglumehmed"], conf: "verified",
      title: { en: "Varna and the second Kosova", ur: "Varna aur doosra Kosova", tr: "Varna ve II. Kosova", ar: "فارنا وكوسوفو الثانية", fa: "وارنا و کوزوو دوم" },
      note: { en: "Selanik (1430) is taken; the crusades of Varna (1444) and Kosova (1448) are defeated.", ur: "Selanik (1430) fatah; Varna (1444) aur Kosova (1448) ki Saleebi muhimmat nakaam.", tr: "Selanik (1430) alınır; Varna (1444) ve II. Kosova (1448) Haçlı seferleri yenilir." },
      goal: { forts: ["selanik", "yanya", "varna", "kosova2"] } },
    { id: "o9", ruler: "fatih", years: "1451–1481", rulers: ["Mehmed II Fatih"], companions: ["aksemseddin", "zaganos", "mahmudpasa", "gedikahmed", "ulubatli", "turahanomer", "mihaloglualibey"], conf: "verified",
      title: { en: "Fatih: the conquest of Constantinople", ur: "Fatih: Qustuntunia ki fatah", tr: "Fatih: İstanbul'un fethi", ar: "الفاتح: فتح القسطنطينية", fa: "فاتح: فتح قسطنطنیه" },
      note: { en: "On 29 May 1453 Constantinople is taken, as the hadith foretold of its conqueror; then Trabzon, Bosnia, Eğriboz and Otranto.", ur: "29 May 1453 ko Qustuntunia fatah hua, jis ke fateh ki hadees mein basharat hai; phir Trabzon, Bosnia, Eğriboz aur Otranto.", tr: "29 Mayıs 1453'te hadiste müjdelenen fetih gerçekleşir; ardından Trabzon, Bosna, Eğriboz ve Otranto." },
      goal: { forts: ["istanbul", "semendire", "trabzon", "bobovac", "egriboz", "otranto"] } },
    { id: "o10", ruler: "bayezid2", years: "1481–1512", rulers: ["Bayezid II Veli"], companions: ["kemalreis", "malkocbali", "hersekzade", "mihaloglualibey"], conf: "verified",
      title: { en: "Veli: the Black Sea and the Morea", ur: "Veli: Bahr-e-Aswad aur Morea", tr: "Veli: Karadeniz ve Mora", ar: "الولي: البحر الأسود والمورة", fa: "ولی: دریای سیاه و موره" },
      note: { en: "Kili and Akkerman (1484) close the Black Sea; Kemal Reis wins at sea and Lepanto and Modon fall.", ur: "Kili aur Akkerman (1484) se Bahr-e-Aswad band hota hai; Kemal Reis samandar mein jeet-te hain aur İnebahtı aur Moton fatah hote hain.", tr: "Kili ve Akkerman (1484) Karadeniz'i kapatır; Kemal Reis denizde zafer kazanır, İnebahtı ve Moton alınır." },
      goal: { forts: ["kili", "akkerman", "inebahti", "moton"] } },
    { id: "o11", ruler: "selim1", years: "1512–1520", rulers: ["Selim I Yavuz"], companions: ["piri", "hadimsinan", "idrisbitlisi"], conf: "verified",
      title: { en: "Yavuz: servant of the Two Holy Mosques", ur: "Yavuz: Khadim-ul-Haramain", tr: "Yavuz: Hâdimü'l-Haremeyn", ar: "ياووز: خادم الحرمين الشريفين", fa: "یاووز: خادم الحرمین" },
      note: { en: "Selim joins Syria, Egypt and the Hejaz to the state and takes the title Servant of the Two Holy Mosques.", ur: "Selim Shaam, Misr aur Hijaz ko riyasat se jorte hain aur Khadim-ul-Haramain ka laqab paate hain.", tr: "Selim Suriye, Mısır ve Hicaz'ı devlete katar ve Hâdimü'l-Haremeyn unvanını alır." },
      goal: { unions: ["dulkadir", "mamluk"] } },
    { id: "o12", ruler: "suleyman1", years: "1520–1566", rulers: ["Süleyman I Kanuni"], companions: ["barbaros", "ibrahimpasa", "sokullu", "mimarsinan", "turgutreis", "piyale", "malkocbali"], conf: "verified",
      title: { en: "Kanuni: the height of the state", ur: "Kanuni: riyasat ka urooj", tr: "Kanuni: devletin zirvesi", ar: "القانوني: ذروة الدولة", fa: "قانونی: اوج دولت" },
      note: { en: "Belgrade, Rhodes, Mohács, Buda; Barbaros rules the Mediterranean; Mimar Sinan builds the Süleymaniye.", ur: "Belgrad, Rodos, Mohaç, Budin; Barbaros Bahr-e-Room par chha jaate hain; Mimar Sinan Süleymaniye banate hain.", tr: "Belgrad, Rodos, Mohaç, Budin; Barbaros Akdeniz'e hâkim olur; Mimar Sinan Süleymaniye'yi yapar." },
      goal: { forts: ["belgrad", "rodos", "mohac", "budin", "trablusgarp", "zigetvar"] } },
    { id: "o13", ruler: "selim2", years: "1566–1603", rulers: ["Selim II", "Murad III", "Mehmed III"], companions: ["lalamustafa", "sokullu", "piyale"], conf: "verified",
      title: { en: "Cyprus and Eğri", ur: "Kıbrıs aur Eğri", tr: "Kıbrıs ve Eğri", ar: "قبرص وإغري", fa: "قبرس و اگری" },
      note: { en: "Lala Mustafa Pasha takes Cyprus (1570–71); Mehmed III takes Eğri and wins at Haçova (1596).", ur: "Lala Mustafa Paşa Kıbrıs (1570–71) fatah karte hain; Mehmed III Eğri lete hain aur Haçova (1596) jeet-te hain.", tr: "Lala Mustafa Paşa Kıbrıs'ı alır (1570–71); III. Mehmed Eğri'yi alır ve Haçova'yı (1596) kazanır." },
      goal: { forts: ["lefkosa", "magosa", "egri"] } },
    { id: "o14", ruler: "murad4", years: "1603–1648", rulers: ["Ahmed I", "Mustafa I", "Osman II", "Murad IV", "İbrahim"], companions: ["tiryakihasan"], conf: "verified",
      title: { en: "Holding the frontiers", ur: "Sarhadon ki hifazat", tr: "Serhadlerin korunması", ar: "حماية الثغور", fa: "پاسداری از مرزها" },
      note: { en: "Tiryaki Hasan Pasha holds Kanije (1601); Murad IV restores order and retakes Baghdad (1638).", ur: "Tiryaki Hasan Paşa Kanije (1601) bachate hain; Murad IV nazm wapas laate hain aur 1638 mein Baghdad wapas lete hain.", tr: "Tiryaki Hasan Paşa Kanije'yi (1601) savunur; IV. Murad düzeni kurar ve Bağdat'ı (1638) geri alır." },
      goal: { wave: 14, unions: 6 } },
    { id: "o15", ruler: "mehmed4", years: "1648–1695", rulers: ["Mehmed IV", "Süleyman II", "Ahmed II"], companions: ["koprulumehmed", "koprulufazil"], conf: "verified",
      title: { en: "The Köprülü revival", ur: "Köprülü daur ki bahaali", tr: "Köprülüler devri", ar: "نهضة آل كوبرولو", fa: "احیای کوپرولوها" },
      note: { en: "Under the Köprülü grand viziers the state takes Uyvar (1663), Kandiye (1669) and Kamaniçe (1672).", ur: "Köprülü wazeer-e-azamon ke daur mein Uyvar (1663), Kandiye (1669) aur Kamaniçe (1672) fatah hote hain.", tr: "Köprülü sadrazamları döneminde Uyvar (1663), Kandiye (1669) ve Kamaniçe (1672) alınır." },
      goal: { forts: ["uyvar", "kandiye", "kamanice"] } },
    { id: "o16", ruler: "ahmed3", years: "1695–1757", rulers: ["Mustafa II", "Ahmed III", "Mahmud I", "Osman III"], companions: ["baltaci"], conf: "verified",
      title: { en: "Prut and Belgrade", ur: "Prut aur Belgrad", tr: "Prut ve Belgrad", ar: "بروت وبلغراد", fa: "پروت و بلگراد" },
      note: { en: "Baltacı Mehmed Pasha surrounds the Russian army at the Prut (1711); Belgrade returns in 1739.", ur: "Baltacı Mehmed Paşa 1711 mein Prut par Roosi fauj ko gher lete hain; 1739 mein Belgrad wapas aata hai.", tr: "Baltacı Mehmed Paşa Prut'ta (1711) Rus ordusunu kuşatır; Belgrad 1739'da geri alınır." },
      goal: { forts: ["prut", "belgrad1739"] } },
    { id: "o17", ruler: "mahmud2",
      units: { azap: { name: "Nizam-ı Cedid", note: { en: "Selim III's new-order army (1793); after 1826 Mahmud II's Asakir-i Mansure", ur: "Selim III ki nayi fauj (1793); 1826 ke baad Mahmud II ki Asakir-i Mansure", tr: "III. Selim'in yeni düzen ordusu (1793); 1826'dan sonra II. Mahmud'un Asâkir-i Mansûre'si" }, conf: "verified" } }, banner: { kind: "redCrescent", note: { en: "A decree of 1793 gave Ottoman ships a red flag with a white crescent", ur: "1793 ke farman se Usmani jahazon ko safed chaand wala surkh jhanda mila", tr: "1793 tarihli buyruldu Osmanlı gemilerine beyaz hilalli kırmızı bayrak verdi" }, conf: "verified" }, years: "1757–1839", rulers: ["Mustafa III", "Abdülhamid I", "Selim III", "Mustafa IV", "Mahmud II"], companions: ["cezzar"], conf: "verified",
      title: { en: "Nizam-ı Cedid: renewal", ur: "Nizam-ı Cedid: islah", tr: "Nizâm-ı Cedîd: yenileşme", ar: "النظام الجديد: التجديد", fa: "نظام جدید: نوسازی" },
      note: { en: "Cezzar Ahmed Pasha holds Acre against Napoleon (1799); Selim III and Mahmud II rebuild the army.", ur: "Cezzar Ahmed Paşa 1799 mein Napoleon ke khilaf Akka bachate hain; Selim III aur Mahmud II fauj ko naye siray se banate hain.", tr: "Cezzar Ahmed Paşa Akka'yı Napolyon'a karşı (1799) savunur; III. Selim ve II. Mahmud orduyu yeniler." },
      goal: { wave: 20, otag: 14 } },
    { id: "o18", ruler: "abdulmecid",
      units: { azap: { name: "Asakir-i Nizamiye", note: { en: "The regular army of the Tanzimat", ur: "Tanzimat ki baqaida fauj", tr: "Tanzimat'ın düzenli ordusu" }, conf: "reported" }, okcu: { name: "Topçu", note: { en: "Artillery regiments", ur: "Topkhana ki rejimentein", tr: "Topçu alayları" }, conf: "verified" }, sipahi: { name: "Süvari", note: { en: "Regular cavalry regiments", ur: "Baqaida sawar rejimentein", tr: "Düzenli süvari alayları" }, conf: "verified" } }, banner: { kind: "redCrescentStar", note: { en: "In 1844 the red flag with a white crescent and star became the state flag; the Republic of Türkiye kept it", ur: "1844 mein safed chaand-sitare wala surkh jhanda riyasat ka jhanda bana; Jamhuriya Turkiye ne ise jaari rakha", tr: "1844'te beyaz ay yıldızlı kırmızı bayrak devlet bayrağı oldu; Türkiye Cumhuriyeti onu sürdürdü" }, conf: "verified" }, years: "1839–1876", rulers: ["Abdülmecid", "Abdülaziz"], companions: ["omerpasa"], conf: "verified",
      title: { en: "Tanzimat and Silistre", ur: "Tanzimat aur Silistre", tr: "Tanzimat ve Silistre", ar: "التنظيمات وسيليسترا", fa: "تنظیمات و سیلیستره" },
      note: { en: "Ömer Pasha defends the Danube; Silistre holds in 1854.", ur: "Ömer Paşa Danube ka difa karte hain; 1854 mein Silistre qaim rehta hai.", tr: "Ömer Paşa Tuna'yı savunur; Silistre 1854'te düşmez." },
      goal: { wave: 24 } },
    { id: "o19", ruler: "abdulhamid2", years: "1876–1909", rulers: ["Abdülhamid II"], companions: ["gaziosman", "edhem"], conf: "verified",
      title: { en: "Abdülhamid Han: Plevne and Dömeke", ur: "Abdülhamid Han: Plevne aur Dömeke", tr: "Abdülhamid Han: Plevne ve Dömeke", ar: "عبد الحميد خان: بلفنة ودوميكو", fa: "عبدالحمید خان: پلونا و دومکه" },
      note: { en: "Gazi Osman Pasha repels three assaults at Plevne (1877); Edhem Pasha wins at Dömeke (1897). The Hejaz Railway is built.", ur: "Gazi Osman Paşa 1877 mein Plevne par teen hamle pasapa karte hain; Edhem Paşa 1897 mein Dömeke jeet-te hain. Hijaz railway banti hai.", tr: "Gazi Osman Paşa Plevne'de (1877) üç hücumu püskürtür; Edhem Paşa Dömeke'de (1897) kazanır. Hicaz Demiryolu yapılır." },
      goal: { forts: ["plevne", "domeke"], wave: 28 } },
  ],
  after: ["Mehmed V Reşad", "Mehmed VI Vahideddin", "Abdülmecid II (caliph, 1922–1924)"],
};

/* ------------------------------------------------------------------------------------------------ Seljuk */

const SELJUK: Path = {
  id: "selcuklu",
  name: { en: "Seljuk State", ur: "Saltanat-e-Seljuq", tr: "Selçuklu Devleti", az: "Səlcuq Dövləti", tk: "Seljuk döwleti", ar: "الدولة السلجوقية", fa: "دولت سلجوقی" },
  tribes: ["kinik"],
  state: "seljuk",
  forts: [
    fort("pasinler", "Pasinler (Kapetrou)", "byz", [41.67, 39.98], "1048", 2, "verified", undefined, true),
    fort("ani", "Ani", "byz", [43.57, 40.51], "1064", 3),
    fort("malazgirt", "Malazgirt (Manzikert)", "byz", [42.53, 39.14], "1071", 5, "verified", undefined, true),
    fort("izmir1081", "İzmir (Smyrna)", "byz", [27.14, 38.42], "c. 1081", 3, "reported"),
    fort("iznik1081", "İznik (Nicaea)", "byz", [29.72, 40.43], "c. 1081", 4, "reported"),
    fort("antakya1084", "Antakya (Antioch)", "byz", [36.16, 36.2], "1084", 4),
    fort("eregli1101", "Ereğli (Heraclea)", "cru", [34.05, 37.51], "1101", 5, "verified", undefined, true),
    fort("miryokefalon", "Miryokefalon", "byz", [30.85, 38.0], "1176", 6, "verified", undefined, true),
    fort("alanya", "Alanya (Kalonoros)", "byz", [32.0, 36.54], "1221", 6),
    fort("sudak", "Suğdak (Sudak)", "rus", [34.97, 44.85], "1220s", 6, "contested"),
  ],
  ocaks: [
    { id: "danismend", name: "Danişmendliler", text: { en: "Frontier house of Danişmend Gazi in Sivas and Tokat.", ur: "Sivas aur Tokat mein Danişmend Gazi ka sarhadi gharana.", tr: "Sivas ve Tokat'ta Danişmend Gazi'nin uç beyliği." }, commanders: [{ hero: "danismendgazi", era: 2 }] },
    { id: "saltuk", name: "Saltuklular", text: { en: "Frontier house of Saltuk Bey at Erzurum.", ur: "Erzurum mein Saltuk Bey ka sarhadi gharana.", tr: "Erzurum'da Saltuk Bey'in uç beyliği." }, commanders: [{ hero: "saltukbey", era: 2 }] },
    { id: "mengucek", name: "Mengücekliler", text: { en: "Frontier house of Mengücek Gazi at Erzincan.", ur: "Erzincan mein Mengücek Gazi ka sarhadi gharana.", tr: "Erzincan'da Mengücek Gazi'nin uç beyliği." }, commanders: [{ hero: "mengucekgazi", era: 2 }] },
    { id: "artuk", name: "Artuklular", text: { en: "House of Artuk Bey, Seljuk commander; his sons ruled Mardin and Hasankeyf.", ur: "Seljuq sipahsalar Artuk Bey ka gharana; un ke beton ne Mardin aur Hasankeyf par hukumat ki.", tr: "Selçuklu komutanı Artuk Bey'in ocağı; oğulları Mardin ve Hasankeyf'e hükmetti." }, commanders: [{ hero: "artukbey", era: 2 }] },
  ],
  eras: [
    { id: "s1", ruler: "selcukbey", years: "c. 960–1009", rulers: ["Selçuk Bey"], companions: [], conf: "reported",
      title: { en: "Selçuk Bey at Jand", ur: "Jand mein Selçuk Bey", tr: "Cend'de Selçuk Bey", ar: "سلجوق بك في جند", fa: "سلجوق بیگ در جند" },
      note: { en: "Selçuk Bey of the Kınık leaves the Oghuz yabgu, settles at Jand on the Syr Darya and accepts Islam with his people.", ur: "Kınık ke Selçuk Bey Oghuz yabgu se alag ho kar Syr Darya par Jand mein aabaad hote hain aur apni qaum ke saath Islam qubool karte hain.", tr: "Kınık boyundan Selçuk Bey Oğuz yabgusundan ayrılır, Seyhun boyunda Cend'e yerleşir ve halkıyla İslam'ı kabul eder." },
      goal: { hunts: 3, otag: 3 } },
    { id: "s2", ruler: "tugrul", years: "1037–1063", rulers: ["Tuğrul Bey", "Çağrı Bey"], companions: ["cagri", "ibrahimyinal"], conf: "verified",
      title: { en: "Dandanakan and Baghdad", ur: "Dandanakan aur Baghdad", tr: "Dandanakan ve Bağdat", ar: "دندانقان وبغداد", fa: "دندانقان و بغداد" },
      note: { en: "After Dandanakan (1040) the Seljuks rule Khorasan; Tuğrul enters Baghdad (1055) as protector of the caliphate. İbrahim Yınal beats a Byzantine–Georgian army at Pasinler (1048).", ur: "Dandanakan (1040) ke baad Khorasan Seljuqon ka; Tuğrul 1055 mein khilafat ke muhafiz ban kar Baghdad aate hain. İbrahim Yınal 1048 mein Pasinler par Byzantine–Georgian fauj ko haraate hain.", tr: "Dandanakan'dan (1040) sonra Horasan Selçukluların olur; Tuğrul 1055'te halifeliğin koruyucusu olarak Bağdat'a girer. İbrahim Yınal Pasinler'de (1048) Bizans–Gürcü ordusunu yener." },
      goal: { forts: ["pasinler"], unions: 1 } },
    { id: "s3", ruler: "alparslan", years: "1063–1072", rulers: ["Alp Arslan"], companions: ["artukbey", "afsin", "danismendgazi", "saltukbey", "mengucekgazi"], conf: "verified",
      title: { en: "Malazgirt: the gate of Anatolia", ur: "Malazgirt: Anatolia ka darwaza", tr: "Malazgirt: Anadolu'nun kapısı", ar: "ملاذكرد: باب الأناضول", fa: "ملازگرد: دروازه آناتولی" },
      note: { en: "Ani falls (1064); on 26 August 1071 Alp Arslan defeats Romanos IV at Malazgirt and Anatolia opens to the Turks.", ur: "Ani 1064 mein fatah; 26 August 1071 ko Alp Arslan Malazgirt mein Romanos IV ko haraate hain aur Anatolia Turkon ke liye khul jata hai.", tr: "Ani düşer (1064); 26 Ağustos 1071'de Alp Arslan Malazgirt'te IV. Romen Diyojen'i yener, Anadolu Türklere açılır." },
      goal: { forts: ["ani", "malazgirt"] } },
    { id: "s4", ruler: "melikshah", years: "1072–1092", rulers: ["Melikşah"], companions: ["nizamulmulk", "suleymansahrum", "cakabey", "artukbey"], conf: "verified",
      title: { en: "Melikşah and the Rum frontier", ur: "Melikşah aur Rum ki sarhad", tr: "Melikşah ve Rum ucu", ar: "ملكشاه وثغر الروم", fa: "ملکشاه و مرز روم" },
      note: { en: "Kutalmışoğlu Süleyman Şah takes İznik and Antakya; Çaka Bey builds a fleet at İzmir; Nizam al-Mulk founds the Nizamiyya madrasas.", ur: "Kutalmışoğlu Süleyman Şah İznik aur Antakya lete hain; Çaka Bey İzmir mein bahri bera banate hain; Nizam ul Mulk Nizamiya madrasay qaim karte hain.", tr: "Kutalmışoğlu Süleyman Şah İznik ve Antakya'yı alır; Çaka Bey İzmir'de donanma kurar; Nizâmülmülk Nizamiye medreselerini açar." },
      goal: { forts: ["izmir1081", "iznik1081", "antakya1084"] } },
    { id: "s5", ruler: "kilicarslan", years: "1092–1107", rulers: ["Kılıç Arslan I"], companions: ["danismendgazi"], conf: "verified",
      title: { en: "Against the crusades", ur: "Saleebi jangon ka muqabla", tr: "Haçlılara karşı", ar: "في مواجهة الحملات الصليبية", fa: "در برابر جنگ‌های صلیبی" },
      note: { en: "With the Danişmendids Kılıç Arslan destroys the crusade of 1101 at Ereğli.", ur: "Danişmendiyon ke saath Kılıç Arslan 1101 ki Saleebi muhim ko Ereğli par tabah karte hain.", tr: "Danişmendlilerle birlikte Kılıç Arslan 1101 Haçlı seferini Ereğli'de yok eder." },
      goal: { forts: ["eregli1101"] } },
    { id: "s6", ruler: "kilicarslan2", years: "1156–1192", rulers: ["Mesud I", "Kılıç Arslan II"], companions: [], conf: "verified",
      title: { en: "Miryokefalon", ur: "Miryokefalon", tr: "Miryokefalon", ar: "ميريوكيفالون", fa: "میریوکفالون" },
      note: { en: "Kılıç Arslan II defeats Manuel I at Miryokefalon (1176); Anatolia stays Turkish.", ur: "Kılıç Arslan II 1176 mein Miryokefalon par Manuel I ko haraate hain; Anatolia Turkon ka rehta hai.", tr: "II. Kılıç Arslan Miryokefalon'da (1176) I. Manuel'i yener; Anadolu Türk yurdu olarak kalır." },
      goal: { forts: ["miryokefalon"] } },
    { id: "s7", ruler: "keykubad", years: "1220–1237", rulers: ["Keyhüsrev I", "Keykâvus I", "Alaeddin Keykubad I"], companions: [], conf: "verified",
      title: { en: "Alaeddin Keykubad: the golden age", ur: "Alaeddin Keykubad: sunehra daur", tr: "Alâeddin Keykubad: altın çağ", ar: "علاء الدين كيقباد: العصر الذهبي", fa: "علاءالدین کیقباد: عصر طلایی" },
      note: { en: "Alanya (1221) becomes the winter capital; a Seljuk force crosses the Black Sea to Sudak; caravanserais line the roads.", ur: "Alanya (1221) sardiyon ka darul hukumat; Seljuq lashkar Bahr-e-Aswad paar Sudak jata hai; sarkon par karwan saraye.", tr: "Alanya (1221) kışlık başkent olur; Selçuklu kuvveti Karadeniz'i geçip Suğdak'a çıkar; yollar kervansaraylarla donanır." },
      goal: { forts: ["alanya", "sudak"] } },
  ],
};

/* ------------------------------------------------------------------------------------------------ Syria and Egypt */

const SHAM: Path = {
  id: "sammisir",
  name: { en: "Zengid, Ayyubid and Mamluk Syria–Egypt", ur: "Zangi, Ayyubi aur Mamluk: Shaam aur Misr", tr: "Zengî, Eyyûbî ve Memlûk: Şam ve Mısır", ar: "الزنكيون والأيوبيون والمماليك", fa: "زنگیان، ایوبیان و ممالیک" },
  tribes: [],
  state: "mamluk",
  forts: [
    fort("urfa", "Urfa (Edessa)", "cru", [38.79, 37.16], "1144", 3),
    fort("inab", "İnab", "cru", [36.45, 35.85], "1149", 3, "verified", undefined, true),
    fort("harim", "Harim", "cru", [36.52, 36.21], "1164", 4, "verified", undefined, true),
    fort("banyas", "Banyas", "cru", [35.69, 33.25], "1164", 4),
    fort("hittin", "Hittin", "cru", [35.45, 32.8], "1187", 5, "verified", undefined, true),
    fort("kudus", "Kudüs (al-Quds)", "cru", [35.23, 31.78], "1187", 6),
    fort("akka", "Akka (Acre)", "cru", [35.07, 32.93], "1187", 5),
    fort("kerak", "Kerak", "cru", [35.7, 31.18], "1188", 5),
    fort("aynicalut", "Ayn Jalut", "mon", [35.35, 32.55], "1260", 6, "verified", undefined, true),
    fort("kayseriye", "Kayseriye (Caesarea)", "cru", [34.9, 32.5], "1265", 6),
    fort("safed", "Safed", "cru", [35.5, 32.96], "1266", 6),
    fort("antakya1268", "Antakya (Antioch)", "cru", [36.16, 36.2], "1268", 7),
    fort("hisnulekrad", "Hisn al-Akrad (Krak)", "cru", [36.29, 34.76], "1271", 7),
    fort("trablussam", "Trablusşam (Tripoli)", "cru", [35.84, 34.44], "1289", 7),
    fort("akka1291", "Akka (1291)", "cru", [35.12, 33.05], "1291", 8),
  ],
  ocaks: [],
  eras: [
    { id: "z1", ruler: "zengi", years: "1127–1146", rulers: ["İmadeddin Zengi"], companions: [], conf: "verified",
      title: { en: "Zengi takes Edessa", ur: "Zangi ne Edessa liya", tr: "Zengî Urfa'yı alır", ar: "زنكي يفتح الرها", fa: "زنگی رُها را می‌گیرد" },
      note: { en: "İmadeddin Zengi, son of the Turkic emir Aksungur, takes Edessa (1144), the first crusader state to fall.", ur: "Turk ameer Aksungur ke bete İmadeddin Zangi 1144 mein Edessa lete hain, pehli Saleebi riyasat jo giri.", tr: "Türk emîri Aksungur'un oğlu İmadeddin Zengî Urfa'yı (1144) alır; düşen ilk Haçlı devleti." },
      goal: { forts: ["urfa"], otag: 3 } },
    { id: "z2", ruler: "nuraddin", years: "1146–1174", rulers: ["Nureddin Mahmud Zengi"], companions: ["sirkuh", "salahaddin", "ismetuddin"], conf: "verified",
      title: { en: "Nur al-Din unites Syria", ur: "Nooruddin Shaam ko mutahid karte hain", tr: "Nureddin Suriye'yi birleştirir", ar: "نور الدين يوحّد الشام", fa: "نورالدین شام را متحد می‌کند" },
      note: { en: "Nur al-Din Zengi wins at İnab (1149) and Harim (1164), unites Syria and sends Shirkuh and Salah al-Din to Egypt.", ur: "Nooruddin Zangi İnab (1149) aur Harim (1164) jeet-te hain, Shaam ko mutahid karte hain aur Shirkuh aur Salahuddin ko Misr bhejte hain.", tr: "Nureddin Zengî İnab (1149) ve Harim'de (1164) kazanır, Suriye'yi birleştirir, Şirkuh ve Selâhaddin'i Mısır'a gönderir." },
      goal: { forts: ["inab", "harim", "banyas"] } },
    { id: "z3", ruler: "salahaddin", years: "1174–1193", rulers: ["Selâhaddin Eyyûbî"], companions: ["ismetuddin"], conf: "verified",
      title: { en: "Hattin and al-Quds", ur: "Hittin aur Bait-ul-Muqaddas", tr: "Hittin ve Kudüs", ar: "حطين والقدس", fa: "حطین و قدس" },
      note: { en: "On 4 July 1187 the crusader army is destroyed at Hattin; al-Quds is freed on 2 October 1187 with largely Turkic cavalry.", ur: "4 July 1187 ko Hittin par Saleebi fauj tabah hui; 2 October 1187 ko zyada tar Turk sawaron ke saath Bait-ul-Muqaddas aazaad hua.", tr: "4 Temmuz 1187'de Haçlı ordusu Hittin'de yok edilir; 2 Ekim 1187'de büyük ölçüde Türk süvarisiyle Kudüs alınır." },
      goal: { forts: ["hittin", "kudus", "akka", "kerak"] } },
    { id: "z4", ruler: "baybars", years: "1250–1277", rulers: ["Aybek", "Kutuz", "Baybars"], companions: ["kutuz", "kalavun"], conf: "verified",
      title: { en: "Ayn Jalut: the Mongols stopped", ur: "Ain Jalut: Mongol rok diye gaye", tr: "Aynicâlût: Moğollar durdurulur", ar: "عين جالوت: إيقاف المغول", fa: "عین جالوت: توقف مغولان" },
      note: { en: "Kutuz and Baybars defeat the Mongols at Ayn Jalut (1260); Baybars then takes Caesarea, Safed, Antioch and Krak.", ur: "Kutuz aur Baybars 1260 mein Ain Jalut par Mongolon ko haraate hain; phir Baybars Kayseriye, Safed, Antakya aur Krak lete hain.", tr: "Kutuz ve Baybars Aynicâlût'ta (1260) Moğolları yener; Baybars ardından Kayseriye, Safed, Antakya ve Hısnülekrad'ı alır." },
      goal: { forts: ["aynicalut", "kayseriye", "safed", "antakya1268", "hisnulekrad"] } },
    { id: "z5", ruler: "kalavun", years: "1279–1293", rulers: ["Kalavun", "el-Eşref Halil"], companions: ["esrefhalil"], conf: "verified",
      title: { en: "The last crusader ports", ur: "Aakhri Saleebi bandargahein", tr: "Son Haçlı limanları", ar: "آخر موانئ الصليبيين", fa: "آخرین بندرهای صلیبیان" },
      note: { en: "Kalavun takes Tripoli (1289) and his son al-Ashraf Khalil takes Acre (1291), ending the crusader states.", ur: "Kalavun 1289 mein Trablus lete hain aur un ke bete al-Ashraf Khalil 1291 mein Akka le kar Saleebi riyasaton ka khatma karte hain.", tr: "Kalavun Trablusşam'ı (1289), oğlu el-Eşref Halil Akka'yı (1291) alır; Haçlı devletleri sona erer." },
      goal: { forts: ["trablussam", "akka1291"] } },
  ],
};

/* ------------------------------------------------------------------------------------------------ Khwarazm */

const KHWARAZM: Path = {
  id: "harezm",
  name: { en: "Khwarazmshahs", ur: "Khwarazm Shahi", tr: "Harezmşahlar", ar: "الخوارزمشاهية", fa: "خوارزمشاهیان" },
  tribes: ["begdili"],
  state: "khwarazm",
  forts: [
    fort("pervan", "Pervan (Parwan)", "mon", [69.2, 35.1], "1221", 5, "verified", undefined, true),
    fort("tiflis", "Tiflis", "geo", [44.79, 41.72], "1226", 5, "verified", "Tbilisi"),
  ],
  ocaks: [],
  eras: [
    { id: "h1", ruler: "atsiz", years: "1127–1156", rulers: ["Atsız"], companions: [], conf: "verified",
      title: { en: "Atsız at Gurganj", ur: "Gurganj mein Atsız", tr: "Gürgenç'te Atsız", ar: "أتسز في الجرجانية", fa: "آتسز در گرگانج" },
      note: { en: "Atsız, governor for the Seljuks, makes Khwarazm a power of its own.", ur: "Seljuqon ke governor Atsız Khwarazm ko apni taqat banate hain.", tr: "Selçuklu valisi Atsız Harezm'i bağımsız bir güç yapar." },
      goal: { hunts: 3, otag: 3 } },
    { id: "h2", ruler: "tekis", years: "1172–1200", rulers: ["İl-Arslan", "Tekiş"], companions: [], conf: "verified",
      title: { en: "Tekiş in Khorasan", ur: "Khorasan mein Tekiş", tr: "Horasan'da Tekiş", ar: "تكش في خراسان", fa: "تکش در خراسان" },
      note: { en: "Tekiş takes Khorasan and Iraq-i Ajam.", ur: "Tekiş Khorasan aur Iraq-e-Ajam lete hain.", tr: "Tekiş Horasan'ı ve Irak-ı Acem'i alır." },
      goal: { unions: 1, otag: 5 } },
    { id: "h3", ruler: "alaeddinmuhammad", years: "1200–1220", rulers: ["Alaeddin Muhammed"], companions: ["terkenhatun"], conf: "verified",
      title: { en: "From the Syr Darya to Iraq", ur: "Syr Darya se Iraq tak", tr: "Seyhun'dan Irak'a", ar: "من سيحون إلى العراق", fa: "از سیحون تا عراق" },
      note: { en: "The realm spans Transoxiana, Khorasan and Iran when the Mongols arrive (1219).", ur: "Jab 1219 mein Mongol aate hain to saltanat Mawara-un-Nahr, Khorasan aur Iran tak phaili hai.", tr: "Moğollar geldiğinde (1219) ülke Maveraünnehir, Horasan ve İran'ı kapsar." },
      goal: { unions: 2, wave: 4 } },
    { id: "h4", ruler: "jalaladdin", years: "1220–1231", rulers: ["Celâleddin Harezmşah"], companions: ["timurmelik"], conf: "verified",
      title: { en: "Jalal al-Din against the Mongols", ur: "Jalaluddin bamuqabla Mongol", tr: "Celâleddin Moğollara karşı", ar: "جلال الدين في مواجهة المغول", fa: "جلال‌الدین در برابر مغولان" },
      note: { en: "Jalal al-Din beats the Mongols at Parwan (1221), crosses the Indus and later takes Tiflis (1226).", ur: "Jalaluddin 1221 mein Parwan par Mongolon ko haraate hain, Sindh paar karte hain aur baad mein 1226 mein Tiflis lete hain.", tr: "Celâleddin Pervan'da (1221) Moğolları yener, İndus'u geçer ve sonra Tiflis'i (1226) alır." },
      goal: { forts: ["pervan", "tiflis"], wave: 6 } },
  ],
};

/* ------------------------------------------------------------------------------------------------ Ghazna and Delhi */

const HIND: Path = {
  id: "gaznedelhi",
  name: { en: "Ghaznavids and the Delhi Sultanate", ur: "Ghaznavi aur Delhi Saltanat", tr: "Gazneliler ve Delhi Sultanlığı", ar: "الغزنويون وسلطنة دلهي", fa: "غزنویان و سلطنت دهلی" },
  tribes: [],
  state: "delhi",
  forts: [
    fort("pesaver", "Peshawar", "hin", [71.57, 34.0], "1001", 3, "verified", undefined, true),
    fort("nagarkot", "Nagarkot (Kangra)", "hin", [76.27, 32.1], "1009", 4),
    fort("kanauj", "Kannauj", "hin", [79.92, 27.05], "1018", 5),
    fort("tarain", "Tarain", "hin", [76.8, 29.8], "1192", 5, "verified", undefined, true),
    fort("gwalior", "Gwalior", "hin", [78.17, 26.23], "1196", 5, "reported"),
    fort("kalinjar", "Kalinjar", "hin", [80.48, 25.0], "1203", 6),
    fort("ranthambore1226", "Ranthambore", "hin", [76.46, 26.02], "1226", 6),
    fort("devagiri", "Devagiri", "hin", [75.21, 19.94], "1296", 6, "verified", "Daulatabad"),
    fort("ranthambore1301", "Ranthambore (1301)", "hin", [76.6, 25.9], "1301", 7),
    fort("chittor", "Chittor", "hin", [74.65, 24.89], "1303", 7),
    fort("warangal", "Warangal", "hin", [79.6, 17.98], "1310", 7),
  ],
  ocaks: [],
  eras: [
    { id: "g1", ruler: "sebuktegin", years: "977–997", rulers: ["Sebüktegin"], companions: [], conf: "verified",
      title: { en: "Sebüktegin at Ghazna", ur: "Ghazni mein Sebüktegin", tr: "Gazne'de Sebüktegin", ar: "سبكتكين في غزنة", fa: "سبکتگین در غزنه" },
      note: { en: "The Turkic commander Sebüktegin founds the Ghaznavid house.", ur: "Turk sipahsalar Sebüktegin Ghaznavi khandan ki bunyaad rakhte hain.", tr: "Türk komutan Sebüktegin Gazneli hanedanını kurar." },
      goal: { hunts: 3, otag: 3 } },
    { id: "g2", ruler: "mahmudghazni", years: "998–1030", rulers: ["Mahmud of Ghazni"], companions: ["ayaz"], conf: "verified",
      title: { en: "Sultan Mahmud's campaigns", ur: "Sultan Mahmud ki muhimmat", tr: "Sultan Mahmud'un seferleri", ar: "غزوات السلطان محمود", fa: "لشکرکشی‌های سلطان محمود" },
      note: { en: "Mahmud defeats Jayapala near Peshawar (1001) and campaigns as far as Kannauj (1018).", ur: "Mahmud 1001 mein Peshawar ke qareeb Jaipal ko haraate hain aur 1018 mein Kannauj tak jaate hain.", tr: "Mahmud Peşaver yakınında (1001) Cayapala'yı yener ve Kannauj'a (1018) kadar sefer eder." },
      goal: { forts: ["pesaver", "nagarkot", "kanauj"] } },
    { id: "g3", ruler: "aibak", years: "1192–1210", rulers: ["Kutbüddin Aybek"], companions: [], conf: "verified",
      title: { en: "Aibak founds the Delhi Sultanate", ur: "Aibak Delhi Saltanat qaim karte hain", tr: "Aybek Delhi Sultanlığı'nı kurar", ar: "أيبك يؤسس سلطنة دلهي", fa: "ایبک سلطنت دهلی را بنیاد می‌نهد" },
      note: { en: "After Tarain (1192) Aibak, Muhammad of Ghor's Turkic commander, takes Gwalior and Kalinjar and rules from Delhi (1206).", ur: "Tarain (1192) ke baad Muhammad Ghori ke Turk sipahsalar Aibak Gwalior aur Kalinjar lete hain aur 1206 se Delhi se hukumat karte hain.", tr: "Tarain'den (1192) sonra Gurlu Muhammed'in Türk komutanı Aybek Gwalior ve Kalinjar'ı alır ve 1206'dan itibaren Delhi'den hükmeder." },
      goal: { forts: ["tarain", "gwalior", "kalinjar"] } },
    { id: "g4", ruler: "iltutmish", years: "1211–1240", rulers: ["İltutmış", "Raziye Sultan"], companions: ["raziye"], conf: "verified",
      title: { en: "Iltutmish and Raziye", ur: "Iltutmish aur Razia", tr: "İltutmış ve Raziye", ar: "التتمش ورضية", fa: "ایلتتمش و رضیه" },
      note: { en: "Iltutmish secures the sultanate and takes Ranthambore (1226); his daughter Raziye rules after him.", ur: "Iltutmish saltanat mazboot karte hain aur 1226 mein Ranthambore lete hain; un ki beti Razia un ke baad hukumat karti hain.", tr: "İltutmış sultanlığı sağlamlaştırır ve Ranthambore'u (1226) alır; ardından kızı Raziye hükmeder." },
      goal: { forts: ["ranthambore1226"], wave: 3 } },
    { id: "g5", ruler: "balban", years: "1266–1287", rulers: ["Balaban"], companions: [], conf: "verified",
      title: { en: "Balban holds the north-west", ur: "Balban shimal-maghrib ki hifazat", tr: "Balaban kuzeybatıyı korur", ar: "بلبن يحمي الشمال الغربي", fa: "بلبن از شمال‌غرب پاسداری می‌کند" },
      note: { en: "Balban guards the frontier against the Mongols.", ur: "Balban Mongolon ke khilaf sarhad ki hifazat karte hain.", tr: "Balaban sınırı Moğollara karşı korur." },
      goal: { wave: 6, otag: 7 } },
    { id: "g6", ruler: "alauddin", years: "1296–1316", rulers: ["Alaeddin Halaci"], companions: ["zafarkhan"], conf: "verified",
      title: { en: "Alauddin Khalji: the Deccan", ur: "Alauddin Khilji: Dakan", tr: "Alaeddin Halaci: Dekken", ar: "علاء الدين الخلجي: الدكن", fa: "علاءالدین خلجی: دکن" },
      note: { en: "Alauddin repels the Mongols and takes Devagiri, Ranthambore, Chittor and Warangal. The Khaljis' Turkic origin is debated.", ur: "Alauddin Mongolon ko pasapa karte hain aur Devagiri, Ranthambore, Chittor aur Warangal lete hain. Khiljiyon ki Turk asal par ikhtilaf hai.", tr: "Alaeddin Moğolları püskürtür; Devagiri, Ranthambore, Chittor ve Warangal'ı alır. Halacların Türk kökeni tartışmalıdır." },
      goal: { forts: ["devagiri", "ranthambore1301", "chittor", "warangal"], wave: 8 } },
  ],
};

/* ------------------------------------------------------------------------------------------------ Aq Qoyunlu and Afshar */

const AQQOYUNLU: Path = {
  id: "akkoyunlu",
  name: { en: "Aq Qoyunlu", ur: "Aq Qoyunlu", tr: "Akkoyunlular", ar: "آق قويونلو", fa: "آق‌قویونلو" },
  tribes: ["bayindir"],
  state: "aqqoyunlu",
  forts: [],
  ocaks: [],
  eras: [
    { id: "a1", ruler: "karayuluk", years: "1378–1435", rulers: ["Kara Yülük Osman Bey"], companions: [], conf: "verified",
      title: { en: "Kara Yülük Osman at Diyarbakır", ur: "Diyarbakır mein Kara Yülük Osman", tr: "Diyarbakır'da Kara Yülük Osman", ar: "قرا يولوك عثمان في ديار بكر", fa: "قرایولوک عثمان در دیاربکر" },
      note: { en: "The Bayındır house of Kara Yülük Osman Bey rules from Diyarbakır.", ur: "Kara Yülük Osman Bey ka Bayındır gharana Diyarbakır se hukumat karta hai.", tr: "Kara Yülük Osman Bey'in Bayındır hanedanı Diyarbakır'dan hükmeder." },
      goal: { hunts: 4, otag: 4, unions: 1 } },
    { id: "a2", ruler: "uzunhasan", years: "1453–1478", rulers: ["Uzun Hasan"], companions: ["saramhatun"], conf: "verified",
      title: { en: "Uzun Hasan at Tabriz", ur: "Tabriz mein Uzun Hasan", tr: "Tebriz'de Uzun Hasan", ar: "أوزون حسن في تبريز", fa: "اوزون حسن در تبریز" },
      note: { en: "Uzun Hasan defeats the Qara Qoyunlu (1467) and the Timurid Abu Sa'id (1469) and rules from Tabriz.", ur: "Uzun Hasan 1467 mein Qara Qoyunlu aur 1469 mein Taimuri Abu Saeed ko haraate hain aur Tabriz se hukumat karte hain.", tr: "Uzun Hasan Karakoyunluları (1467) ve Timurlu Ebû Saîd'i (1469) yener ve Tebriz'den hükmeder." },
      goal: { unions: ["qaraqoyunlu", "timurid"], wave: 6 } },
  ],
};

const AFSHAR: Path = {
  id: "afsar",
  name: { en: "Afsharid Iran", ur: "Afshari Iran", tr: "Avşar Hanedanı", ar: "الأفشاريون", fa: "افشاریان" },
  tribes: ["avsar"],
  state: "afsharid",
  forts: [],
  ocaks: [],
  eras: [
    { id: "f1", years: "early 18th c.", rulers: [], companions: [], conf: "verified",
      title: { en: "The Afshar oba at Abivard", ur: "Abivard mein Afshar oba", tr: "Ebiverd'de Avşar obası", ar: "أوبا الأفشار في أبيورد", fa: "اوبای افشار در ابیورد" },
      note: { en: "Nadir, of the Kırklu clan of the Afshar, grows up near Abivard in Khorasan.", ur: "Afshar ke Kırklu khandan ke Nadir Khorasan mein Abivard ke qareeb jawan hote hain.", tr: "Avşar'ın Kırklu obasından Nadir, Horasan'da Ebiverd yakınlarında yetişir." },
      goal: { hunts: 5, otag: 4, wave: 3 } },
    { id: "f2", ruler: "nadershah", years: "1736–1747", rulers: ["Nadir Şah"], companions: [], conf: "verified",
      title: { en: "Nadir Shah", ur: "Nadir Shah", tr: "Nadir Şah", ar: "نادر شاه", fa: "نادرشاه" },
      note: { en: "Nadir restores Iran's frontiers and is crowned in 1736.", ur: "Nadir Iran ki sarhadein bahaal karte hain aur 1736 mein taaj posh hote hain.", tr: "Nadir İran'ın sınırlarını yeniden kurar ve 1736'da tahta çıkar." },
      goal: { unions: 3, wave: 7, otag: 8 } },
  ],
};

export const PATHS: Path[] = [OTTOMAN, SELJUK, SHAM, KHWARAZM, HIND, AQQOYUNLU, AFSHAR];
export const PATH_BY_ID: Record<string, Path> = Object.fromEntries(PATHS.map((p) => [p.id, p]));

/** First era in which a hero joins each path (ruler or companion or house commander). */
export function heroEra(path: Path, heroId: string): number | null {
  for (let i = 0; i < path.eras.length; i++) {
    const e = path.eras[i];
    if (e.ruler === heroId || e.companions.includes(heroId)) return i;
  }
  return null;
}

/** All hero ids of a path. */
export function pathHeroes(path: Path): string[] {
  const out: string[] = [];
  for (const e of path.eras) for (const h of [e.ruler, ...e.companions]) if (h && !out.includes(h)) out.push(h);
  for (const o of path.ocaks) for (const c of o.commanders) if (!out.includes(c.hero)) out.push(c.hero);
  return out;
}

export function fortDefenders(f: Fort): { azap: number; okcu: number; sipahi: number } {
  const total = Math.round(30 * Math.pow(f.tier, 1.75) + 20 * f.tier);
  const [a, o, s] = HOLDERS[f.holder].mix;
  return { azap: Math.round(total * a), okcu: Math.round(total * o), sipahi: Math.round(total * s) };
}

/** Units of the current era: each troop type takes the name from the latest era that defines it. */
export function unitsAt(path: Path | null, era: number): Partial<Record<TroopId, Unit>> {
  const out: Partial<Record<TroopId, Unit>> = {};
  if (!path) return out;
  for (const e of path.eras.slice(0, era + 1)) Object.assign(out, e.units ?? {});
  return out;
}

export function bannerAt(path: Path | null, era: number): EraBanner | null {
  if (!path) return null;
  let b: EraBanner | null = null;
  for (const e of path.eras.slice(0, era + 1)) if (e.banner) b = e.banner;
  return b;
}
