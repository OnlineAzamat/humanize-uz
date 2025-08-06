[![npm version](https://badge.fury.io/js/humanize-uz.svg)](https://badge.fury.io/js/humanize-uz)

# humanize-uz

O‘zbek tilida inson o‘qiydigan ko‘rinishda raqam va sanalarni formatlovchi kutubxona.

## O‘rnatish

```bash
npm install humanize-uz
```
Foydalanish
```js
import { humanizeNumber, humanizeDate, timeAgo } from "humanize-uz"

console.log(humanizeNumber(1250000)) // 1.2 million
console.log(humanizeDate("2025-08-06")) // bugun
console.log(timeAgo(new Date(Date.now() - 3600 * 1000))) // 1 soat oldin

```