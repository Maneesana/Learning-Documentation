---
title: 'Removing Even Integers from an Array'
tags: [array]
---

:::info[Solved On]
3rd August, 2025
:::

## Introduction

Welcome to my coding blog! This post focuses on a fundamental array manipulation task: filtering. I'll show you how to create a new array containing only specific elements from an original array, with a key focus on proper memory management.

## The Problem

My task is to write a function that takes an array of integers and its size as input. The function should remove all even integers from the array and return a new array containing only the odd numbers. The size of the original array should be updated to reflect the size of the new array.

**Time Complexity**: O(n)  
**Space Complexity**: O(k) where k is the number of odd elements

## My Approach

My solution uses an efficient two-pass approach. This method ensures that I only allocate the necessary amount of memory, making the solution optimal in terms of space.

### Algorithm Breakdown:

1.  **Count Odd Numbers**: First, I iterate through the original array to count the number of odd integers.
2.  **Allocate Memory**: I then create a new array with a size equal to the count of odd numbers.
3.  **Copy Odd Numbers**: In my second pass, I copy all the odd elements from the original array into the new array.
4.  **Return New Array**: Finally, I return the new array containing only odd numbers and update the size variable.

This approach is efficient as it only allocates the exact amount of memory needed for the result, avoiding waste of space.

## Solution Code

```cpp
#include <iostream>
#include <string>
#include <cmath>

namespace ArrayChallenge{

    int* removeEven(int* arr, int &size) {
        int m = 0;
        //Find number of odd elements in arr
        for (int i = 0; i < size; i++) {
            if (arr[i] % 2 != 0) {
                ++m;
            }
        }
        //Create odds array with the size equal to the number of odd elements in arr
        int* odds = new int[m];
        int n = 0;
        for (int i = 0; i < size; i++) {
            if (arr[i] % 2 != 0) { // Check if the item in the array is not even
                odds[n++] = arr[i]; // If it isn't even, append it to the odds array
            }
        }
        size = m;
        return odds;
    }

    void runChallenge1() {
        int inputs[][10] = {{3, 2, 41, 3, 34},
        {-5, -4, -3, -2, -1},
        {-1, 2, 3, -4, -10},
        {1, 2, 3, 7},
        {2, 4, 6, 8, 10}};

        int sizes[] = {4, 5, 5, 1, 5};
        int* result;
        std::cout<<"START RUNING ARRAY CHALLENGE 1"<<std::endl;
        int s = (int)sizeof(inputs)/sizeof(inputs[0]);
        for (int i = 0; i < s; ++i) {
            std::cout << i + 1 << ".\\tArray: [";
            for (int j = 0; j < sizes[i]; ++j) {
                if(j==sizes[i]-1)
                std::cout << inputs[i][j];
                else
                std::cout << inputs[i][j] << ", ";
            }
            std::cout <<"]"<< std::endl;

            result = removeEven(inputs[i], sizes[i]);

            std::cout << "\\n\\tResult: [";
            for (int j = 0; j < sizes[i]; ++j) {
                if(j==sizes[i]-1)
                std::cout << result[j];
                else
                std::cout << result[j] << ", ";
            }
            std::cout <<"]"<< std::endl;


            delete[] result;

            std::cout << std::string(100, '-') << std::endl;
        }

        std::cout<<"END: ARRAY CHALLENGE 1"<<std::endl;
    }
}
```
