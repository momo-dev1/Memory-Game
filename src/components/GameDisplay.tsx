import cards from "../libs/cards";
import CardGrid from "./CardGrid";
import PlayerInfo from "./PlayerInfo";
import { useEffect, useState } from "react";
import styled from "styled-components";
import EndInfo from "./EndInfo";

export interface CardObj {
  id: number;
  name: string;
  image: string;
  flipped: boolean;
  found: boolean;
}

const GameDisplay = (): JSX.Element => {
  let pairsToFind = 8;
  const [randomCards, setRandomCards] = useState<CardObj[] | null>(null);
  const [score, setScore] = useState<number>(0);
  const [turns, setTurns] = useState<number>(0);
  const [selectedCards, setSelectedCards] = useState<CardObj[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [gameFinished, setGameFinished] = useState<boolean>(false);

  // audio files
  const cardClickSFX = new Audio("/audio/card-click.wav");
  const cardFoundSFX = new Audio("/audio/card-found.wav");
  const gameWinSFX = new Audio("/audio/game-win.wav");
  const buttonClickSFX = new Audio("/audio/button-click.wav");

  // randomly selects a card from the cardsArr, adds it to the randomOrderArr and then removes it from the original array, so that we end up with an array of cards in a random order
  const randomiseCards = () => {
    let randomOrderArr = [];
    let cardsArr = cards;
    for (let i = cardsArr.length; i > 0; i--) {
      let randomIndex = Math.floor(Math.random() * i);
      randomOrderArr.push(cardsArr[randomIndex]);
      cardsArr = [
        ...cardsArr.slice(0, randomIndex),
        ...cardsArr.slice(randomIndex + 1),
      ];
    }
    return randomOrderArr;
  };

  useEffect(() => {
    if (score === pairsToFind) {
      setTimeout(() => {
        gameWinSFX.play();
        setGameFinished(true);
        setRandomCards(null);
      }, 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCards]);

  const setFlippedStatus = (cardIndex: number) => {
    if (randomCards) {
      if (
        randomCards[cardIndex].flipped === true ||
        randomCards[cardIndex].found === true
      ) {
        return;
      }

      const newState = randomCards.map((card, index) => {
        if (index === cardIndex) {
          return { ...card, flipped: true };
        }
        return card;
      });
      setRandomCards(newState);
    }
  };
  const updateSelectedCards = (card: CardObj) => { };
  
  const handleClick = (cardIndex: number, card: CardObj) => {
    if (isPlaying) {
      if (selectedCards.length < 2) {
        cardClickSFX.play();
        setFlippedStatus(cardIndex);
        updateSelectedCards(card);
      } else {
      }
    }
  };

  

  const resetGame = () => {
    setScore(0);
    setTurns(0);
    setSelectedCards([]);
    setGameFinished(false);
    setIsPlaying(false);
    startGame();
  };

  const startGame = () => {
    const newState = randomiseCards();
    setRandomCards(newState);
    setIsPlaying(true);
    buttonClickSFX.play();
  };

  return (
    <GameContainer>
      <audio id="cardClick" src="card-click.wav"></audio>
      {gameFinished ? (
        <EndInfo resetGame={resetGame} />
      ) : isPlaying ? (
        <CardGrid randomCards={randomCards} handleClick={handleClick} />
      ) : (
        <StartContainer>
          <IntroText>Find all of the matching pairs of cards!</IntroText>
          <StartButton onClick={startGame}>Start</StartButton>
        </StartContainer>
      )}
      <PlayerInfo turns={turns} score={score} />
    </GameContainer>
  );
};

const GameContainer = styled.main`
  width: min(80%, 800px);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 75vh;
  box-shadow: var(--oxford-blue-light) 0px 1px 6px;
  border-radius: 0.5rem;
  padding: 2rem 0 0 0;
  background-color: var(--mauvelous-light);
`;

const StartContainer = styled.div`
  text-align: center;
  margin-top: auto;
  font-size: 2rem;
`;

const StartButton = styled.button`
  width: 40%;
  border-radius: 1rem;
  border: none;
  font-size: 2rem;
  padding-block: 0.5rem;
  background-color: var(--violet-blue-crayola);
  color: var(--off-white);
  letter-spacing: 0.2rem;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: var(--oxford-blue-light) 0px 1px 3px;
`;

const IntroText = styled.p`
  font-size: 2rem;
`;

export default GameDisplay;
