$w.onReady(function () {
  // When the booking modal opens on mobile, the HTML component sends a postMessage.
  // We scroll to the component so the absolute-positioned modal (top:0) is visible.
  // If the modal still doesn't appear, check that '#html1' matches the actual
  // HTML component ID in the Wix editor (click the component → check the ID panel).
  $w('#html1').onMessage((event) => {
    if (event.data && event.data.type === 'piba-booking-modal-open') {
      $w('#html1').scrollTo();
    }
  });
});
