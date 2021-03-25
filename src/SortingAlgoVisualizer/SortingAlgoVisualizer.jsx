import React from 'react';
import './SortingAlgoVisualizer.css';
import {dobubbleSort, domergeSort, doquickSort} from '../sortingAlgo/sortingalgo.js';
import {doinsertionsort} from '../sortingAlgo/sortingalgo.js';
import {doselectionSort} from '../sortingAlgo/sortingalgo.js';

export default class SortingAlgoVisualizer extends React.Component {
    /* used to initate an array (have to call super(props) to use props) */
    /* the selected algorithm will change its value: 1 = bubbleSort, 2 = insertionSort */
    /* what we have in states:                             */
    /* array, animations, selected_alg, step, range, speed */
    /* what we have in class:                              */
    /* width, myinterval, compare, swap                    */
    constructor(props){
        super(props);

        this.state = {
            array: [],
            animations: [],
            selected_alg : null,
            range : 50,
            speed : 50
        };

        /*  width = the size of the bars
            myinterval = timer controling the speed of the animations
            play_speed = myinterval's speed 
            compare = tracks the number of comparisons with an alg
            swap = tracks the number of swaps with an alg
            step = tracks the number of total steps with an alg
            */
        this.width = 4;
        this.myinterval = null;
        this.play_speed = 50;
        this.compare = 0;
        this.swap = 0;
        this.steps = 0;
    }

    componentDidMount(){
        this.resetArray();  
    }
    componentWillUnmount(){
        this.resetArray();  
    }

    resetColor(color){
        /* reset the colors back to primary color */
        var arrayBars = document.getElementsByClassName('array_bar');
        for(let x = 0; x < arrayBars.length; x++){
            arrayBars[x].style.backgroundColor = color;
        }
    }

    resetArray(){
        /* get range & speed from slider */
        const {range} = this.state;

        /* first stop the interval if we have one */
        if(this.myinterval){
            clearInterval(this.myinterval);
            this.myinterval = null;
        }
        
        /* reset the values in array */
        const array = [];
        for(let i = 0; i < range; i++){
            array.push(randomIntBetweenIntervel(25,700));
        }
        this.resetCounters();
        
        /* updates the state */
        this.setState({
            array,
            animations : [],
            selected_alg : null
        });
    }

    /* creates the animations and setState to the correct state */
    bubbleSort() {
        const animation = dobubbleSort(this.state.array.slice());
        this.resetCounters();
        /* entering critical section */
        this.setState({
            animations : animation,
            selected_alg : 'BUBBLE'
        });
        /* existing cs */
    }

    insertionSort(){
        const animation = doinsertionsort(this.state.array.slice());
        this.resetCounters();
        this.setState({
            animations : animation,
            selected_alg : 'INSERTION'
        });
    }

    selectionSort(){
        const animation = doselectionSort(this.state.array.slice());
        this.resetCounters();
        this.setState({
            animations : animation,
            selected_alg : 'SELECTION'
        });
    }

    quickSort(){
        const animation = doquickSort(this.state.array.slice());
        this.resetCounters();
        this.setState({
            animations : animation,
            selected_alg : 'QUICK'
        });
    }

    mergeSort(){
        const animation = domergeSort(this.state.array.slice());
        this.resetCounters();
        this.setState({
            animations : animation,
            selected_alg: 'MERGE'
        });
    }

    resetCounters(){
        this.compare = 0;
        this.swap = 0;
        this.steps = 0;
        this.resetColor('teal');
    }

    /* animations/user buttons */
    //play starts a timer that calls step. IMPORTANT: saving timer in state
    play(){
        const {selected_alg, speed} = this.state;
        //if there is already animations playing, we do nothing
        let play_speed = (101 - speed) + (101-speed);
        if(selected_alg === null || this.myinterval !== null){
            console.log("No animations ready");
        }else{ //here we do the animations
            this.myinterval = setInterval(this.step, play_speed);
        }
    }
    //plays an animation from animations in state, uses everything in state to dispatch animations
    //made it an arrow function so it could use states
    //if animations are playing, we can use step to show the next animation & stop the animation
    step = ()=>{
        if(this.state.selected_alg && this.state.animations.length > 0){
            switch (this.state.selected_alg){
                case 'BUBBLE' :
                    this.doBubbleSortAnimations(this.state.animations, this.state.array, this.state.step);
                    break;
                case 'INSERTION' : 
                    this.doInsertionAnimations(this.state.animations, this.state.array, this.state.step);
                    break;
                case 'SELECTION' : 
                    this.doSelectionAnimations(this.state.animations, this.state.array, this.state.step);
                    break;
                case 'QUICK':
                    this.doQuickSortAnimations(this.state.animations, this.state.array, this.state.step);
                    break;
                case 'MERGE':
                    this.doMergeSortAnimations(this.state.animations, this.state.array, this.state.step);
                    break;
                default :
                    console.log("No animations playing");
            }
        }else{ //not ready! no algo selected or generated!
            console.log("No animations available");
            if(this.myinterval !== null){
                clearInterval(this.myinterval);
                this.myinterval = null;
            }
        }
    }
    
    stop(){
        clearInterval(this.myinterval);
        this.myinterval = null;
    }

    /* allows user to save and reuse arrays */
    savearr(){
        this.savedArr = this.state.array.slice();
    }

    oldarr(){
        this.resetArray();
        this.setState({
            array : this.savedArr
        });
        this.resetColor('teal');
    }
    
    /* sorting algo visualizations */
    doBubbleSortAnimations(animations, array){
        const animation = animations.pop();
        var arrayBars = document.getElementsByClassName('array_bar');
        const [action, one, two] = animation;
        const barOneStyle = arrayBars[one].style;
        const barTwoStyle = arrayBars[two].style;
        switch(action){
            case 0:
                //0 stands for comparing to be sorted (blue) with is sorted (red)
                barOneStyle.backgroundColor = 'red';
                barTwoStyle.backgroundColor = 'red';
                this.compare++;
                break;
            case 1:
                barOneStyle.backgroundColor = 'teal';
                barTwoStyle.backgroundColor = 'teal';
                break;
            case 2:
                barOneStyle.backgroundColor = 'blue';
                barTwoStyle.backgroundColor = 'blue';
                let temp = array[one];
                array[one] = array[two];
                array[two] = temp;
                this.swap++;
                break;
            case 3: 
                barOneStyle.backgroundColor = 'teal';
                barTwoStyle.backgroundColor = 'yellow';
                break;
            default:
                console.log('hi');

        }

        if(animations.length === 0){
            for(let i = 0; i<arrayBars.length; i++){
                arrayBars[i].style.backgroundColor = 'yellow';
            }
        }
        this.setState({
            array : array,
            animations : animations
        });
        this.steps++;
    }

    doInsertionAnimations(animations, array){
        const animation = animations.pop();
        var arrayBars = document.getElementsByClassName('array_bar');
        const [action, one, two] = animation;
        const barOneStyle = arrayBars[one].style;
        const barTwoStyle = arrayBars[two].style;
        switch(action){
            case 0:
                //0 stands for comparing to be sorted (blue) with is sorted (red)
                barOneStyle.backgroundColor = 'red';
                barTwoStyle.backgroundColor = 'blue';
                this.compare++;
                break;
            case 1:
                barOneStyle.backgroundColor = 'blue';
                barTwoStyle.backgroundColor = 'yellow';
                let temp = array[one];
                array[one] = array[two];
                array[two] = temp;
                this.swap++;
                break;
            case 2:
                barOneStyle.backgroundColor = 'yellow';
                barTwoStyle.backgroundColor = 'yellow';
                break;
            default:
                console.log('hi');

        }

        /* turns all the bars to yellow after sorted */
        if(animations.length === 0){
            for(let i = 0; i<arrayBars.length; i++){
                arrayBars[i].style.backgroundColor = 'yellow';
            }
        }

        /* updates our states for next step */
        this.setState({
            array : array,
            animations : animations
        });
        this.steps++;
    }

    doSelectionAnimations(animations, array){
        const animation = animations.pop();
        var arrayBars = document.getElementsByClassName('array_bar');
        const [action, one, two] = animation;
        const barOneStyle = arrayBars[one].style;
        var barTwoStyle;
        switch(action){
            case "SELECT":
                //0 stands for comparing to be sorted (blue) with is sorted (red)
                barOneStyle.backgroundColor = 'blue';
                break;
            case 'COMPARE':
                barOneStyle.backgroundColor = 'red';
                this.compare++;
                break;
            case 'MIN':
                barTwoStyle = arrayBars[two].style;
                barOneStyle.backgroundColor = 'teal';
                barTwoStyle.backgroundColor = 'orange';
                break;
            case 'COMPARE_OVER': 
                barOneStyle.backgroundColor = 'teal';
                break;
            case 'SWAP':
                barTwoStyle = arrayBars[two].style;
                barOneStyle.backgroundColor = 'yellow';
                barTwoStyle.backgroundColor = 'teal';
                let temp = array[one];
                array[one] = array[two];
                array[two] = temp;
                this.swap++;
                break;
            case 'SORTED':
                barOneStyle.backgroundColor = 'yellow';
                break;
            default:
                console.log('hi');

        }

        if(animations.length === 0){
            for(let i = 0; i<arrayBars.length; i++){
                arrayBars[i].style.backgroundColor = 'yellow';
            }
        }
        this.setState({
            array : array,
            animations : animations
        });
        this.steps++;
    }

    doQuickSortAnimations(animations, array){
        const animation = animations.pop();
        var arrayBars = document.getElementsByClassName('array_bar');
        const [action, one, two] = animation;
        const barOneStyle = arrayBars[one].style;
        var barTwoStyle;
        switch(action){
            case "SELECT":
                //0 stands for comparing to be sorted (blue) with is sorted (red)
                barOneStyle.backgroundColor = 'blue';
                break;
            case 'DESELECT':
                barTwoStyle = arrayBars[two].style;
                barTwoStyle.backgroundColor = 'blue';
                barOneStyle.backgroundColor = 'teal';
                break;
            case 'COMPARE':
                barOneStyle.backgroundColor = 'red';
                this.compare++;
                break;
            case 'COMPARE_OVER': 
                // barTwoStyle = arrayBars[two].style;
                // barTwoStyle.backgroundColor = 'teal';
                barOneStyle.backgroundColor = 'teal';
                break;
            case 'SWAP':
                barTwoStyle = arrayBars[two].style;
                barTwoStyle.backgroundColor = 'orange';
                barOneStyle.backgroundColor = 'orange';
                let temp = array[one];
                array[one] = array[two];
                array[two] = temp;
                this.swap++;
                break;
            case 'COMPLETES':
                barOneStyle.backgroundColor = 'yellow';
                break;
            default:
                console.log('hi');

        }

        if(animations.length === 0){
            for(let i = 0; i<arrayBars.length; i++){
                arrayBars[i].style.backgroundColor = 'yellow';
            }
        }
        this.setState({
            array : array,
            animations : animations
        });
        this.steps++;
    }

    doMergeSortAnimations(animations, array){
        const animation = animations.pop();
        var arrayBars = document.getElementsByClassName('array_bar');
        const [action, one, two] = animation;
        const barOneStyle = arrayBars[one].style;
        var barTwoStyle;
        switch(action){
            case "SELECT":
                //0 stands for comparing to be sorted (blue) with is sorted (red)
                barTwoStyle = arrayBars[two].style;
                barTwoStyle.backgroundColor = 'red';
                barOneStyle.backgroundColor = 'red';
                this.compare++;
                break;
            case 'DESELECT':
                barTwoStyle = arrayBars[two].style;
                barTwoStyle.backgroundColor = 'teal';
                barOneStyle.backgroundColor = 'teal';
                break;
            case 'CHANGE':
                array[one] = two;
                this.swap++;
                break;
            default:
                console.log('hi');
        }

        if(animations.length === 0){
            for(let i = 0; i<arrayBars.length; i++){
                arrayBars[i].style.backgroundColor = 'yellow';
            }
        }
        this.setState({
            array : array,
            animations : animations
        });
        this.steps++;
    }
    /* everything that is rendered onto the screen is below */
    render(){
        const {array, selected_alg} = this.state;

        return(
            <>
            <div className="user_settings">
             <div className="button_container">
                <h1>Sorting Algorithm Visualizer</h1>
                <button onClick={()=> this.resetArray()} button className="button_sort">Generate New Array</button>
                <button onClick={()=> this.bubbleSort()} button className="button_sort">Bubble Sort</button>
                <button onClick={()=> this.insertionSort()} button className="button_sort">Insertion Sort</button>
                <button onClick={()=> this.selectionSort()} button className="button_sort">Selection Sort</button>
                <button onClick={()=> this.quickSort()} button className="button_sort">Quick Sort</button>
                <button onClick={()=> this.mergeSort()} button className="button_sort">Merge Sort</button>
                <button onClick={()=> this.play()} button className="button_play">Play</button>
                <button onClick={()=> this.stop()} button className="button_play">Stop</button>
                <button onClick={()=> this.step()} button className="button_play">Step</button>
                <button onClick={()=> this.savearr()} button className="button_sort">Save Array</button>
                <button onClick={()=> this.oldarr()} button className="button_sort">Use saved array</button>
            </div>
            <div className="animations_status">
                <p>steps: {this.steps}</p>
                <p>Selected Algorithm:</p>
                <p>{selected_alg || "no sorting algorithms selected"}</p>
                <input type="range" min={25} max={200} value={this.state.range} className ="slider" onChange={this.handleOnChangeRange}></input>
                <p>Array size: {this.state.range}</p>
                <input type="range" min={1} max={100} value={this.state.speed} className ="slider" onChange={this.handleOnChangeSpeed}></input>
                <p>Animation speed: {this.state.speed}%</p>
            </div>
            </div>
            <div className="array_container">
            {array.map((value,index) => (
                <div className="array_bar"
                 key ={index}
                 style={{height: `${value}px`, width: `${this.width}px`}}>
                </div>
            ))}
            <p>Comparsion: {this.compare}</p>
            <p>Swap: {this.swap}</p>
            <p>{this.state.animations[this.state.animations.length-1]}</p>
            </div>
            </>
        );
    }
    //for slider bar
    handleOnChangeRange = (e) => {
        let range = e.target.value;
        let width = range > 100 ? (range > 150 ? 3 : 4) : (range > 25 ? 5 : 6);
        this.width = width;
        this.setState({range : range});
        this.resetArray();
    }

    handleOnChangeSpeed = (e) => {
        let value = e.target.value;
        let play_speed = (101 - value) + (101-value);

        /* if we already have an interval, clear it and remake it. If not just change speed in state */
        if(this.myinterval){
            clearInterval(this.myinterval);
            this.myinterval = setInterval(this.step, play_speed);
        }
        this.setState({speed : value});
    }

}

function randomIntBetweenIntervel(min, max){
    return Math.floor(Math.random() * (max-min+1) + min);
}