const SHARE_MINUTES_MAX_LENGTH = 60;

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}…`;
}

export function buildShareText(
  title: string,
  shareText: string,
  meetingMinutes: string,
  translation: string
): string {
  const minutesForShare = truncate(meetingMinutes, SHARE_MINUTES_MAX_LENGTH);
  return (
    `Buzzword Questで『${title}』に昇格しました。\n${shareText}\n\n` +
    `本日の議事録：\n${minutesForShare}\n\n` +
    `翻訳：\n${translation}\n\n` +
    `#BuzzwordQuest\n#意識だけで上まで行け\n#横文字ビンゴ`
  );
}

export async function shareResult(
  title: string,
  shareText: string,
  meetingMinutes: string,
  translation: string
): Promise<"shared" | "copied" | "failed"> {
  const text = buildShareText(title, shareText, meetingMinutes, translation);

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
