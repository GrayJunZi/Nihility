socket.on("availableOffers", (offers) => {
  console.log(offers);
});

socket.on("newOfferAwaiting", (offers) => {
  createOfferEls(offers);
});

socket.on("answerResponse", (offer) => {
  addAnswer(offer);
});

socket.on("receivedIceCandidateFromServer", (iceCandidate) => {
  addNewIceCandidate(iceCandidate);
});

function createOfferEls(offers) {
  const answerEl = document.querySelector("#answer");
  offers.forEach((offer) => {
    const newOfferEl = document.createElement("div");
    newOfferEl.innerHTML = `<button class="btn btn-success col-2">Answer ${offer.offererUserName}</button>`;
    newOfferEl.addEventListener("click", () => answerOffer(offer));
    answerEl.appendChild(newOfferEl);
  });
}