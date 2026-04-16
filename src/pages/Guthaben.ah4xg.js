import wixUsers from 'wix-users';
import wixData from 'wix-data';
import wixLocation from 'wix-location';

$w.onReady(() => {
  wixUsers.onLogin(() => {
    // Seite neu aufrufen (quasi Reload)
    wixLocation.to(wixLocation.url);
  });
});

$w.onReady(async function () {
  const user = wixUsers.currentUser;

  // Prüfen ob User eingeloggt ist
  if (!user.loggedIn) {
    $w('#showBalance').text = "Bitte melde dich an, um dein Guthaben zu sehen.";
    $w("#warnunganmelden").show();
    $w("#textFeedback").hide();
    $w("#textFeedback2").hide();
    return;
  }

  // ✳️ Hole die E-Mail des eingeloggten Nutzers
  const mail = await user.getEmail();

  // Datenbank-Abfrage: Suche Guthaben für die E-Mail
  const result = await wixData.query("userBalances")
    .eq("eMail", mail)
    .find();

  if (result.items.length > 0) {
    const balance = result.items[0].balance;
    $w('#showBalance').text = `Dein aktuelles Guthaben beträgt: ${balance.toFixed(2)} €`;
  } else {
    $w('#showBalance').text = "Noch kein Guthaben vorhanden.";
  }

  $w("#inputButton").onClick(async () => {
    $w("#textFeedback").text = "";

    const betragText = $w("#userInput").value;
    const betrag = parseFloat(betragText.replace(",", "."));

    if (isNaN(betrag) || betrag <= 0) {
      $w("#textFeedback").text = "Bitte gib einen gültigen Betrag ein.";
      return;
    }
    const result = await wixData.query("userBalances")
      .eq("eMail", mail)
      .find();

    if (result.items.length === 0) {
      $w("#textFeedback").text = "Kein Guthabenkonto gefunden.";
      $w("#textFeedback").style.color = "#dc3545";
      $w("#textFeedback").show();
      return;
    }

    const eintrag = result.items[0];
    if (eintrag.balance < betrag) {
      $w("#textFeedback").text = `Nicht genug Guthaben. Du hast nur ${eintrag.balance.toFixed(2)} €`;
      $w("#textFeedback").style.color = "#dc3545";
      $w("#textFeedback").show();
      return;
    }

    // Guthaben reduzieren
    eintrag.balance -= betrag;
    eintrag.lastUpdated = new Date();

    await wixData.update("userBalances", eintrag);

    $w("#textFeedback").text = `Erfolgreich ${betrag.toFixed(2)} € abgezogen!`;
    $w("#textFeedback").style.color = "#28a745";
    $w("#textFeedback").show();
    $w("#textFeedback2").text = `Dein neues Guthaben beträgt: ${eintrag.balance.toFixed(2)} €`;
    $w("#textFeedback2").show();
    $w('#showBalance').text = `Dein aktuelles Guthaben beträgt: ${eintrag.balance.toFixed(2)} €`;
    $w("#userInput").value = "";

    await wixData.insert("transactions", {
        eMail: mail,
        balanceChange: -betrag,
        newBalance: eintrag.balance,
        timestamp: new Date()
      });
  });
});
