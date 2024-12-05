document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');
  cards.forEach((card) => {
      card.addEventListener('click', () => {
          cards.forEach((b) => b.classList.remove('selected'));
          card.classList.add('selected');
      });
  });

  const initialVisitCard = document.getElementById('initial-visit');
  if (initialVisitCard) {
      initialVisitCard.addEventListener('click', () => {
          window.location.href = '/kiosk/pages/privacy-consent/privacy-consent.php';
      });
  }

  const followUpVisitCard = document.getElementById('follow-up-visit');
  if (followUpVisitCard) {
      followUpVisitCard.addEventListener('click', () => {
          window.location.href = '/kiosk/pages/exist-information/exist-information.php';
      });
  }
});
