---
title: 'Implementing a Dynamic Array in C++'
tags: [array]
---

:::info[Solved On]
2nd August, 2025
:::

## Introduction

In this guide, we'll walk through the process of creating our own dynamic array class in C++, which we'll call `ArrayList`. This is a foundational data structure, similar to `std::vector` in C++, and understanding how it works under the hood is a fantastic exercise. We'll cover dynamic memory allocation, automatic resizing, and memory management, and we'll even look at how to work with 2D arrays.

## The Goal

Our objective is to build a dynamic array data structure that can:

- Automatically grow in size when its capacity is reached.
- Provide essential operations like adding elements, displaying the array, and removing the last element.
- Handle memory allocation and deallocation correctly to prevent memory leaks.
- Serve as a basis for understanding both 1D and 2D dynamic arrays.

## Our `ArrayList` Class

The `ArrayList` class we're building will manage a dynamically allocated array. Here are its key features and the logic behind them.

### Key Features:

- **Dynamic Resizing**: When the array is full, it will automatically double its capacity.
- **Memory Management**: We'll use `new` and `delete[]` to properly allocate and deallocate memory.
- **Core Operations**: We'll implement methods like `add`, `display`, `popBack`, and `getSize`.
- **1D and 2D Examples**: We'll show how to use our `ArrayList` and also how to work with standard 2D arrays in C++.

### The Resizing Algorithm:

1.  **Initialization**: When an `ArrayList` object is created, it allocates an initial array with a specified capacity.
2.  **The `add` Operation**: Before adding a new element, we check if the array is full (`num_of_elements == capacity`). If it is, we trigger the resize operation.
3.  **The `resize` Operation**:
    - We double the `capacity`.
    - A new, larger temporary array is created.
    - All elements from the old array are copied to the new one.
    - The old array's memory is deallocated, and our internal array pointer is updated to point to the new array.
4.  **Memory Cleanup**: A destructor is crucial to deallocate the array's memory when an `ArrayList` object goes out of scope, preventing memory leaks.

## Solution Code

```cpp
#include<iostream>
#include "CH1_remove_even_integers.h"
#include "CH2_merge_two_sorted_arrays.h"
#include "CH3_two_numbers_add_to_k.h"
#include "CH4_product_array.h"
#include "CH5_unique_non_repeating.h"
#include "CH6_rotate_array.h"
#include "CH7_rearrage_pos_neg.h"
#include "CH8_max_sub_array.h"
#include "CH9_max_min_rearrage.h"

// dynamic memory allocation - 1D array
namespace Array{
    class ArrayList {
        private:
            int *arr;
            int num_of_elements;
            int capacity;
            void resize(){
                capacity = capacity *2;
                int *tempArr = new int[capacity];

                for(int i=0; i< num_of_elements;  i++){
                    tempArr[i] = arr[i];
                }
                delete [] arr;
                arr = tempArr;
            }
    public:
            ArrayList(int size):arr(new int[size]),num_of_elements(0),capacity(size){}

            void add(int val){
                if(num_of_elements == capacity){
                    resize();
                }
                arr[num_of_elements] = val;
                num_of_elements++;
            }

            void display(){
                for(int i=0; i<num_of_elements; i++){
                    std::cout<<arr[i]<<std::endl;
                }
            }
            int popBack(){
                int ele = arr[num_of_elements];
                arr[num_of_elements-1] = -1;
                return ele;
            }
            int getSize(){
                return capacity;
            }


    };

    void OneDArrayExample(){
        std::cout<<"1D Array"<<std::endl;
        auto arr1  = ArrayList(5);
        arr1.add(2);
        arr1.add(2);
        arr1.add(2);
        arr1.add(2);
        arr1.add(2);
        arr1.add(2);
        arr1.add(5);
        arr1.display();
        std::cout<<"Array Size: "<<arr1.getSize()<<std::endl;
    }


    void TwoDArrayExample(){
        // static 2D array
        std::cout<<"Static 2D Array"<<std::endl;
        int arr[2][2] = {
            {1,2},
            {3,4}
        };
        for(int i =0; i<2; i++){
            for(int j=0; j<2; j++){

                std::cout<<arr[i][j]<<" ";
            }
            std::cout<<"\n";

        }
        // Dynamic 2D Array
        std::cout<<"Dynamic 2D Array"<<std::endl;
        int k=0;
        int rows = 2;
        int cols = 3;
        int ** arr2 = new int *[rows];
        for(int i= 0; i < rows; i++)
            arr2[i] = new int[cols];

        for(int i =0; i<rows; i++){
            for(int j= 0; j<cols; j++){
                k++;
                arr[i][j] = k;
                std::cout<<arr[i][j]<<" ";
            }
            std::cout<<"\n";
        }

        for(int i =0; i< rows; i++)
        {
            delete [] arr2[i];
        }

        delete [] arr2;
        std::cout<<"Cleaned Up Memory now"<<std::endl;


    }
    void runArrayExample(){
        OneDArrayExample();
        TwoDArrayExample();
        ArrayChallenge::runChallenge1();
        ArrayChallenge::runChallenge2();
        ArrayChallenge::runChallenge3();
        ArrayChallenge::runChallenge4();
        ArrayChallenge::runChallenge5();
        ArrayChallenge::runChallenge6();
        ArrayChallenge::runChallenge7();
        ArrayChallenge::runChallenge8();
        ArrayChallenge::runChallenge9();
    }
}
```
