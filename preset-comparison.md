# Preset Encoding Comparison

## Design System State

### Scenarios tested

| Scenario | Description |
|----------|-------------|
| **All defaults** | User hasn't changed anything |
| **Minimal** | Only changed accordion style |
| **Medium** | Changed colors, font, icon lib, 3 component styles |
| **Full** | 14 component styles, 6 param overrides, custom colors, fonts, icons, layout |

### Full state example (used for "Full" scenario)

```json
{
  "c": {
    "a": "material",
    "p": "#6366f1",
    "n": "slate",
    "ac": "violet",
    "s": "#22c55e",
    "w": "#f97316",
    "d": "#ef4444",
    "v": "vibrant",
    "co": 0.2
  },
  "t": {
    "h": "playfair-display",
    "b": "inter"
  },
  "i": "remix",
  "l": {
    "r": "md",
    "s": "compact"
  },
  "s": {
    "accordion": "hammamet",
    "alert": "sousse",
    "badge": "pill",
    "button": "brutalist",
    "card": "elevated",
    "checkbox": "rounded",
    "dialog": "centered",
    "input": "underline",
    "menu": "floating",
    "select": "minimal",
    "tabs": "underline",
    "table": "striped",
    "toast": "stacked",
    "tooltip": "arrow"
  },
  "p": {
    "badge-radius": "full",
    "alert-radius": "md",
    "avatar-radius": "lg",
    "button-radius": "sm",
    "card-radius": "lg",
    "input-radius": "sm"
  }
}
```

---

## Summary Table

| Option | All defaults | Minimal | Medium | Full |
|--------|-------------|---------|--------|------|
| `JSON → base64url` | _(no param)_ | **40** chars | **188** chars | **967** chars |
| `JSON → deflate → base64url` | _(no param)_ | **43** chars | **143** chars | **524** chars |
| `Compact key:value (plain)` | _(no param)_ | **20** chars | **109** chars | **525** chars |
| `Compact key:value (URL-encoded)` | _(no param)_ | **22** chars | **137** chars | **667** chars |
| `Compact key:value → deflate → base64url` | _(no param)_ | **30** chars | **119** chars | **403** chars |
| `Minimal JSON (short keys) → deflate → base64url` | _(no param)_ | **43** chars | **143** chars | **431** chars |

---

## Option 1: JSON → base64url

> Raw JSON with full keys, base64url encoded

**All defaults** (no preset)
```
/create
```

**Minimal** (40 chars)
```
/create?preset=eyJzIjp7ImFjY29yZGlvbiI6ImhhbW1hbWV0In19
```

**Medium** (188 chars)
```
/create?preset=eyJjIjp7InAiOiIjNjM2NmYxIiwibiI6InNsYXRlIn0sInQiOnsiaCI6InBsYXlmYWlyLWRpc3BsYXkifSwiaSI6InJlbWl4IiwicyI6eyJhY2NvcmRpb24iOiJoYW1tYW1ldCIsImFsZXJ0Ijoic291c3NlIiwiYnV0dG9uIjoiYnJ1dGFsaXN0In19
```

**Full** (967 chars)
```
/create?preset=eyJjb2xvcnMiOnsiYWxnb3JpdGhtIjoibWF0ZXJpYWwiLCJwcmltYXJ5IjoiIzYzNjZmMSIsIm5ldXRyYWwiOiJzbGF0ZSIsImFjY2VudCI6InZpb2xldCIsInN1Y2Nlc3MiOiIjMjJjNTVlIiwid2FybmluZyI6IiNmOTczMTYiLCJkYW5nZXIiOiIjZWY0NDQ0IiwibW9kZVZhcmlhbnQiOiJ2aWJyYW50IiwiY29udHJhc3QiOjAuMn0sInR5cG9ncmFwaHkiOnsiaGVhZGluZyI6InBsYXlmYWlyLWRpc3BsYXkiLCJib2R5IjoiaW50ZXIifSwiaWNvbkxpYnJhcnkiOiJyZW1peCIsImxheW91dCI6eyJyYWRpdXMiOiJtZCIsInNwYWNpbmciOiJjb21wYWN0In0sInN0eWxlcyI6eyJhY2NvcmRpb24iOiJoYW1tYW1ldCIsImFsZXJ0Ijoic291c3NlIiwiYmFkZ2UiOiJwaWxsIiwiYnV0dG9uIjoiYnJ1dGFsaXN0IiwiY2FyZCI6ImVsZXZhdGVkIiwiY2hlY2tib3giOiJyb3VuZGVkIiwiZGlhbG9nIjoiY2VudGVyZWQiLCJpbnB1dCI6InVuZGVybGluZSIsIm1lbnUiOiJmbG9hdGluZyIsInNlbGVjdCI6Im1pbmltYWwiLCJ0YWJzIjoidW5kZXJsaW5lIiwidGFibGUiOiJzdHJpcGVkIiwidG9hc3QiOiJzdGFja2VkIiwidG9vbHRpcCI6ImFycm93In0sInBhcmFtcyI6eyJiYWRnZS1yYWRpdXMiOiJmdWxsIiwiYWxlcnQtcmFkaXVzIjoibWQiLCJhdmF0YXItcmFkaXVzIjoibGciLCJidXR0b24tcmFkaXVzIjoic20iLCJjYXJkLXJhZGl1cyI6ImxnIiwiaW5wdXQtcmFkaXVzIjoic20ifX0
```

---

## Option 2: JSON → deflate → base64url

> Raw JSON with full keys, compressed then base64url

**All defaults** (no preset)
```
/create
```

**Minimal** (43 chars)
```
/create?preset=q1YqVrKqVkpMTs4vSsnMz1OyUspIzM1NzE0tUaqtBQA
```

**Medium** (143 chars)
```
/create?preset=HYxBCsMwDAT_srm6h1DwQb9RHIcI7DpYMrQE_70ot4EZ5kYC3bhAWOI7xmNFwAcELWwZM8DcnyBchX8HS3_tos4uBYSeq3wRoB5ySq3v0nxxcq1csyGAS-7m1zZUMwK2YfZEWx_GRdQw5x8
```

**Full** (524 chars)
```
/create?preset=XZHBbuMwDET_hXtVim2aZrH-hj3vnZZom6gkGhSd1ijy7wWVoEV7IwbkaObpHaJk0QbDO2CeRdmWAgMUNFLGDAFW5YK6wwC_zk_n8_QIASptpphhgJbRCAJgjFQNBriwZDII0LYYqTW_Ox7j87NvvaJWrrNr098_T49nCJCwzqQu0XQ6nU4QoEii_6iMd8dRfQoQpZpiMxh-PxyvAWxfZVZcl93zL4TpZr5m3CdkPSRuPkOAUZJX4GqkcA3AUeo_N-7NlAq_QYCMu2zmZoqJNw9fkndZMd6so5QVo7lFsz3TjVyMoomlwgALloKlE8BM6gWabK15_RHTTJ6Ps5MdN7N-M-pmmLn1jqgJBqBMFzTyx-NC8WWUN88pW01dTIxZeiDySl3junp48B3NXP3JQnWDAaYsaN4gQKNM0dcKVy79iw3H9uPOcMwetZny2t1NOnlohvHlrkg2XmEAVJVXZ7KiYulMetfDJ8Zp65U7ksN3uHhBQ_0S8_zJ5kts5c7mx17v_G3tev0A
```

---

## Option 3: Compact key:value (plain)

> Human-readable `key:value` pairs, comma-separated

**All defaults** (no preset)
```
/create
```

**Minimal** (20 chars)
```
/create?preset=s.accordion:hammamet
```

**Medium** (109 chars)
```
/create?preset=c.pri:#6366f1,c.neu:slate,t.h:playfair-display,i:remix,s.accordion:hammamet,s.alert:sousse,s.button:brutalist
```

**Full** (525 chars)
```
/create?preset=c.alg:material,c.pri:#6366f1,c.neu:slate,c.acc:violet,c.suc:#22c55e,c.war:#f97316,c.dan:#ef4444,c.var:vibrant,c.con:0.2,t.h:playfair-display,t.b:inter,i:remix,l.r:md,l.s:compact,s.accordion:hammamet,s.alert:sousse,s.badge:pill,s.button:brutalist,s.card:elevated,s.checkbox:rounded,s.dialog:centered,s.input:underline,s.menu:floating,s.select:minimal,s.tabs:underline,s.table:striped,s.toast:stacked,s.tooltip:arrow,p.badge-radius:full,p.alert-radius:md,p.avatar-radius:lg,p.button-radius:sm,p.card-radius:lg,p.input-radius:sm
```

---

## Option 3b: Compact key:value (URL-encoded)

> Same as above but properly URL-encoded for safe use in query strings

**All defaults** (no preset)
```
/create
```

**Minimal** (22 chars)
```
/create?preset=s.accordion%3Ahammamet
```

**Medium** (137 chars)
```
/create?preset=c.pri%3A%236366f1%2Cc.neu%3Aslate%2Ct.h%3Aplayfair-display%2Ci%3Aremix%2Cs.accordion%3Ahammamet%2Cs.alert%3Asousse%2Cs.button%3Abrutalist
```

**Full** (667 chars)
```
/create?preset=c.alg%3Amaterial%2Cc.pri%3A%236366f1%2Cc.neu%3Aslate%2Cc.acc%3Aviolet%2Cc.suc%3A%2322c55e%2Cc.war%3A%23f97316%2Cc.dan%3A%23ef4444%2Cc.var%3Avibrant%2Cc.con%3A0.2%2Ct.h%3Aplayfair-display%2Ct.b%3Ainter%2Ci%3Aremix%2Cl.r%3Amd%2Cl.s%3Acompact%2Cs.accordion%3Ahammamet%2Cs.alert%3Asousse%2Cs.badge%3Apill%2Cs.button%3Abrutalist%2Cs.card%3Aelevated%2Cs.checkbox%3Arounded%2Cs.dialog%3Acentered%2Cs.input%3Aunderline%2Cs.menu%3Afloating%2Cs.select%3Aminimal%2Cs.tabs%3Aunderline%2Cs.table%3Astriped%2Cs.toast%3Astacked%2Cs.tooltip%3Aarrow%2Cp.badge-radius%3Afull%2Cp.alert-radius%3Amd%2Cp.avatar-radius%3Alg%2Cp.button-radius%3Asm%2Cp.card-radius%3Alg%2Cp.input-radius%3Asm
```

---

## Option 4: Compact key:value → deflate → base64url

> Key:value pairs, compressed

**All defaults** (no preset)
```
/create
```

**Minimal** (30 chars)
```
/create?preset=K9ZLTE7OL0rJzM-zykjMzU3MTS0BAA
```

**Medium** (119 chars)
```
/create?preset=FchLCoBACADQw7Q1IYJZeBubjIT5oQ7U7aPd42UcprSkPaVrg4xNJnnhEAi8aRR-L1ZbT_XfoGRS9QFHzrnbqb3RzbVylfiziAV5n-4CjseM6I0Om8FFPT4
```

**Full** (403 chars)
```
/create?preset=VY9dTgMxDIQP09cQQSlF-DZex7u1cH7kOAvcHmWhQrxlPs_EHoqoG2R0NkENFJsJnK7P1-v6FCgWHtAVnQNFJIJdqrIHin0QnM5nenmZow80OK1vr89P10AxYYETr5fL5RIo7miwy2JYZo5qgcd4Dh5v0BS_VhR7SNLnO3hcQIqzBQHjLJ9Bo0FOQWMHqrkheejzkGpJaoEb5oyZD6hsDr2O3jn0uGDaGJqoTjHca4HFhqNKn3ZCS8DKOzqnqW9M70v9BKujpAMlQa0bEM-LDiKlDYc5N5Uy12QuA1at6FK20GNnZXLIUiTjXO249H8Jx0UZupu040-v2B26I73_6qouDdCsfoT2U-TBMMnosA7V0H663llOk-zoaHek2wwepe-o59CO0v88R6E_yzc
```

---

## Option 5: Minimal JSON (short keys) → deflate → base64url

> JSON with abbreviated keys (`s` for styles, `c` for colors, etc.), compressed

**All defaults** (no preset)
```
/create
```

**Minimal** (43 chars)
```
/create?preset=q1YqVrKqVkpMTs4vSsnMz1OyUspIzM1NzE0tUaqtBQA
```

**Medium** (143 chars)
```
/create?preset=HYxBCsMwDAT_srm6h1DwQb9RHIcI7DpYMrQE_70ot4EZ5kYC3bhAWOI7xmNFwAcELWwZM8DcnyBchX8HS3_tos4uBYSeq3wRoB5ySq3v0nxxcq1csyGAS-7m1zZUMwK2YfZEWx_GRdQw5x8
```

**Full** (431 chars)
```
/create?preset=XVFbbsIwELzL9NdULQSq-jYbxwkr_IjsTaBCuXu1Fioqf_FkxvPwHQ72DoJFJPGFKcBghsXb6XA6jZ8wSLCogcTDgBwsVs7BCwyq8vZ7dzzqv6uexu-vw-cJBoOe_Nh1XQeDtcn6Qkl1LsN-vO83A1H3MyzmQD8jcdkNXPUbBj0sOIkv2AwYFsVHvsEgqKho5OERwuU4kxMl1tbHuVwGzhr9TDFSbHkp-CLaJi-1auSehsmrOwft3S8iTdOXRShwbWGpaBcf_Eri1dGdvbv0-aaR8pKGBg5MIU-axWvmhnGaF_VTTgmc1DL6tMBiDJmE06QFfPBOaZETx_YAQn190Qn1QaNWKTy32yVTbW2E3OWB5CCsr0el5KvOMescreau0MCLXjsurW1b44m2MWklofIEw_Q3yxOs8THLC6_V_Ufbtl8
```

---

## Recommendation

| Criteria | Option 3 (key:value) | Option 5 (JSON+deflate) |
|----------|---------------------|------------------------|
| **Human readable** | Yes | No |
| **Full config URL length** | 525 chars (667 URL-encoded) | 431 chars |
| **Minimal config URL length** | 21 chars | ~52 chars |
| **Custom values (colors, oklch, etc.)** | Needs escaping rules for `,` and `:` | Just works (JSON handles any value) |
| **Parser complexity** | Custom parser needed | `JSON.parse` (built-in) |
| **Future-proof for new value types** | Fragile with special chars | Any JSON-serializable value |
| **Dependency** | None | `pako` in browser (3kb gzipped) |
| **Debugging** | Can read URL directly | Need to decode to inspect |
