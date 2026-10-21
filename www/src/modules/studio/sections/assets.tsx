"use client"

/* Assets — the brand the preview wears: a built-in product's logo, or
   None for the blocks' placeholder marks. Uploads are listed, not live. */

import { AssetImage } from "../assets/brand"
import { BRANDS } from "../assets/brands"
import type { BrandName } from "../axes/assets"
import { BRAND_OPTIONS } from "../axes/assets.meta"
import { DIAL_LABEL, DIAL_ROW, DialGlyph, DialSelect } from "../dial"
import type { RowMap } from "../row-host"

const OPTIONS = BRAND_OPTIONS.map((option) => ({
  ...option,
  glyph: option.value !== "none" && (
    <DialGlyph>
      <AssetImage asset={BRANDS[option.value as BrandName].logo} />
    </DialGlyph>
  ),
}))

const AssetsRow = () => (
  <DialSelect axis="brandAssets" label="Assets" options={OPTIONS}>
    <div aria-disabled className={DIAL_ROW}>
      <span className={DIAL_LABEL}>Upload logo & wordmark</span>
      <span className="text-[13px] font-medium text-fg/50">Coming soon</span>
    </div>
  </DialSelect>
)

export const ROWS: RowMap = {
  brandAssets: AssetsRow,
}
