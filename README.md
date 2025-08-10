[![npm version](https://badge.fury.io/js/humanize-uz.svg)](https://badge.fury.io/js/humanize-uz)

# humanize-uz

O‘zbek tilida inson o‘qiydigan ko‘rinishda raqam va sanalarni formatlovchi kutubxona.

## O‘rnatish

```bash
npm install humanize-uz
```
## Foydalanish
```js
import { humanizeNumber, humanizeDate, timeAgo } from "humanize-uz"

console.log(humanizeNumber(1250000)) // 1.2 million
console.log(humanizeDate("2025-08-06")) // bugun
console.log(timeAgo(new Date(Date.now() - 3600 * 1000))) // 1 soat oldin

```

#### Currency
```js
humanizeCurrency(125000) // "125 000 UZS"
humanizeCurrency(125000, 'USD') // "$125,000"
```

#### pluralizeUz(count, singular, plural)
* O‘zbekcha birlik/ko‘plik qo‘shimchalarini tanlaydi
* Raqamga mos variant qaytaradi
```js
pluralizeUz(1, 'kitob', 'kitoblar') // "kitob"
pluralizeUz(5, 'kitob', 'kitoblar') // "kitoblar"
```

#### humanizeTimeRange(start: Date, end: Date)
* Boshlanish va tugash vaqtini o‘qishga qulay ko‘rinishda qaytaradi
* Kun bir xil bo‘lsa, sanani bir marta yozadi

```js
humanizeTimeRange(
  new Date('2025-08-10T09:00'),
  new Date('2025-08-10T17:30')
)
// "10 avgust, 2025, 09:00 - 17:30"
```