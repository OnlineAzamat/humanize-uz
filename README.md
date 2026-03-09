[![npm version](https://badge.fury.io/js/humanize-uz.svg)](https://badge.fury.io/js/humanize-uz)

# humanize-uz

O‘zbek tilida inson o‘qiydigan ko‘rinishda raqam, sana va boshqa ma'lumotlarni formatlovchi kutubxona.

## O‘rnatish

```bash
npm install humanize-uz
```

## Imkoniyatlar

### 1. Sonlarni formatlash
```js
import { humanizeNumber, numberToWords, humanizeOrdinal } from "humanize-uz"

// Qisqa ko'rinishda
humanizeNumber(1250000) // "1.2 million"
humanizeNumber(1500)    // "1.5 ming"

// So'z bilan ifodalash
numberToWords(123)      // "yuz yigirma uch"
numberToWords(1500)     // "bir ming besh yuz"

// Tartib sonlar
humanizeOrdinal(1)             // "1-"
humanizeOrdinal(2, "full")     // "2-nchi"
humanizeOrdinal(3, "full")     // "3-inchi"
```

### 2. Sana va vaqt
```js
import { humanizeDate, timeAgo, humanizeTimeRange } from "humanize-uz"

humanizeDate("2026-03-09") // "bugun"
timeAgo(new Date(Date.now() - 3600 * 1000)) // "1 soat oldin"

// Vaqt oralig'i
humanizeTimeRange(
  new Date('2025-08-10T09:00'),
  new Date('2025-08-10T17:30')
)
// "10 avgust, 2025, 09:00 - 17:30"
```

### 3. Valyuta va Fayl hajmi
```js
import { humanizeCurrency, humanizeFileSize } from "humanize-uz"

// Valyuta
humanizeCurrency(125000)        // "125 000 soʻm"
humanizeCurrency(100, 'USD')    // "$100"

// Fayl hajmi
humanizeFileSize(1024)          // "1 KB"
humanizeFileSize(1572864, 1)    // "1.5 MB"
```

### 4. Telefon va Ro'yxatlar
```js
import { humanizePhoneNumber, humanizeList } from "humanize-uz"

// Telefon raqami
humanizePhoneNumber("901234567")    // "+998 (90) 123-45-67"
humanizePhoneNumber(998931234567)   // "+998 (93) 123-45-67"

// Ro'yxatni formatlash
humanizeList(['olma', 'anor', 'behi']) // "olma, anor va behi"
```

### 5. Ko'plik/Birlik (Pluralization)
```js
import { pluralizeUz } from "humanize-uz"

pluralizeUz(1, 'kitob', 'kitoblar') // "kitob"
pluralizeUz(5, 'kitob', 'kitoblar') // "kitoblar"
```

## Litsenziya
MIT
