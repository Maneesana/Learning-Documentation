---
title: 'Rearranging a Sorted Array in Min-Max Form'
tags: [array]
---

## Introduction

In this post, I explore an interesting array rearrangement problem: transforming a sorted array into a "min-max" pattern. I'll look at two solutions: a simple one that uses extra space, and a more clever in-place solution that uses a mathematical trick to save space.

## The Problem

Given a sorted array of positive integers, rearrange it so that the first element is the maximum value, the second is the minimum, the third is the second-maximum, the fourth is the second-minimum, and so on.

**Example:**
Input: `[1, 2, 3, 4, 5]`
Output: `[5, 1, 4, 2, 3]`

**Constraints:**

- 0 ≤ nums.length ≤ 10^3
- 1 ≤ nums[i] ≤ 10^5

## Solution 1: The Straightforward Approach (Using Extra Space)

The most intuitive way to solve this is to create a new result array. I use two pointers: `min` starting at the beginning of the sorted input array and `max` starting at the end. I then build my new array by taking an element from the `max` pointer, then from the `min` pointer, and moving the pointers inward until they meet.

- **Time Complexity**: O(n)
- **Space Complexity**: O(n)

## Solution 2: The In-Place Encoding Trick

A more advanced solution rearranges the array in-place, achieving O(1) space complexity. The key is a clever encoding technique that allows storing two numbers (the original value and the new value) in a single array element.

### Algorithm:

1.  **Find a Marker**: Choose a `Marker` value that is larger than any element in the array (e.g., `max_element + 1`).
2.  **Encoding Pass**: Iterate through the array. At each index `i`, I want to store the new value (either a max or a min from the ends of the array) without losing the original value. I do this with the formula:
    `arr[i] = arr[i] + (new_value % Marker) * Marker`
    - For even indices, `new_value` is `arr[max_index]`.
    - For odd indices, `new_value` is `arr[min_index]`.
      The original value at `arr[i]` can still be retrieved using `arr[i] % Marker`.
3.  **Decoding Pass**: After encoding, iterate through the array one last time and retrieve the final rearranged numbers by dividing each element by the `Marker`:
    `arr[i] = arr[i] / Marker`

This is a clever way to use the limited space of the array itself to store the information needed for the rearrangement.

## Solution Code

```cpp
#include<iostream>
#include<string>
#include<vector>
using std::cout,std::endl,std::string;
namespace ArrayChallenge {

    // This works only for positive values
    // Two positive number can be encoded as one
    // e.g. at a single index in an array, it can hold two positive values
    // Take a value is possible greater than all of the values to be encoded. INT_MAX
    // Encoding formula: Encoded value =  N0 + ((N1%INT_MAX) * INT_MAX)
    // Decoding for N0:  Encoded Value % INT_MAX
    // Decoding for N1:  Encoded Value / INT_MAX
    void basicEncodingExample(){
        std::vector<vector<int>> series {
            {2,5},
            {3,8},
            {10,20}
        };
        std::vector<int> encodeArr;
        int max = 100;
        int pt = 0;


        std::cout<<"INPUT ARRAY"<<std::endl;
        for(auto ar : series){
            int val1 = ar[0];
            int val2 = ar[1];
            std::cout<<"INPUT: FIRST VALUE "<<val1<<std::endl;
            std::cout<<"INPUT: SECOND VALUE "<<val2<<std::endl;
            int enVal = val1 + (val2 * max);
            encodeArr.push_back(enVal);
            pt++;
        }
        std::cout<<"\n";

        std::cout<<"Showing encoded array"<<std::endl;
        std::cout<<"[";
        for(auto itr : encodeArr){
            std::cout<<itr << ", ";
        }
        std::cout<<"]";
        std::cout<<"\n";
        std::cout<<"Decoding: "<<std::endl;

        for(auto val: encodeArr){
            std::cout<<"First Value: "<<val%max<<std::endl;
            std::cout<<"Second Value: "<<val/max<<std::endl;

        }


    }

    // Use encoding technique
    std::vector<int> RearrangeArray_encoding(std::vector<int>& nums) {
    int minPos = 0;
    int maxPos = nums.size() -1;
    int globalMax = nums[maxPos] + 1;

    // Encoding
    for(int i =0; i <nums.size(); i++)
    {
        if(i%2 == 0){
            nums[i] += (nums[maxPos]%globalMax) * globalMax;
            maxPos--;
        }else{
            nums[i] += (nums[minPos]%globalMax) * globalMax;
            minPos++;
        }
    }
    // decoding
    for(int k =0; k<nums.size(); k++){
        nums[k]/=globalMax;
    }

    return nums;
}



   // Given array is sorted in asc order
    std::vector<int> RearrangeArray(std::vector<int>& nums) {
        std::vector<int> result;
        int n= nums.size();
        int greaterNumPos = 0;
        for(int i=0; i<n/2; i++){
            greaterNumPos = n - (i+1);
            result.push_back(nums[greaterNumPos]);
            result.push_back(nums[i]);
        }

        return result;
    }

    void printVector(std::vector<int> &arr){
       std::cout<<std::endl;
        std::cout<<"[";
        for(auto it : arr){
            std::cout<<it<<", ";
        }
        std::cout<<"]";
        std::cout<<std::endl;
     }


    void runChallenge9(){

         std::vector<std::vector<int>> inputArray = {
        {1, 2, 3, 4, 5, 6, 7, 8},
        {11, 22, 33, 44, 55, 66, 77, 88},
        {1, 2, 4, 8, 16, 32, 64, 128, 512, 1024},
        {3, 3, 5, 5, 7, 7, 9, 9, 11, 11, 13, 13},
        {100, 233, 544, 753, 864, 935, 1933, 2342}
    };

    for (size_t i = 0; i < inputArray.size(); ++i) {
        std::cout << i + 1 << ".\tOriginal array: ";
        printVector(inputArray[i]);
        std::cout << "\n\tRearranged array: ";
        std::vector<int> rearranged = RearrangeArray(inputArray[i]);
        printVector(rearranged);
        std::cout << "\n" << std::string(100, '-') << std::endl;
    }

    }

}


// [3, 3, 5, 5, 7, 7, 9, 9, 11, 11, 13, 13]
// 13,3,13,3,11,5,11,5,9,7,9,7
```
