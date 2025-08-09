---
title: 'Rotating an Array to the Right'
tags: [array]
---

:::info[Solved On]
3rd August, 2025
:::

## Introduction

Welcome to another coding challenge! This time, we're diving into array rotation, a common operation in computer science and a great way to practice your array manipulation skills. We'll be shifting the elements of an array to the right by a given number of positions.

## The Problem

Your task is to write a function that takes an array of integers, its size, and a number `k` as input. The function should rotate the array's elements to the right by `k` positions.

**Time Complexity**: O(n), as we iterate through the array once.  
**Space Complexity**: O(n), because we are creating a new array to store the rotated result.

## Our Approach

Our solution uses a straightforward and intuitive mapping approach. We'll create a new array and place each element from the original array into its new, rotated position. The key to this approach is using the modulo operator to handle the "wraparound" effect of rotation.

### Algorithm Breakdown:

1.  **Create a Result Array**: First, we allocate a new array of the same size as the input array.
2.  **Calculate the New Position**: For each element at an index `i` in the original array, its new position in the rotated array will be `(i + k) % size`.
3.  **Handle Wraparound with Modulo**: The modulo operator (`%`) is the star of this algorithm. It ensures that if `i + k` goes beyond the array's bounds, the element correctly "wraps around" to the beginning of the array.
4.  **Place Elements**: We then copy each element from the original array to its newly calculated position in the result array.

### Example:

Let's say we have the array `[1, 2, 3, 4, 5]` and we want to rotate it to the right by `k = 2`.

- The element at index 0 (value 1) moves to `(0 + 2) % 5 = 2`.
- The element at index 1 (value 2) moves to `(1 + 2) % 5 = 3`.
- The element at index 3 (value 4) moves to `(3 + 2) % 5 = 0`.
- ...and so on.

The final rotated array will be `[4, 5, 1, 2, 3]`.

## Solution Code

```cpp
#include<iostream>
#include <string>

using std::endl,std::cout,std::string;

namespace ArrayChallenge{
    int* rightRotate(int nums[], int size, int k) {

    int *result = new int[size];
    int ind = 0;
    int kInd;

    while(ind < size){
        kInd = ind + k;
        if(kInd>size-1){
            kInd = kInd % size;
        }
        result[kInd] =  nums[ind];
        ind++;
    }

    return result;
}


    void runChallenge6(){

    int inputs[][10] = {
        {10, 20, 30, 40, 50},
        {1, -2, 3, 4, 5},
        {-1, 90, -90, 4, 6},
        {3, 6, 9, -12},
        {-100, -200, -300}
    };
    int sizes[] = {5, 5, 5, 4, 3};

    int k[] = {3, 2, 6, 2, 1};

    std::cout<<"STARTED RUNNING: ARRAY CHALLENGE 6\n";
    for (int i = 0; i < sizeof(inputs) / sizeof(inputs[0]); i++) {
        cout << i + 1 << ".\\tArray: [";
        for (int j = 0; j < sizes[i]; j++) {
            cout << inputs[i][j];
            if (j != sizes[i] - 1) {
                cout << ", ";
            }
        }
        cout << "]" << endl;

        int* result = rightRotate(inputs[i], sizes[i], k[i]);
        cout << "\\n\\tRotated Array: [";
        for (int k = 0; k < sizes[i]; k++) {

            cout << result[k];
            if (k != sizes[i] - 1) {
                cout << ", ";
            }
        }
        cout << "]" << endl;

        cout << "-" << string(70, '-') << endl;


        // Free memory allocated for the product array
        delete[] result;
    }

    std::cout<<"STOPPED RUNNING: ARRAY CHALLENGE 6\n";
    }
}
```
