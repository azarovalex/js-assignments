'use strict';

/**
 * Возвращает номер банковского счета, распаршеный из предоставленной строки.
 *
 * Вы работаете в банке, который недавно приобрел аппарат, помогающий в чтении писем и факсов, отправленных филиалами.
 * Аппарат сканирует бумажный документ и генерирует строку с банковсчким счетом, который выглядит следующим образом:
 *
 *    _  _     _  _  _  _  _
 *  | _| _||_||_ |_   ||_||_|
 *  ||_  _|  | _||_|  ||_| _|
 *
 * Каждая строка содержит номер счета, записанный с помощью '|' и '_'.
 * Каждый счет должен иметь 9 цифр в диапазоне от 0 до 9.
 *
 * Ваша задача -- написать функцию, которая будет принимать номер счета строкой, как описано выше, и парсить ее в обычные числа.
 *
 * @param {string} bankAccount
 * @return {number}
 *
 * Example of return :
 *
 *   '    _  _     _  _  _  _  _ \n'+
 *   '  | _| _||_||_ |_   ||_||_|\n'+     =>  123456789
 *   '  ||_  _|  | _||_|  ||_| _|\n'
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '| | _| _|| ||_ |_   ||_||_|\n'+     => 23056789
 *   '|_||_  _||_| _||_|  ||_| _|\n',
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '|_| _| _||_||_ |_ |_||_||_|\n'+     => 823856989
 *   '|_||_  _||_| _||_| _||_| _|\n',
 *
 */
function parseBankAccount(bankAccount) {
    let number = 0;
    let number_length = bankAccount.length / 3 - 1;
    let parts = [
        [' _ ', '   ', ' _ ', ' _ ', '   ', ' _ ', ' _ ', ' _ ', ' _ ', ' _ '],
        ['| |', '  |', ' _|', ' _|', '|_|', '|_ ', '|_ ', '  |', '|_|', '|_|'],
        ['|_|', '  |', '|_ ', ' _|', '  |', ' _|', '|_|', '  |', '|_|', ' _|']
    ];
    for (let i = 0; i < number_length; i += 3) {
        const digit = [
            bankAccount.slice(i, i + 3),
            bankAccount.slice(i + 28, i + 31),
            bankAccount.slice(i + 56, i + 59)
        ];

        for (let j = 0; j < parts[0].length; j++) {
            if (parts[0][j] == digit[0] && parts[1][j] == digit[1] && parts[2][j] == digit[2]) {
                number = number * 10 + j;
                break;
            }
        }
    }

    return number;
}


/**
 * Возвращает строку, в которой будут вставлены переносы строки в правильных местах. Каждая часть до переноса строки должна быть не больше, чем переданное в функцию число.
 * Строка может быть перенесена только по границе слов.
 *
 * @param {string} text
 * @param {number} columns
 * @return {Iterable.<string>}
 *
 * @example :
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 26 =>  'The String global object',
 *                                                                                                'is a constructor for',
 *                                                                                                'strings, or a sequence of',
 *                                                                                                'characters.'
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 12 =>  'The String',
 *                                                                                                'global',
 *                                                                                                'object is a',
 *                                                                                                'constructor',
 *                                                                                                'for strings,',
 *                                                                                                'or a',
 *                                                                                                'sequence of',
 *                                                                                                'characters.'
 */
function* wrapText(text, columns) {
	let words = text.split(' ');
	let line = new String();
	while (words.length > 0) {
		line = words.shift();
		while ((words.length > 0) && (line.length + words[0].length < columns)) {
			line += ' ' + words.shift();
		}
		yield line;
	}
}


/**
 * Возвращает ранг заданной покерной комбинации.
 * Ранги смотрите тут: https://en.wikipedia.org/wiki/List_of_poker_hands
 * https://ru.wikipedia.org/wiki/%D0%9F%D0%BE%D0%BA%D0%B5%D1%80
 *
 * @param {array} hand
 * @return {PokerRank} rank
 *
 * @example
 *   [ '4♥','5♥','6♥','7♥','8♥' ] => PokerRank.StraightFlush
 *   [ 'A♠','4♠','3♠','5♠','2♠' ] => PokerRank.StraightFlush
 *   [ '4♣','4♦','4♥','4♠','10♥' ] => PokerRank.FourOfKind
 *   [ '4♣','4♦','5♦','5♠','5♥' ] => PokerRank.FullHouse
 *   [ '4♣','5♣','6♣','7♣','Q♣' ] => PokerRank.Flush
 *   [ '2♠','3♥','4♥','5♥','6♥' ] => PokerRank.Straight
 *   [ '2♥','4♦','5♥','A♦','3♠' ] => PokerRank.Straight
 *   [ '2♥','2♠','2♦','7♥','A♥' ] => PokerRank.ThreeOfKind
 *   [ '2♥','4♦','4♥','A♦','A♠' ] => PokerRank.TwoPairs
 *   [ '3♥','4♥','10♥','3♦','A♠' ] => PokerRank.OnePair
 *   [ 'A♥','K♥','Q♥','2♦','3♠' ] =>  PokerRank.HighCard
 */
const PokerRank = {
    StraightFlush: 8,
    FourOfKind: 7,
    FullHouse: 6,
    Flush: 5,
    Straight: 4,
    ThreeOfKind: 3,
    TwoPairs: 2,
    OnePair: 1,
    HighCard: 0
}

function getPokerHandRank(hand) {
    const getShape = card => card[card.length - 1];
    const rankToNum = rank => isNaN(parseInt(rank)) ? (11 + ['J', 'Q', 'K', 'A'].indexOf(rank)) : parseInt(rank);
    const getRank = card => rankToNum(card.length == 3 ? card.slice(0, 2) : card[0]);
    const isSameShape = cards => cards.every(card => getShape(card) == getShape(cards[0]));

    function countRanks(cards) {
        const counters = Array.from({length: 13}, elem => 0);
        for (let card of cards) {
            counters[getRank(card) - 2]++;
        }
        return counters;
    }

    function isStraight (cards) {
        const sorted = cards.map(card => getRank(card)).sort((a, b) => a - b);
        if (sorted[0] == '2' && sorted[sorted.length - 1] == '14') {
            sorted.unshift(sorted.pop());
        }
        for (let i = 1; i < sorted.length; i++) {
            const diff = sorted[i] - sorted[i - 1];
            if (diff != 1 && diff != -12) {
                return false;
            }
        }

        return true;
    }

    const ranks = countRanks(hand);
    switch(true) {
        case (isStraight(hand) && isSameShape(hand)):
            return PokerRank.StraightFlush;
        case (ranks.indexOf(4) != -1):
            return PokerRank.FourOfKind;
        case (ranks.indexOf(3) != -1 && ranks.indexOf(2) != -1):
            return PokerRank.FullHouse;
        case isSameShape(hand):
            return PokerRank.Flush;
        case isStraight(hand):
            return PokerRank.Straight;
        case ranks.indexOf(3) != -1:
            return PokerRank.ThreeOfKind;
        case ranks.indexOf(2) != -1 && ranks.lastIndexOf(2) != ranks.indexOf(2):
            return PokerRank.TwoPairs;
        case ranks.indexOf(2) != -1:
            return PokerRank.OnePair;
        default:
            return PokerRank.HighCard;
    }
}


/**
 * Возвращает набор прямоугольников из заданной фигуры.
 * Фигура -- это многострочный набор ASCII символов из '-', '+', '|' и пробелов.
 * Ваша задача -- разбить фигуру на прямоугольники, из которых она составлена.
 *
 * К СВЕДЕНИЮ: Порядок прямоугольников не имеет значения.
 *
 * @param {string} figure
 * @return {Iterable.<string>} decomposition to basic parts
 * 
 * @example
 *
 *    '+------------+\n'+
 *    '|            |\n'+
 *    '|            |\n'+              '+------------+\n'+
 *    '|            |\n'+              '|            |\n'+         '+------+\n'+          '+-----+\n'+
 *    '+------+-----+\n'+       =>     '|            |\n'+     ,   '|      |\n'+     ,    '|     |\n'+
 *    '|      |     |\n'+              '|            |\n'+         '|      |\n'+          '|     |\n'+
 *    '|      |     |\n'               '+------------+\n'          '+------+\n'           '+-----+\n'
 *    '+------+-----+\n'
 *
 *
 *
 *    '   +-----+     \n'+
 *    '   |     |     \n'+                                    '+-------------+\n'+
 *    '+--+-----+----+\n'+              '+-----+\n'+          '|             |\n'+
 *    '|             |\n'+      =>      '|     |\n'+     ,    '|             |\n'+
 *    '|             |\n'+              '+-----+\n'           '+-------------+\n'
 *    '+-------------+\n'
 */
function* getFigureRectangles(figure) {
    let figureArr = figure.split('\n');
	let rectangle = new Array();
	for (let i = 0; i < figureArr.length; i++)
		for (let j = 0; j < figureArr[i].length; j++)
			if (figureArr[i][j] == '+') {
				rectangle = GetRectangle(figureArr, i, j);
				if (rectangle != null)
					yield DrawRectangle(rectangle[1], rectangle[0]);
			}
}

function GetRectangle(figure, row, column) {
	for (let i = row + 1; i < figure.length; i++) {
		if (figure[i][column] == '+') {
			for (let j = column + 1; j < figure[row].length; j++) {
				if (figure[i][j] == "+") {
					if (figure[row][j] == "+") {
						let flag = true;
						for (let k = row + 1; k < i; k++)
							if (figure[k][j] != '|') {
								flag = false;
								break;
							}
						if (flag) return [i - row + 1, j - column + 1];
					}
				} else if (figure[i][j] != '-') break;
			}
		} else if (figure[i][column] != '|') break;
	}
	return null;
}
	
function DrawRectangle(width, height) {
    return '+' + '-'.repeat(width - 2) + '+\n' + ('|' + ' '.repeat(width - 2) + 
            '|\n').repeat(height - 2) + '+' + '-'.repeat(width - 2) + '+\n';
}


module.exports = {
    parseBankAccount : parseBankAccount,
    wrapText: wrapText,
    PokerRank: PokerRank,
    getPokerHandRank: getPokerHandRank,
    getFigureRectangles: getFigureRectangles
};
