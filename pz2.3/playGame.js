import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
function getRandomCard() {
  const cards = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
    "A",
  ];
  const randomIndex = Math.floor(Math.random() * cards.length);
  return cards[randomIndex];
}
function getCardValue(card) {
  if (card === "A") {
    return 11;
  } else if (["K", "Q", "J"].includes(card)) {
    return 10;
  } else {
    return parseInt(card);
  }
}
function calculateHandValue(hand) {
  let value = 0;
  let aceCount = 0;

  for (let card of hand) {
    const cardValue = getCardValue(card);
    value += cardValue;

    if (card === "A") {
      aceCount++;
    }
  }

  while (value > 21 && aceCount > 0) {
    value -= 10;
    aceCount--;
  }

  return value;
}
export function playGame() {
  const playerHand = [];
  const dealerHand = [];

  // Deal initial cards
  playerHand.push(getRandomCard());
  dealerHand.push(getRandomCard());
  playerHand.push(getRandomCard());
  dealerHand.push(getRandomCard());

  console.log("=== Гра Blackjack ===");
  console.log("Ваші карти:", playerHand.join(" "));
  console.log("Карта дилера:", dealerHand[0]);

  const playerTurn = () => {
    rl.question("Бажаєте взяти карту? (так або ні): ", (answer) => {
      if (answer.toLowerCase() === "так") {
        const newCard = getRandomCard();
        playerHand.push(newCard);
        console.log("Ваші карти:", playerHand.join(" "));

        const playerValue = calculateHandValue(playerHand);
        if (playerValue > 21) {
          console.log("Ви перебрали! Ви програли.");
          playAgain();
        } else {
          playerTurn();
        }
      } else {
        dealerTurn();
      }
    });
  };

  const dealerTurn = () => {
    const dealerValue = calculateHandValue(dealerHand);

    console.log("Карти дилера:", dealerHand.join(" "));

    while (dealerValue < 17) {
      const newCard = getRandomCard();
      dealerHand.push(newCard);
      dealerValue = calculateHandValue(dealerHand);
      console.log("Карти дилера:", dealerHand.join(" "));
    }

    if (dealerValue > 21) {
      console.log("Дилер перебрав! Ви перемогли.");
    } else {
      const playerValue = calculateHandValue(playerHand);

      if (playerValue > dealerValue) {
        console.log("Ви перемогли!");
      } else if (playerValue < dealerValue) {
        console.log("Дилер переміг.");
      } else {
        console.log("Нічия.");
      }
    }

    playAgain();
  };

  const playAgain = () => {
    rl.question("Бажаєте грати ще раз? (так або ні): ", (answer) => {
      if (answer.toLowerCase() === "так") {
        playGame();
      } else {
        console.log("Дякуємо за гру! До побачення!");
        rl.close();
      }
    });
  };

  playerTurn();
}
