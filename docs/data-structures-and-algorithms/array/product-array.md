---
title: 'Calculating the Product of All Elements Except Self'
tags: [array]
---

:::info[Solved On]
3rd August, 2025
:::

## Introduction

Welcome to another coding challenge! This problem is a fantastic exercise in thinking about array manipulations in a non-obvious way. We're tasked with creating a new array where each element is the product of all other elements in the original array, but with a catch: you cannot use the division operator.

## The Problem

Given an array of integers, create a new array where each element at index `i` is the product of all the numbers in the original array except the one at index `i`.

**Time Complexity**: O(n), as we will traverse the array twice.  
**Space Complexity**: O(1), excluding the output array. We use a constant amount of extra space.

## Our Approach

The solution is a clever two-pass algorithm that avoids division. The key insight is that the product for any given element is the product of all elements to its left multiplied by the product of all elements to its right.

### Algorithm Breakdown:

1.  **The Left Pass**: We first iterate through the array from left to right. For each position `i`, we calculate the product of all elements to its left and store it in our `product` array. We use a variable `left` to keep a running product.
2.  **The Right Pass**: Next, we iterate through the array from right to left. For each position `j`, we calculate the product of all elements to its right (using a `right` running product variable). We then multiply this right-side product with the already stored left-side product in `product[j]`.
3.  **The Result**: After these two passes, each position in our `product` array will contain the product of all other elements.

This algorithm is elegant because it breaks down a seemingly complex calculation into two simple, linear passes. It also naturally handles edge cases, like zeros in the array.

## Solution Code

```cpp
#include<iostream>
#include<string>
using std::cout,std::endl,std::string;

namespace ArrayChallenge{

    int* findProduct(int nums[], int size){
        int left=1,right=1;
        int * product = new int[size];

        // Calculating left of its element
        for(int i=0; i<size; i++){
            product[i] = left;
            left *=  nums[i];

        }

        // Calcuating right of its element and update product
        for(int j=size-1; j>=0; j--){
            product[j] *=right;
            right *= nums[j];
        }
        return product;
    }



void runChallenge4(){
        int inputs[][10] = {
        {1, 2, 3, 4},
        {5, -3, 1, 2},
        {2, 2, 2, 0},
        {0, 0, 0, 0},
        {-1, -2, -4}
    };
    int sizes[] = {4, 4, 4, 4, 3};

    std::cout<<"STARTED RUNNIGN: ARRAY CHALLENGE 4 \n";

    for (int i = 0; i < sizeof(inputs) / sizeof(inputs[0]); i++) {
        cout << i + 1 << ".\\tArray: [";
        for (int j = 0; j < sizes[i]; j++) {
            cout << inputs[i][j];
            if (j != sizes[i] - 1) {
                cout << ", ";
            }
        }
        cout << "]" << endl;

        int* result = findProduct(inputs[i], sizes[i]);
        cout << "\\n\\tList of products: [";
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

    std::cout<<"ENDED RUNNING: ARRAY CHALLENGE 4\n";
}

}
```
