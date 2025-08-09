---
title: 'Rearranging Positive and Negative Numbers in an Array'
tags: [array]
---

:::info[Solved On]
3rd August, 2025
:::

## Introduction

Welcome to another coding challenge! This problem is a great exercise in in-place array manipulation. We'll be rearranging an array so that all the negative numbers are grouped together at the beginning, followed by all the positive numbers. This is conceptually similar to the partitioning step in algorithms like Quicksort.

## The Problem

Given an array of integers, your task is to rearrange it such that all negative numbers come before all positive numbers. The order of the elements within the two groups (negatives and positives) does not matter.

**Time Complexity**: O(n), as we will make a single pass through the array.  
**Space Complexity**: O(1), because we are performing the rearrangement in-place, without using any extra space that scales with the input size.

## Our Approach

We'll use a partitioning strategy with a single pass through the array. This is a very efficient way to solve this problem.

### Algorithm Breakdown:

1.  **Initialize a Pointer**: We'll keep a pointer, let's call it `leftMostInd`, which will mark the boundary of our negative number section. Initially, it will be at the start of the array (index 0).
2.  **Single Pass Through the Array**: We'll iterate through the array from beginning to end.
3.  **Negative Number Found**: Whenever we encounter a negative number at our current position `i`, we'll swap it with the element at `leftMostInd`.
4.  **Update the Pointer**: After the swap, we'll increment `leftMostInd`. This effectively expands the "negative numbers" section of our array by one.
5.  **The Result**: By the time our loop finishes, all the negative numbers will have been swapped to the beginning of the array (up to the `leftMostInd`), and the positive numbers will be in the remaining part of the array.

### Key Insight:

This approach maintains an important invariant: at any point during the iteration, all elements before `leftMostInd` are guaranteed to be negative. This is what allows us to solve the problem in a single, efficient pass.

## Solution Code

```cpp
#include<iostream>
#include<utility>
#include<string>


using std::cout,std::string,std::endl;
namespace ArrayChallenge {

void Rearrange(int arr[], int size) {
    // Using swap
    int leftMostInd = 0;
    for(int i=0; i<size; ++i){
        if(arr[i] <0){
            if(i!=leftMostInd)
                std::swap(arr[leftMostInd],arr[i]);
            leftMostInd++;
        }
    }

}

    void runChallenge7(){
        int inputs[][5] = {{10, 4, 6, 23, 7},
                       {-3, 20, -1, 8},
                       {2, -5, -4, 43, 2},
                       {-3, -10, -19, 21, -17},
                       {25, 50, 75, -100, 400}};
    int sizes[] = {5, 4, 5, 5, 5};

    std::cout<<"STARTED RUNNING: ARRAY CHALLENGE 7"<<std::endl;

    for (int i = 0; i < sizeof(inputs) / sizeof(inputs[0]); ++i) {
        cout << i + 1 << ".\\tArray: [";
        for (int j = 0; j < sizes[i]; j++) {
            std::cout << inputs[i][j] << ", ";
        }
        cout << "]" << endl;
        std::cout << "\\tResult: [";
        Rearrange(inputs[i], sizes[i]);
        for (int j = 0; j < sizes[i]; j++) {
            std::cout << inputs[i][j] << ", ";
        }
        cout << "]" << endl;
        std::cout << "\\n";
        std::cout << std::string(100, '-') << std::endl;
    }
    std::cout<<"STOPPED RUNNING: ARRAY CHALLENGE 7"<<std::endl;
    }

}
```
