import wixData from 'wix-data';

export const invoke = async ({ payload }) => {
  try {
    const { contact } = payload;

    const email = contact?.email;
    const contactId = contact?.contactId;
    const name = `${contact?.name?.first ?? ""} ${contact?.name?.last ?? ""}`.trim();

    if (!email || !contactId) {
      throw new Error("Kontaktinformationen unvollständig.");
    }

    // Prüfen, ob schon ein Eintrag existiert (zur Sicherheit)
    const existing = await wixData.query("userBalances")
      .eq("contactId", contactId)
      .find();

    if (existing.items.length > 0) {
      console.log("Eintrag für diesen Nutzer existiert bereits.");
      return;
    }

    // Neuen Guthaben-Eintrag erstellen
    const newBalanceEntry = {
      contactId,
      eMail: email,
      name,
      balance: 0,
      lastUpdated: new Date()
    };

    await wixData.insert("userBalances", newBalanceEntry);
    console.log("Startguthaben erfolgreich angelegt für:", email);

  } catch (error) {
    console.error("Fehler beim Anlegen des Startguthabens:", error);
    // Optional: Triggered Mail oder Logging ergänzen
  }
};
