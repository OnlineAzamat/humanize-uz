# Versiyalar tarixi

## 1.3.0 — hali chiqarilmagan

### Yangi

- `addSuffix`, `compareUz`, `searchKey`, `getPhoneOperator`, `isValidUzPhone`.

### Tuzatishlar

- `addSuffix`: `bargga`, `pedagogga`, `bogʻga`, `bugʻga`; `ga` va `gacha` uchun k/q almashinuvi saqlandi. Asos ham natija locale’iga o‘tkaziladi.
- `humanizeCurrency`: eksponent darajasidagi nollar olib tashlanmaydi; `1e30` qiymati `1e+30 soʻm` bo‘lib qoladi. `1e21` dan kichik qiymatlarda mavjud `toFixed(2)` yaxlitlashi saqlangan.
- `normalizeUz`: so‘z oxiridagi o/g apostroflari ham normallashtiriladi; bu transliteratsiya, qidiruv va saralashga ham tatbiq etiladi.
- `humanizeNumber` va `humanizeOrdinal`: `NaN`, `Infinity`, `-Infinity` endi README shartiga mos `RangeError` beradi. Avval shu qiymatlar uchun satr qaytarilgan.
- `humanizeTimeRange`: ikkala chegaradagi noto‘g‘ri sana barcha locale’larda `RangeError` beradi.
- Mobil kodlar jadvaliga UZTELECOM’ning 70 kodi qo‘shildi.

## 1.2.0 — 2026-10-25

- `amountToWords`: UZS, USD, EUR summalarini so‘z bilan yozish, kasr va bosh harf parametrlari.
- `ordinalToWords`: tartib sonlarni so‘z bilan yozish.
- `kaa-Latn`, `kaa-Cyrl`, qoraqalpoq lug‘ati va lotin/kirill transliteratsiyasi.
- `normalizeKaa`, `toUpperKaa`, `toLowerKaa`.
- `humanizeList` bog‘lovchisi locale bo‘yicha tanlanadi.

## 1.1.0 — 2026-10-15

- `normalizeUz`, `transliterate`, `detectScript` va o‘zbek locale’lari.
- Ommaviy eksportlar: `numberToWords`, `humanizeOrdinal`, `humanizeTimeRange`, `humanizeFileSize`, `humanizePhoneNumber`, `humanizeList`.
- Son, sana, nisbiy vaqt, valyuta va fayl hajmini formatlash tuzatishlari; [migratsiya jadvali](README.md#01x-dan-yangilash).
- `pluralizeUz` eskirgan deb belgilandi. Paket ESM, Node.js 18+ va TypeScript deklaratsiyalari bilan tarqatiladi.
