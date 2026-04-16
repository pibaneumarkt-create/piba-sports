// API-Referenz: https://www.wix.com/velo/reference/api-overview/introduction

$w.onReady(function () {

	// Eigenen Javascript-Code unter Verwendung der Velo-Framework-API hier schreiben

	// Print Hallo Welt:
	// console.log("Hallo Welt!");

	// Funktionen auf Seitenelementen aufrufen z. B..:
	// $w("#button1").label = "Klicke mich!";

	// Auf „Ausführen“ klicken oder die Vorschau deiner Website ansehen, um deinen Code auszuführen

});
import wixUsers from 'wix-users';
import wixData from 'wix-data';

$w.onReady(function () {
  if (wixUsers.currentUser.loggedIn) {
    const userId = wixUsers.currentUser.id;

    // Check if user already has a credit entry
    wixData.query("UserCredits")
      .eq("userId", userId)
      .find()
      .then((results) => {
        if (results.items.length === 0) {
          // Create new credit entry
          wixData.insert("UserCredits", {
            userId: userId,
            balance: 0
          });
        }
      });
  }
});
