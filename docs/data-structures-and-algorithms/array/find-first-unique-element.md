---
title: 'Finding the First Unique Element in an Array'
tags: [array]
---

:::info[Solved On]
2nd August, 2025
:::

## Introduction

Welcome to another coding challenge! This time, we're on the hunt for the first non-repeating element in an array. This problem tests your ability to compare elements within an array and handle different scenarios. The solution we'll explore is a straightforward brute-force approach, which is great for understanding the core logic of the problem.

## The Problem

Given an array of integers, your task is to find and return the first integer that does not repeat itself anywhere else in the array.

**Time Complexity**: O(n²), because for each element, we potentially scan the entire array again.  
**Space Complexity**: O(1), as we are not using any extra data structures that scale with the input size.

## Our Approach

We'll be using a brute-force, nested-loop method. While not the most time-efficient for large datasets, it's very space-efficient and easy to understand.

### Algorithm Breakdown:

1.  **Outer Loop**: We'll iterate through each element of the array with an outer loop. Let's call the current element our `candidate`.
2.  **Inner Loop**: For each `candidate`, we'll start an inner loop that also iterates through the entire array to check for duplicates.
3.  **Duplicate Check**: Inside the inner loop, we compare our `candidate` with every other element. If we find an identical element at a different index, we know our `candidate` is not unique.
4.  **Early Exit**: If a duplicate is found, we can immediately break out of the inner loop and move to the next `candidate` in the outer loop.
5.  **Unique Found**: If the inner loop completes its entire run without finding any duplicates, it means our `candidate` is unique! Since we're looking for the _first_ unique element, we can return this `candidate` right away.

### A Note on Trade-offs:

This O(n²) approach is simple and uses constant space. However, for larger arrays, a more optimal solution would involve using a hash map. That would bring the time complexity down to O(n) but would require O(n) space.

## Solution Code

```cpp
#include<iostream>


namespace ArrayChallenge{

    int findFirstUnique(int arr[],int size){

        for(int p1=0; p1 <size;  p1++){
            int p2=0;
            while(p2 < size){
                if(p1!=p2 && arr[p1] == arr[p2]){
                    break;
                }
                p2++;
            }

            // p2 reach end of array and does not find any duplicate that means it is unique
            if(p2 == size){
                return arr[p1];
            }

        }
        return -1;

    }
    // Time Complexity: O(N^2)
    // Space Complexity: O(1)

    void runChallenge5(){
        int inputs[][6] = {
        {9, 2, 3, 2, 6, 6},
        {-5, -4, -4, 6, -1, 0},
        {-1, 2, -1, -4, -10, 2},
        {1, 1, 2, 9, 5, 5},
        {-2, 2, -2, 2, 5, -3}
    };

    int rows = sizeof(inputs) / sizeof(inputs[0]);

    std::cout<<"STARTED RUNNING: ARRAY CHALLENGE 5 \n";

    for (int i = 0; i < rows; ++i) {
        int cols = sizeof(inputs[i]) / sizeof(inputs[i][0]);

        std::cout << i + 1 << ".\\tInput list: ";
        for (int j = 0; j < cols; ++j) {
            std::cout << inputs[i][j] << " ";
        }
        std::cout << std::endl;

        std::cout << "\\tFirst unique number: " << findFirstUnique(inputs[i], cols) << std::endl;
        std::cout << std::string(100, '-') << std::endl;
    }
    std::cout<<"STOPPED RUNNING: ARRAY CHALLENGE 5\n";

    }
}
```
