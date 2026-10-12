# Vasa Calendar 2026–27

The academic calendar of VASA International School of Stockholm for the 2026–27 school year, as a web page and as a calendar you can add to your phone or computer. It covers every year group, EY, PYP and MYP alike.

- **Web page:** https://jeffery812.github.io/Skolkompis/Calendar/
- **Calendar feed (.ics):** https://jeffery812.github.io/Skolkompis/Calendar/Vasa-2026-27.ics

## Source

The calendar is transcribed from the school's official calendar sheet:

https://docs.google.com/spreadsheets/d/15zwEwGGxn6g7EgCy1T33fFVuDxQXG5DIZ1gItNCYgDA/edit?gid=0#gid=0

The school can change dates during the year. If a date matters, check it against the sheet. The screenshots this transcription was made from (`vasa-26:27-1.png` to `vasa-26:27-3.png`) are kept in this folder for reference.

## What's in the calendar

Every entry on the sheet becomes a calendar event. When a cell repeats over consecutive weekdays (for example a week of "ASC"), those days become a single event.

- **Titles start with "Vasa:"** so school events stand out among your own.
- **Closures say what's closed.** A pink "ASC" day appears as *School closed – ASC open*, and a yellow day as *School & ASC closed – …*.
- **Each event's notes** give its colour category from the sheet (for example *Nationella Prov / National tests*), the original text and the week number.
- **Packed-lunch days** (the light-blue theme days) remind you at 19:00 the evening before.

Colour codes on the sheet and the web page:

| Colour | Meaning |
| --- | --- |
| Pink | School is closed / ASC open |
| Yellow | School and ASC are closed |
| Light blue | Theme day / Packed lunch day |
| Blue | Theme day / School lunch |
| Green | PRAO |
| Orange | Nationella Prov / National tests |

## Adding it to your phone or computer

**Subscribe rather than import.** A subscription appears as its own calendar called **"Vasa 2026-27"**. You can show or hide it with one tap, remove it in one go, and it picks up changes automatically when the calendar is updated. Importing the .ics file instead copies the events into one of your existing calendars, where they don't update and are harder to remove.

### iPhone / iPad

1. Open the [web page](https://jeffery812.github.io/Skolkompis/Calendar/) in Safari.
2. Tap **📲 Subscribe on iPhone / Mac**, then **Subscribe**.
3. Optional: to get the packed-lunch reminders, turn off **Remove Alerts** before tapping **Add**.

Alternatively, go to **Settings → Apps → Calendar → Calendar Accounts → Add Account → Other → Add Subscribed Calendar** and paste the feed link above. On older iOS versions this is under **Settings → Calendar → Accounts**.

To show or hide the calendar, open the Calendar app, tap **Calendars** at the bottom, and tick or untick **Vasa 2026-27**.

### Mac (Calendar app)

1. Open the web page and click **📲 Subscribe on iPhone / Mac**.

   Or, in Calendar, choose **File → New Calendar Subscription…** and paste the feed link above.
2. Pick an auto-refresh interval, for example every day. Untick **Remove Alerts** if you want the packed-lunch reminders.
3. Choose **iCloud** as the location if you also want it on your iPhone.

### Android / Google Calendar

Google Calendar can only add a subscription on a computer. It then syncs to your phone.

1. On the web page, click **🔗 Copy link for Google Calendar**, or copy the feed link above.
2. Open [calendar.google.com](https://calendar.google.com) on a computer.
3. Next to **Other calendars**, click **+ → From URL**, paste the link and click **Add calendar**.
4. On your Android phone, open Google Calendar → **Settings**, tap the new calendar and make sure **Sync** is on.

Google refreshes subscribed calendars on its own schedule, so changes can take several hours, sometimes up to a day, to appear.

### Outlook

- **Outlook on the web / new Outlook:** **Calendar → Add calendar → Subscribe from web**, then paste the feed link.
- **Classic Outlook for Windows:** **Home → Add Calendar → From Internet…**, then paste the feed link.

### Just a one-off copy

Download [Vasa-2026-27.ics](Vasa-2026-27.ics) and open it to import the events into an existing calendar. These events won't update when the calendar changes.

## Updating the calendar (for maintainers)

The events live in one file, `calendar-data.js`, which both the web page and the .ics are built from.

1. Edit `calendar-data.js`. Each week is one row: `[week, month, Monday's date, [Mon..Fri], all-week]`.
2. Regenerate the calendar file:

   ```sh
   node Calendar/make-ics.js
   ```
3. Commit and push both files. Subscribed calendars pick up the change at their next refresh, typically within 12 hours on Apple devices.

| File | Purpose |
| --- | --- |
| `index.html` | The web page |
| `calendar-data.js` | All events, the single source for the page and the .ics |
| `make-ics.js` | Generates `Vasa-2026-27.ics` from `calendar-data.js` |
| `Vasa-2026-27.ics` | The calendar feed for phones and computers |
| `vasa-26:27-*.png` | Screenshots of the source sheet |
