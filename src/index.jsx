import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './index.css';


class App extends Component {
    deck;
    constructor(props) {
        super(props);
        this.deck = new Deck();
        this.deck.shuffle();
    }

    render() {
        return (
            <div>
                <Hand hand={[this.deck.deal(), this.deck.deal()]} onRegCard={() => this.deck.deal()} turnEnd={(points) => {return points > 15 ? 1 : 0;}} />
            </div> 
        );
    }
}


class Deck extends React.Component {
    // Holds an Array of Cards
    deck;
    constructor(props) {
        super(props);
        let deck = new Array();
        for (let suit = 0; suit < 4; suit++) {
            for (let number = 0; number < 13; number++) {
                deck.push(<Card suit={suit} number={number} />);
            }
        }
       this.deck = deck;
    }

    displayCards() {
        return (
            <ol> {
                this.deck.map( (card, move) => {
                    return (
                        <li key={move}>
                            <Card suit={card.props.suit} number={card.props.number} />
                        </li>
                );})}
            </ol>
        );
    }
    
    deal() {
        return this.deck.shift();
    }

    // Fisher Yates Shuffle
    shuffle() {
        const length = this.deck.length;
        for (let i = length; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * i);
           const currentIndex = i - 1;
           (function(array, i, j) {
                const temp = array[i];
                array[i] = array[j];
                array[j] = temp;
           })(this.deck, currentIndex, randomIndex);
        }
     }

    render() {
        return (
            this.displayCards()
        );
    }
}

function Card(props) {
    return (
        <div className='card'>
            Suit {props.suit} with number {props.number}
            <img className='card-img'src={`./images/${props.suit}.${props.number + 1}.jpg`} alt={`./images/${props.suit}.${props.number + 1}.jpg`}></img>
        </div>
    );
}

class Hand extends React.Component {
    points = 0;
    constructor(props) {
        super(props);
        this.state = {
            hand: this.props.hand,
            hasWon: -1,
        };
        this.points = this.calcPoints();
    }
    
    render() {
        return (
            <table>
                <caption>
                    <strong>
                        {(function(state) {
                            if (state.hasWon === -1) {
                                return 'Your Cards';
                            }
                            return state.hasWon === 1 ? 'You win' : 'You lose';
                        })(this.state)} 
                    </strong>
                </caption>
                <tr>
                    {this.state.hand.map( (card) => {
                        return <td>{card}</td>;
                    })}
                </tr>
                <tr>
                    <td><button onClick={() => {this.setState( { hand: this.state.hand.length < 5 ? this.state.hand.concat([this.props.onRegCard()]) : this.state.hand}); this.calcPoints()}}>Hit me!</button></td>
                    <td><button onClick={() => {this.setState( { hasWon: this.props.turnEnd(this.calcPoints())} )}}>Hold</button></td>
                </tr>
            </table>
            
        );
    }

    calcPoints() {
        let points = 0;
        let aces = 0;
        let hand = this.state.hand;
        for (let card in hand) {
            let number = hand[card].props.number;
            if (number > 9) {
                number = 10;
            } else if (number === 0) {
                aces++;
            } else {
                number++;
            }
            points += number;
        }
        console.log(`Points: ${points} and Aces: ${aces}`);
        if (aces === 0) {
            return points;
        }
        if (points > 21) {
            return points;
        }
        if (points + 1 * aces > 21) {
            return points + 1 * aces;
        }
        return points + 11 + (1 * (aces - 1));
    } 

    displayPoints() {
        let points = 0;
        let hand = this.props.hand.array.concat([]);
        hand.forEach(card => {
            let point = 0;
            point = point === 0 ? point + 1 : point;
            if (card.number > 9) {
                point = 10;
            }
            points += point;
        });
        return points;
    }
}
{/* <div>
                {this.props.hand}
                <div>
                    <button onClick={this.props.reqCard}>Hit me!</button>
                    <button onClick={this.props.turnEnd}>Hold</button>
                    
                </div>
            </div>  */}


/*
class Card extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            suit: props.suit,
            number: props.number
        };
    }
    render() {
        return <div>{this.state.suit} with number {this.state.number}</div>;
    }
    getNumber() {
        return this.state.number;
    }
}
*/












// ========================================

ReactDOM.render(
  <App />,
  document.getElementById('root')
);