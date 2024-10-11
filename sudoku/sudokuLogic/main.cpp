#include <iostream>
#include <emscripten/emscripten.h>

extern "C" {
    bool isSafe(int grid[9][9], int row, int col, int num);
    bool solveSudoku(int grid[9][9]);
    void EMSCRIPTEN_KEEPALIVE solveSudokuWrapper(int grid[81]);
}

bool isSafe(int grid[9][9], int row, int col, int num) {
    for (int x = 0; x < 9; x++)
        if (grid[row][x] == num || grid[x][col] == num)
            return false;

    int startRow = row - row % 3, startCol = col - col % 3;
    for (int i = 0; i < 3; i++)
        for (int j = 0; j < 3; j++)
            if (grid[i + startRow][j + startCol] == num)
                return false;

    return true;
}

bool solveSudoku(int grid[9][9]) {
    int row, col;
    bool emptySpot = false;
    for (row = 0; row < 9; row++) {
        for (col = 0; col < 9; col++) {
            if (grid[row][col] == 0) {
                emptySpot = true;
                break;
            }
        }
        if (emptySpot) break;
    }
    if (!emptySpot)
        return true;

    for (int num = 1; num <= 9; num++) {
        if (isSafe(grid, row, col, num)) {
            grid[row][col] = num;
            if (solveSudoku(grid))
                return true;
            grid[row][col] = 0;
        }
    }
    return false;
}

void EMSCRIPTEN_KEEPALIVE solveSudokuWrapper(int grid[81]) {
    int sudoku[9][9];
    for (int i = 0; i < 81; i++) {
        sudoku[i / 9][i % 9] = grid[i];
    }

    solveSudoku(sudoku);

    for (int i = 0; i < 81; i++) {
        grid[i] = sudoku[i / 9][i % 9];
    }
}
