---
title: 'Merging Two Sorted Arrays'
tags: [array]
---

:::info[Solved On]
3rd August, 2025
:::

## Introduction

Welcome back to my coding blog! This post tackles a classic problem: merging two sorted arrays into a single sorted array. This operation is a cornerstone of the famous Merge Sort algorithm and a great exercise for mastering the two-pointer technique.

## The Problem

My task is to create a function that takes two sorted arrays as input and merges them into a single, new sorted array.

**Time Complexity**: O(m + n), where 'm' and 'n' are the sizes of the two input arrays.  
**Space Complexity**: O(m + n), as I create a new array to store the merged result.

## My Approach

I'll use the two-pointer technique, which is an optimal and elegant way to solve this problem.

### Algorithm Breakdown:

1.  **Initialize Pointers**: I'll use three pointers: one for each of the two input arrays (`p1`, `p2`) and one for my result array (`p3`).
2.  **Compare and Merge**: I'll compare the elements at the current positions of the input arrays (`nums1[p1]` and `nums2[p2]`). The smaller of the two is added to my result array, and its corresponding pointer is moved forward.
3.  **Advance Pointers**: The pointer for the result array (`p3`) is always incremented after an element is added.
4.  **Handle Remaining Elements**: This process continues until one of the input arrays is fully traversed.
5.  **Append the Rest**: Finally, I append any remaining elements from the other array to the end of my result array.

This approach guarantees that the merged array is sorted and achieves linear time complexity, making it highly efficient.

## Solution Code

```cpp
#include <iostream>
#include <vector>

// #pragma GCC diagnostic push
// #pragma GCC diagnostic ignored "-Wsign-compare"

using namespace std;


namespace ArrayChallenge{


vector<int> MergeArrays(const vector<int>& nums1, const vector<int>& nums2) {
    size_t p1 = 0;
    size_t p2 = 0;
    size_t p3 = 0;

    // Initialize the result vector with size equal to the sum of sizes of nums1 and nums2
    vector<int> result(nums1.size() + nums2.size());

    // Traverse both arrays until the end of either array is reached
    while (p1 < nums1.size() && p2 < nums2.size()) {
        // If the value at p1 is smaller than the value at p2, store the value at p3 and increment p1 and p3
        if (nums1[p1] < nums2[p2]) {
            result[p3++] = nums1[p1++];
        }
        // Otherwise, store the value at p2 into p3 and increment p2 and p3
        else {
            result[p3++] = nums2[p2++];
        }
    }

    // Append the remaining elements of nums1 into result
    while (p1 < nums1.size()) {
        result[p3++] = nums1[p1++];
    }

    // Append the remaining elements of nums2 into result
    while (p2 < nums2.size()) {
        result[p3++] = nums2[p2++];
    }

    return result;
}

// Driver code
void runChallenge2() {
    vector<vector<int>> nums1 = {
        {23, 33, 35, 41, 44, 47, 56, 91, 105},
        {1, 2},
        {1, 1, 1},
        {6},
        {12, 34, 45, 56, 67, 78, 89, 99}
    };

    vector<vector<int>> nums2 = {
        {32, 49, 50, 51, 61, 99},
        {7},
        {1, 2, 3, 4},
        {-99, -45},
        {100}
    };

    vector<int> size1 = {9, 2, 3, 1, 8};
    vector<int> size2 = {6, 1, 4, 2, 1};

    std::cout<<"START RUNNING: ARRAY CHALLENGE 2"<<std::endl;
    for (size_t i = 0; i < nums1.size(); ++i) {

        cout << i + 1 << ".\\tFirst array: [ ";
        for (size_t j = 0; j < static_cast<size_t>(size1[i]); ++j) {
            cout << nums1[i][j] << " ";
        }
        cout <<"]"<< endl;

        cout << "\\tSecond array: [ ";
        for (size_t j = 0; j < static_cast<size_t>(size2[i]); ++j) {
            cout << nums2[i][j] << " ";
        }
        cout <<"]"<< endl;

        vector<int> merged = MergeArrays(nums1[i], nums2[i]);
        cout << "\\tMerged array: [ ";
        for (int num : merged) {
            cout << num << " ";
        }
        cout <<"]"<< endl;

        string line(100, '-');
        cout << line << endl;
    }
    std::cout<<"STOPPED RUNNING: ARRAY CHALLENGE 2"<<std::endl;
}

// #pragma GCC diagnostic pop

}
```
