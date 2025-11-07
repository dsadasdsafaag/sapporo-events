import ja from "../locales/ja.json";
import en from "../locales/en.json";
import zhhant from "../locales/zh-hant.json";
import ko from "../locales/ko.json";
import es from "../locales/es.json";

const dict = { ja, en, "zh-hant": zhhant, ko, es };

// t('key.path', lang)
export function t(key, lang = "ja") {
  const d = dict[lang] || dict.ja;
  const parts = key.split(".");
  let cur = d;
  for (const p of parts) {
    if (cur && typeof cur === "object" && p in cur) {
      cur = cur[p];
    } else {
      // フォールバック：キーをそのまま返す
      return key;
    }
  }
  return cur;
}

export function getCategoryLabel(cat, lang = "ja") {
  const map = {
    festival: t("category.festival", lang),
    indoor: t("category.indoor", lang),
    learn: t("category.learn", lang),
    other: t("category.other", lang),
  };
  return map[cat] || t("category.other", lang);
}

export const LOCALES = ["ja", "en", "zh-hant", "ko", "es"];
