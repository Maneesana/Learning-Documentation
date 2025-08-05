---
title: 'Min Max Rearrangement of a Sorted Array'
tags: [array]
---

:::info[Solved On]
3rd August, 2025
:::

Today, I tackled an interesting array problem: rearranging a sorted array into a "min-max" format. The goal is to transform an array like `[1, 2, 3, 4, 5]` into `[5, 1, 4, 2, 3]`. I explored two different solutions: a straightforward approach using extra space and a more clever, space-efficient method that modifies the array in-place.

### The Problem

You are given a sorted array nums containing only positive integers. Your task is to rearrange the array so that:

The element at index 0 is the largest number.

The element at index 1 is the smallest number.

The element at index 2 is the second-largest number.

The element at index 3 is the second-smallest number, and so on.

In other words, even indices should contain the remaining largest numbers in descending order, while odd indices should contain the remaining smallest numbers in ascending order.

**Constraints:**

- 0 ≤ nums.length ≤ 10^3
- 1 ≤ nums[i] ≤ 10^5

### Solution 1: The Straightforward Approach (Out-of-Place)

The most intuitive way to solve this is to create a new array. We can use two pointers, one at the beginning (`min`) and one at the end (`max`) of the original array. We then iterate, adding the element from the `max` pointer and then the element from the `min` pointer to our new result array, moving the pointers inward until they meet.

This approach is easy to understand and implement, but it has a space complexity of O(n) because it requires an auxiliary array of the same size as the input.

### Solution 2: The Encoding Trick (In-Place)

A more advanced solution rearranges the array in-place, achieving O(1) space complexity. The key is a clever encoding technique that allows us to store two numbers in a single array element.

The formula is: `New Value = Old Value + (Value To Add * Marker)`

Here, the `Marker` is a number larger than any element in the array. This ensures that when we modify the array elements, the original values are not lost.

1.  **Encoding:** We iterate through the array. For even indices, we want to place a "max" element, and for odd indices, a "min" element. We modify the element at the current index `i` by adding the desired new value (`arr[max_index]` or `arr[min_index]`) multiplied by our `Marker`.
    - `arr[i] += (arr[max_index] % Marker) * Marker`
2.  **Decoding:** After the encoding pass is complete, the array contains the modified values. To retrieve the final rearranged numbers, we simply divide each element by the `Marker`.
    - `arr[i] = arr[i] / Marker`

This works because the original value can be retrieved using the modulo operator (`arr[i] % Marker`), while the new, rearranged value is retrieved with integer division.

Here is the C++ implementation of both the encoding logic and the rearrangement algorithms.

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
