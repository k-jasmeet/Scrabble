/*
file: script.js
GUI Assignment: HW5 one line scrabble
Jasmeet Kaur, UMass Lowell Computer Science, jasmeet_kaur@student.uml.edu
Copyright (c) 2024 by Jasmeet. All rights reserved. May be freely copied or
excerpted for educational purposes with credit to the author.

*/

//data from pieces.json by Ramon Meza but slightly altered
const tileData = [
    { letter: 'A', value: 1, count: 9 },
    { letter: 'B', value: 3, count: 2 },
    { letter: 'C', value: 3, count: 2 },
    { letter: 'D', value: 2, count: 4 },
    { letter: 'E', value: 1, count: 12 },
    { letter: 'F', value: 4, count: 2 },
    { letter: 'G', value: 2, count: 3 },
    { letter: 'H', value: 4, count: 2 },
    { letter: 'I', value: 1, count: 9 },
    { letter: 'J', value: 8, count: 1 },
    { letter: 'K', value: 5, count: 1 },
    { letter: 'L', value: 1, count: 4 },
    { letter: 'M', value: 3, count: 2 },
    { letter: 'N', value: 1, count: 6 },
    { letter: 'O', value: 1, count: 8 },
    { letter: 'P', value: 3, count: 2 },
    { letter: 'Q', value: 10, count: 1 },
    { letter: 'R', value: 1, count: 6 },
    { letter: 'S', value: 1, count: 4 },
    { letter: 'T', value: 1, count: 6 },
    { letter: 'U', value: 1, count: 4 },
    { letter: 'V', value: 4, count: 2 },
    { letter: 'W', value: 4, count: 2 },
    { letter: 'X', value: 8, count: 1 },
    { letter: 'Y', value: 4, count: 2 },
    { letter: 'Z', value: 10, count: 1 },
    { letter: ' ', value: 0, count: 2 }
];

let score = 0;
let placedTiles = [];

$(function() 
{
    drawTiles(7);
    generateBoard();
    //drawing new tiles
    $("#draw-button").on("click", function() 
    {
        replenishTiles();
    });
    //restart game
    $("#restart-button").on("click", function() 
    {
        resetGame();
    });
});
// to draw a specficied number of tiles
function drawTiles(number) 
{
    const tileBasePath = 'scrabble_tiles/';
    const drawnTiles = [];
    const availableTiles = [];

    tileData.forEach(tile => 
        {
        for (let i = 0; i < tile.count; i++) 
        {
            availableTiles.push(tile.letter);
        }
    });
    // draw random tiles
    for (let i = 0; i < number; i++) 
    {
        const randomIndex = Math.floor(Math.random() * availableTiles.length);
        const randomLetter = availableTiles.splice(randomIndex, 1)[0];
        drawnTiles.push(randomLetter);
    }

    $("#tile-rack").empty();

    drawnTiles.forEach(letter => 
    {
        let imageFileName = `Scrabble_Tile_${letter === ' ' ? 'Blank' : letter}.jpg`;
        let tileElement = $(`<div class="tile">
                            <img src="${tileBasePath}${imageFileName}" alt="${letter}">
                             </div>`);
        $("#tile-rack").append(tileElement);
    });
    // make a tile draggable
    $(".tile").draggable(
    {
        revert: function(droppable) 
        {
            if (!droppable) 
            {
                return true;
            }
            return !droppable.hasClass("board-square");
        },
        helper: "clone",
        start: function() 
        {
            if ($(this).parent().hasClass("board-square")) 
            {
                return false;
            }
        }
    });
}
// make the scrabble board 
function generateBoard() 
{
    $("#scrabble-board").empty();
    $("#scrabble-board").append('<img src="Scrabble_Board_OneLine.png" alt="Scrabble Board">');

    for (let i = 0; i < 15; i++) 
    {
        let boardSquare = $('<div class="board-square"></div>');
        boardSquare.css(
        {
            top: 0,
            left: `${i * 64}px`
        });
        $("#scrabble-board").append(boardSquare);
    }

    initializeDroppable();
}
//  start dropping function 
function initializeDroppable() 
{
    $(".board-square").droppable(
    {
        accept: ".tile",
        drop: function(event, ui) 
        {
            const letter = ui.draggable.find('img').attr('alt');
            const squareIndex = $(this).index();
            if (validatePlacement(squareIndex)) 
            {
                $(this).addClass("ui-state-highlight").html(ui.draggable.html());
                $(this).data('letter', letter);
                ui.draggable.draggable('disable').css('opacity', 0.5);
                placedTiles.push(squareIndex);
                updateScore();
            } 
            else 
            {
                ui.draggable.draggable('option', 'revert', true);
            }
        }
    });
}
// tile placement
function validatePlacement(index) 
{
    if (placedTiles.length === 0) return true; 

    const adjacentIndices = placedTiles.map(i => [i - 1, i + 1]).flat();
    return adjacentIndices.includes(index);
}
// calculating score 
function updateScore() 
{
    let totalScore = 0;
    let baseScore = 1;
    // defining the scores on the board
    const bonusSquares = 
    [
        3, 13,
        7, 8  
    ];

    $(".board-square").each(function(index) 
    {
        const letter = $(this).data('letter');
        if (letter) 
        {
            const tile = tileData.find(t => t.letter === letter);
            if (tile) 
            {
                let score = tile.value;
                if (bonusSquares.includes(index)) 
                {
                    if (index === 3 || index === 13) 
                    {
                        baseScore *= 2;
                    } else if (index === 7 || index === 8) 
                    {
                        score *= 2;
                    }
                }
                totalScore += score;
            }
        }
    });

    totalScore *= baseScore;
    $("#score").text('Score: ' + totalScore);
}
//reset game function
function resetGame()
{
    $(".board-square").removeClass("ui-state-highlight").empty().removeData('letter');
    drawTiles(7);
    placedTiles = [];
    score = 0;
    $("#score").text('Score: ' + score);
}
// to get new tiles 
function replenishTiles() 
{
    const tilesOnBoard = $(".tile").length;
    drawTiles(7 - tilesOnBoard);
}
