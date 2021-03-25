/* bubble sort */
export function dobubbleSort (arr){
    var swapped;
    var array = arr;
    var animations = []; 
    var y = 0;
    do {
        swapped = false;
        /* actions: 0 = first compare, 1 = second compare, 2 = swap, 3 = last in sorted */
        for (var i=0; i < array.length-1-y; i++) {
            /* comparing, change color */
            animations.push([0, i, i+1]);
            let isLast = i === array.length-y-2 ? true : false;
            const temp = array[i];
            const temp_i1 = array[i+1];
            if (array[i] > array[i+1]) {  //if first index > second index, then swap
                array[i] = temp_i1;
                array[i+1] = temp;
                swapped=true;
                animations.push([2, i, i+1]);
            }
            if(isLast){
                animations.push([3, i, i+1]);
            }else{
                animations.push([1, i, i+1]);
            }
        }
        y++;
    } while (swapped);

    return animations.reverse();
}

/* insertion sort */
export function doinsertionsort (arr){
    var array = arr;
    var animations = []; 


    for (let i = 1; i < array.length; i++) 
    {  
        let key = arr[i];  
        let j = i - 1;  
  
        /* Move elements of arr[0..i-1], that are  
        greater than key, to one position ahead  
        of their current position */
        animations.push([0, j, i]);
        while (j >= 0 && arr[j] > key) 
        {  
            //switch & compare more
            animations.push([1, j, j+1]);
            //swap should know to turn the colors back to yellow for j
            arr[j + 1] = arr[j];  
            j = j - 1;
            if(j >= 0){
                animations.push([0, j, j+1]);
            }
        }  
        if(j >= 0){
            animations.push([2, j, j+1]);
        }else{
            animations.push([2, j+1, j+1]);
        }
        arr[j + 1] = key;  
    }  

    return animations.reverse();
}

/* selection sort */
export function doselectionSort(arr) {
    var array = arr;
    var animations = []; 
    let len = arr.length;
    for (let i = 0; i < len; i++) {
        let min = i;
        //selected i as the next index for selection
        animations.push(['SELECT', i]);
        for (let j = i + 1; j < len; j++) {
            //compare index j with min
            animations.push(['COMPARE', j]);
            if (array[min] > array[j]) {
                if(min === i){
                    animations.push(['MIN', j, j]);
                }else{
                    animations.push(['MIN', min, j]);
                }
                min = j;
            }else{
                animations.push(['COMPARE_OVER', j]);
            }
        }

        if (min === i) {
            animations.push(['SORTED', i]);
        } else{
            //swap
            let tmp = array[i];
            array[i] = array[min];
            array[min] = tmp;
            animations.push(['SWAP', i, min]);
        }
    }
    return animations.reverse();
}

/* quick sort */
export function doquickSort(arr){  
    /* The main function that implements QuickSort() 
      arr[] --> Array to be sorted, 
      low  --> Starting index, 
      high  --> Ending index */
      let len = arr.length;
      const animations = quicksort(arr, 0, len-1);

      return animations.reverse();
}

function partition(arr, low, high) 
{ 
    let animations = [];
    let pivot = arr[high];  
    animations.push(['SELECT', high]);
    let i = low-1; // index of smaller element 
    for (let j=low; j<high; j++) 
    { 
        // If current element is smaller than the pivot, comparing arr[j] with pivot
        animations.push(['COMPARE', j]);
        if (arr[j] < pivot) 
        { 
            i++; 
            // swap arr[i] and arr[j] 
            let temp = arr[i]; 
            arr[i] = arr[j]; 
            arr[j] = temp; 
            animations.push(['SWAP', i, j]);
            animations.push(['COMPARE_OVER', j]);
            animations.push(['DESELECT', i, i+1]);
            //animations.push(['COMPARE_OVER', i, j]);
        } else{
            animations.push(['COMPARE_OVER', j]);
        }
    } 

    // swap arr[i+1] and arr[high] (or pivot) 
    let temp = arr[i+1]; 
    arr[i+1] = arr[high]; 
    arr[high] = temp; 
    animations.push(['SWAP', i+1, high]);
    animations.push(['COMPARE_OVER',high]);
    animations.push(['COMPLETES', i+1]);

    return [i+1, animations]; 
} 

function quicksort(arr, low, high) 
{ 
    var complete_animations = [];
    if (low < high) 
    { 
        /* pi is partitioning index, arr[pi] is  
            now at right place */
        let [pi, partition_animation] = partition(arr, low, high); 
        // Recursively sort elements before 
        // partition and after partition 

        const animations = quicksort(arr, low, pi-1); 
        const animations2 = quicksort(arr, pi+1, high); 

        const animations1n2 = animations.concat(animations2);
        complete_animations = partition_animation.concat(animations1n2);
    } 

    return complete_animations;
}

/* merge sort */
export function domergeSort(array) {
    const animations = [];
    if (array.length <= 1) return array;
    const auxiliaryArray = array.slice();
    mergeSortHelper(array, 0, array.length - 1, auxiliaryArray, animations);
    return animations.reverse();
  }
  
function mergeSortHelper(mainArray,startIdx,endIdx,auxiliaryArray,animations) {
    if (startIdx === endIdx) return;
    const middleIdx = Math.floor((startIdx + endIdx) / 2);
    mergeSortHelper(auxiliaryArray, startIdx, middleIdx, mainArray, animations);
    mergeSortHelper(auxiliaryArray, middleIdx + 1, endIdx, mainArray, animations);
    doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations);
}

function doMerge(mainArray,startIdx,middleIdx,endIdx,auxiliaryArray,animations) {
    let k = startIdx;
    let i = startIdx;
    let j = middleIdx + 1;
    while (i <= middleIdx && j <= endIdx) {
        // These are the values that we're comparing; we push them once
        // to change their color.
        animations.push(["SELECT",i, j]);
        // These are the values that we're comparing; we push them a second
        // time to revert their color.
        animations.push(["DESELECT",i, j]);
        if (auxiliaryArray[i] <= auxiliaryArray[j]) {
        // We overwrite the value at index k in the original array with the
        // value at index i in the auxiliary array.
        animations.push(["CHANGE",k, auxiliaryArray[i]]);
        mainArray[k++] = auxiliaryArray[i++];
        } else {
        // We overwrite the value at index k in the original array with the
        // value at index j in the auxiliary array.
        animations.push(["CHANGE",k, auxiliaryArray[j]]);
        mainArray[k++] = auxiliaryArray[j++];
        }
    }
    while (i <= middleIdx) {
        // These are the values that we're comparing; we push them once
        // to change their color.
        animations.push(["SELECT",i, i]);
        // These are the values that we're comparing; we push them a second
        // time to revert their color.
        animations.push(["DESELECT",i, i]);
        // We overwrite the value at index k in the original array with the
        // value at index i in the auxiliary array.
        animations.push(["CHANGE",k, auxiliaryArray[i]]);
        mainArray[k++] = auxiliaryArray[i++];
    }
    while (j <= endIdx) {
        // These are the values that we're comparing; we push them once
        // to change their color.
        animations.push(["SELECT",j, j]);
        // These are the values that we're comparing; we push them a second
        // time to revert their color.
        animations.push(["DESELECT", j, j]);
        // We overwrite the value at index k in the original array with the
        // value at index j in the auxiliary array.
        animations.push(["CHANGE",k, auxiliaryArray[j]]);
        mainArray[k++] = auxiliaryArray[j++];
    }
}
