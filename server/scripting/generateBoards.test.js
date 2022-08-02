const { checkWord, scoreWords, cleanStr, sumPoints } = require('./generateBoards')

describe('Checking whether something is a word', () => {
    test("Returns false for an empty string", () => {
        expect(checkWord('')).toBe(false)
    })
    test("Doesn't return true if you pass it a nonsense word and no other args", () => {
        expect(checkWord('wordfjkdlfs nfdsfsfs')).toBe(false)
    })
    test("Returns false if you don't pass it required letter", () => {
        expect(checkWord('fdsjklfd', 'djsnd')).toBe(false)
    })
    test("Returns false if word does not have required letter", () => {
        expect(checkWord('apple', 'aple', 'j')).toBe(false)
    })
    test("Returns false if word has extra letters (not permitted)", () => {
        expect(checkWord('apples', 'aplea', 'a')).toBe(false)
    })
    test("Returns true if conditions met", () => {
        expect(checkWord('apples', 'aples', 's')).toBe(true)
    })
})

describe('Scoring words based on the rules of the game', () => {
    test("Returns empty object if no arguments passed", () => {
        expect(scoreWords()).toEqual({})
    })
    test("Returns empty object if just one argument passed", () => {
        expect(scoreWords(['word'])).toEqual({})
    })
    test("Scores correctly", () => {
        expect(scoreWords(['word', 'words', 'doorknob'], ['d','o','r','w','s','b','k','n'])).toEqual({ word: 1, words: 5, doorknob: 8})
    })
    test("Scores pangrams correctly", () => {
        expect(scoreWords(['words'], ['w','o','r','s','d'])).toEqual({words: 14})
    })
})

describe('Cleaning string works correctly', () => {
    test("Returns empty string if no arguments passed", () => {
        expect(cleanStr()).toBe('')
    })
    test("Doesn't modify string that already has only letters", () => {
        expect(cleanStr('fdjsklfds')).toBe('fdjsklfds')
    })
    test("Deletes words in a comma separated list that are too short", () => {
        expect(cleanStr('a,an,apple,no')).toBe('apple')
    })
    test("Deletes extraneous commas", () => {
        expect(cleanStr('apple,,schoolbus,,,typewriter,,')).toBe('apple,schoolbus,typewriter')
    })
    test("Deletes repeat words", () => {
        expect(cleanStr('apple,apple,apple')).toBe('apple')
    })
})

describe('Sums total points available for a gameboard', () => {
    test("Sums points", () => {
        expect(cleanStr()).toBe('')
    })
    test("Doesn't sum anything that's not a number", () => {
        expect(cleanStr('fdjsklfds')).toBe('fdjsklfds')
    })
})