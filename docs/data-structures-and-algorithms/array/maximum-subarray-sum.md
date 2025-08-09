---
title: "Finding the Maximum Subarray Sum (Kadane's Algorithm)"
tags: [array]
---

:::info[Solved On]
2nd August, 2025
:::

## Introduction

Welcome to a classic and elegant algorithm challenge! We'll be implementing Kadane's Algorithm, a dynamic programming approach to find the maximum sum of any contiguous subarray within a given array. This is a beautiful example of how a seemingly complex problem can be solved with a simple, linear-time solution.

## The Problem

Given an array of integers (which can include both positive and negative numbers), your task is to find the sum of a contiguous subarray that has the largest sum.

**Time Complexity**: O(n), as we only need to traverse the array once.  
**Space Complexity**: O(1), as we only use a couple of variables to keep track of the sums.

## Our Approach: Kadane's Algorithm

Kadane's Algorithm is a brilliant example of optimal substructure, a key concept in dynamic programming. It works by scanning through the array and, at each position, making a simple decision.

### Algorithm Breakdown:

1.  **Initialization**: We'll start with two variables: `currentSum` and `globalSum`. Both will be initialized with the value of the first element in the array.
2.  **The Core Decision**: As we iterate through the array, for each element, we have a choice:
    - Do we **extend** the current subarray by adding the new element to `currentSum`?
    - Or do we **start a new subarray** beginning with the new element?
3.  **The Rule**: The decision is based on the value of `currentSum`. If `currentSum` has become negative, it's always better to start a new subarray, so we reset `currentSum` to be the current element. Otherwise, we continue to extend the existing subarray.
4.  **Update the Global Maximum**: After each step, we compare `currentSum` with `globalSum`. If `currentSum` is larger, we update `globalSum`.
5.  **The Result**: By the end of the single pass, `globalSum` will hold the maximum sum of any contiguous subarray.

### Example:

Consider the array `[-4, 2, -5, 1, 2, 3, 6, -5, 1]`.

- We start with `globalSum = -4` and `currentSum = -4`.
- Next element is 2. `currentSum` is negative, so we start fresh: `currentSum = 2`. `globalSum` is now 2.
- ...and so on.
- Eventually, we'll have a subarray `[1, 2, 3, 6]` which gives a sum of 12. This will be our `globalSum`.
- The final result for this example is 12.

## Solution Code

```cpp
#include<iostream>
#include<string>

using std::cout,std::endl,std::string;
namespace ArrayChallenge {
    // Using Dynamic Programming:  Kadane's Algorithm
    // Bottom up approach: Solve a sub-problem to solve a bigger problem
    int maxSumArr(int nums[], int arrSize) {
        if(arrSize <1){
            return 0;
        }
        int currSum = nums[0];
        int globalSum = nums[0];

        for(int i=0; i<arrSize; i++){
            // Calculate currSum ending with nums[i]
            // Decide - should I start new subarray ? or Should I extend the current subarray ?
            if(currSum<0){
                // It is better to start a new subarray
                currSum = nums[i];
            }else{
                currSum+=nums[i];

            }

            if(currSum > globalSum){
                globalSum = currSum;
            }
        }
        return globalSum;

    }


    void runChallenge8(){

        int inputs[][10] = {
        {1, 2, 2, 3, 3, 1, 4},
        {2, 2, 1},
        {4, 1, 2, 1, 2},
        {-4, -1, -2, -1, -2},
        {-4, 2, -5, 1, 2, 3, 6, -5, 1},
        {25}
    };
    int sizes[] = {7, 3, 5, 5, 9, 1};

    std::cout<<"STARTED RUNNING: ARRAY CHALLENGE 8\n";
    for (int i = 0; i < sizeof(inputs) / sizeof(inputs[0]); i++) {
        cout << i + 1 << ".\\tArray: [";
        for (int j = 0; j < sizes[i]; j++) {
            cout << inputs[i][j];
            if (j != sizes[i] - 1) {
                cout << ", ";
            }
        }
        cout << "]" << endl;

        cout << "\\tMaximum Sum: " << maxSumArr(inputs[i], sizes[i]) << endl;
        cout << "-" << string(75, '-') << endl;
    }
    std::cout<<"STOPPED RUNNING: ARRAY CHALLENGE 8\n";
    }
}
```
