export function buildShareText(title: string, shareText: string, translationFirstLine: string): string {
  return `今日の会議で『${title}』に昇格しました。\n${shareText}\n翻訳：${translationFirstLine}\n#横文字ビンゴ`;
}

export async function shareResult(
  title: string,
  shareText: string,
  translation: string
): Promise<"shared" | "copied" | "failed"> {
  const firstLine = translation.split("。")[0] + "。";
  const text = buildShareText(title, shareText, firstLine);

  if (navigator.share) {
    try {
      await navigator.share({ text });
      return "shared";
    } catch {
      // user cancelled or share failed — fall through to clipboard
    }
  }

  try {
    await navigator.clipboard.writeText(text);
    return "copied";
  } catch {
    return "failed";
  }
}
