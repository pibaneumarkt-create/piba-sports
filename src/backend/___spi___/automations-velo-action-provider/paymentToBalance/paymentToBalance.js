import wixData from 'wix-data';
import { triggeredEmails } from 'wix-crm-backend';

/**
 * Autocomplete function declaration, do not delete
 * @param {import('./__schema__.js').Payload} options
 */
export const invoke = async ({ payload }) => {
  try {
    const contactId = payload.contactId;
    const amountString = payload.transactionCurrencyAmount.amount;
    const amount = parseFloat(amountString.replace(',', '.')) * 1.1; // 10% draufrechnen
    const name = `${payload.contact.name.first} ${payload.contact.name.last}`;
    const mail = payload.contact.email;

    if (!contactId || isNaN(amount)) {
      console.error("Fehlende Daten:", { contactId, amount });
      return {};
    }

    // Versuche bestehenden Eintrag zu finden
    const { items } = await wixData.query("userBalances")
      .eq("eMail", mail)
      .limit(1)
      .find();

    if (items.length > 0) { 
      const eintrag = items[0]; 
      eintrag.balance += amount;
      eintrag.lastUpdated = new Date();
      await wixData.update("userBalances", eintrag);
      await wixData.insert("transactions", {
        contactId: contactId,
        eMail: mail,
        balanceChange: amount,
        newBalance: eintrag.balance,
        timestamp: new Date()
      });
    } else {
      // Neuer Eintrag
      await wixData.insert("transactions", {
        contactId: contactId,
        eMail: mail,
        balanceChange: amount,
        newBalance: amount,
        timestamp: new Date()
      });
      await wixData.insert("userBalances", {
        contactId: contactId,
        eMail: mail,
        balance: amount,
        name: name,
        lastUpdated: new Date()
      });
    }
    
    console.log(`Guthaben aktualisiert für ${contactId}: +${amount.toFixed(2)} €`);
  } catch (error) {
    console.error("Fehler beim Verarbeiten der Zahlung:", error);

      const message = `
      Fehler bei der Gutschrift:

      📍 Fehler: 
      ${error.toString()}

      📦 Payload:
      ${JSON.stringify(payload, null, 2)}
      `;
    await triggeredEmails.emailContact("Un5Llsj","8299d85e-3da5-4929-bb93-74e53ed1b34c" ,{
      variables: {
        subject: "Fehler bei der Gutschrift",
        message: message
      }
    });
  }

  return {};
};