[![npm version](https://badge.fury.io/js/humanize-uz.svg)](https://badge.fury.io/js/humanize-uz)
[![CI](https://github.com/OnlineAzamat/humanize-uz/actions/workflows/ci.yml/badge.svg)](https://github.com/OnlineAzamat/humanize-uz/actions/workflows/ci.yml)

# humanize-uz

O‘zbek tilida inson o‘qiydigan ko‘rinishda raqam, sana va boshqa ma'lumotlarni formatlovchi kutubxona.

- Uch yozuvda natija: amaldagi lotin, **2026-yilgi yangi lotin alifbosi** (ö, ğ, ş, ç) va kirill
- **Qoraqalpoq tili** (tajribaviy): 2016-yilgi lotin va kirill yozuvi
- Summani soʻz bilan yozish (shartnoma va toʻlov hujjatlari uchun)
- Yozuvlar orasida transliteratsiya va apostroflarni rasmiy belgilarga keltirish
- Bogʻliqliklarsiz, TypeScript turlari bilan, ESM, Node.js 18+ va brauzer

## O‘rnatish

```bash
npm install humanize-uz
```

## Imkoniyatlar

### 1. Sonlarni formatlash
```js
import { humanizeNumber, numberToWords, humanizeOrdinal, ordinalToWords } from "humanize-uz"

// Qisqa ko'rinishda
humanizeNumber(1250000) // "1.3 million"
humanizeNumber(1500)    // "1.5 ming"
humanizeNumber(999999)  // "1 million"

// So'z bilan ifodalash
numberToWords(123)      // "yuz yigirma uch"
numberToWords(1500)     // "bir ming besh yuz"

// Tartib sonlar
humanizeOrdinal(1)             // "1-"
humanizeOrdinal(2, "full")     // "2-nchi"
humanizeOrdinal(3, "full")     // "3-inchi"

// Tartib sonni so'z bilan
ordinalToWords(1)              // "birinchi"
ordinalToWords(22)             // "yigirma ikkinchi"
```

> `numberToWords` faqat butun sonlarni qabul qiladi (aks holda `RangeError`) va rasmiy `ʻ` (U+02BB) belgisidan foydalanadi: `numberToWords(10) // "oʻn"`.

### 2. Sana va vaqt
```js
import { humanizeDate, timeAgo, humanizeTimeRange } from "humanize-uz"

humanizeDate(new Date())                       // "bugun"
humanizeDate(Date.now() + 86400000)            // "ertaga"
timeAgo(new Date(Date.now() - 3600 * 1000))    // "1 soat oldin"
timeAgo(new Date(Date.now() + 5 * 60 * 1000))  // "5 daqiqadan keyin"

// Vaqt oralig'i
humanizeTimeRange(
  new Date('2025-08-10T09:00'),
  new Date('2025-08-10T17:30')
)
// "10-avgust, 2025, 09:00 - 17:30"
```

### 3. Valyuta va Fayl hajmi
```js
import { humanizeCurrency, humanizeFileSize } from "humanize-uz"

// Valyuta
humanizeCurrency(125000)        // "125 000 soʻm"
humanizeCurrency(100, 'USD')    // "$100"
humanizeCurrency(1234.5)        // "1 234.5 soʻm"

// Fayl hajmi
humanizeFileSize(1024)          // "1 KB"
humanizeFileSize(1572864, 1)    // "1.5 MB"
```

### 4. Summani so'z bilan yozish
```js
import { amountToWords } from "humanize-uz"

amountToWords(1250000.5)                  // "bir million ikki yuz ellik ming soʻm 50 tiyin"
amountToWords(1250000)                    // "bir million ikki yuz ellik ming soʻm"
amountToWords(100, { currency: "USD" })   // "yuz dollar"
amountToWords(12.05, { fraction: "words", capitalize: true }) // "Oʻn ikki soʻm besh tiyin"
amountToWords(12.05, { locale: "uz-Cyrl" })                   // "ўн икки сўм 05 тийин"
```

Valyutalar: `UZS` (standart), `USD`, `EUR`. Kasr qismi 2 xonagacha yaxlitlanadi va nol boʻlsa yozilmaydi.

### 5. Telefon va Ro'yxatlar
```js
import { humanizePhoneNumber, humanizeList } from "humanize-uz"

// Telefon raqami
humanizePhoneNumber("901234567")    // "+998 (90) 123-45-67"
humanizePhoneNumber(998931234567)   // "+998 (93) 123-45-67"

// Ro'yxatni formatlash
humanizeList(['olma', 'anor', 'behi']) // "olma, anor va behi"
```

### 6. Imlo va transliteratsiya
```js
import { normalizeUz, transliterate, detectScript } from "humanize-uz"

// Apostroflarni rasmiy belgilarga keltirish: oʻ, gʻ — ʻ (U+02BB), tutuq belgisi — ʼ (U+02BC)
normalizeUz("O'zbekiston")  // "Oʻzbekiston"
normalizeUz("ma'no")        // "maʼno"

// Amaldagi lotin, 2026-yilgi lotin (ö, ğ, ş, ç) va kirill orasida
transliterate("Oʻzbekiston", { to: "uz-Latn-2026" })  // "Özbekiston"
transliterate("choʻqqi", { to: "uz-Cyrl" })           // "чўққи"
transliterate("Шаҳар", { to: "uz-Latn" })             // "Shahar"
transliterate("Isʼhoq", { to: "uz-Latn-2026" })       // "Ishoq"

detectScript("Şahar")  // "uz-Latn-2026"
```

Kirish yozuvi avtomatik aniqlanadi. Lotin matnda ö, ğ, ş, ç boʻlmasa, u amaldagi imlo deb olinadi; boshqacha boʻlsa `from` parametrini bering: `transliterate("Ishoq", { from: "uz-Latn-2026", to: "uz-Cyrl" })`.

#### `locale` parametri

Soʻz qaytaradigan barcha funksiyalar oxirgi argument sifatida `{ locale }` qabul qiladi. Standart qiymat — `"uz-Latn"` (amaldagi imlo), shuning uchun eski kod oʻzgarmaydi.

```js
numberToWords(94, { locale: "uz-Latn-2026" })        // "töqson tört"
numberToWords(94, { locale: "uz-Cyrl" })             // "тўқсон тўрт"
humanizeOrdinal(2, "full", { locale: "uz-Latn-2026" }) // "2-nçi"
timeAgo(date, { locale: "uz-Cyrl" })                 // "2 соат олдин"
humanizeCurrency(125000, "UZS", { locale: "uz-Latn-2026" }) // "125 000 söm"
humanizeTimeRange(start, end, { locale: "uz-Cyrl" }) // "10 сентябр, 2025, 09:00 - 17:30"
```

| `locale` | Yozuv |
|---|---|
| `uz-Latn` | Amaldagi lotin (oʻ, gʻ, sh, ch) — standart |
| `uz-Latn-2026` | 2026-yilgi lotin (ö, ğ, ş, ç) |
| `uz-Cyrl` | Kirill |
| `kaa-Latn` | Qoraqalpoq, 2016-yilgi lotin (tajribaviy) |
| `kaa-Cyrl` | Qoraqalpoq, kirill (tajribaviy) |

> Lotindan kirillga oʻtkazish qoidalarga asoslangan. Ruschadan oʻzlashgan soʻzlar (`sentabr` → `сентябрь`, `ts` → `ц`) lugʻatsiz toʻgʻri tiklanmaydi.

### 7. Qoraqalpoq tili (tajribaviy)

Soʻz qaytaradigan barcha funksiyalar `kaa-Latn` va `kaa-Cyrl` ni qabul qiladi. Brauzer va Node.js'dagi `Intl` qoraqalpoq tilini bilmaydi, shuning uchun soʻzlar va oy nomlari kutubxonaning oʻzida saqlanadi.

```js
import { numberToWords, ordinalToWords, amountToWords, timeAgo, transliterate, toUpperKaa, normalizeKaa } from "humanize-uz"

numberToWords(1994, { locale: "kaa-Latn" })  // "bir mıń toǵız júz toqsan tórt"
numberToWords(1994, { locale: "kaa-Cyrl" })  // "бир мың тоғыз жүз тоқсан төрт"
ordinalToWords(6, { locale: "kaa-Latn" })    // "altınshı"
timeAgo(date, { locale: "kaa-Latn" })        // "2 saat burın"
amountToWords(1250000.5, { locale: "kaa-Latn" }) // "bir million eki júz eliw mıń swm 50 tıyın"

transliterate("Қарақалпақстан", { to: "kaa-Latn" })  // "Qaraqalpaqstan"
transliterate("Nókis", { to: "kaa-Cyrl" })           // "Нөкис"

// Í ning kichigi nuqtasiz ı: standart "altı".toUpperCase() "ALTI" beradi
toUpperKaa("altı")       // "ALTÍ"
normalizeKaa("No'kis")   // "Nókis" (2016-yilgacha boʻlgan apostrofli yozuv)
```

> **Tajribaviy.** Qoraqalpoqcha soʻzlar ona tilida soʻzlashuvchi tomonidan hali tasdiqlanmagan. Ayniqsa quyidagilarni tekshirish kerak: tartib sonlar (`jigirmanshı`, `qırıqınshı`), vaqt soʻzlari (`burın`, `minuttan keyin`, `házir`), valyuta (`swm`, `tıyın`, `cent`) va `hám`. Xato topsangiz, [issue oching](https://github.com/OnlineAzamat/humanize-uz/issues).

### 8. `pluralizeUz` (eskirgan)

O‘zbek tilida sondan keyin ot birlikda qoladi: **"5 kitob"**, "5 kitoblar" emas. Shu sababli `pluralizeUz` eskirgan (`@deprecated`) deb belgilandi va keyingi major versiyada olib tashlanadi.

## 0.1.x dan yangilash

1.x versiyada xatolar tuzatildi, shu sababli ayrim natijalar oʻzgardi:

| Funksiya | 0.1.x | 1.x |
|---|---|---|
| `humanizeNumber(1000000)` | `"1.0 million"` | `"1 million"` |
| `humanizeNumber(999999)` | `"1000.0 ming"` | `"1 million"` |
| `timeAgo` (10 daqiqa oldin) | `"1 soat oldin"` | `"10 daqiqa oldin"` |
| `timeAgo` (5 soniyadan kam) | `"2 soniya oldin"` | `"hozirgina"` |
| `humanizeDate` (ertangi kun) | `"-1 kun oldin"` | `"ertaga"` |
| `humanizeCurrency(1234.567)` | `"1 234.567 soʻm"` | `"1 234.57 soʻm"` |

- Notoʻgʻri sana, `NaN` yoki `Infinity` berilsa, funksiyalar endi `RangeError` tashlaydi.
- Paketga faqat `import { ... } from "humanize-uz"` orqali murojaat qilinadi; `humanize-uz/dist/...` kabi ichki yoʻllar `exports` sababli yopilgan.
- Node.js 18 yoki undan yangi versiya talab qilinadi.

## Versiyalar

**Keyingi versiya** (hali chiqarilmagan):
- Yangi: `amountToWords` (summani soʻz bilan), `ordinalToWords` (tartib sonni soʻz bilan).
- Qoraqalpoq tili (tajribaviy): `kaa-Latn`, `kaa-Cyrl` locale'lari, `normalizeKaa`, `toUpperKaa`, `toLowerKaa`, `transliterate` orqali lotin ↔ kirill.
- `humanizeList` ning bogʻlovchisi endi ixtiyoriy: berilmasa tilga qarab `va` yoki `hám`.

**1.1.0** — npm'dagi birinchi 1.x versiya (0.1.6 dan keyin):
- Yangi: `normalizeUz`, `transliterate`, `detectScript`; soʻz qaytaradigan barcha funksiyalarda `{ locale }` parametri (`uz-Latn`, `uz-Latn-2026`, `uz-Cyrl`).
- Yangi eksportlar: `numberToWords`, `humanizeOrdinal`, `humanizeTimeRange`, `humanizeFileSize`, `humanizePhoneNumber`, `humanizeList`.
- Tuzatishlar: `timeAgo`, `humanizeDate`, `humanizeNumber`, `numberToWords`, `humanizeCurrency`, `humanizeFileSize` (yuqoridagi jadvalga qarang).
- `pluralizeUz` eskirgan deb belgilandi.

## Ishlab chiqish

```bash
npm install
npm test           # testlar
npm run typecheck  # TypeScript tekshiruvi
npm run build      # dist/ papkasini yaratish
```

`dist/` git'da saqlanmaydi: `npm pack` va `npm publish` paytida `prepack` skripti uni avtomatik quradi, `npm publish` esa avval testlarni ishga tushiradi (`prepublishOnly`).

### Yangi versiya chiqarish

```bash
npm version minor        # yoki patch / major: versiya commit'i va v* tegi
git push --follow-tags   # teg GitHub Actions'dagi Release workflow'ini ishga tushiradi
```

Paket npm'ga [trusted publishing](https://docs.npmjs.com/trusted-publishers/) orqali, tokensiz va provenance bilan chiqariladi (`.github/workflows/release.yml`).

## Litsenziya
MIT
