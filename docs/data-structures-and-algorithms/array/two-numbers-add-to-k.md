---
title: 'Finding Two Numbers that Sum to a Target (Two Sum Problem)'
tags: [array]
---

:::info[Solved On]
3rd August, 2025
:::

## Introduction

This time, I'm tackling the classic "Two Sum" problem. This is a very popular interview question, and solving it efficiently demonstrates a good understanding of array manipulation and algorithms. I'll be using the two-pointer technique on a sorted array.

## The Problem

Given an array of integers, my task is to find two numbers within that array that add up to a specific target value, `K`.

**Time Complexity**: O(n log n), primarily due to the initial sorting step.  
**Space Complexity**: O(1), as I am modifying the array in-place and using constant extra space.

## My Approach

My solution involves a combination of sorting and the two-pointer technique. This is a very efficient way to solve this problem when allowed to modify the original array.

### Algorithm Breakdown:

1.  **Sort the Array**: The first and most crucial step is to sort the input array. This allows me to use the two-pointer technique effectively.
2.  **Initialize Pointers**: I'll set up two pointers: a `left` pointer at the beginning of the array and a `right` pointer at the end.
3.  **Calculate the Sum**: In each step, I calculate the sum of the elements at the `left` and `right` pointers.
4.  **Adjust Pointers Based on Sum**:
    - If the `sum` is less than my target `K`, I need a larger sum. So, I move the `left` pointer one step to the right.
    - If the `sum` is greater than my target `K`, I need a smaller sum. So, I move the `right` pointer one step to the left.
    - If the `sum` is exactly equal to `K`, I've found the pair! I return these two numbers.
5.  **Continue Until Pointers Meet**: I repeat this process until the `left` and `right` pointers cross each other. If they cross, it means no such pair exists.

This approach leverages the sorted nature of the array to intelligently and quickly narrow down the search space.

## Solution Code

```cpp
#include<algorithm>
#include<iostream>

#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wsign-compare"
namespace ArrayChallenge{

int* FindSum(int nums[], int k, int size) {
    std::sort(nums, nums + size);

    int left = 0;
    int right = size - 1;

    int* result = new int[2];
    int sumVal = 0;
    // Iterate until the pointers meet
    while (left < right) {
        // Calculate the sum of the current pair
        sumVal = nums[left] + nums[right];
        // If the sum is less than the target sum, move the left pointer to the right
        if (sumVal < k)
            left++;
        // If the sum is greater than the target sum, move the right pointer to the left
        else if (sumVal > k)
            right--;
        // If the sum equals the target sum, add the pair to the result array and break the loop
        else {
            result[0] = nums[left];
            result[1] = nums[right];
            return result;
        }
    }
    delete[] result; // Free memory before returning nullptr
    return nullptr;
}

void runChallenge3() {
    int inputs[][10] = {
        {1, 2, 3, 4},
        {1, 2},
        {2, 2},
        {-4, -1, -9, 1, -7},
        {25, 50, 75, 100, 400}
    };

    int sizes[5] = {4, 2, 2, 5, 5};
    int k[5] = {5, 3, 4, -3, 425};

    std::cout<<"STARTED RUNNING: ARRAY CHALLENGE 3"<<std::endl;
    for (int i = 0; i < 5; i++) {
        std::cout << (i + 1) << "\\tArray: [";
        for (int j = 0; j < sizes[i]; j++) {
            std::cout << inputs[i][j];
            if (j < sizes[i] - 1) {
                std::cout << ", ";
            }
        }
        std::cout << "]" << std::endl;
        int* nums2 = FindSum(inputs[i], k[i], sizes[i]);

        int num1 = nums2[0];
        int num2 = nums2[1];
        std::cout << "\\n\\tk: " << k[i] << std::endl;
        std::cout << "\\n\\tResult: [" << num1 << ", " << num2 << "]" <<std::endl;

        std::cout << std::string(100, '-') << std::endl;
        delete[] nums2; // Free memory after use
    }

    std::cout<<"STOPPED RUNNING: ARRAY CHALLENGE 3"<<std::endl;
 }
}
#pragma GCC diagnostic pop
```
